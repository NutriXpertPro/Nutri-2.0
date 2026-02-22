"""
Módulo de Substituição Nutricional Inteligente V2026 - Padrão UUFT
Focado em Pureza, Estado de Preparo e Equivalência de Macro-Âncora.
"""

from typing import List, Optional
from dataclasses import dataclass
from django.db.models import Q
from .models import UnifiedFood, AlimentoTACO, AlimentoTBCA, AlimentoUSDA
import logging
import time

logger = logging.getLogger(__name__)

# Constantes de configuração da substituição nutricional
MIN_CAL_VAL = 1.0
MAX_VOL_FACTOR = 2.8
MIN_VOL_FACTOR = 0.2
CAL_DESVIO_MAX = 0.35
PERFIL_DESVIO_MAX = 0.7
SCORE_CAL_WEIGHT = 0.4
SCORE_PERFIL_WEIGHT = 0.6
MIN_SIMILARITY_SCORE = 0.1
MAX_SIMILARITY_SCORE = 0.99


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
    alimento_original: str = ""
    alimento_substituto: str = ""
    quantidade_original_g: float = 0.0
    quantidade_substituto_g: float = 0.0
    grupo: str = ""
    macronutriente_igualizado: str = ""
    calories_original: float = 0.0
    calories_substituto: float = 0.0
    diferenca_calorica: float = 0.0
    calories_por_100g_original: float = 0.0
    calories_por_100g_substituto: float = 0.0
    proteina_substituto: float = 0.0
    carboidrato_substituto: float = 0.0
    lipidios_substituto: float = 0.0
    fibra_substituto: float = 0.0
    similarity_score: float = 0.0


# =========================================================================
# CLASSIFICAÇÃO NUTRICIONAL UNIVERSAL
# Aplica-se a TODOS os alimentos de TODAS as tabelas (TACO, TBCA, USDA)
# =========================================================================

