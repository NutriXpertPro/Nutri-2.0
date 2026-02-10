from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination  # Importado
from django.db.models import Q
from itertools import chain
import hashlib
import logging

logger = logging.getLogger(__name__)

from .models import (
    AlimentoTACO,
    AlimentoTBCA,
    AlimentoUSDA,
    Diet,
    Meal,
    FoodItem,
    AlimentoMedidaIBGE,
    MedidaCaseira,
    FavoriteFood,
    MealPreset,
    DefaultPreset,
    FoodSubstitutionGroup,
    FoodSubstitution,
    FoodSubstitutionRule,
    NutritionistSubstitutionFavorite,
    CustomFood,
)
from .nutritional_substitution import (
    sugerir_substitucoes,
    sugerir_substituicoes_v2026,
    NutricaoAlimento,
    identificar_grupo_nutricional,
    identificar_subgrupo,
    alimento_taco_para_nutricao,
    alimento_tbca_para_nutricao,
    alimento_usda_para_nutricao,
)

from .serializers import (
    AlimentoTACOSerializer,
    AlimentoTBCASerializer,
    AlimentoUSDASerializer,
    UnifiedFoodSerializer,
    DietSerializer,
    MealSerializer,
    FoodItemSerializer,
    MealPresetSerializer,
    DefaultPresetSerializer,
    FoodSubstitutionGroupSerializer,
    FoodSubstitutionRuleSerializer,
    NutritionistSubstitutionFavoriteSerializer,
    CustomFoodSerializer,
)
from .search_utils import (
    normalizar_para_scoring,
    calcular_score_radical,
    apply_search_filter,
)
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser


# Classe auxiliar para simular um objeto de modelo para o serializer
class Box:
    def __init__(self, **kwargs):
        for k, v in kwargs.items():
            setattr(self, k, v)


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
        # Limpeza de food_id (remover prefixos de source se houver)
        clean_id = str(food_id)
        for prefix in [
            "TACO_",
            "TBCA_",
            "USDA_",
            "Sua Tabela_",
            "CUSTOM_",
            "SUPLEMENTOS_",
        ]:
            if clean_id.startswith(prefix):
                clean_id = clean_id.replace(prefix, "")
                break

        # Garantir que estamos usando a fonte correta especificada pelo nutricionista
        if source == "TACO":
            try:
                food = AlimentoTACO.objects.get(id=clean_id)
            except (ValueError, AlimentoTACO.DoesNotExist):
                food = AlimentoTACO.objects.filter(codigo=clean_id).first()

            if not food:
                return None

            # Garantir que os macros sejam calculados com base exclusivamente na tabela TACO
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

            # Garantir que os macros sejam calculados com base exclusivamente na tabela TBCA
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

            # Garantir que os macros sejam calculados com base exclusivamente na tabela USDA
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
            # Verificar se clean_id é um número válido antes de consultar
            try:
                clean_id_int = int(clean_id)
                food = CustomFood.objects.get(id=clean_id_int)
                # Garantir que os macros sejam calculados com base exclusivamente nos dados personalizados
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
                # ID não é um número válido ou alimento não existe
                return None
        elif source == "IBGE":
            FoodSearchViewSet.ensure_cache()
            cache = getattr(FoodSearchViewSet, "IBGE_CACHE", {})
            if clean_id in cache:
                data = cache[clean_id]
                # Garantir que os macros sejam calculados com base exclusivamente nos dados IBGE
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
    except Exception as e:
        print(f"Error in _get_food_data: {e}")
    return None


class ToggleFavoriteView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        data = request.data

        food_source = data.get("source")
        food_id = str(data.get("id"))
        food_name = data.get("nome")

        if not all([food_source, food_id]):
            return Response(
                {"error": "Dados incompletos"}, status=status.HTTP_400_BAD_REQUEST
            )

        # Tentar encontrar
        favorite = FavoriteFood.objects.filter(
            user=user, food_source=food_source, food_id=food_id
        ).first()

        if favorite:
            favorite.delete()
            return Response({"is_favorite": False})
        else:
            FavoriteFood.objects.create(
                user=user,
                food_source=food_source,
                food_id=food_id,
                food_name=food_name or "Alimento",
            )
            return Response({"is_favorite": True})


class FoodPageNumberPagination(PageNumberPagination):
    page_size = 30  # Ajustado para 30 itens por página conforme solicitado
    page_size_query_param = "page_size"
    max_page_size = 100


