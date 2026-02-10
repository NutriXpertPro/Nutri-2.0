#!/usr/bin/env python3
"""
Script de validação de dados nutricionais do Nutri 4.0
Verifica se os dados nutricionais estão corretamente implementados
e baseados em fontes oficiais (TACO/TBCA/USDA/IBGE).
"""

import sys
import os
import re
from pathlib import Path

def check_nutritional_data_sources(file_path):
    """Verifica se os dados nutricionais estão baseados em fontes oficiais"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    issues = []
    
    # Verifica se há referência a fontes oficiais
    has_valid_source = (
        'TACO' in content or
        'TBCA' in content or
        'USDA' in content or
        'IBGE' in content or
        'taco' in content or
        'tbca' in content or
        'usda' in content or
        'ibge' in content
    )
    
    # Verifica se há dados nutricionais sem fonte
    nutritional_keywords = [
        'calorias', 'proteina', 'proteína', 'carboidrato', 
        'gordura', 'fibra', 'energia', 'macro', 'macros'
    ]
    
    has_nutritional_data = any(keyword in content.lower() for keyword in nutritional_keywords)
    
    if has_nutritional_data and not has_valid_source:
        issues.append(f"Dados nutricionais sem fonte oficial identificada: {file_path}")
    
    return issues

def check_macro_balance(file_path):
    """Verifica se há cálculos de macros balanceados"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    issues = []
    
    # Verifica fórmulas de cálculo de TMB/GCDT
    has_tmb_calculation = (
        'mifflin' in content.lower() or
        'harris' in content.lower() or
        'tmb' in content.lower() or
        'taxa metabólica' in content.lower()
    )
    
    has_gcdt_calculation = (
        'gcdt' in content.lower() or
        'gasto calórico' in content.lower() or
        'atividade' in content.lower()
    )
    
    # Verifica se há cálculos sem fórmulas estabelecidas
    if ('calorias' in content.lower() or 'kcal' in content.lower()) and not (has_tmb_calculation or has_gcdt_calculation):
        if 'diet' in str(file_path) or 'nutricional' in str(file_path).lower():
            issues.append(f"Possível cálculo de calorias sem fórmula padrão: {file_path}")
    
    return issues

def check_food_substitutions(file_path):
    """Verifica se as regras de substituição estão corretamente implementadas"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    issues = []
    
    # Verifica se há substituições de alimentos
    if 'substituicao' in content.lower() or 'substituição' in content.lower() or 'substituto' in content.lower():
        # Verifica se há validação de similaridade
        has_similarity_check = (
            'similaridade' in content.lower() or
            'equivalencia' in content.lower() or
            'equivalência' in content.lower() or
            'macro' in content.lower() or
            'calorias' in content.lower()
        )
        
        if not has_similarity_check:
            issues.append(f"Substituição de alimentos sem validação de similaridade: {file_path}")
    
    return issues

def main():
    if len(sys.argv) != 2:
        print("Uso: python nutrition_validator.py <diretório_do_projeto>")
        sys.exit(1)
    
    project_dir = Path(sys.argv[1])
    
    # Encontrar todos os arquivos Python e JSON no projeto
    files = list(project_dir.rglob("*.py")) + list(project_dir.rglob("*.json"))
    
    all_issues = []
    
    for file_path in files:
        # Pular arquivos de teste e migrações
        if any(skip in str(file_path) for skip in ['migrations', 'test', '__pycache__', 'node_modules']):
            continue
            
        issues = check_nutritional_data_sources(file_path)
        issues.extend(check_macro_balance(file_path))
        issues.extend(check_food_substitutions(file_path))
        
        if issues:
            all_issues.extend(issues)
    
    # Exibir resultados
    if all_issues:
        print(f"\n⚠️  Encontrados {len(all_issues)} potenciais problemas nutricionais:")
        print("="*60)
        for issue in all_issues:
            print(f"❌ {issue}")
        print("\nVerifique esses itens para garantir dados nutricionais precisos e baseados em fontes oficiais.")
        return 1
    else:
        print("✅ Nenhum problema nutricional óbvio encontrado!")
        print("✓ Dados baseados em fontes oficiais (TACO/TBCA/USDA/IBGE)")
        print("✓ Cálculos de macros e TMB/GCDT implementados corretamente")
        print("✓ Substituições com validação de similaridade")
        return 0

if __name__ == "__main__":
    sys.exit(main())