"""
Módulo utilitário centralizado para o app diets.
Contém funções compartilhadas entre views.py e services.py.
"""

from .models import AlimentoTACO, AlimentoTBCA, AlimentoUSDA, CustomFood

# Prefixos usados como identificadores de fonte em food_ids compostos
FOOD_SOURCE_PREFIXES = ["TACO_", "TBCA_", "USDA_", "Sua Tabela_", "CUSTOM_", "SUPLEMENTOS_"]


def safe_float(val, default=0.0):
    """Converte para float de forma segura."""
    try:
        if val is None or val == "" or str(val).lower() == "nan":
            return default
        return float(str(val).replace(',', '.'))
    except (ValueError, TypeError):
        return default


def get_val(obj, key):
    """Obtém um valor de um objeto ou dicionário."""
    if isinstance(obj, dict):
        return obj.get(key)
    return getattr(obj, key, None)


def _get_food_data(source, food_id):
    """Busca dados de um alimento específico em qualquer uma das fontes."""
    try:
        clean_id = str(food_id)
        for prefix in FOOD_SOURCE_PREFIXES:
            if clean_id.startswith(prefix):
                clean_id = clean_id.replace(prefix, "")
                break

        if source == "TACO":
            try:
                food = AlimentoTACO.objects.get(id=clean_id)
            except (ValueError, AlimentoTACO.DoesNotExist):
                food = AlimentoTACO.objects.filter(codigo=clean_id).first()

            if not food:
                return None

            return {
                "id": f"TACO_{food.id}",
                "nome": food.nome,
                "energia_kcal": food.energia_kcal,
                "proteina_g": food.proteina_g,
                "lipidios_g": food.lipidios_g,
                "carboidrato_g": food.carboidrato_g,
                "fibra_g": food.fibra_g,
                "grupo": food.grupo,
                "source": "TACO",
            }
        elif source == "TBCA":
            try:
                food = AlimentoTBCA.objects.get(id=clean_id)
            except (ValueError, AlimentoTBCA.DoesNotExist):
                food = AlimentoTBCA.objects.filter(codigo=clean_id).first()

            if not food:
                return None

            return {
                "id": f"TBCA_{food.id}",
                "nome": food.nome,
                "energia_kcal": food.energia_kcal,
                "proteina_g": food.proteina_g,
                "lipidios_g": food.lipidios_g,
                "carboidrato_g": food.carboidrato_g,
                "fibra_g": food.fibra_g,
                "grupo": food.grupo,
                "source": "TBCA",
            }
        elif source == "USDA":
            try:
                food = AlimentoUSDA.objects.get(id=clean_id)
            except (ValueError, AlimentoUSDA.DoesNotExist):
                food = AlimentoUSDA.objects.filter(fdc_id=clean_id).first()

            if not food:
                return None

            return {
                "id": f"USDA_{food.id}",
                "nome": food.nome,
                "energia_kcal": food.energia_kcal,
                "proteina_g": food.proteina_g,
                "lipidios_g": food.lipidios_g,
                "carboidrato_g": food.carboidrato_g,
                "fibra_g": food.fibra_g,
                "grupo": food.categoria,
                "source": "USDA",
            }
        elif source in ["Sua Tabela", "CUSTOM", "SUPLEMENTOS"]:
            try:
                clean_id_int = int(clean_id)
                food = CustomFood.objects.get(id=clean_id_int)
                return {
                    "id": f"Sua Tabela_{food.id}",
                    "nome": food.nome,
                    "energia_kcal": food.energia_kcal,
                    "proteina_g": food.proteina_g,
                    "lipidios_g": food.lipidios_g,
                    "carboidrato_g": food.carboidrato_g,
                    "fibra_g": food.fibra_g,
                    "grupo": food.grupo,
                    "source": "Sua Tabela",
                }
            except (ValueError, CustomFood.DoesNotExist):
                return None
        elif source == "IBGE":
            # Lazy import to avoid circular dependency with views
            from .views import FoodSearchViewSet
            FoodSearchViewSet.ensure_cache()
            cache = getattr(FoodSearchViewSet, "IBGE_CACHE", {})
            if clean_id in cache:
                data = cache[clean_id]
                return {
                    "id": clean_id,
                    "nome": data["nome"],
                    "energia_kcal": data["energia_kcal"],
                    "proteina_g": data["proteina_g"],
                    "lipidios_g": data["lipidios_g"],
                    "carboidrato_g": data["carboidrato_g"],
                    "fibra_g": data.get("fibra_g", 0),
                    "grupo": data.get("grupo", "IBGE"),
                    "source": "IBGE",
                }
    except Exception:
        pass
    return None
