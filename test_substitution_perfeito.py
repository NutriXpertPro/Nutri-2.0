#!/usr/bin/env python
"""
Teste do Sistema de Substituição Perfeito
"""

import os
import sys
import django

# Setup Django
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "backend"))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "nutri4.settings")
django.setup()

from backend.diets.nutritional_substitution import (
    identificar_tipo_alimento,
    identificar_preparo,
    calcular_quantidade_por_macro,
    sugerir_substituicoes_perfeito,
)
from backend.diets.models import UnifiedFood


def test_identificar_tipo():
    """Testa identificação de tipo de alimento"""
    print("\n=== TESTE: Identificar Tipo ===")

    casos = [
        ("Arroz, integral, cozido", "CARBOIDRATO"),
        ("Frango, peito, grelhado", "PROTEINA"),
        ("Batata-doce, cozida", "CARBOIDRATO"),
        ("Tilápia, grelhada", "PROTEINA"),
        ("Azeite de oliva", "GORDURA"),
    ]

    for nome, esperado in casos:
        resultado = identificar_tipo_alimento(nome)
        status = "✓" if resultado == esperado else "✗"
        print(f"  {status} '{nome}': {resultado} (esperado: {esperado})")


def test_identificar_preparo():
    """Testa identificação de método de preparo"""
    print("\n=== TESTE: Identificar Preparo ===")

    casos = [
        ("Arroz, integral, cozido", "BOILED"),
        ("Frango, peito, grelhado", "GRILLED"),
        ("Batata, assada", "ROASTED"),
        ("Peixe, frito", "FRIED"),
        ("Carne crua", "RAW"),
    ]

    for nome, esperado in casos:
        resultado = identificar_preparo(nome)
        status = "✓" if resultado == esperado else "✗"
        print(f"  {status} '{nome}': {resultado} (esperado: {esperado})")


def test_calcular_quantidade():
    """Testa cálculo de quantidade equivalente"""
    print("\n=== TESTE: Calcular Quantidade ===")

    # Se 100g de arroz tem 28g de carboidrato,
    # e queremos um substituto com a mesma quantidade de carboidrato
    # Se o substituto tem 25g de carboidrato por 100g:
    # quantidade = (28 * 100) / 25 = 112g

    qtd = calcular_quantidade_por_macro(28, 25, 100)
    print(f"  Macro original: 28g, Macro substituto: 25g/100g, Qtd original: 100g")
    print(f"  Quantidade calculada: {qtd}g (esperado: 112g)")
    print(f"  {'✓' if abs(qtd - 112) < 1 else '✗'}")


def test_sugerir_substituicoes():
    """Testa sugestão de substituições"""
    print("\n=== TESTE: Sugerir Substituições ===")

    # Verificar se há dados no UnifiedFood
    total = UnifiedFood.objects.count()
    print(f"  Total de alimentos no UnifiedFood: {total}")

    if total == 0:
        print("  ✗ ATENÇÃO: Não há dados no UnifiedFood!")
        print("  Execute: python manage.py unify_foods")
        return

    # Testar com arroz cozido
    print("\n  Testando substituições para 'Arroz, integral, cozido' (100g):")

    substitutos = sugerir_substituicoes_perfeito(
        original_nome="Arroz, integral, cozido",
        original_grupo="CARB",
        original_quantidade=100,
        original_proteina_100g=2.5,
        original_carboidrato_100g=28,
        original_lipidio_100g=1.0,
        original_energia_100g=124,
        original_prep_method="BOILED",
        limite=10,
    )

    print(f"  Encontrados {len(substitutos)} substitutos:")
    for i, sub in enumerate(substitutos[:5], 1):
        print(f"    {i}. {sub.alimento_substituto}")
        print(
            f"       Qtd: {sub.quantidade_substituto_g}g | Macro: {sub.macronutriente_igualizado}={getattr(sub, sub.macronutriente_igualizado + '_substituto', 0)}g/100g"
        )
        print(f"       Score: {sub.similarity_score}")


if __name__ == "__main__":
    print("=" * 50)
    print("TESTE DO SISTEMA DE SUBSTITUIÇÃO PERFEITO")
    print("=" * 50)

    test_identificar_tipo()
    test_identificar_preparo()
    test_calcular_quantidade()
    test_sugerir_substituicoes()

    print("\n" + "=" * 50)
    print("FIM DOS TESTES")
    print("=" * 50)
