from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination  # Importado
from django.db.models import Q
from itertools import chain
import hashlib
from .utils import safe_float, get_val, _get_food_data
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
from .services import calculate_suggestion_service

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


# safe_float, get_val, and _get_food_data are imported from .utils above
# They were previously defined here but have been centralized.


def _get_food_data_local(source, food_id):
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

        # --- FILTROS DE CATEGORIA ROBUSTOS ---
        # Grupos que identificam suplementos de forma clara
        SUPPLEMENT_KEYWORDS = ["SUPLEMENTO", "WHEY", "CREATINA", "WHEY PROTEIN", "FINS ESPECIAIS"]
        
        def filter_category(queryset, field_name, mode):
            """
            Aplica filtros de inclusão ou exclusão de suplementos.
            mode: 'SUPLEMENTOS' ou 'NOT_SUPPLEMENTS'
            """
            q_filter = Q()
            for kw in SUPPLEMENT_KEYWORDS:
                q_filter |= Q(**{f"{field_name}__icontains": kw})
            
            if mode == "SUPLEMENTOS":
                return queryset.filter(q_filter)
            elif mode == "NOT_SUPPLEMENTS":
                return queryset.exclude(q_filter)
            return queryset

        results = []

        # Determinar permissões de busca baseadas na fonte
        is_all = source_param in ["", "ALL", "SUPLEMENTOS"]
        search_custom = is_all or source_param in ["SUA TABELA", "CUSTOM"]
        search_official = is_all or source_param in ["ALIMENTOS", "TACO", "TBCA", "USDA"]
        
        # Modo de operação: Aba de Suplementos ou Aba de Alimentos
        op_mode = "SUPLEMENTOS" if (grupo_param == "SUPLEMENTOS" or source_param == "SUPLEMENTOS") else "NOT_SUPPLEMENTS"

        # 1. CustomFood (Sua Tabela / Meus Suplementos)
        if search_custom:
            custom_qs = CustomFood.objects.filter(is_active=True)
            if only_mine:
                custom_qs = custom_qs.filter(nutritionist=request.user)
            else:
                custom_qs = custom_qs.filter(Q(nutritionist=request.user) | Q(nutritionist__isnull=True))

            # Aplicar filtro de categoria (Suplementos vs Alimentos)
            custom_qs = filter_category(custom_qs, "grupo", op_mode)

            # Filtros adicionais de subgrupo (ex: Frutas, Carnes)
            if grupo_param and grupo_param not in ["SUPLEMENTOS", "NOT_SUPPLEMENTS", "TODOS"]:
                custom_qs = custom_qs.filter(grupo__icontains=grupo_param)

            if search_query:
                custom_qs = apply_search_filter(custom_qs, search_query, field="nome")

            for item in custom_qs[:200]:
                results.append(self._map_custom_to_unified(item, "Sua Tabela", user_fav_keys))

        # 2. Modelos Oficiais (TACO, TBCA, USDA)
        if search_official:
            # Tabelas ativas (se is_all é true, todas ficam ativas)
            taco_active = is_all or source_param in ["ALIMENTOS", "TACO"]
            tbca_active = is_all or source_param in ["ALIMENTOS", "TBCA"]
            usda_active = is_all or source_param in ["ALIMENTOS", "USDA"]

            if taco_active:
                qs = AlimentoTACO.objects.all()
                qs = filter_category(qs, "grupo", op_mode)
                if grupo_param and grupo_param not in ["SUPLEMENTOS", "NOT_SUPPLEMENTS", "TODOS"]:
                    qs = qs.filter(grupo__icontains=grupo_param)
                
                qs = apply_search_filter(qs, search_query)
                for item in qs[:150]:
                    results.append(self._map_model_to_unified(item, "TACO", user_fav_keys))

            if tbca_active:
                qs = AlimentoTBCA.objects.all()
                qs = filter_category(qs, "grupo", op_mode)
                if grupo_param and grupo_param not in ["SUPLEMENTOS", "NOT_SUPPLEMENTS", "TODOS"]:
                    qs = qs.filter(grupo__icontains=grupo_param)
                
                qs = apply_search_filter(qs, search_query)
                for item in qs[:150]:
                    results.append(self._map_model_to_unified(item, "TBCA", user_fav_keys))

            if usda_active:
                qs = AlimentoUSDA.objects.all()
                # USDA usa 'categoria' em vez de 'grupo'
                qs = filter_category(qs, "categoria", op_mode)
                
                qs = apply_search_filter(qs, search_query)
                for item in qs[:100]:
                    results.append(self._map_model_to_unified(item, "USDA", user_fav_keys))

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

    @action(detail=True, methods=["get"], url_path="substitutions-v2")
    def substitutions_v2(self, request, pk=None):
        """
        GET /foods/{id}/substitutions-v2/
        Retorna substitutos inteligentes para um alimento específico.
        """
        food_id_raw = pk
        parts = food_id_raw.split("_", 1)
        if len(parts) == 2:
            food_source = parts[0]
            food_id = parts[1]
        else:
            food_source = "TACO"
            food_id = food_id_raw

        # Buscar dados do alimento para obter o nome original
        food_data = _get_food_data(food_source, food_id)
        if not food_data:
            return Response({"error": "Alimento não encontrado"}, status=status.HTTP_404_NOT_FOUND)

        food_name = food_data.get("nome", "Alimento")
        
        # Parâmetros de contexto (opcionais no GET)
        qty = safe_float(request.query_params.get("quantity", 100))
        diet = request.query_params.get("diet_type", "normocalorica")
        
        results, group, code = calculate_suggestion_service(
            food_id=food_id,
            food_name=food_name,
            food_source=food_source,
            original_quantity=qty,
            diet_type=diet
        )
        
        if code != 200:
            return Response({"error": group}, status=code)

        # Mapear para o formato que o frontend espera (SubstitutionResponseV2)
        formatted_results = []
        for res in results:
            fptr = res["food"]
            formatted_results.append({
                "substitute_food_id": str(fptr.get("id", "")),
                "substitute_food_name": fptr.get("nome", ""),
                "substitute_source": fptr.get("source", "AUTO"),
                "equivalent_quantity_g": res["suggested_quantity"],
                "equivalent_quantity_display": f"{res['suggested_quantity']:.1f}g",
                "predominant_nutrient": group,
                "macros": {
                    "calories": fptr.get("energia_kcal", 0),
                    "protein": fptr.get("proteina_g", 0),
                    "carbs": fptr.get("carboidrato_g", 0),
                    "fat": fptr.get("lipidios_g", 0),
                    "fiber": fptr.get("fibra_g", 0),
                },
                "similarity_score": res["similarity_score"],
                "notes": res["notes"]
            })

        return Response({
            "original_food": {
                "name": food_name,
                "quantity": qty,
                "unit": "g",
                "macros": {
                    "calories": food_data.get("energia_kcal", 0),
                    "protein": food_data.get("proteina_g", 0),
                    "carbs": food_data.get("carboidrato_g", 0),
                    "fat": food_data.get("lipidios_g", 0),
                }
            },
            "substitutions": formatted_results
        })

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



    # Deprecated methods removed — logic centralized in nutritional_substitution.py
    # _identify_predominant_nutrient, _get_professional_group,
    # _is_same_food_family, _calculate_nutritional_equivalence
    # were all removed as part of the 2026 cleanup.





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

        # Usar o serviço de substituição inteligente 2026
        results_raw, group_name, code = calculate_suggestion_service(
            food_id=original_food_id,
            food_name=food_item.food_name,
            food_source=original_source,
            original_quantity=float(food_item.quantity),
            diet_type="normocalorica", # TODO: Get from diet
            t_ptn=food_item.protein,
            t_cho=food_item.carbs,
            t_fat=food_item.fats
        )

        if code != 200:
            return Response({"error": group_name}, status=code)

        results = []
        for res in results_raw:
            fptr = res["food"]
            results.append(
                {
                    "substitute_food_id": res.get("id", ""),
                    "substitute_food_name": fptr.get("nome", ""),
                    "substitute_source": fptr.get("source", "AUTO"),
                    "equivalent_quantity_g": round(res["suggested_quantity"], 1),
                    "equivalent_quantity_display": f"{res['suggested_quantity']:.1f}g",
                    "predominant_nutrient": predominant,
                    "macros": {
                        "calories": round(fptr.get("energia_kcal", 0), 1),
                        "protein": round(fptr.get("proteina_g", 0), 1),
                        "carbs": round(fptr.get("carboidrato_g", 0), 1),
                        "fat": round(fptr.get("lipidios_g", 0), 1),
                        "fiber": round(fptr.get("fibra_g", 0), 1),
                    },
                    "original_macros": {
                        "calories": float(food_item.calories),
                        "protein": float(food_item.protein),
                        "carbs": float(food_item.carbs),
                        "fat": float(food_item.fats),
                    },
                    "similarity_score": res.get("similarity_score", 0),
                    "notes": res.get("notes", "")
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
