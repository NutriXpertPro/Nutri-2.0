# Generated manually for Nutri 4.0 - Sistema de Substituições v2
# Adiciona campos de restrição alimentar ao FoodSubstitutionRule

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("diets", "0017_alter_customfood_nutritionist"),
    ]

    operations = [
        # Adicionar campos de restrição alimentar ao FoodSubstitutionRule
        migrations.AddField(
            model_name="foodsubstitutionrule",
            name="is_vegan",
            field=models.BooleanField(
                default=False,
                help_text="Se o alimento substituto é vegano (sem origem animal)",
                verbose_name="Vegano",
            ),
        ),
        migrations.AddField(
            model_name="foodsubstitutionrule",
            name="is_vegetarian",
            field=models.BooleanField(
                default=False,
                help_text="Se o alimento substituto é vegetariano (pode conter laticínios/ovos)",
                verbose_name="Vegetariano",
            ),
        ),
        migrations.AddField(
            model_name="foodsubstitutionrule",
            name="is_gluten_free",
            field=models.BooleanField(
                default=True,
                help_text="Se o alimento substituto é sem glúten",
                verbose_name="Sem Glúten",
            ),
        ),
        # Adicionar índices para melhorar performance nas buscas com filtros
        migrations.AddIndex(
            model_name="foodsubstitutionrule",
            index=models.Index(
                fields=["is_vegan", "is_vegetarian", "is_gluten_free"],
                name="diets_foodsub_dietary_idx",
            ),
        ),
        migrations.AddIndex(
            model_name="foodsubstitutionrule",
            index=models.Index(
                fields=["original_source", "original_food_id", "is_vegan"],
                name="diets_foodsub_orig_vegan_idx",
            ),
        ),
        migrations.AddIndex(
            model_name="foodsubstitutionrule",
            index=models.Index(
                fields=["original_source", "original_food_id", "is_vegetarian"],
                name="diets_foodsub_orig_veg_idx",
            ),
        ),
    ]