# Keywords para classificação por nome — ordem importa (mais específico primeiro)
_CLASSIFICATION_RULES = [
    # PROTEIN_LEAN: carnes magras, aves, peixes, ovos
    (
        "PROTEIN_LEAN",
        [
            "frango",
            "peito de frango",
            "sobrecoxa",
            "coxa de frango",
            "peixe",
            "tilapia",
            "tilápia",
            "salmao",
            "salmão",
            "atum",
            "sardinha",
            "bacalhau",
            "merluza",
            "pescada",
            "camarao",
            "camarão",
            "ovo",
            "clara de ovo",
            "omelete",
            "patinho",
            "maminha",
            "file mignon",
            "filé mignon",
            "alcatra",
            "lagarto",
            "coxao mole",
            "coxão mole",
            "coxao duro",
            "coxão duro",
            "contrafile",
            "contrafilé",
            "acém",
            "acem",
            "músculo",
            "musculo",
            "peru",
            "chester",
            "carne bovina",
            "carne de boi",
        ],
    ),
    # LEGUME: leguminosas
    (
        "LEGUME",
        [
            "feijao",
            "feijão",
            "lentilha",
            "grao de bico",
            "grão-de-bico",
            "grao-de-bico",
            "grão de bico",
            "soja",
            "edamame",
            "ervilha",
        ],
    ),
    # DAIRY: laticínios
    (
        "DAIRY",
        [
            "leite",
            "iogurte",
            "yogurte",
            "queijo",
            "requeijao",
            "requeijão",
            "ricota",
            "cottage",
            "cream cheese",
            "creme de leite",
            "coalhada",
            "kefir",
            "nata",
        ],
    ),
    # FAT: gorduras e oleaginosas
    (
        "FAT",
        [
            "azeite",
            "oleo",
            "óleo",
            "manteiga",
            "margarina",
            "castanha",
            "amendoim",
            "nozes",
            "noz",
            "amêndoa",
            "amendoa",
            "macadamia",
            "macadâmia",
            "pistache",
            "semente de girassol",
            "semente de linhaça",
            "linhaça",
            "linhaca",
            "chia",
            "coco ralado",
            "coco seco",
            "banha",
            "gordura",
            "maionese",
            "bacon",
            "toucinho",
            "creme de leite",
            "pasta de amendoim",
        ],
    ),
    # CARB: carboidratos complexos, cereais, tubérculos
    (
        "CARB",
        [
            "arroz",
            "macarrao",
            "macarrão",
            "espaguete",
            "talharim",
            "lasanha",
            "batata",
            "mandioca",
            "aipim",
            "macaxeira",
            "inhame",
            "cará",
            "cara",
            "cuscuz",
            "couscous",
            "aveia",
            "granola",
            "milho",
            "polenta",
            "fubá",
            "fuba",
            "angu",
            "quinoa",
            "quinua",
            "trigo",
            "farinha",
            "farelo",
            "pão",
            "pao",
            "bisnaga",
            "torrada",
            "tapioca",
            "beiju",
            "polvilho",
            "batata doce",
            "batata-doce",
            "centeio",
            "cevada",
            "cevadinha",
        ],
    ),
    # FRUIT: frutas
    (
        "FRUIT",
        [
            "banana",
            "maçã",
            "maca",
            "laranja",
            "tangerina",
            "mexerica",
            "limao",
            "limão",
            "abacaxi",
            "manga",
            "uva",
            "morango",
            "framboesa",
            "amora",
            "mirtilo",
            "blueberry",
            "pera",
            "pêra",
            "pêssego",
            "pessego",
            "nectarina",
            "mamão",
            "mamao",
            "papaia",
            "papaya",
            "melancia",
            "melão",
            "melao",
            "kiwi",
            "goiaba",
            "jabuticaba",
            "acerola",
            "caju",
            "graviola",
            "maracuja",
            "maracujá",
            "abacate",
            "caqui",
            "ameixa",
            "figo",
            "tâmara",
            "tamara",
            "carambola",
            "pitaya",
            "lichia",
            "jaca",
            "mangaba",
            "açaí",
            "acai",
        ],
    ),
    # VEGGIE: hortaliças, verduras, legumes (hortícola)
    (
        "VEGGIE",
        [
            "alface",
            "rucula",
            "rúcula",
            "agriao",
            "agrião",
            "couve",
            "espinafre",
            "escarola",
            "acelga",
            "chicória",
            "chicoria",
            "tomate",
            "pepino",
            "rabanete",
            "abóbora",
            "abobora",
            "abobrinha",
            "moranga",
            "brócolis",
            "brocolis",
            "couve-flor",
            "couve flor",
            "vagem",
            "quiabo",
            "cenoura",
            "beterraba",
            "nabo",
            "chuchu",
            "berinjela",
            "jiló",
            "jilo",
            "pimentão",
            "pimentao",
            "repolho",
            "cebola",
            "alho",
            "alho-poró",
            "alho poro",
            "palmito",
            "aspargo",
            "aspargos",
            "salsa",
            "salsinha",
            "cebolinha",
            "coentro",
            "manjericao",
            "manjericão",
            "maxixe",
        ],
    ),
]

# Alimentos ultraprocessados que devem ser excluídos de substituições
_ULTRAPROCESSED_KEYWORDS = [
    "biscoito",
    "bolacha",
    "refrigerante",
    "sorvete",
    "salgadinho",
    "pizza",
    "nugget",
    "empanado",
    "salsicha",
    "linguiça",
    "linguica",
    "mortadela",
    "presunto",
    "hamburguer",
    "hambúrguer",
    "miojo",
    "macarrao instantaneo",
    "macarrão instantâneo",
    "achocolatado",
    "toddy",
    "nescau",
    "chocolate ao leite",
    "chocolate branco",
    "bala",
    "pirulito",
    "chiclete",
    "gelatina",
    "pudim",
    "wafer",
]