class FoodSearchViewSet(viewsets.ViewSet):
    """
    ViewSet para busca unificada de alimentos com isolamento rigoroso de fontes.
    """

    permission_classes = [IsAuthenticated]

    @classmethod
    def ensure_cache(cls):
        """Cache global para evitar N+1 queries no IBGE com dados nutricionais"""
        if not hasattr(cls, "IBGE_CACHE") or not cls.IBGE_CACHE:
            cls.IBGE_CACHE = {}
            try:
                from .models import AlimentoMedidaIBGE, MedidaCaseira, AlimentoTBCA

                try:
                    if not AlimentoMedidaIBGE.objects.exists():
                        return
                except Exception:
                    return

                items = AlimentoMedidaIBGE.objects.select_related("medida").all()
                tbca_lookup = {}
                tbca_qs = AlimentoTBCA.objects.all().values(
                    "nome",
                    "energia_kcal",
                    "proteina_g",
                    "lipidios_g",
                    "carboidrato_g",
                    "fibra_g",
                )
                for item in tbca_qs:
                    tbca_lookup[item["nome"].lower()] = item

                cache = {}
                for item in items:
                    name = item.nome_alimento
                    if not name:
                        continue
                    md5_id = hashlib.sha256(name.encode("utf-8")).hexdigest()
                    if md5_id not in cache:
                        name_lower = name.lower()
                        nutri = tbca_lookup.get(name_lower) or tbca_lookup.get(
                            name_lower.split(",")[0]
                        )

                        def get_val(obj, key):
                            return obj.get(key, 0) if isinstance(obj, dict) else 0

                        cache[md5_id] = {
                            "id": md5_id,
                            "nome": name,
                            "nome_lower": name_lower,
                            "medida_nome": item.medida.nome
                            if item.medida
                            else "Medida",
                            "peso_g": item.peso_g or 0,
                            "energia_kcal": get_val(nutri, "energia_kcal"),
                            "proteina_g": get_val(nutri, "proteina_g"),
                            "lipidios_g": get_val(nutri, "lipidios_g"),
                            "carboidrato_g": get_val(nutri, "carboidrato_g"),
                            "fibra_g": get_val(nutri, "fibra_g"),
                            "grupo": "Medida Caseira (IBGE)",
                        }
                cls.IBGE_CACHE = cache
            except Exception as e:
                print(f"Error loading IBGE cache: {e}")
                cls.IBGE_CACHE = {}

    def list(self, request):
        search_query = request.query_params.get("search", "").strip()
        source_param = request.query_params.get("source", "").upper()
        grupo_param = request.query_params.get("grupo", "").upper()
        only_mine = request.query_params.get("mine", "false").lower() == "true"

        # Mapa de favoritos
        user_fav_keys = set()
        if request.user.is_authenticated:
            favs = FavoriteFood.objects.filter(user=request.user)
            for f in favs:
                user_fav_keys.add(f"{f.food_source}_{f.food_id}")

        results = []

        # --- ROTEAMENTO ESTRITO POR FONTE ---

        # MODO 1: SUPLEMENTOS (Isolamento Total)
        if source_param == "SUPLEMENTOS" or grupo_param == "SUPLEMENTOS":
            custom_qs = CustomFood.objects.filter(
                grupo__icontains="Suplementos", is_active=True
            )
            if only_mine:
                custom_qs = custom_qs.filter(nutritionist=request.user)
            else:
                custom_qs = custom_qs.filter(
                    Q(nutritionist=request.user) | Q(nutritionist__isnull=True)
                )

            if search_query:
                custom_qs = apply_search_filter(custom_qs, search_query, field="nome")

            for item in custom_qs[:200]:
                results.append(
                    self._map_custom_to_unified(item, "Sua Tabela", user_fav_keys)
                )

        # MODO 2: SUA TABELA (Alimentos Personalizados)
        elif source_param in ["SUA TABELA", "CUSTOM"]:
            custom_qs = CustomFood.objects.filter(
                nutritionist=request.user, is_active=True
            )
            # Exclui suplementos se estiver na aba "Sua Tabela" genérica para não duplicar
            if grupo_param != "SUPLEMENTOS":
                custom_qs = custom_qs.exclude(grupo__icontains="Suplementos")

            if search_query:
                custom_qs = apply_search_filter(custom_qs, search_query, field="nome")

            for item in custom_qs[:200]:
                results.append(
                    self._map_custom_to_unified(item, "Sua Tabela", user_fav_keys)
                )

        # MODO 3: ALIMENTOS OFICIAIS (TACO, TBCA, USDA)
        else:
            # Se for uma fonte específica (ex: TACO) ou ALIMENTOS/Vazio
            search_taco = source_param in ["ALIMENTOS", "TACO", ""]
            search_tbca = source_param in ["ALIMENTOS", "TBCA", ""]
            search_usda = source_param in ["ALIMENTOS", "USDA", ""]

            if search_taco:
                qs = apply_search_filter(AlimentoTACO.objects.all(), search_query)
                if grupo_param:
                    if grupo_param == "NOT_SUPPLEMENTS":
                        qs = qs.exclude(grupo__icontains="Suplementos")
                    elif grupo_param != "TODOS":
                        qs = qs.filter(grupo__icontains=grupo_param)
                for item in qs[:150]:
                    results.append(
                        self._map_model_to_unified(item, "TACO", user_fav_keys)
                    )

            if search_tbca:
                qs = apply_search_filter(AlimentoTBCA.objects.all(), search_query)
                if grupo_param:
                    if grupo_param == "NOT_SUPPLEMENTS":
                        qs = qs.exclude(grupo__icontains="Suplementos")
                    elif grupo_param != "TODOS":
                        qs = qs.filter(grupo__icontains=grupo_param)
                for item in qs[:150]:
                    results.append(
                        self._map_model_to_unified(item, "TBCA", user_fav_keys)
                    )

            if search_usda:
                qs = apply_search_filter(AlimentoUSDA.objects.all(), search_query)
                # USDA usa 'categoria' em vez de 'grupo'
                if grupo_param == "NOT_SUPPLEMENTS":
                    qs = qs.exclude(categoria__icontains="Suplementos")
                for item in qs[:100]:
                    results.append(
                        self._map_model_to_unified(item, "USDA", user_fav_keys)
                    )

        # Scoring e Ordenação
        if search_query:
            q_tokens = normalizar_para_scoring(search_query)
            for res in results:
                res["search_score"] = calcular_score_radical(
                    res.get("nome", ""), q_tokens
                )
            results.sort(
                key=lambda x: (not x.get("is_favorite"), -x.get("search_score", 0))
            )
        else:
            results.sort(key=lambda x: not x.get("is_favorite"))

        # Paginação Real
        paginator = FoodPageNumberPagination()
        page = paginator.paginate_queryset(results, request)
        if page is not None:
            return paginator.get_paginated_response(page)

        return Response({"count": len(results), "results": results[:200]})

    def _map_model_to_unified(self, item, source, fav_keys):
        """Helper para padronizar saída de modelos oficiais"""
        pk = getattr(item, "id", getattr(item, "fdc_id", ""))
        return {
            "id": f"{source}_{pk}",
            "nome": item.nome,
            "grupo": getattr(item, "grupo", getattr(item, "categoria", "Geral")),
            "source": source,
            "is_favorite": f"{source}_{pk}" in fav_keys,
            "energia_kcal": item.energia_kcal,
            "proteina_g": item.proteina_g,
            "lipidios_g": item.lipidios_g,
            "carboidrato_g": item.carboidrato_g,
            "fibra_g": getattr(item, "fibra_g", 0),
            "unidade_caseira": getattr(item, "unidade_caseira", "Porção"),
            "peso_unidade_caseira_g": getattr(item, "peso_unidade_caseira_g", 100),
            "medidas": [
                {"label": item.unidade_caseira, "weight": item.peso_unidade_caseira_g}
            ]
            if hasattr(item, "unidade_caseira") and item.unidade_caseira
            else [],
        }

    def _map_custom_to_unified(self, item, source, fav_keys):
        """Helper para padronizar saída de CustomFood"""
        return {
            "id": f"{source}_{item.id}",
            "nome": item.nome,
            "grupo": item.grupo or "Personalizado",
            "source": source,
            "is_favorite": f"{source}_{item.id}" in fav_keys,
            "energia_kcal": item.energia_kcal,
            "proteina_g": item.proteina_g,
            "lipidios_g": item.lipidios_g,
            "carboidrato_g": item.carboidrato_g,
            "fibra_g": item.fibra_g,
            "unidade_caseira": item.unidade_caseira,
            "peso_unidade_caseira_g": item.peso_unidade_caseira_g,
            "medidas": [
                {"label": item.unidade_caseira, "weight": item.peso_unidade_caseira_g}
            ]
            if item.unidade_caseira
            else [],
        }

    @action(detail=False, methods=["GET"])
    def grupos(self, request):
        """
        GET /api/v1/foods/grupos/
        Retorna todos os grupos/categorias disponíveis.
        """
        taco_grupos = set(
            AlimentoTACO.objects.values_list("grupo", flat=True).distinct()
        )
        tbca_grupos = set(
            AlimentoTBCA.objects.values_list("grupo", flat=True).distinct()
        )
        usda_grupos = set(
            AlimentoUSDA.objects.values_list("categoria", flat=True).distinct()
        )

        all_grupos = sorted(taco_grupos | tbca_grupos | usda_grupos)

        return Response({"grupos": all_grupos})

    @action(detail=False, methods=["GET"])
    def favorites(self, request):
        """
        GET /api/v1/diets/foods/favorites/
        Retorna a lista de alimentos favoritos do usuário com dados nutricionais completos.
        """
        if not request.user.is_authenticated:
            return Response({"results": []})

        self.ensure_cache()
        favorites = FavoriteFood.objects.filter(user=request.user).order_by(
            "-created_at"
        )
        results = []

        for fav in favorites:
            food_data = _get_food_data(fav.food_source, fav.food_id)
            if food_data:
                food_data["is_favorite"] = True
                results.append(food_data)

        return Response({"results": results})

    def get_measure_data(self, food_name):
        """
        Retorna a melhor medida padrão e uma lista de todas as medidas disponíveis.
        Usa CACHE EM MEMÓRIA para performance extrema.
        """
        if not food_name:
            return None, None, []

        # Garante que o cache está carregado
        self.ensure_cache()

        # Limpeza do nome
        parts = food_name.split(",")
        clean_name = parts[0].strip()

        if len(parts) > 1 and len(clean_name.split()) == 1:
            potential_name = f"{clean_name} {parts[1].strip()}"
            if len(potential_name) < 30:
                clean_name = potential_name

        search_term = clean_name.lower()

        # Busca no CACHE (em memória)
        # 1. Filtra matches
        matches = [
            m
            for m in FoodSearchViewSet.IBGE_CACHE.values()
            if search_term in m["nome_lower"]
        ]

        # Excluir medidas triviais
        matches = [
            m
            for m in matches
            if m["medida_nome"] not in ["Grama", "Quilo", "Miligrama"]
        ]

        if not matches:
            first_word = clean_name.split()[0].lower()
            if len(first_word) > 3:
                matches = [
                    m
                    for m in FoodSearchViewSet.IBGE_CACHE.values()
                    if first_word in m["nome_lower"]
                ]
                matches = [
                    m
                    for m in matches
                    if m["medida_nome"] not in ["Grama", "Quilo", "Miligrama"]
                ]

        available_measures = []
        if matches:
            # Coletar todas as medidas únicas
            seen_measures = set()
            for m in matches:
                if m["medida_nome"] not in seen_measures:
                    available_measures.append(
                        {"label": m["medida_nome"], "weight": m["peso_g"]}
                    )
                    seen_measures.add(m["medida_nome"])

            # HEURÍSTICA PARA MEDIDA PADRÃO

            # Lista de prioridades baseada no tipo de alimento (tentativa por nome)
            priorities = []
            name_lower = search_term  # já é lower

            # 1. Líquidos/Bebidas -> Mililitro, Copo, Xícara
            if any(
                x in name_lower
                for x in [
                    "suco",
                    "agua",
                    "água",
                    "cafe",
                    "café",
                    "cha",
                    "chá",
                    "leite",
                    "bebida",
                    "vitamina",
                    "refrigerante",
                    "iogurte",
                    "yogurte",
                    "cerveja",
                    "vinho",
                ]
            ):
                priorities = ["Mililitro", "Ml", "Copo", "Xícara", "Caneca", "Taça"]

            # 2. Frutas/Legumes Inteiros -> Unidade, Fatia
            elif any(
                x in name_lower
                for x in [
                    "laranja",
                    "maca",
                    "maçã",
                    "banana",
                    "mamao",
                    "mamão",
                    "melancia",
                    "melao",
                    "pao",
                    "pão",
                    "pera",
                    "pêra",
                    "tangerina",
                    "mexerica",
                    "kiwi",
                    "batata doce",
                ]
            ):
                priorities = ["Unidade", "Fatia", "Gomo", "Pedaço"]

            # 3. Bolos/Tortas/Doces -> Fatia, Pedaço
            elif any(
                x in name_lower
                for x in ["bolo", "torta", "pizza", "pudim", "chocolate"]
            ):
                priorities = ["Fatia", "Pedaço", "Unidade", "Barra"]

            # 4. Folhosos -> Prato, Folha
            elif any(
                x in name_lower
                for x in [
                    "alface",
                    "rucula",
                    "rúcula",
                    "agriao",
                    "agrião",
                    "couve",
                    "espinafre",
                    "escarola",
                    "acelga",
                ]
            ):
                priorities = ["Prato", "Folha", "Pires"]

            # 5. Grãos/Cozidos/Pastosos -> Colher, Concha
            else:
                priorities = [
                    "Colher de arroz",
                    "Colher de sopa",
                    "Concha",
                    "Escumadeira",
                    "Colher",
                ]

            # Tentar encontrar a melhor match baseada na prioridade
            best_match = None
            for priority in priorities:
                # Tenta encontrar string que COMEÇA com a prioridade para ser mais específico
                # Ex: 'Colher de arroz' deve vir antes de 'Colher' genérica
                for m in available_measures:
                    if m["label"].lower().startswith(priority.lower()):
                        best_match = m
                        break
                if best_match:
                    break

            # Se não achou por prefixo, tenta contains
            if not best_match:
                for priority in priorities:
                    for m in available_measures:
                        if priority.lower() in m["label"].lower():
                            best_match = m
                            break
                    if best_match:
                        break

            # Fallback genérico se a heurística específica falhar
            if not best_match:
                fallback_priorities = ["Unidade", "Colher de sopa", "Fatia", "Copo"]
                for priority in fallback_priorities:
                    for m in available_measures:
                        if priority.lower() in m["label"].lower():
                            best_match = m
                            break
                    if best_match:
                        break

            # Último recurso: pega o primeiro
            if not best_match and available_measures:
                best_match = available_measures[0]

            if best_match:
                return best_match["label"], best_match["weight"], available_measures

        return None, None, []


