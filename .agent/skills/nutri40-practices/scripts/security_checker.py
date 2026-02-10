#!/usr/bin/env python3
"""
Script de verificação de segurança de dados do Nutri 4.0
Verifica se os modelos e views estão corretamente implementando o isolamento de dados
entre nutricionistas.
"""

import sys
import os
import re
from pathlib import Path

def check_data_isolation(file_path):
    """Verifica se o arquivo implementa corretamente o isolamento de dados"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    issues = []
    
    # Verifica se há consultas sem filtro de nutricionista
    unsafe_patterns = [
        r'\.objects\.all\(\)',  # Consultas sem filtro
        r'\.filter\([^)]*\)',   # Pode ser seguro ou inseguro, verificar contexto
    ]
    
    # Verifica se há filtros por nutricionista
    has_nutritionist_filter = (
        'nutritionist=request.user' in content or
        'nutritionist=self.request.user' in content or
        'nutritionist=user' in content
    )
    
    # Verifica se há uso de .all() em consultas de dados sensíveis
    if re.search(r'\.objects\.all\(\)', content):
        if not has_nutritionist_filter and any(keyword in content.lower() for keyword in ['patient', 'diet', 'anamnesis', 'evaluation']):
            issues.append(f"Potencial problema de segurança: Uso de .all() em dados sensíveis em {file_path}")
    
    return issues

def check_models_for_nutritionist_field(file_path):
    """Verifica se modelos têm campo de nutricionista"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    issues = []
    
    # Verifica se é um arquivo de modelo
    if 'models.py' in str(file_path) and ('class' in content and '(models.Model)' in content):
        # Verifica se tem campo de nutricionista
        if 'nutritionist' not in content and 'nutricionista' not in content:
            # Exceções para modelos que não precisam de nutricionista
            exceptions = ['User', 'AlimentoTACO', 'AlimentoTBCA', 'AlimentoUSDA', 'MedidaCaseira', 'AlimentoMedidaIBGE']
            has_exception = any(exc in content for exc in exceptions)
            
            if not has_exception:
                issues.append(f"Modelo pode precisar de campo de nutricionista: {file_path}")
    
    return issues

def main():
    if len(sys.argv) != 2:
        print("Uso: python security_checker.py <diretório_do_projeto>")
        sys.exit(1)
    
    project_dir = Path(sys.argv[1])
    
    # Encontrar todos os arquivos Python no projeto
    python_files = list(project_dir.rglob("*.py"))
    
    all_issues = []
    
    for file_path in python_files:
        # Pular arquivos de teste e migrações
        if any(skip in str(file_path) for skip in ['migrations', 'test', '__pycache__', 'node_modules']):
            continue
            
        issues = check_data_isolation(file_path)
        issues.extend(check_models_for_nutritionist_field(file_path))
        
        if issues:
            all_issues.extend(issues)
    
    # Exibir resultados
    if all_issues:
        print(f"\n⚠️  Encontrados {len(all_issues)} potenciais problemas de segurança:")
        print("="*60)
        for issue in all_issues:
            print(f"❌ {issue}")
        print("\nVerifique esses itens para garantir o isolamento adequado de dados entre nutricionistas.")
        return 1
    else:
        print("✅ Nenhum problema de segurança de dados óbvio encontrado!")
        return 0

if __name__ == "__main__":
    sys.exit(main())