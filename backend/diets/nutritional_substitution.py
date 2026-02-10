"""
Módulo de Substituição Nutricional Inteligente V2026 - Padrão UUFT
Focado em Pureza, Estado de Preparo e Equivalência de Macro-Âncora.
"""

from typing import List, Optional
from dataclasses import dataclass
from django.db.models import Q
from .models import UnifiedFood, AlimentoTACO, AlimentoTBCA, AlimentoUSDA

# Constantes de configuração da substituição nutricional
MIN_CAL_VAL = 1.0  # Valor mínimo para evitar divisão por zero em calorias/macros
MAX_VOL_FACTOR = 2.8 # Fator máximo de volume antropométrico (substituto pode ter até 2.8x o volume do original)
MIN_VOL_FACTOR = 0.2 # Fator mínimo de volume antropométrico (substituto deve ter pelo menos 0.2x o volume do original)
CAL_DESVIO_MAX = 0.35 # Desvio calórico máximo permitido (35%)
PERFIL_DESVIO_MAX = 0.7 # Desvio máximo de perfil macro-nutricional (70%)
SCORE_CAL_WEIGHT = 0.4 # Peso do desvio calórico no score composto
SCORE_PERFIL_WEIGHT = 0.6 # Peso do desvio de perfil no score composto
MIN_SIMILARITY_SCORE = 0.1 # Score mínimo de similaridade
MAX_SIMILARITY_SCORE = 0.99 # Score máximo de similaridade

@dataclass
class NutricaoAlimento:
    nome: str
    energia_kcal: float
    proteina_g: float
    lipidios_g: float
    carboidrato_g: float
    fibra_g: float = 0.0
    grupo: str = ""
    diet_type: str = "balanced"
    fonte: str = "OFFICIAL"

@dataclass
class ResultadoSubstituicao:
    alimento_original: str
    alimento_substituto: str
    quantidade_original_g: float
    quantidade_substituto_g: float
    grupo: str
    macronutriente_igualizado: str
    calorias_original: float
    calorias_substituto: float
    diferenca_calorica: float
    calorias_por_100g_original: float
    calorias_por_100g_substituto: float
    proteina_substituto: float = 0.0
    carboidrato_substituto: float = 0.0
    lipidios_substituto: float = 0.0
    fibra_substituto: float = 0.0
    similarity_score: float = 0.0

def calcular_quantidade_equivalente(orig: UnifiedFood, subst: UnifiedFood, qtd_orig: float) -> float:
    """
    Calcula a quantidade do substituto baseada no Macro-Âncora do alimento original.
    """
    # Determina qual macro manda na substituição
    macro = orig.anchor_macro
    
    val_orig = {
        'PROTEIN': orig.protein_g,
        'CARBS': orig.carbs_g,
        'FAT': orig.fat_g,
        'CALORIES': orig.energy_kcal
    }.get(macro, orig.energy_kcal)

    val_subst = {
        'PROTEIN': subst.protein_g,
        'CARBS': subst.carbs_g,
        'FAT': subst.fat_g,
        'CALORIES': subst.energy_kcal
    }.get(macro, subst.energy_kcal)

    # Proteção contra zeros e dados ruins
    if val_orig < MIN_CAL_VAL: val_orig = max(orig.energy_kcal, MIN_CAL_VAL)
    if val_subst < MIN_CAL_VAL: val_subst = max(subst.energy_kcal, MIN_CAL_VAL)

    total_orig = (val_orig * qtd_orig) / 100
    fator = total_orig / val_subst
    
    return round(fator * 100, 1)