def identificar_grupo_nutricional(nome, grupo_original=""):
    """
    Classifica um alimento em seu grupo nutricional usando:
    1. Keywords (match por nome) - alta precisão
    2. Grupo original da tabela (TACO/TBCA) - média precisão
    3. Fallback: retorna grupo_original se nada casar
    """
    if not nome:
        return grupo_original or "OTHER"

    nome_lower = nome.lower().strip()

    # Verificar ultraprocessados primeiro
    if any(kw in nome_lower for kw in _ULTRAPROCESSED_KEYWORDS):
        # Exceção: 'batata doce' não é doce ultraprocessado
        if (
            "doce" in nome_lower
            and "batata" not in nome_lower
            and "fruta" not in nome_lower
        ):
            return "OTHER"

    # Match por keywords (mais específico primeiro)
    for group_name, keywords in _CLASSIFICATION_RULES:
        if any(kw in nome_lower for kw in keywords):
            return group_name

    # Fallback pelo grupo da tabela TACO/TBCA
    grupo_lower = (grupo_original or "").lower()
    if "fruta" in grupo_lower:
        return "FRUIT"
    if (
        "verdura" in grupo_lower
        or "hortali" in grupo_lower
        or "leguminosa" in grupo_lower
    ):
        return "VEGGIE"
    if "carne" in grupo_lower or "pescado" in grupo_lower or "ave" in grupo_lower:
        return "PROTEIN_LEAN"
    if (
        "cereal" in grupo_lower
        or "farináceo" in grupo_lower
        or "farinaceo" in grupo_lower
    ):
        return "CARB"
    if (
        "leite" in grupo_lower
        or "laticínio" in grupo_lower
        or "laticinio" in grupo_lower
    ):
        return "DAIRY"
    if "gordura" in grupo_lower or "óleo" in grupo_lower or "oleo" in grupo_lower:
        return "FAT"
    if "leguminosa" in grupo_lower:
        return "LEGUME"

    return grupo_original or "OTHER"


def identificar_subgrupo(nome):
    """Identifica subgrupo dentro do grupo principal."""
    if not nome:
        return ""

    nome_lower = nome.lower().strip()

    # Proteínas
    if any(kw in nome_lower for kw in ["frango", "peru", "chester"]):
        return "AVES"
    if any(
        kw in nome_lower
        for kw in [
            "peixe",
            "salmao",
            "salmão",
            "tilapia",
            "tilápia",
            "atum",
            "sardinha",
            "camarao",
            "camarão",
        ]
    ):
        return "PESCADOS"
    if any(kw in nome_lower for kw in ["ovo", "clara"]):
        return "OVOS"
    if any(
        kw in nome_lower
        for kw in [
            "patinho",
            "maminha",
            "alcatra",
            "filé",
            "file",
            "coxao",
            "coxão",
            "acém",
            "acem",
        ]
    ):
        return "CARNE_BOVINA"

    # Carboidratos
    if any(kw in nome_lower for kw in ["arroz"]):
        return "ARROZ"
    if any(
        kw in nome_lower
        for kw in ["batata", "mandioca", "inhame", "cará", "cara", "aipim"]
    ):
        return "TUBERCULOS"
    if any(kw in nome_lower for kw in ["pão", "pao", "torrada", "bisnaga"]):
        return "PAES"
    if any(kw in nome_lower for kw in ["macarrao", "macarrão", "espaguete"]):
        return "MASSAS"

    # Frutas
    if any(kw in nome_lower for kw in ["açaí", "acai", "banana", "manga"]):
        return "FRUTAS_TROPICAIS"
    if any(kw in nome_lower for kw in ["maçã", "maca", "pera", "pêra", "pêssego"]):
        return "FRUTAS_TEMPERADAS"
    if any(kw in nome_lower for kw in ["morango", "framboesa", "amora", "mirtilo"]):
        return "FRUTAS_VERMELHAS"
    if any(kw in nome_lower for kw in ["laranja", "limao", "limão", "tangerina"]):
        return "CITRICOS"

    # Vegetais
    if any(
        kw in nome_lower
        for kw in [
            "alface",
            "rucula",
            "rúcula",
            "agriao",
            "agrião",
            "espinafre",
            "couve",
        ]
    ):
        return "FOLHOSOS"
    if any(kw in nome_lower for kw in ["cenoura", "beterraba", "abóbora", "abobora"]):
        return "RAIZES_LEGUMES"

    return ""


# =========================================================================
# CONVERTERS: ORM Model → NutricaoAlimento
# =========================================================================


def alimento_taco_para_nutricao(obj):
    """Converte AlimentoTACO para NutricaoAlimento."""
    if obj is None:
        return None
    try:
        return NutricaoAlimento(
            nome=obj.nome,
            energia_kcal=float(obj.energia_kcal or 0),
            proteina_g=float(obj.proteina_g or 0),
            lipidios_g=float(obj.lipidios_g or 0),
            carboidrato_g=float(obj.carboidrato_g or 0),
            fibra_g=float(obj.fibra_g or 0),
            grupo=obj.grupo or "",
            fonte="TACO",
        )
    except Exception:
        return None