# Função auxiliar para verificar medidas inválidas
def is_invalid_measure(name):
    return not name or name.lower() in [
        "g",
        "grama",
        "gramas",
        "ml",
        "mililitro",
        "l",
        "litro",
        "mg",
    ]


class DietViewSet(viewsets.ModelViewSet):
    """ViewSet para gerenciamento de dietas."""

    serializer_class = DietSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Se a nova dieta for ativa, desative as outras do mesmo paciente
        is_active = self.request.data.get("is_active", True)
        patient_id = self.request.data.get("patient")

        if is_active and patient_id:
            Diet.objects.filter(patient_id=patient_id, is_active=True).update(
                is_active=False
            )

        diet = serializer.save()

        # Criar notificação para o paciente
        if is_active:
            try:
                from notifications.models import Notification
                from django.utils import timezone

                Notification.objects.create(
                    user=diet.patient.user,
                    title="Novo Plano Alimentar! 🍎",
                    message=f"Seu nutricionista acabou de enviar seu novo plano: {diet.name}. Confira agora!",
                    notification_type="new_diet",
                    sent_at=timezone.now(),
                )
            except Exception as e:
                print(f"Erro ao criar notificação de dieta: {e}")

    def perform_update(self, serializer):
        # Se a dieta atualizada for ativa, desative as outras
        is_active = self.request.data.get("is_active", True)
        patient_id = self.request.data.get("patient")

        if is_active and patient_id:
            Diet.objects.filter(patient_id=patient_id, is_active=True).exclude(
                pk=serializer.instance.pk
            ).update(is_active=False)

        diet = serializer.save()

        # Criar notificação para o paciente
        if is_active:
            try:
                from notifications.models import Notification
                from django.utils import timezone

                Notification.objects.create(
                    user=diet.patient.user,
                    title="Plano Alimentar Atualizado! 🍎",
                    message=f"Seu plano '{diet.name}' foi atualizado. Dê uma olhada nas novidades!",
                    notification_type="new_diet",
                    sent_at=timezone.now(),
                )
            except Exception as e:
                print(f"Erro ao criar notificação de atualização: {e}")

    @action(detail=True, methods=["POST"], parser_classes=[MultiPartParser, FormParser])
    def upload_pdf(self, request, pk=None):
        """
        Upload de arquivo PDF para a dieta.
        """
        diet = self.get_object()

        if "file" not in request.data:
            return Response(
                {"error": "Nenhum arquivo enviado."}, status=status.HTTP_400_BAD_REQUEST
            )

        file_obj = request.data["file"]

        # Validar tipo de arquivo
        if not file_obj.name.lower().endswith(".pdf"):
            return Response(
                {"error": "O arquivo deve ser um PDF."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        diet.pdf_file = file_obj
        diet.save()

        return Response(
            {"status": "PDF salvo com sucesso", "pdf_url": diet.pdf_file.url}
        )

    def get_queryset(self):
        # Otimização de Performance: N+1 Selects
        queryset = Diet.objects.filter(patient__nutritionist=self.request.user)\
            .select_related('patient', 'patient__user')\
            .prefetch_related('meals_rel', 'meals_rel__items')

        patient_id = self.request.query_params.get("patient")
        if patient_id:
            queryset = queryset.filter(patient_id=patient_id)

        is_active = self.request.query_params.get("is_active")
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == "true")

        return queryset


class MealViewSet(viewsets.ModelViewSet):
    """ViewSet para gerenciamento de refeições."""

    serializer_class = MealSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Meal.objects.filter(diet__patient__nutritionist=self.request.user)

        diet_id = self.request.query_params.get("diet")
        if diet_id:
            queryset = queryset.filter(diet_id=diet_id)

        return queryset


class MealPresetViewSet(viewsets.ModelViewSet):
    """ViewSet para gerenciamento de presets de refeições."""

    serializer_class = MealPresetSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = MealPreset.objects.filter(nutritionist=self.request.user)

        # Filtros opcionais
        meal_type = self.request.query_params.get("meal_type")
        if meal_type:
            queryset = queryset.filter(meal_type=meal_type)

        diet_type = self.request.query_params.get("diet_type")
        if diet_type:
            queryset = queryset.filter(diet_type=diet_type)

        is_active = self.request.query_params.get("is_active")
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == "true")

        search = self.request.query_params.get("search")
        if search:
            queryset = queryset.filter(name__icontains=search)

        return queryset

    def perform_create(self, serializer):
        # Associar automaticamente ao nutricionista autenticado
        serializer.save(nutritionist=self.request.user)


