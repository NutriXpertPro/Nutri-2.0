"""
Seed de Substituições v2 - Nutri 4.0
=====================================

Comando Django para popular o banco de dados com as 56 regras de substituição
com equivalência nutricional exata (8 alimentos × 7 substituições cada).

Uso:
    python manage.py seed_substitutions_v2
"""

import json
import os
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.db import transaction
from diets.models import FoodSubstitutionRule


class Command(BaseCommand):
    help = "Popula o banco com 56 regras de substituição (8 alimentos x 7 opções)"

    def handle(self, *args, **options):
        self.stdout.write("Iniciando seed de substituicoes v2...")
        self.stdout.write("=" * 60)

        rules_data = self.load_substitution_rules()

        created_count = 0
        skipped_count = 0
        error_count = 0

        with transaction.atomic():
            for food_data in rules_data:
                original = food_data["original_food"]
                substitutes = food_data["substitutes"]

                self.stdout.write(
                    f"\nProcessando: {original['name']} ({original['quantity_g']}g)"
                )
                self.stdout.write(
                    f"   Macro predominante: {original['macro_predominant']}"
                )

                for sub in substitutes:
                    try:
                        # Verificar se já existe
                        existing = FoodSubstitutionRule.objects.filter(
                            original_food_name__icontains=original["name"],
                            substitute_food_name__icontains=sub["name"],
                            diet_type="normocalorica",
                        ).first()

                        if existing:
                            self.stdout.write(f"   ! Já existe: {sub['name']}")
                            skipped_count += 1
                            continue

                        # Criar nova regra
                        rule = FoodSubstitutionRule.objects.create(
                            original_source="TACO",
                            original_food_id=f"manual_{original['name'].lower().replace(' ', '_')}",
                            original_food_name=original["name"],
                            substitute_source="TACO",
                            substitute_food_id=f"manual_{sub['name'].lower().replace(' ', '_')}",
                            substitute_food_name=sub["name"],
                            diet_type="normocalorica",
                            nutrient_predominant=original["macro_predominant"][
                                :4
                            ],  # carb, prot, fat
                            similarity_score=Decimal(
                                str(sub["similarity_score"] / 100)
                            ),
                            conversion_factor=Decimal(
                                str(sub["quantity_g"] / original["quantity_g"])
                            ),
                            suggested_quantity=Decimal(str(sub["quantity_g"])),
                            is_vegan=sub["is_vegan"],
                            is_vegetarian=sub["is_vegetarian"],
                            is_gluten_free=sub["is_gluten_free"],
                            priority=sub["priority"],
                            is_active=True,
                            notes=f"Substituição calculada: {original['macro_predominant']} igualizado, similaridade {sub['similarity_score']}%",
                        )

                        self.stdout.write(
                            f"   OK Criado: {sub['name']} ({sub['quantity_g']}g) - Similaridade: {sub['similarity_score']}%"
                        )
                        created_count += 1

                    except Exception as e:
                        self.stdout.write(
                            f"   ERRO Erro ao criar {sub['name']}: {str(e)}"
                        )
                        error_count += 1

        self.stdout.write("\n" + "=" * 60)
        self.stdout.write("RESUMO:")
        self.stdout.write(f"   OK Criadas: {created_count} regras")
        self.stdout.write(f"   ! Ignoradas (já existiam): {skipped_count} regras")
        self.stdout.write(f"   ERRO Erros: {error_count} regras")
        self.stdout.write(
            f"   Total no banco: {FoodSubstitutionRule.objects.count()} regras"
        )
        self.stdout.write("=" * 60)
        self.stdout.write("Seed concluído!")

    def load_substitution_rules(self):
        """Carrega as regras de substituição do arquivo JSON."""
        # Caminho correto: backend/diets/data/substitution_rules_v2.json
        json_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
            "data",
            "substitution_rules_v2.json",
        )

        with open(json_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        return data["substitution_rules"]
