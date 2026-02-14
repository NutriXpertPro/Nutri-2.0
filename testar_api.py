#!/usr/bin/env python3
"""
Script para testar o endpoint da API de pacientes
"""

import requests
import json

def test_api_endpoint():
    """
    Testa o endpoint da API de pacientes para verificar se os dados estão sendo retornados corretamente
    """
    print("=== Teste do Endpoint da API de Pacientes ===\n")
    
    # Este é um teste genérico - você precisará substituir pelo token real de autenticação
    print("Para testar o endpoint da API corretamente, você precisa de um token JWT válido.")
    print("O endpoint é algo como: GET /api/patients/ com cabeçalho Authorization: Bearer <token>")
    print("\nPassos para diagnosticar:")
    print("1. Abra o DevTools do navegador (F12)")
    print("2. Vá para a aba Network")
    print("3. Acesse a página de pacientes")
    print("4. Procure pela requisição para /api/patients/ ou /patients/")
    print("5. Verifique:")
    print("   - Se a requisição está sendo feita")
    print("   - Se o status é 200 (sucesso) ou outro código de erro")
    print("   - Se os dados retornados incluem a paciente Angela")
    print("   - Se há cabeçalhos de autorização sendo enviados corretamente")
    
    print("\nTambém verifique:")
    print("- Se o token JWT está expirado")
    print("- Se o frontend está filtrando os resultados após recebê-los")
    print("- Se há algum erro no console do navegador")
    
    print("\nSoluções imediatas a tentar:")
    print("1. Limpar cache e cookies do navegador")
    print("2. Fazer logout e login novamente")
    print("3. Tentar em uma janela anônima/incógnito")
    print("4. Verificar se há extensões do navegador interferindo")

if __name__ == "__main__":
    test_api_endpoint()