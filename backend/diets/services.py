
from .models import (
    AlimentoTACO, AlimentoTBCA, AlimentoUSDA, FoodSubstitutionRule, UnifiedFood, NutritionistSubstitutionFavorite
)
from .nutritional_substitution import (
    NutricaoAlimento, sugerir_substituicoes_v2026, identificar_grupo_nutricional, calcular_substituicao
)
from .utils import safe_float, get_val, _get_food_data
from django.db.models import Q
import hashlib
import logging

logger = logging.getLogger(__name__)

# Constantes para prefixos de fontes de alimentos
FOOD_SOURCE_PREFIXES = ["TACO_", "TBCA_", "USDA_", "Sua Tabela_", "CUSTOM_", "SUPLEMENTOS_"]

def calculate_suggestion_service(
    food_id, food_name, food_source, original_quantity, 
    diet_type="normocalorica", t_ptn=None, t_cho=None, t_fat=None
):
    """
    Serviço puro que encapsula a lógica de cálculo de substituições.
    Retorna uma LISTA de dicionários prontos para o Response ou lança Exception.
    """
    results = []
    
    # 1. Obter dados do alimento original
    original_food = _get_food_data(food_source, food_id)
    if not original_food:
        # Fallback: tentar buscar por nome se o ID/Source falhar
        original_food = AlimentoTACO.objects.filter(nome__icontains=food_name).first()

    if not original_food:
         return None, "Alimento original não encontrado", 404

    # 2. Identificar Nome e Grupo
    food_instance_name = get_val(original_food, 'nome') or food_name
    original_group = get_val(original_food, 'grupo') or get_val(original_food, 'categoria') or ""
    group_name = identificar_grupo_nutricional(food_instance_name, original_group)

    # Macros "A Verdade Absoluta" vindas do frontend (se existirem)
    def calc_rel(total, qty):
        if total is None or total == "" or str(total).lower() == "nan": return None
        try:
            t = float(total)
            q = float(qty)
            if q <= 0: return t
            return (t * 100.0) / q
        except (ValueError, TypeError):
            return None

    v_ptn = calc_rel(t_ptn, original_quantity)
    v_cho = calc_rel(t_cho, original_quantity)
    v_fat = calc_rel(t_fat, original_quantity)

    # Priorizar valores enviados pelo frontend (customizados no plano)
    p_base = v_ptn if v_ptn is not None else safe_float(get_val(original_food, 'proteina_g'))
    c_base = v_cho if v_cho is not None else safe_float(get_val(original_food, 'carboidrato_g'))
    l_base = v_fat if v_fat is not None else safe_float(get_val(original_food, 'lipidios_g'))
    cal_base = (p_base * 4) + (c_base * 4) + (l_base * 9)

    # Converter original_food para NutricaoAlimento
    current_nutri = NutricaoAlimento(
        nome=food_instance_name,
        energia_kcal=cal_base,
        proteina_g=p_base,
        lipidios_g=l_base,
        carboidrato_g=c_base,
        fibra_g=safe_float(get_val(original_food, 'fibra_g')),
        grupo=original_group,
        diet_type=diet_type
    )

    # 3. Motor de Inteligência 2026 (Hub UnifiedFood)
    try:
        # Limpeza do ID e Source para compatibilidade com o Hub
        clean_id = str(food_id)
        for prefix in FOOD_SOURCE_PREFIXES:
            if clean_id.startswith(prefix):
                clean_id = clean_id.replace(prefix, "")

        hub_suggestions = sugerir_substituicoes_v2026(
            orig_id=clean_id,
            original_source=food_source,
            qtd_orig=original_quantity,
            limite=20
        )

        for res in hub_suggestions:
            results.append({
                "id": f"auto_{res.alimento_substituto}_{hashlib.sha256(res.alimento_substituto.encode()).hexdigest()[:6]}",
                "food": {
                    "nome": res.alimento_substituto,
                    "energia_kcal": res.calorias_por_100g_substituto,
                    "proteina_g": res.proteina_substituto,
                    "carboidrato_g": res.carboidrato_substituto,
                    "lipidios_g": res.lipidios_substituto,
                    "fibra_g": res.fibra_substituto,
                    "source": "AUTO",
                    "grupo": res.grupo
                },
                "suggested_quantity": res.quantidade_substituto_g,
                "similarity_score": res.similarity_score,
                "notes": f"Inteligência 2026: Equivalência por {res.macronutriente_igualizado}",
                "source": "AUTO"
            })
    except Exception as e:
        logger.error(f"[SUGGEST ENGINE ERROR 2026] {str(e)}", exc_info=True)

    # Fundir resultados e capturar status
    v2026_count = 0
    fixed_rules_count = 0
    
    v2026_count = len([r for r in results if r.get('source') == 'AUTO'])

    # 4. Somar Regras Fixas (FoodSubstitutionRule)
    parts = food_name.split(",")
    search_term = parts[0].strip()
    fixed_rules = FoodSubstitutionRule.objects.filter(
        Q(original_food_name__icontains=search_term),
        is_active=True
    ).filter(Q(diet_type=diet_type) | Q(diet_type='ALL'))

    for rule in fixed_rules:
        sub_data = _get_food_data(rule.substitute_source, rule.substitute_food_id)
        if sub_data:
            sub_item = NutricaoAlimento(
                nome=sub_data['nome'],
                energia_kcal=sub_data['energia_kcal'],
                proteina_g=sub_data['proteina_g'],
                lipidios_g=sub_data['lipidios_g'],
                carboidrato_g=sub_data['carboidrato_g'],
                fibra_g=sub_data.get('fibra_g', 0),
                grupo=sub_data.get('grupo', ''),
                diet_type=diet_type
            )
            
            sub_group = identificar_grupo_nutricional(sub_data['nome'], sub_data.get('grupo', ''))
            res_sub = calcular_substituicao(current_nutri, sub_item, group_name or sub_group, original_quantity)
            
            results.append({
                "id": f"rule_{rule.id}",
                "food": {**sub_data, "source": rule.substitute_source},
                "suggested_quantity": res_sub.quantidade_substituto_g,
                "similarity_score": float(rule.similarity_score),
                "notes": rule.notes or "Sugestão Fixa do Nutricionista"
            })
            fixed_rules_count += 1

    # Remover duplicatas mantendo a ordem (mesmo nome e quantidade)
    seen = set()
    cleaned_results = []
    for r in results:
        key = f"{r['food']['nome']}_{r['suggested_quantity']}"
        if key not in seen:
            cleaned_results.append(r)
            seen.add(key)
    
    # Ordenar por similarity_score
    cleaned_results.sort(key=lambda x: x.get('similarity_score', 0), reverse=True)
    
    engine_status = {
        "v2026_count": v2026_count,
        "fixed_rules_count": fixed_rules_count,
        "total": len(cleaned_results)
    }

    return {
        "substitutions": cleaned_results[:limite],
        "engine_status": engine_status
    }, group_name or "mixed", 200