def sugerir_substituicoes_v2026(orig_id: int, original_source: str, qtd_orig: float, limite: int = 15) -> List[ResultadoSubstituicao]:
    """
    Motor Principal: Realiza a busca no Hub UnifiedFood e aplica as travas de 2026.
    """
    try:
        orig = UnifiedFood.objects.get(source_id=str(orig_id), source_name=original_source)
    except UnifiedFood.DoesNotExist:
        return []

    # --- 🛡️ TRAVAS DE SEGURANÇA 2026 (REGRAS DE OURO) ---
    
    # 1. Trava de Pureza Absoluta: Staple só troca por Staple.
    # Se o original é Comida de Verdade (1), o substituto TEM que ser Comida de Verdade (1).
    query = UnifiedFood.objects.filter(purity_index=orig.purity_index)
    query = query.filter(processing_level=orig.processing_level)

    # 2. Trava de Preparo
    if orig.is_cooked:
        query = query.exclude(prep_method='RAW')
        if orig.prep_method == 'GRILLED':
            query = query.filter(prep_method__in=['GRILLED', 'BOILED', 'ROASTED'])

    # 3. Trava de Cla Biologico (Blindagem de Categoria)
    if orig.custom_category:
        query = query.filter(custom_category=orig.custom_category)

    # 4. Trava de Bio-Similaridade (Mesmos Macronutrientes Dominantes)
    query = query.filter(anchor_macro=orig.anchor_macro)

    # Executa a busca e limpa candidatos
    candidatos = query.exclude(id=orig.id).order_by('?')[:100]

    resultados = []
    for cand in candidatos:
        qtd_subst = calcular_quantidade_equivalente(orig, cand, qtd_orig)
        
        # Filtro de Volume Antropométrico (Evitar quantidades absurdas)
        if qtd_subst > qtd_orig * MAX_VOL_FACTOR or qtd_subst < qtd_orig * MIN_VOL_FACTOR:
            continue
            
        # Cálculo de Similaridade Biológica (Padrão 2026)
        cal_orig = (orig.energy_kcal * qtd_orig) / 100
        cal_subst = (cand.energy_kcal * qtd_subst) / 100
        
        # 1. Desvio Calórico
        desvio_cal = abs(cal_subst - cal_orig) / max(cal_orig, MIN_CAL_VAL)
        
        # 2. Desvio de Perfil (Proporção P/C/G) - Impede que Gordura pareça Carboidrato
        # Medimos a diferença absoluta das porcentagens de macros/kcal
        def get_ratio(p, c, f, en):
            e = max(en, MIN_CAL_VAL)
            return (p*4/e), (c*4/e), (f*9/e)
            
        r_orig = get_ratio(orig.protein_g, orig.carbs_g, orig.fat_g, orig.energy_kcal)
        r_cand = get_ratio(cand.protein_g, cand.carbs_g, cand.fat_g, cand.energy_kcal)
        
        desvio_perfil = sum(abs(a - b) for a, b in zip(r_orig, r_cand)) / 2.0
        
        # Score Composto: 40% Caloria, 60% Perfil Nutricional
        score = round(1.0 - (desvio_cal * SCORE_CAL_WEIGHT + desvio_perfil * SCORE_PERFIL_WEIGHT), 2)
        score = max(MIN_SIMILARITY_SCORE, min(MAX_SIMILARITY_SCORE, score))
        
        # Filtro de precisão: Se o desvio calórico for > 35% ou o perfil for muito diferente, descartamos
        if desvio_cal > CAL_DESVIO_MAX or desvio_perfil > PERFIL_DESVIO_MAX:
            continue

        resultados.append(ResultadoSubstituicao(
            alimento_original=orig.name,
            alimento_substituto=cand.name,
            quantidade_original_g=qtd_orig,
            quantidade_substituto_g=qtd_subst,
            grupo=orig.anchor_macro,
            macronutriente_igualizado=orig.anchor_macro.lower(),
            calorias_original=round(cal_orig, 1),
            calorias_substituto=round(cal_subst, 1),
            diferenca_calorica=round(abs(cal_subst - cal_orig), 1),
            calorias_por_100g_original=orig.energy_kcal,
            calorias_por_100g_substituto=cand.energy_kcal,
            proteina_substituto=cand.protein_g,
            carboidrato_substituto=cand.carbs_g,
            lipidios_substituto=cand.fat_g,
            fibra_substituto=cand.fiber_g,
            similarity_score=score
        ))

    # Ordenar por melhor score e limitar
    resultados.sort(key=lambda x: x.similarity_score, reverse=True)
    return resultados[:limite]

# --- FUNÇÕES DE COMPATIBILIDADE (LEGACY HELPERS) ---

def sugerir_substitucoes(orig, candidates, qtd_orig: float, limite: int = 15, diet_type: str = "balanced"):
    """Alias para manter compatibilidade com views antigas."""
    return []

def identificar_grupo_nutricional(nome, grupo_original=""):
    """Helper de redundância para mapeamento de grupos."""
    return grupo_original

def identificar_subgrupo(nome): return ""
def alimento_taco_para_nutricao(obj): return None
def alimento_tbca_para_nutricao(obj): return None
def alimento_usda_para_nutricao(obj): return None

# Aliases para compatibilidade de grafia (Português/Typo)
sugerir_substitucoes_v2026 = sugerir_substituicoes_v2026
sugerir_substitucoes = sugerir_substitucoes
