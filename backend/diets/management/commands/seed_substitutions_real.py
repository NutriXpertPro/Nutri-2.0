from django.core.management.base import BaseCommand
from diets.models import FoodSubstitutionRule, AlimentoTACO
from users.models import User
from diets.nutritional_substitution import (
    NutricaoAlimento, 
    identificar_grupo_nutricional, 
    calcular_substituicao,
    alimento_taco_para_nutricao
)
from django.db import transaction
import random

class Command(BaseCommand):
    help = "Cria substituições inteligentes baseadas em grupos nutricionais reais"

    def handle(self, *args, **options):
        self.stdout.write("Limpando regras de substituição antigas e arbitrárias...")
        FoodSubstitutionRule.objects.filter(notes__icontains="Substituição base").delete()
        FoodSubstitutionRule.objects.filter(notes__icontains="Substituição reversa").delete()

        admin_user = User.objects.first()
        if not admin_user:
            self.stdout.write("Erro: Nenhum usuário encontrado para atribuir as regras!")
            return

        self.stdout.write("Buscando alimentos da base TACO...")
        foods = list(AlimentoTACO.objects.all())
        if not foods:
            self.stdout.write("Erro: Base TACO vazia!")
            return

        # Agrupar alimentos por grupo nutricional real
        grouped_foods = {}
        for f in foods:
            group = identificar_grupo_nutricional(f.nome, f.grupo)
            if group not in grouped_foods:
                grouped_foods[group] = []
            grouped_foods[group].append(f)

        self.stdout.write(f"Grupos identificados: {list(grouped_foods.keys())}")

        created_count = 0
        
        with transaction.atomic():
            for group, items in grouped_foods.items():
                if group == "OTHER" or len(items) < 2:
                    continue
                
                self.stdout.write(f"Gerando regras para o grupo: {group} ({len(items)} alimentos)")
                
                # Para cada grupo, pegamos alguns alimentos para criar regras de exemplo
                # Não queremos criar regras para todos contra todos (N^2), seria demais.
                # Vamos pegar até 10 alimentos do grupo e criar 3 substitutos para cada.
                sample_size = min(len(items), 20)
                sample_items = random.sample(items, sample_size)
                
                for original in sample_items:
                    orig_nutri = alimento_taco_para_nutricao(original)
                    if not orig_nutri: continue
                    
                    # Tenta encontrar 3 substitutos no mesmo grupo
                    substitutos_potenciais = [i for i in items if i.id != original.id]
                    if not substitutos_potenciais: continue
                    
                    # Pega até 3 aleatórios
                    num_subst = min(len(substitutos_potenciais), 3)
                    subst_items = random.sample(substitutos_potenciais, num_subst)
                    
                    for substitute in subst_items:
                        subst_nutri = alimento_taco_para_nutricao(substitute)
                        if not subst_nutri: continue
                        
                        # Calcular a substituição real usando o motor
                        res = calcular_substituicao(
                            orig_nutri, 
                            subst_nutri, 
                            group, 
                            100.0  # Base 100g
                        )
                        
                        # Só criar se a similaridade for razoável (> 0.6)
                        if res.similarity_score >= 0.6:
                            rule, created = FoodSubstitutionRule.objects.get_or_create(
                                original_source="TACO",
                                original_food_id=str(original.id),
                                substitute_source="TACO",
                                substitute_food_id=str(substitute.id),
                                diet_type="normocalorica",
                                defaults={
                                    "original_food_name": original.nome,
                                    "substitute_food_name": substitute.nome,
                                    "nutrient_predominant": res.macronutriente_igualizado[:4].lower(),
                                    "similarity_score": res.similarity_score,
                                    "conversion_factor": res.quantidade_substituto_g / 100.0,
                                    "suggested_quantity": res.quantidade_substituto_g,
                                    "priority": int(res.similarity_score * 100),
                                    "notes": f"Gerado via Inteligência Nutricional: {group}",
                                    "created_by": admin_user,
                                    "is_active": True,
                                    "is_vegan": "animal" not in substitute.nome.lower() and "carne" not in substitute.nome.lower(),
                                    "is_vegetarian": "carne" not in substitute.nome.lower(),
                                    "is_gluten_free": True,
                                },
                            )
                            if created:
                                created_count += 1

        self.stdout.write(f"\nSucesso! {created_count} novas regras inteligentes criadas!")
        self.stdout.write(f"Total de regras no banco: {FoodSubstitutionRule.objects.count()}")