def alimento_tbca_para_nutricao(obj):
    """Converte AlimentoTBCA para NutricaoAlimento."""
    if obj is None:
        return None
    try:
        return NutricaoAlimento(
            nome=obj.nome,
            energia_kcal=float(obj.energia_kcal or 0),
            proteina_g=float(obj.proteina_g or 0),
            lipidios_g=float(obj.lipidios_g or 0),
            carboidrato_g=float(obj.carboidrato_g or 0),
            fibra_g=float(obj.fibra_g or 0),
            grupo=obj.grupo or "",
            fonte="TBCA",
        )
    except Exception:
        return None


def alimento_usda_para_nutricao(obj):
    """Converte AlimentoUSDA para NutricaoAlimento."""
    if obj is None:
        return None
    try:
        return NutricaoAlimento(
            nome=obj.nome,
            energia_kcal=float(obj.energia_kcal or 0),
            proteina_g=float(obj.proteina_g or 0),
            lipidios_g=float(obj.lipidios_g or 0),
            carboidrato_g=float(obj.carboidrato_g or 0),
            fibra_g=float(obj.fibra_g or 0),
            grupo=getattr(obj, "categoria", "") or "",
            fonte="USDA",
        )
    except Exception:
        return None


# =========================================================================
# CÁLCULO DE EQUIVALÊNCIA
# =========================================================================


def _determinar_macro_ancora(grupo):
    """Determina o macro-âncora pelo grupo nutricional."""
    mapping = {
        "PROTEIN_LEAN": "proteina",
        "CARB": "carboidrato",
        "LEGUME": "carboidrato",
        "FRUIT": "carboidrato",
        "VEGGIE": "carboidrato",
        "FAT": "lipidios",
        "DAIRY": "proteina",
    }
    return mapping.get(grupo, "calorias")


def calcular_substituicao(original, substituto, grupo, quantidade_original):
    """
    Calcula a equivalência nutricional entre dois alimentos.

    Args:
        original: NutricaoAlimento do alimento original
        substituto: NutricaoAlimento do alimento substituto
        grupo: grupo nutricional do alimento (PROTEIN_LEAN, CARB, etc.)
        quantidade_original: quantidade em gramas do original

    Returns:
        ResultadoSubstituicao com a quantidade equivalente e métricas
    """
    macro_ancora = _determinar_macro_ancora(grupo)

    # Selecionar o valor do macro-âncora
    macro_map_orig = {
        "proteina": original.proteina_g,
        "carboidrato": original.carboidrato_g,
        "lipidios": original.lipidios_g,
        "calorias": original.energia_kcal,
    }
    macro_map_subst = {
        "proteina": substituto.proteina_g,
        "carboidrato": substituto.carboidrato_g,
        "lipidios": substituto.lipidios_g,
        "calorias": substituto.energia_kcal,
    }

    val_orig = macro_map_orig.get(macro_ancora, original.energia_kcal)
    val_subst = macro_map_subst.get(macro_ancora, substituto.energia_kcal)

    # Proteção contra zeros
    if val_orig < MIN_CAL_VAL:
        val_orig = max(original.energia_kcal, MIN_CAL_VAL)
    if val_subst < MIN_CAL_VAL:
        val_subst = max(substituto.energia_kcal, MIN_CAL_VAL)

    # Calcular quantidade equivalente
    total_macro_orig = (val_orig * quantidade_original) / 100
    fator = total_macro_orig / val_subst
    quantidade_substituto = round(fator * 100, 1)

    # Calcular calorias
    cal_orig = (original.energia_kcal * quantidade_original) / 100
    cal_subst = (substituto.energia_kcal * quantidade_substituto) / 100

    # Calcular similarity score
    desvio_cal = abs(cal_subst - cal_orig) / max(cal_orig, MIN_CAL_VAL)

    def get_ratio(p, c, f, en):
        e = max(en, MIN_CAL_VAL)
        return (p * 4 / e), (c * 4 / e), (f * 9 / e)

    r_orig = get_ratio(
        original.proteina_g,
        original.carboidrato_g,
        original.lipidios_g,
        original.energia_kcal,
    )
    r_subst = get_ratio(
        substituto.proteina_g,
        substituto.carboidrato_g,
        substituto.lipidios_g,
        substituto.energia_kcal,
    )

    desvio_perfil = sum(abs(a - b) for a, b in zip(r_orig, r_subst)) / 2.0

    score = round(
        1.0 - (desvio_cal * SCORE_CAL_WEIGHT + desvio_perfil * SCORE_PERFIL_WEIGHT), 2
    )
    score = max(MIN_SIMILARITY_SCORE, min(MAX_SIMILARITY_SCORE, score))

    return ResultadoSubstituicao(
        alimento_original=original.nome,
        alimento_substituto=substituto.nome,
        quantidade_original_g=quantidade_original,
        quantidade_substituto_g=quantidade_substituto,
        grupo=grupo,
        macronutriente_igualizado=macro_ancora,
        calories_original=round(cal_orig, 1),
        calories_substituto=round(cal_subst, 1),
        diferenca_calorica=round(abs(cal_subst - cal_orig), 1),
        calories_por_100g_original=original.energia_kcal,
        calories_por_100g_substituto=substituto.energia_kcal,
        proteina_substituto=substituto.proteina_g,
        carboidrato_substituto=substituto.carboidrato_g,
        lipidios_substituto=substituto.lipidios_g,
        fibra_substituto=substituto.fibra_g,
        similarity_score=score,
    )


