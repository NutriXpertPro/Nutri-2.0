import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'setup.settings')
django.setup()

from diets.models import AlimentoTACO, AlimentoTBCA, AlimentoUSDA
from diets.nutritional_substitution import sugerir_substitucoes, alimento_taco_para_nutricao, identificar_grupo_nutricional, alimento_tbca_para_nutricao, alimento_usda_para_nutricao
from django.db.models import Q

def test_substitution(food_name):
    print(f"\n--- Testando: {food_name} ---")
    orig_obj = AlimentoTACO.objects.filter(nome__icontains=food_name).first()
    if not orig_obj:
        print(f"Alimento '{food_name}' não encontrado na TACO.")
        return

    nutri = alimento_taco_para_nutricao(orig_obj)
    group_name = identificar_grupo_nutricional(orig_obj.nome)
    
    mapa_filtro = {
        "carboidratos_complexos": ["Cereais", "Tubérculos", "Raízes", "Amiláceos", "Arroz", "Pães", "Massas"],
        "proteinas_principais": ["Carnes", "Ovos", "Pescados", "Aves", "Peixes", "Bovino", "Frango", "Suíno", "Peru"],
        "leguminosas": ["Leguminosas", "Feijão", "Lentilha", "Grão-de-bico"],
        "frutas_adocadas": ["Frutas"],
        "frutas_citricas": ["Frutas"],
        "verduras_verdes": ["Verduras", "Hortaliças", "Legumes", "Vegetais"],
        "legumes_variados": ["Verduras", "Hortaliças", "Legumes", "Vegetais"],
        "oleaginosas": ["Nozes", "Sementes", "Oleaginosas", "Castanha"],
        "gorduras_e_condimentos": ["Gorduras", "Óleos", "Azeite", "Manteiga"]
    }
    
    kws = mapa_filtro.get(group_name, [])
    query_obj = Q()
    for kw in kws:
        query_obj |= Q(grupo__icontains=kw)

    candidates = []
    for item in AlimentoTACO.objects.filter(query_obj)[:100]:
        candidates.append(alimento_taco_para_nutricao(item))
    for item in AlimentoTBCA.objects.filter(query_obj)[:100]:
        candidates.append(alimento_tbca_para_nutricao(item))
    
    subs = sugerir_substitucoes(nutri, candidates, 100)
    print(f"Grupo identificado: {group_name}")
    print(f"Candidatos brutos: {len(candidates)}")
    print(f"Substituições geradas: {len(subs)}")
    for s in subs[:10]:
        print(f" -> {s.alimento_substituto}: {s.quantidade_substituto_g}g (Score: {s.similarity_score})")

if __name__ == "__main__":
    test_substitution("Arroz, integral, cozido")
    test_substitution("Frango, peito, sem pele, grelhado")