class FoodItemViewSet(viewsets.ModelViewSet):
    """ViewSet para gerenciamento de itens alimentares."""

    serializer_class = FoodItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = FoodItem.objects.filter(
            meal__diet__patient__nutritionist=self.request.user
        ).select_related('meal__diet__patient')

        meal_id = self.request.query_params.get("meal")
        if meal_id:
            queryset = queryset.filter(meal_id=meal_id)

        return queryset


class DefaultPresetViewSet(viewsets.ModelViewSet):
    """ViewSet para gerenciamento de presets padro."""

    serializer_class = DefaultPresetSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = DefaultPreset.objects.filter(nutritionist=self.request.user)

        # Filtros opcionais
        meal_type = self.request.query_params.get("meal_type")
        if meal_type:
            queryset = queryset.filter(meal_type=meal_type)

        diet_type = self.request.query_params.get("diet_type")
        if diet_type:
            queryset = queryset.filter(diet_type=diet_type)

        is_active = self.request.query_params.get("is_active")
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == "true")

        return queryset

    def perform_create(self, serializer):
        # Associar automaticamente ao nutricionista autenticado
        serializer.save(nutritionist=self.request.user)

    def perform_update(self, serializer):
        # Garantir que o nutricionista não seja alterado
        serializer.save(nutritionist=self.request.user)


class FoodSubstitutionRuleViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerenciamento de regras globais de substituição.
    Usado por administradores para definir substituições padrão.
    """

    serializer_class = FoodSubstitutionRuleSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = FoodSubstitutionRule.objects.filter(is_active=True)

        # Filtros opcionais
        diet_type = self.request.query_params.get("diet_type")
        if diet_type:
            queryset = queryset.filter(diet_type=diet_type)

        original_food_id = self.request.query_params.get("original_food_id")
        if original_food_id:
            queryset = queryset.filter(original_food_id=original_food_id)

        nutrient_predominant = self.request.query_params.get("nutrient_predominant")
        if nutrient_predominant:
            queryset = queryset.filter(nutrient_predominant=nutrient_predominant)

        return queryset.select_related("created_by").order_by(
            "diet_type", "priority", "-similarity_score"
        )

    def perform_create(self, serializer):
        # Associar automaticamente ao usuário autenticado
        serializer.save(created_by=self.request.user)

    @action(detail=False, methods=["GET"])
    def suggest(self, request):
        """
        Busca substituições baseadas em regras dinâmicas (motor) e fixas (regras).
        Refatorado para usar Service Layer em 08/02/2026.
        """
        food_id = request.query_params.get("food_id")
        food_name = request.query_params.get("food_name")
        food_source = request.query_params.get("food_source", "TACO")
        
        if not food_name:
            return Response({"error": "food_name é obrigatório"}, status=400)
            
        try:
            # Parse dos parâmetros
            original_quantity = float(request.query_params.get("quantity", 100))
            diet_type = request.query_params.get("diet_type", "normocalorica")
            
            # Target macros (opcional)
            t_ptn = request.query_params.get("orig_ptn")
            t_cho = request.query_params.get("orig_cho")
            t_fat = request.query_params.get("orig_fat")

            # Importação Lazy para evitar problema de import circular na inicialização
            from .services import calculate_suggestion_service
            
            # Chamada ao Serviço
            results, group_name, status_code = calculate_suggestion_service(
                food_id, food_name, food_source, original_quantity,
                diet_type, t_ptn, t_cho, t_fat
            )
            
            if status_code != 200:
                pass # Erros do serviço (ex: 404) serão tratados no retorno abaixo se results for None
                
            if results is None:
                return Response({"error": group_name}, status=status_code)

            return Response({"substitutions": results, "predominant": group_name or "mixed"})

        except Exception as e:
            # Log detalhado no servidor usando o logger padrão
            logger.error(f"[SUGGEST ERROR] {str(e)}", exc_info=True)
            # Retorno genérico para o cliente (Security Best Practice)
            return Response(
                {"error": "Ocorreu um erro interno ao processar sua solicitação."}, 
                status=500
            )

    @action(detail=False, methods=["POST"])
    def toggle_favorite(self, request):
        """Alterna o status de favorito de uma regra de substituição"""
        substitution_id = request.data.get("substitution_id")
        is_favorite = request.data.get("is_favorite", False)

        # Aqui você implementaria a lógica de salvar a preferência do nutricionista
        # Pelo fluxo atual, apenas retornamos sucesso para simular
        return Response({"status": "success", "is_favorite": is_favorite})

        return Response({"success": True})

    # =========================================================================
    # DEPRECATED: As funções abaixo foram unificadas em nutritional_substitution.py
    # Mantidas temporariamente para compatibilidade retroativa.
    # TODO: Remover após validação completa do motor unificado
    # =========================================================================
    
    def _identify_predominant_nutrient(self, food):
        """
        DEPRECATED: Use identificar_grupo_nutricional() de nutritional_substitution.py
        Identifica o macronutriente predominante do alimento
        """
        protein = food.proteina_g
        carbs = food.carboidrato_g
        fats = food.lipidios_g

        if carbs > protein and carbs > fats:
            return "carb"
        elif protein > carbs and protein > fats:
            return "protein"
        else:
            return "fat"

    def _get_professional_group(self, food):
        """Classifica o alimento em um grupo profissional para evitar trocas ilógicas"""
        name = food.nome.lower()
        # Se for TACO, usa o grupo da base como apoio
        taco_group = getattr(food, "grupo", "").lower()

        # Excluir ultraprocessados e doces de grupos principais
        # Usamos regex ou verificações mais precisas para não pegar 'batata doce'
        is_junk = any(
            x in name
            for x in [
                "bolo",
                "biscoito",
                "bolacha",
                "refrigerante",
                "sorvete",
                "salgadinho",
                "pizza",
                "lasanha",
            ]
        )
        # 'doce' sozinho ou em contextos de sobremesa, mas não 'batata doce'
        if "doce" in name and "batata" not in name and "fruta" not in name:
            is_junk = True

        if is_junk:
            return "OTHER"

        # Proteínas Magras
        if any(
            x in name
            for x in [
                "frango",
                "peixe",
                "ovo",
                "clara",
                "patinho",
                "maminha",
                "filé mignon",
                "file mignon",
            ]
        ):
            return "PROTEIN_LEAN"
        # Leguminosas
        if any(
            x in name
            for x in [
                "feijao",
                "feijão",
                "lentilha",
                "grao de bico",
                "grão-de-bico",
                "soja",
                "ervilha",
            ]
        ):
            return "LEGUME"
        # Carboidratos / Amiláceos / Tubérculos
        if any(
            x in name
            for x in [
                "arroz",
                "batata",
                "mandioca",
                "aipim",
                "inhame",
                "cuscuz",
                "aveia",
                "milho",
                "quinoa",
                "macarrao",
                "macarrão",
                "trigo",
                "pão",
                "pao",
                "farinha",
                "polvilho",
            ]
        ):
            return "CARB"
        # Frutas
        if "fruta" in taco_group or any(
            x in name
            for x in [
                "banana",
                "maçã",
                "maca",
                "laranja",
                "abacaxi",
                "abacate",
                "manga",
                "uva",
                "pera",
                "pêra",
                "mamão",
                "mamao",
                "melancia",
                "melão",
                "melao",
                "morango",
            ]
        ):
            return "FRUIT"
        # Vegetais / Hortaliças
        if (
            "verdura" in taco_group
            or "hortali" in taco_group
            or any(
                x in name
                for x in [
                    "alface",
                    "tomate",
                    "pepino",
                    "abóbora",
                    "abobora",
                    "abobrinha",
                    "brócolis",
                    "brocolis",
                    "vagem",
                    "cenoura",
                    "beterraba",
                    "chuchu",
                ]
            )
        ):
            return "VEGGIE"

        return "OTHER"

    def _is_same_food_family(self, original_name, substitute_name):
        """
        Verifica se o alimento substituto é da mesma família do original.
        Usado para evitar sugerir 'arroz tipo 1' como substituto de 'arroz integral'.
        """
        # Verificar se os parâmetros são válidos
        if not original_name or not substitute_name:
            return False

        original_lower = original_name.lower().strip()
        substitute_lower = substitute_name.lower().strip()

        # Extrair nome base (antes da vírgula, se houver)
        original_base = original_lower.split(",")[0].strip()
        substitute_base = substitute_lower.split(",")[0].strip()

        # Lista de palavras-chave que indicam mesma família
        food_families = {
            "arroz": ["arroz"],
            "feijao": ["feijao", "feijão"],
            "batata": ["batata"],
            "macarrao": ["macarrao", "macarrão"],
            "pao": ["pao", "pão"],
        }

        # Verificar se ambos pertencem à mesma família
        for family, keywords in food_families.items():
            original_in_family = any(kw in original_base for kw in keywords)
            substitute_in_family = any(kw in substitute_base for kw in keywords)

            # Se ambos são da mesma família (ex: arroz integral e arroz tipo 1)
            if original_in_family and substitute_in_family:
                return True

        return False

    def _calculate_nutritional_equivalence(
        self, original_food, substitute_food, original_quantity, professional_group
    ):
        """Calcula a quantidade do substituto baseada no macro predominante do grupo profissional"""
        if not original_food or not substitute_food or not original_food.energia_kcal:
            return original_quantity

        # Se o alimento original tem 0 de energia (improvável), retorna original
        if original_food.energia_kcal == 0 or substitute_food.energia_kcal == 0:
            return original_quantity

        # Determinar qual macro usar para a equivalência
        if professional_group in ["CARB", "LEGUME", "FRUIT"]:
            orig_val = original_food.carboidrato_g
            sub_val = substitute_food.carboidrato_g
        elif professional_group == "PROTEIN_LEAN":
            orig_val = original_food.proteina_g
            sub_val = substitute_food.proteina_g
        else:
            # Fallback para calorias se não for um grupo específico de carb/proteína
            orig_val = original_food.energia_kcal
            sub_val = substitute_food.energia_kcal

        if not orig_val or not sub_val or sub_val == 0:
            # Fallback para calorias se o macro específico for zero
            orig_val = original_food.energia_kcal
            sub_val = substitute_food.energia_kcal

        if not orig_val or not sub_val or sub_val == 0:
            return original_quantity

        orig_total = (original_quantity / 100.0) * orig_val
        sub_needed_qty = (orig_total / sub_val) * 100.0

        # Teto de segurança: No máximo 10x a porção original (evitar 8kg de manga)
        max_limit = original_quantity * 10
        if sub_needed_qty > max_limit:
            return max_limit

        return round(sub_needed_qty, 1)

    @action(detail=False, methods=["POST"])
    def toggle_favorite(self, request):
        """Toggle favorito para uma substituição"""
        substitution_id = request.data.get("substitution_id")
        is_favorite = request.data.get("is_favorite", True)

        if not substitution_id:
            return Response(
                {"error": "substitution_id é obrigatório"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Parse substitution_id para extrair tipo e ID
        if substitution_id.startswith("fav_"):
            # Já é favorita - desfavoritar
            fav_id = substitution_id.replace("fav_", "")
            try:
                favorite = NutritionistSubstitutionFavorite.objects.get(
                    id=fav_id, nutritionist=request.user
                )
                favorite.delete()
                return Response({"is_favorite": False})
            except NutritionistSubstitutionFavorite.DoesNotExist:
                return Response(
                    {"error": "Favorito não encontrado"},
                    status=status.HTTP_404_NOT_FOUND,
                )
        elif substitution_id.startswith("global_"):
            # É global - criar favorita
            global_id = substitution_id.replace("global_", "")
            try:
                global_sub = FoodSubstitutionRule.objects.get(id=global_id)
            except FoodSubstitutionRule.DoesNotExist:
                return Response(
                    {"error": "Regra global não encontrada"},
                    status=status.HTTP_404_NOT_FOUND,
                )

            # Criar favorita
            NutritionistSubstitutionFavorite.objects.create(
                nutritionist=request.user,
                original_source=global_sub.original_source,
                original_food_id=global_sub.original_food_id,
                original_food_name=global_sub.original_food_name,
                diet_type=global_sub.diet_type,
                substitute_source=global_sub.substitute_source,
                substitute_food_id=global_sub.substitute_food_id,
                substitute_food_name=global_sub.substitute_food_name,
                suggested_quantity=global_sub.suggested_quantity,
                similarity_score=global_sub.similarity_score,
                priority=10,
            )
            return Response({"is_favorite": True})

        return Response(
            {"error": "Formato de substitution_id inválido"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    @action(detail=False, methods=["POST"])
    def save_selection(self, request):
        """Salva as substituições selecionadas pelo nutricionista"""
        original_food_id = request.data.get("original_food_id")
        diet_type = request.data.get("diet_type")
        selected_substitution_ids = request.data.get("selected_substitution_ids", [])

        if not all([original_food_id, diet_type]):
            return Response(
                {"error": "original_food_id e diet_type são obrigatórios"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Remover favoritas antigas não selecionadas
        old_favorites = NutritionistSubstitutionFavorite.objects.filter(
            nutritionist=request.user,
            original_food_id=original_food_id,
            diet_type=diet_type,
        )

        # IDs das favoritas existentes
        existing_fav_ids = set(f"fav_{f.id}" for f in old_favorites)

        # IDs a manter
        keep_ids = set(selected_substitution_ids)

        # Remover favoritas não selecionadas
        for fav_id in existing_fav_ids - keep_ids:
            fav = old_favorites.filter(id=fav_id.replace("fav_", "")).first()
            if fav:
                fav.delete()

        # Marcar as selecionadas como favoritas (se não forem)
        for sub_id in selected_substitution_ids:
            if sub_id.startswith("global_"):
                # Criar favorita da global
                global_id = sub_id.replace("global_", "")
                try:
                    global_sub = FoodSubstitutionRule.objects.get(id=global_id)
                    NutritionistSubstitutionFavorite.objects.get_or_create(
                        nutritionist=request.user,
                        original_source=global_sub.original_source,
                        original_food_id=global_sub.original_food_id,
                        diet_type=global_sub.diet_type,
                        substitute_food_id=global_sub.substitute_food_id,
                        defaults={
                            "original_food_name": global_sub.original_food_name,
                            "substitute_source": global_sub.substitute_source,
                            "substitute_food_name": global_sub.substitute_food_name,
                            "suggested_quantity": global_sub.suggested_quantity,
                            "similarity_score": global_sub.similarity_score,
                            "priority": 10,
                        },
                    )
                except FoodSubstitutionRule.DoesNotExist:
                    continue

        return Response({"success": True})


class NutritionistSubstitutionFavoriteViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerenciamento de favoritos de substituição.
    Cada nutricionista pode ter suas próprias preferências.
    """

    serializer_class = NutritionistSubstitutionFavoriteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = NutritionistSubstitutionFavorite.objects.filter(
            nutritionist=self.request.user, is_active=True
        )

        # Filtros opcionais
        diet_type = self.request.query_params.get("diet_type")
        if diet_type:
            queryset = queryset.filter(diet_type=diet_type)

        original_food_id = self.request.query_params.get("original_food_id")
        if original_food_id:
            queryset = queryset.filter(original_food_id=original_food_id)

        return queryset.order_by("diet_type", "priority")

    def perform_create(self, serializer):
        # Associar automaticamente ao nutricionista autenticado
        serializer.save(nutritionist=self.request.user)