# =========================================================================
# MOTOR PRINCIPAL V2026 (Hub UnifiedFood)
# =========================================================================


def calcular_quantidade_equivalente(
    orig: UnifiedFood, subst: UnifiedFood, qtd_orig: float
) -> float:
    """
    Calcula a quantidade do substituto baseada no Macro-Âncora do alimento original.
    """
    macro = orig.anchor_macro

    val_orig = safe_float(
        {
            "PROTEIN": orig.protein_g,
            "CARBS": orig.carbs_g,
            "FAT": orig.fat_g,
            "CALORIES": orig.energy_kcal,
        }.get(macro, orig.energy_kcal),
        default=0.0,
    )

    val_subst = safe_float(
        {
            "PROTEIN": subst.protein_g,
            "CARBS": subst.carbs_g,
            "FAT": subst.fat_g,
            "CALORIES": subst.energy_kcal,
        }.get(macro, subst.energy_kcal),
        default=0.0,
    )

    if val_orig < MIN_CAL_VAL:
        val_orig = max(orig.energy_kcal, MIN_CAL_VAL)
    if val_subst < MIN_CAL_VAL:
        val_subst = max(subst.energy_kcal, MIN_CAL_VAL)

    total_orig = (val_orig * qtd_orig) / 100
    fator = total_orig / val_subst

    return round(fator * 100, 1)


