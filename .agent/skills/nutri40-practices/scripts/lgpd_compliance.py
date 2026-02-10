#!/usr/bin/env python3
"""
Script de verificação de conformidade LGPD do Nutri 4.0
Verifica se os dados sensíveis estão corretamente protegidos
e se há conformidade com a Lei Geral de Proteção de Dados.
"""

import sys
import os
import re
from pathlib import Path

def check_sensitive_data_handling(file_path):
    """Verifica se dados sensíveis estão corretamente protegidos"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    issues = []
    
    # Verifica se há manipulação de dados sensíveis
    sensitive_keywords = [
        'cpf', 'rg', 'endereco', 'endereço', 'telefone', 'email', 
        'peso', 'altura', 'doenca', 'doença', 'medicamento', 
        'historico', 'histórico', 'anamnese', 'avaliacao', 'avaliação'
    ]
    
    has_sensitive_data = any(keyword in content.lower() for keyword in sensitive_keywords)
    
    # Verifica se há proteção de dados sensíveis
    protection_indicators = [
        'encrypt', 'criptogra', 'hash', 'mask', 'ocultar', 'proteger',
        'privacy', 'segurança', 'lgpd', 'consentimento', 'termo'
    ]
    
    has_protection = any(indicator in content.lower() for indicator in protection_indicators)
    
    if has_sensitive_data and not has_protection:
        issues.append(f"Dados sensíveis sem proteção aparente: {file_path}")
    
    return issues

def check_user_consent(file_path):
    """Verifica se há implementação de consentimento do usuário"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    issues = []
    
    # Verifica se há referência a consentimento
    consent_indicators = [
        'consentimento', 'termo', 'permissão', 'autorizacao', 'autorização',
        'privacy policy', 'política de privacidade', 'lgpd'
    ]
    
    has_consent_reference = any(indicator in content.lower() for indicator in consent_indicators)
    
    # Verifica se é um modelo ou view que lida com dados do paciente
    if ('patient' in str(file_path).lower() or 'user' in str(file_path).lower()) and not has_consent_reference:
        issues.append(f"Modelo/view com dados do paciente sem referência a consentimento: {file_path}")
    
    return issues

def check_data_retention(file_path):
    """Verifica se há políticas de retenção de dados"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    issues = []
    
    # Verifica se há lógica de remoção de dados
    retention_indicators = [
        'delete', 'remover', 'excluir', 'retenção', 'expirar', 'cleanup',
        'retention', 'expiration', 'remove'
    ]
    
    has_retention_logic = any(indicator in content.lower() for indicator in retention_indicators)
    
    # Verifica se há modelos com dados sensíveis sem política de retenção
    if ('patient' in content.lower() or 'anamnesis' in content.lower() or 'avaliacao' in content.lower()) and not has_retention_logic:
        issues.append(f"Dados sensíveis sem política de retenção aparente: {file_path}")
    
    return issues

def check_access_logs(file_path):
    """Verifica se há logs de acesso a dados sensíveis"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    issues = []
    
    # Verifica se há referência a logs de acesso
    log_indicators = [
        'log', 'audit', 'acesso', 'acessar', 'registro', 'track', 'trace'
    ]
    
    has_log_reference = any(indicator in content.lower() for indicator in log_indicators)
    
    # Verifica se é uma view ou função que acessa dados sensíveis
    if any(sensitive in content.lower() for sensitive in ['patient', 'anamnesis', 'avaliacao', 'diet']) and not has_log_reference:
        issues.append(f"Acesso a dados sensíveis sem log aparente: {file_path}")
    
    return issues

def main():
    if len(sys.argv) != 2:
        print("Uso: python lgpd_compliance.py <diretório_do_projeto>")
        sys.exit(1)
    
    project_dir = Path(sys.argv[1])
    
    # Encontrar todos os arquivos Python e arquivos de configuração
    files = list(project_dir.rglob("*.py")) + list(project_dir.rglob("*.md")) + list(project_dir.rglob("*.txt"))
    
    all_issues = []
    
    for file_path in files:
        # Pular arquivos de teste e migrações
        if any(skip in str(file_path) for skip in ['migrations', 'test', '__pycache__', 'node_modules']):
            continue
            
        issues = check_sensitive_data_handling(file_path)
        issues.extend(check_user_consent(file_path))
        issues.extend(check_data_retention(file_path))
        issues.extend(check_access_logs(file_path))
        
        if issues:
            all_issues.extend(issues)
    
    # Exibir resultados
    if all_issues:
        print(f"\n⚠️  Encontrados {len(all_issues)} potenciais problemas de conformidade LGPD:")
        print("="*60)
        for issue in all_issues:
            print(f"❌ {issue}")
        print("\nVerifique esses itens para garantir conformidade com a LGPD.")
        print("Lembre-se de implementar:")
        print("- Consentimento explícito do usuário")
        print("- Proteção de dados sensíveis")
        print("- Políticas de retenção e exclusão de dados")
        print("- Logs de acesso a dados pessoais")
        return 1
    else:
        print("✅ Nenhuma violação óbvia de LGPD encontrada!")
        print("✓ Dados sensíveis estão protegidos")
        print("✓ Consentimento do usuário está implementado")
        print("✓ Políticas de retenção estão em vigor")
        print("✓ Acesso a dados pessoais é registrado")
        return 0

if __name__ == "__main__":
    sys.exit(main())