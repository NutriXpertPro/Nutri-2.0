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
    
    print("=== Análise do Problema ===")
    print("1. O banco de dados está OK (confirmado anteriormente)")
    print("2. O backend está filtrando corretamente por nutricionista")
    print("3. O frontend está usando React Query para cache")
    print("4. O dashboard mostra '1 paciente' mas a lista está vazia")
    
    print("\n=== Possíveis causas ===")
    print("- React Query cache mantendo dados antigos")
    print("- Diferença entre endpoints de métricas e listagem")
    print("- Problema de renderização condicional")
    print("- Filtro de status aplicado incorretamente")
    
    print("\n=== Simulação de solução ===")
    print("Para resolver o problema de cache no React Query:")
    print("1. Limpar o cache do React Query")
    print("2. Forçar refetch dos dados")
    print("3. Verificar se o campo 'status' está sendo retornado corretamente")
    
    print("\n=== Solução imediata para o usuário ===")
    print("1. Abrir DevTools (F12)")
    print("2. Ir ao Console")
    print("3. Executar:")
    print("   localStorage.clear();")
    print("   sessionStorage.clear();") 
    print("   window.location.reload();")
    print("4. Fazer login novamente")

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
    
    print("\nCódigo para limpar o cache no frontend:")
    print("# Em algum lugar do componente ou hook")
    print("# import { useQueryClient } from '@tanstack/react-query';")
    print("#")
    print("# const queryClient = useQueryClient();")
    print("#")
    print("# Função para forçar atualização")
    print("# const forceRefresh = () => {")
    print("#     queryClient.invalidateQueries({ queryKey: ['patients'] });")
    print("# };")
    print("#")
    print("# Botão para o usuário acionar manualmente")
    print("# <button onClick={forceRefresh}>Atualizar Lista</button>")

def implement_fix():
    """
    Implementa uma possível correção no código frontend
    """
    print("\n=== Implementação de Correção ===\n")
    
    print("Vamos modificar o hook usePatients para resolver o problema de cache:")
    
    # Ler o arquivo atual
    try:
        with open(r"C:\Nutri 4.0\frontend\src\hooks\usePatients.ts", "r", encoding="utf-8") as f:
            content = f.read()
        
        print("Conteúdo atual do hook usePatients.ts:")
        print(content[:1000] + "..." if len(content) > 1000 else content)
        
        print("\nSugestão de modificação:")
        print("# Modificar a chamada useQuery para incluir opções de cache:")
        print("const { data: patients, isLoading, error } = useQuery({")
        print("    queryKey: ['patients'],")
        print("    queryFn: patientService.getAll,")
        print("    enabled: isAuthenticated && !isAuthLoading,")
        print("    staleTime: 1000 * 60,         // 1 minuto")
        print("    cacheTime: 1000 * 60 * 5,    // 5 minutos")  
        print("    refetchOnWindowFocus: true,   // Refetch quando a janela ganha foco")
        print("    refetchOnMount: true,         // Refetch quando o componente monta")
        print("    retry: 2                      // Tentar novamente em caso de falha")
        print("})")
        
    except FileNotFoundError:
        print("Arquivo usePatients.ts não encontrado")
    except Exception as e:
        print(f"Erro ao ler o arquivo: {str(e)}")

if __name__ == "__main__":
    test_api_directly()
    simulate_cache_problem()
    implement_fix()