def sugerir_substituicoes_v2026(
    orig_id: str, original_source: str, qtd_orig: float, limite: int = 15
) -> List[ResultadoSubstituicao]:
    """
    Motor Principal: Realiza a busca no Hub UnifiedFood e aplica as travas de 2026.
    """
    start_time = time.time()
    try:
        orig = UnifiedFood.objects.get(
            source_id=str(orig_id), source_name=original_source
        )
    except UnifiedFood.DoesNotExist:
        logger.warning(
            f"[V2026] Alimento original {orig_id} ({original_source}) não encontrado no Hub UnifiedFood"
        )
        return []

    logger.info(
        f"[V2026] Buscando substitutos para: {orig.name} (Source: {original_source}, ID: {orig_id})"
    )
    logger.info(
        f"[V2026] Atributos Hub: Pureza={orig.purity_index}, Prep={orig.prep_method}, Clan={orig.custom_category}, Anchor={orig.anchor_macro}"
    )

    # --- TRAVAS DE SEGURANÇA 2026 ---

    # 1. Trava de Pureza Absoluta
    query = UnifiedFood.objects.filter(purity_index=orig.purity_index)
    query = query.filter(processing_level=orig.processing_level)
    count_purity = query.count()

    # 2. Trava de Preparo
    if orig.is_cooked:
        query = query.exclude(prep_method="RAW")
        if orig.prep_method == "GRILLED":
            query = query.filter(prep_method__in=["GRILLED", "BOILED", "ROASTED"])
    count_prep = query.count()

    # 3. Trava de Clã Biológico
    if orig.custom_category:
        query = query.filter(custom_category=orig.custom_category)
    count_clan = query.count()

    # 4. Trava de Bio-Similaridade
    query = query.filter(anchor_macro=orig.anchor_macro)
    count_anchor = query.count()

    logger.info(
        f"[V2026] Funil de filtragem: Hub={UnifiedFood.objects.count()} -> Purity={count_purity} -> Prep={count_prep} -> Clan={count_clan} -> Anchor={count_anchor}"
    )

    candidatos = query.exclude(id=orig.id).order_by("?")[:100]

    resultados = []
    for cand in candidatos:
        qtd_subst = calcular_quantidade_equivalente(orig, cand, qtd_orig)

        if (
            qtd_subst > qtd_orig * MAX_VOL_FACTOR
            or qtd_subst < qtd_orig * MIN_VOL_FACTOR
        ):
            continue

        cal_orig = (orig.energy_kcal * qtd_orig) / 100
        cal_subst = (cand.energy_kcal * qtd_subst) / 100

        desvio_cal = abs(cal_subst - cal_orig) / max(cal_orig, MIN_CAL_VAL)

        def get_ratio(p, c, f, en):
            e = max(en, MIN_CAL_VAL)
            return (p * 4 / e), (c * 4 / e), (f * 9 / e)

        r_orig = get_ratio(orig.protein_g, orig.carbs_g, orig.fat_g, orig.energy_kcal)
        r_cand = get_ratio(cand.protein_g, cand.carbs_g, cand.fat_g, cand.energy_kcal)

        desvio_perfil = sum(abs(a - b) for a, b in zip(r_orig, r_cand)) / 2.0

        score = round(
            1.0 - (desvio_cal * SCORE_CAL_WEIGHT + desvio_perfil * SCORE_PERFIL_WEIGHT),
            2,
        )
        score = max(MIN_SIMILARITY_SCORE, min(MAX_SIMILARITY_SCORE, score))

        if desvio_cal > CAL_DESVIO_MAX or desvio_perfil > PERFIL_DESVIO_MAX:
            continue

        resultados.append(
            ResultadoSubstituicao(
                alimento_original=orig.name,
                alimento_substituto=cand.name,
                quantidade_original_g=qtd_orig,
                quantidade_substituto_g=qtd_subst,
                grupo=orig.anchor_macro,
                macronutriente_igualizado=orig.anchor_macro.lower(),
                calories_original=round(cal_orig, 1),
                calories_substituto=round(cal_subst, 1),
                diferenca_calorica=round(abs(cal_subst - cal_orig), 1),
                calories_por_100g_original=orig.energy_kcal,
                calories_por_100g_substituto=cand.energy_kcal,
                proteina_substituto=cand.protein_g,
                carboidrato_substituto=cand.carbs_g,
                lipidios_substituto=cand.fat_g,
                fibra_substituto=cand.fiber_g,
                similarity_score=score,
            )
        )

    resultados.sort(key=lambda x: x.similarity_score, reverse=True)

    elapsed = time.time() - start_time
    logger.info(
        f"[V2026] Finalizado em {elapsed:.3f}s. Encontrados {len(resultados)} substitutos válidos."
    )

    return resultados[:limite]


# =========================================================================
# SISTEMA DE SUBSTITUIÇÃO PERFEITO V2026.1
# Implementa as regras de substituição完美的
# =========================================================================


