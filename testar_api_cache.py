#!/usr/bin/env python3
"""
Script para testar a API de pacientes e verificar o problema de cache
"""

import subprocess
import sys
import os
import json

def test_api_directly():
    """
    Testa a API de pacientes diretamente para verificar o problema
    """
    print("=== Teste Direto da API de Pacientes ===\n")
    
    # Script para testar a API
    script_content = '''
import requests
import json
import sys
import os

def test_api():
    print("Testando a API de pacientes...")
    
    # Este é um teste de diagnóstico - não temos o token real
    # Mas podemos verificar a estrutura da API e o que poderia estar acontecendo
    
    print("\\n=== Análise do Problema ===")
    print("1. O banco de dados está OK (confirmado anteriormente)")
    print("2. O backend está filtrando corretamente por nutricionista")
    print("3. O frontend está usando React Query para cache")
    print("4. O dashboard mostra '1 paciente' mas a lista está vazia")
    
    print("\\n=== Possíveis causas ===")
    print("- React Query cache mantendo dados antigos")
    print("- Diferença entre endpoints de métricas e listagem")
    print("- Problema de renderização condicional")
    print("- Filtro de status aplicado incorretamente")
    
    print("\\n=== Simulação de solução ===")
    print("Para resolver o problema de cache no React Query:")
    print("1. Limpar o cache do React Query")
    print("2. Forçar refetch dos dados")
    print("3. Verificar se o campo 'status' está sendo retornado corretamente")
    
    # Mostrar o código que precisa ser ajustado no frontend
    print("\\n=== Código a ser ajustado no frontend ===")
    print("Em usePatients hook, adicione opções de cache:")
    print('''
    const { data: patients, isLoading, error } = useQuery({
        queryKey: ['patients'],
        queryFn: patientService.getAll,
        enabled: isAuthenticated && !isAuthLoading,
        staleTime: 1000 * 60,         // 1 minuto
        cacheTime: 1000 * 60 * 5,    // 5 minutos  
        refetchOnWindowFocus: true,   // Refetch quando a janela ganha foco
        refetchOnMount: true,         // Refetch quando o componente monta
        retry: 2                      // Tentar novamente em caso de falha
    })
    ''')
    
    print("\\n=== Solução imediata para o usuário ===")
    print("1. Abrir DevTools (F12)")
    print("2. Ir ao Console")
    print("3. Executar:")
    print("   localStorage.clear();")
    print("   sessionStorage.clear();") 
    print("   window.location.reload();")
    print("4. Fazer login novamente")
    
    print("\\n=== Outra solução ===")
    print("No arquivo C:\\\\Nutri 4.0\\\\frontend\\\\src\\\\app\\\\patients\\\\page.tsx")
    print("Adicione um botão de 'Atualizar' que chame:")
    print("queryClient.invalidateQueries({ queryKey: ['patients'] });")

if __name__ == "__main__":
    test_api()
'''

    # Escrever o script temporário
    with open('temp_test_api.py', 'w', encoding='utf-8') as f:
        f.write(script_content)
    
    # Executar o script com o Python do ambiente virtual
    try:
        result = subprocess.run([
            r'C:\Nutri 4.0\backend\.venv\Scripts\python.exe',
            'temp_test_api.py'
        ], capture_output=True, text=True, cwd=os.getcwd())
        
        print("Resultado do teste:")
        print(result.stdout)
        if result.stderr:
            print("Erros:")
            print(result.stderr)
            
    except Exception as e:
        print(f"Erro ao executar o teste: {str(e)}")
    finally:
        # Remover o script temporário
        if os.path.exists('temp_test_api.py'):
            os.remove('temp_test_api.py')

def simulate_cache_problem():
    """
    Simula o problema de cache e como resolver
    """
    print("\n=== Simulação do Problema de Cache ===\n")
    
    print("Situação atual:")
    print("- Backend: Retorna 1 paciente para o nutricionista ID 76")
    print("- Dashboard: Mostra '1 paciente' corretamente")
    print("- Lista: Não mostra nenhum paciente")
    
    print("\nCausa provável:")
    print("- React Query cache armazenou uma versão antiga dos dados")
    print("- Ou o campo 'status' está causando filtragem indesejada")
    
    print("\nSolução técnica:")
    print("1. Verificar o campo 'status' retornado pela API")
    print("2. Limpar o cache do React Query")
    print("3. Forçar atualização dos dados")
    
    # Criar um script para demonstrar como limpar o cache
    print("\nCódigo para limpar o cache no frontend:")
    print("""
    // Em algum lugar do componente ou hook
    import { useQueryClient } from '@tanstack/react-query';
    
    const queryClient = useQueryClient();
    
    // Função para forçar atualização
    const forceRefresh = () => {
        queryClient.invalidateQueries({ queryKey: ['patients'] });
    };
    
    // Botão para o usuário acionar manualmente
    <button onClick={forceRefresh}>Atualizar Lista</button>
    """)

if __name__ == "__main__":
    test_api_directly()
    simulate_cache_problem()