# =============================================================================
# VIEWSET DE GRUPOS DE SUBSTITUIÇÃO
# =============================================================================


class FoodSubstitutionGroupViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerenciamento de grupos de substituição de alimentos.
    """

    serializer_class = FoodSubstitutionGroupSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = FoodSubstitutionGroup.objects.filter(is_active=True)

        predominant_nutrient = self.request.query_params.get("predominant_nutrient")
        if predominant_nutrient:
            queryset = queryset.filter(predominant_nutrient=predominant_nutrient)

        return queryset.order_by("name")

    def perform_create(self, serializer):
        serializer.save()


# =============================================================================
# VIEWSET DE SUBSTITUIÇÃO DE ALIMENTOS (POR REFEIÇÃO)
# =============================================================================


class FoodSubstitutionsViewSet(viewsets.ViewSet):
    """
    ViewSet para gerenciamento de substituições de alimentos.
    Oferece substitutos com equivalência nutricional baseada no macronutriente predominante.
    """

    permission_classes = [IsAuthenticated]

    def list(self, request, meal_id=None, food_item_id=None):
        """
        GET /meals/{meal_id}/foods/{food_item_id}/substitutes/
        Retorna até 7 substitutos com equivalência nutricional calculada.
        """
        try:
            food_item = FoodItem.objects.get(id=food_item_id, meal_id=meal_id)
        except FoodItem.DoesNotExist:
            return Response(
                {"error": "Item de alimento não encontrado"},
                status=status.HTTP_404_NOT_FOUND,
            )

        protein = float(food_item.protein)
        carbs = float(food_item.carbs)
        fats = float(food_item.fats)

        if carbs >= protein and carbs >= fats:
            predominant = "carbs"
            original_nutrient = carbs
        elif protein >= carbs and protein >= fats:
            predominant = "protein"
            original_nutrient = protein
        else:
            predominant = "fat"
            original_nutrient = fats

        original_source = None
        original_food_id = None

        # Garantir que estamos utilizando os dados da tabela correta associada ao item de alimento
        if food_item.taco_food_id:
            original_source = "TACO"
            original_food_id = str(food_item.taco_food_id)
        elif food_item.tbca_food_id:
            original_source = "TBCA"
            original_food_id = str(food_item.tbca_food_id)
        elif food_item.usda_food_id:
            original_source = "USDA"
            original_food_id = str(food_item.usda_food_id)
        else:
            original_source = "TACO"
            original_food_id = None

        # Permitir substituições de qualquer fonte para garantir variedade, mas priorizar da mesma fonte
        substitutions = FoodSubstitution.objects.filter(
            is_approved=True
        ).select_related("group")

        # Primeiro tentamos encontrar substituições da mesma fonte
        same_source_subs = substitutions
        if original_food_id:
            same_source_subs = substitutions.filter(
                original_source=original_source, original_food_id=original_food_id
            )

        # Se não encontrarmos da mesma fonte, buscamos de qualquer fonte
        if not same_source_subs.exists():
            if original_food_id:
                substitutions = substitutions.filter(original_food_id=original_food_id)
            else:
                substitutions = substitutions.filter(
                    original_food_name__icontains=food_item.food_name.split(",")[0],
                )
        else:
            substitutions = same_source_subs

        group_predominants = {
            "carbs": "carbs",
            "protein": "protein",
            "fat": "fat",
        }
        target_predominant = group_predominants.get(predominant)
        if target_predominant:
            substitutions = substitutions.filter(
                group__predominant_nutrient=target_predominant
            )

        # Filtrar alimentos crus (cru/crua)
        substitutions = [
            s
            for s in substitutions
            if not any(kw in s.substitute_food_name.lower() for kw in ["cru", "crua"])
        ]

        substitutions = substitutions[:7]

        results = []
        for sub in substitutions:
            if predominant == "carbs":
                sub_nutrient = sub.substitute_carbs_per_100g
            elif predominant == "protein":
                sub_nutrient = sub.substitute_protein_per_100g
            else:
                sub_nutrient = sub.substitute_fat_per_100g

            # Usar a nova lógica de arredondamento e precisão para garantir equivalência
            original_quantity = float(food_item.quantity)
            if sub_nutrient and sub_nutrient > 0:
                # Cálculo: (Quantidade de macro na porção original / Quantidade de macro em 100g do substituto) * 100
                equivalent_quantity = (original_nutrient / float(sub_nutrient)) * 100.0
            else:
                equivalent_quantity = original_quantity

            multiplier = equivalent_quantity / 100

            results.append(
                {
                    "substitute_food_id": sub.substitute_food_id,
                    "substitute_food_name": sub.substitute_food_name,
                    "substitute_source": sub.substitute_source,
                    "equivalent_quantity_g": round(equivalent_quantity, 1),
                    "equivalent_quantity_display": f"{equivalent_quantity:.0f}g"
                    if equivalent_quantity >= 10
                    else f"{equivalent_quantity:.1f}g",
                    "predominant_nutrient": predominant,
                    "macros": {
                        "calories": round(
                            sub.substitute_calories_per_100g * multiplier, 1
                        ),
                        "protein": round(
                            sub.substitute_protein_per_100g * multiplier, 1
                        ),
                        "carbs": round(sub.substitute_carbs_per_100g * multiplier, 1),
                        "fat": round(sub.substitute_fat_per_100g * multiplier, 1),
                        "fiber": round(sub.substitute_fiber_per_100g * multiplier, 1),
                    },
                    "original_macros": {
                        "calories": float(food_item.calories),
                        "protein": float(food_item.protein),
                        "carbs": float(food_item.carbs),
                        "fat": float(food_item.fats),
                    },
                }
            )

        return Response(
            {
                "original_food": {
                    "name": food_item.food_name,
                    "quantity": float(food_item.quantity),
                    "unit": food_item.unit,
                    "macros": {
                        "calories": float(food_item.calories),
                        "protein": float(food_item.protein),
                        "carbs": float(food_item.carbs),
                        "fat": float(food_item.fats),
                    },
                },
                "substitutions": results,
            }
        )

    @action(detail=True, methods=["post"])
    def apply(self, request, meal_id=None, food_item_id=None):
        """
        POST /meals/{meal_id}/foods/{food_item_id}/apply-substitution/
        Aplica uma substituição a um item de alimento.
        """
        data = request.data

        try:
            food_item = FoodItem.objects.get(id=food_item_id, meal_id=meal_id)
        except FoodItem.DoesNotExist:
            return Response(
                {"error": "Item de alimento não encontrado"},
                status=status.HTTP_404_NOT_FOUND,
            )

        food_item.food_name = data.get("substitute_food_name")
        food_item.quantity = data.get("equivalent_quantity_g")
        food_item.unit = "g"
        macros = data.get("macros", {})
        food_item.calories = macros.get("calories", 0)
        food_item.protein = macros.get("protein", 0)
        food_item.carbs = macros.get("carbs", 0)
        food_item.fats = macros.get("fat", 0)
        food_item.fiber = macros.get("fiber", 0)

        source = data.get("substitute_source")
        sub_food_id = data.get("substitute_food_id")

        food_item.taco_food = None
        food_item.tbca_food = None
        food_item.usda_food = None

        if source == "TACO":
            try:
                food_item.taco_food_id = int(sub_food_id)
            except (ValueError, TypeError):
                pass
        elif source == "TBCA":
            try:
                food_item.tbca_food_id = int(sub_food_id)
            except (ValueError, TypeError):
                pass
        elif source == "USDA":
            try:
                food_item.usda_food_id = int(sub_food_id)
            except (ValueError, TypeError):
                pass

        food_item.save()

        return Response(
            {"success": True, "food_item": FoodItemSerializer(food_item).data}
        )


# =============================================================================
# VIEWSET DE ALIMENTOS PERSONALIZADOS
# =============================================================================


class CustomFoodViewSet(viewsets.ModelViewSet):
    """
    ViewSet para alimentos personalizados criados pelo nutricionista.
    """

    serializer_class = CustomFoodSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CustomFood.objects.filter(
            nutritionist=self.request.user, is_active=True
        ).order_by("nome")

    def perform_create(self, serializer):
        serializer.save(nutritionist=self.request.user)

    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save()

    @action(detail=False, methods=["GET"])
    def groups(self, request):
        """Retorna os grupos usados nos alimentos personalizados"""
        groups = (
            CustomFood.objects.filter(nutritionist=self.request.user, is_active=True)
            .values_list("grupo", flat=True)
            .distinct()
            .order_by("grupo")
        )
        return Response(groups)