def identificar_tipo_alimento(nome: str) -> str:
    """
    Identifica se o alimento é CARBOIDRATO, PROTEINA ou GORDURA.
    """
    if not nome:
        return "UNKNOWN"

    nome_lower = nome.lower()

    proteinas = [
        "frango",
        "peito",
        "sobrecoxa",
        "coxa",
        "peru",
        "chester",
        "peixe",
        "tilapia",
        "tilápia",
        "salmao",
        "salmão",
        "atum",
        "sardinha",
        "bacalhau",
        "merluza",
        "pescada",
        "camarao",
        "camarão",
        "ovo",
        "clara",
        "omelete",
        "patinho",
        "maminha",
        "file mignon",
        "filé mignon",
        "alcatra",
        "lagarto",
        "feijão",
        "feijao",
        "lentilha",
        "grão de bico",
        "grao de bico",
        "ervilha",
        "soja",
        "tofu",
        "tempeh",
        "coxao",
        "coxão",
        "contrafile",
        "contrafilé",
        "acém",
        "acem",
        "músculo",
        "musculo",
        "carne",
        "bovina",
        "suíno",
        "suino",
        "porco",
        "lombo",
        "pernil",
        "bacon",
        "fígado",
        "figado",
        "coração",
        "coracao",
        "linguça",
        "linguica",
        "abadejo",
        "pintado",
        "cação",
        "pescada",
        "corvina",
        "pargo",
        "garoupa",
        "swordfish",
        "espada",
        "sardinha",
        " cavala",
        "pescada",
    ]

    carboidratos = [
        "arroz",
        "macarrao",
        "macarrão",
        "espaguete",
        "talharim",
        "lasanha",
        "batata",
        "mandioca",
        "aipim",
        "macaxeira",
        "inhame",
        "cará",
        "cara",
        "batata-doce",
        "batata doce",
        "batata-baroa",
        "cuscuz",
        "couscous",
        "aveia",
        "granola",
        "milho",
        "polenta",
        "fubá",
        "fuba",
        "quinoa",
        "quinua",
        "trigo",
        "farinha",
        "farelo",
        "pão",
        "pao",
        "torrada",
        "tapioca",
        "polvilho",
        "centeio",
        "cevada",
        "cevadinha",
        "painço",
        "painco",
        "abóbora",
        "abobora",
        "moranga",
        "jerimum",
    ]

    gorduras = [
        "azeite",
        "oleo",
        "óleo",
        "manteiga",
        "margarina",
        "castanha",
        "amendoim",
        "nozes",
        "noz",
        "amêndoa",
        "macadamia",
        "pistache",
        "semente",
        "linhaça",
        "chia",
        "coco",
        "banha",
        "gordura",
        "maionese",
        "bacon",
        "toucinho",
    ]

    for p in proteinas:
        if p in nome_lower:
            return "PROTEINA"

    for c in carboidratos:
        if c in nome_lower:
            return "CARBOIDRATO"

    for g in gorduras:
        if g in nome_lower:
            return "GORDURA"

    return "UNKNOWN"


def identificar_preparo(nome: str) -> str:
    """
    Identifica o método de preparo pelo nome do alimento.
    """
    if not nome:
        return "UNKNOWN"

    nome_lower = nome.lower()

    if "grelhado" in nome_lower:
        return "GRILLED"
    elif "cozido" in nome_lower or "cozida" in nome_lower:
        return "BOILED"
    elif "assado" in nome_lower or "assada" in nome_lower:
        return "ROASTED"
    elif "frito" in nome_lower or "frita" in nome_lower:
        return "FRIED"
    elif "cru" in nome_lower or "crua" in nome_lower or "in natura" in nome_lower:
        return "RAW"

    return "UNKNOWN"


PREP_METHODS_CARB = ["BOILED", "GRILLED", "ROASTED"]
PREP_METHODS_PROTEIN = {
    "GRILLED": ["GRILLED", "ROASTED"],
    "BOILED": ["BOILED"],
    "ROASTED": ["ROASTED", "GRILLED"],
    "FRIED": ["FRIED"],
    "RAW": ["RAW"],
    "UNKNOWN": ["BOILED", "GRILLED", "ROASTED", "FRIED"],
}


def calcular_quantidade_por_macro(
    macro_original: float, macro_substituto_por_100g: float, quantidade_original: float
) -> float:
    """
    Calcula a quantidade do substituto para ter a MESMA quantidade do macro-âncora.
    Fórmula: quantidade = (macro_original * 100) / macro_substituto
    """
    if macro_substituto_por_100g <= 0:
        return quantidade_original

    macro_total_original = (macro_original * quantidade_original) / 100
    quantidade_substituto = (macro_total_original * 100) / macro_substituto_por_100g

    return round(quantidade_substituto, 1)


