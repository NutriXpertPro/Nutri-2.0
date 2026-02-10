import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'setup.settings')
django.setup()

from diets.models import AlimentoTACO, AlimentoTBCA, AlimentoUSDA
from diets.nutritional_substitution import sugerir_substitucoes, alimento_taco_para_nutricao, identificar_grupo_nutricional

with open('final_report.txt', 'w', encoding='utf-8') as f:
    def test_substitution(food_name):
        f.write(f"\n--- Testando: {food_name} ---\n")
        orig_obj = AlimentoTACO.objects.filter(nome__icontains=food_name).first()
        if not orig_obj:
            f.write(f"Alimento '{food_name}' não encontrado na TACO.\n")
            return

        nutri = alimento_taco_para_nutricao(orig_obj)
        group = identificar_grupo_nutricional(orig_obj.nome)
        
        candidates = []
        taco_qs = AlimentoTACO.objects.filter(grupo__icontains=group)
        for item in taco_qs[:200]:
            candidates.append(alimento_taco_para_nutricao(item))
        
        subs = sugerir_substitucoes(nutri, candidates, 100)
        f.write(f"Grupo identificado: {group}\n")
        f.write(f"Substituições geradas: {len(subs)}\n")
        for s in subs[:10]:
            f.write(f" -> {s.alimento_substituto}: {s.quantidade_substituto_g}g (Score: {s.similarity_score})\n")

    test_substitution("Arroz, integral, cozido")
    test_substitution("Frango, peito, sem pele, grelhado")