def sugerir_substituicoes_perfeito(
    original_nome: str,
    original_grupo: str,
    original_quantidade: float,
    original_proteina_100g: float,
    original_carboidrato_100g: float,
    original_lipidio_100g: float,
    original_energia_100g: float,
    original_prep_method: str = "UNKNOWN",
    limite: int = 15,
) -> List[ResultadoSubstituicao]:
    """
    Sistema de Substituição Perfeito V2026.1

    Regras:
    1. CARBOIDRATOS: apenas alimentos cozidos/grelhados/assados (NÃO crus)
    2. PROTEÍNAS: mesmo método de preparo
    3. Equivalência: mesma quantidade de macro-âncora
    4. Mínimo 7 opções
    """

    tipo_alimento = identificar_tipo_alimento(original_nome)
    prep_method_orig = identificar_preparo(original_nome)

    if prep_method_orig == "UNKNOWN" and original_prep_method:
        prep_method_orig = original_prep_method

    logger.info(
        f"[PERFEITO] Tipo={tipo_alimento}, Prep={prep_method_orig}, Original={original_nome}"
    )

    if tipo_alimento == "PROTEINA":
        macro_ancora = "proteina"
        macro_original = original_proteina_100g
    elif tipo_alimento == "CARBOIDRATO":
        macro_ancora = "carboidrato"
        macro_original = original_carboidrato_100g
    elif tipo_alimento == "GORDURA":
        macro_ancora = "lipidios"
        macro_original = original_lipidio_100g
    else:
        macro_ancora = "carboidrato"
        macro_original = original_carboidrato_100g

    query = (
        UnifiedFood.objects.filter(purity_index="STAPLE")
        .exclude(name__icontains="baião")
        .exclude(name__icontains="feijoada")
        .exclude(name__icontains="lasanha")
        .exclude(name__icontains="nugget")
        .exclude(name__icontains="empanado")
    )

    if tipo_alimento == "CARBOIDRATO":
        query = query.filter(prep_method__in=PREP_METHODS_CARB)

    elif tipo_alimento == "PROTEINA":
        prep_methods_allowed = PREP_METHODS_PROTEIN.get(
            prep_method_orig, PREP_METHODS_PROTEIN["UNKNOWN"]
        )
        query = query.filter(prep_method__in=prep_methods_allowed)

    elif tipo_alimento == "GORDURA":
        pass  # Sem filtro específico de preparo para gorduras

    logger.info(f"[PERFEITO] Após filtros tipo: {query.count()} candidatos")

    query = query.exclude(name__icontains=original_nome.split(",")[0].strip())

    candidatos = list(query[:200])

    resultados = []
    for cand in candidatos:
        if cand.name and any(
            p in cand.name.lower() for p in ["baião", "feijoada", "receita", "prato"]
        ):
            continue

        cand_tipo = identificar_tipo_alimento(cand.name)
        if cand_tipo != tipo_alimento and cand_tipo != "UNKNOWN":
            continue

        if tipo_alimento == "CARBOIDRATO":
            macro_cand = cand.carbs_g
        elif tipo_alimento == "PROTEINA":
            macro_cand = cand.protein_g
        else:
            macro_cand = cand.fat_g

        if macro_cand and macro_cand > 0:
            qtd_subst = calcular_quantidade_por_macro(
                macro_original, macro_cand, original_quantidade
            )
        else:
            qtd_subst = original_quantidade

        if qtd_subst > original_quantidade * 3 or qtd_subst < original_quantidade * 0.3:
            continue

        cal_orig = (original_energia_100g * original_quantidade) / 100
        cal_subst = (cand.energy_kcal * qtd_subst) / 100

        desvio_cal = abs(cal_subst - cal_orig) / max(cal_orig, 1)
        score = max(0.1, min(0.99, 1 - desvio_cal))

        if cand_tipo == tipo_alimento:
            score = min(0.99, score + 0.1)

        resultados.append(
            ResultadoSubstituicao(
                alimento_original=original_nome,
                alimento_substituto=cand.name,
                quantidade_original_g=original_quantidade,
                quantidade_substituto_g=qtd_subst,
                grupo=tipo_alimento,
                macronutriente_igualizado=macro_ancora,
                calories_original=round(cal_orig, 1),
                calories_substituto=round(cal_subst, 1),
                diferenca_calorica=round(abs(cal_subst - cal_orig), 1),
                calories_por_100g_original=original_energia_100g,
                calories_por_100g_substituto=cand.energy_kcal,
                proteina_substituto=cand.protein_g,
                carboidrato_substituto=cand.carbs_g,
                lipidios_substituto=cand.fat_g,
                fibra_substituto=cand.fiber_g,
                similarity_score=score,
            )
        )

    resultados.sort(key=lambda x: x.similarity_score, reverse=True)

    return resultados[: max(7, limite)]

    return resultados[: max(7, limite)]


# --- FUNÇÕES DE COMPATIBILIDADE (LEGACY HELPERS) ---


def sugerir_substitucoes(
    orig, candidates, qtd_orig: float, limite: int = 15, diet_type: str = "balanced"
):
    """Alias para manter compatibilidade com views antigas."""
    return []


# Aliases para compatibilidade de grafia (Português/Typo)
sugerir_substitucoes_v2026 = sugerir_substituicoes_v2026
sugerir_substitucoes = sugerir_substitucoes
