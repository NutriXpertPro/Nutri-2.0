#!/usr/bin/env python3
"""
Script para diagnosticar e resolver o problema de exibição da paciente Angela Cristina Portes de Sant Ana
"""

import sqlite3
import sys
import os
from datetime import datetime

def diagnose_patient_visibility():
    """
    Diagnóstico completo do problema de visibilidade da paciente
    """
    print("=== Diagnóstico de Visibilidade da Paciente ===")
    
    # Conectar ao banco de dados
    db_path = "C:/Nutri 4.0/backend/db.sqlite3"
    if not os.path.exists(db_path):
        print(f"Banco de dados não encontrado em: {db_path}")
        return False
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Verificar informações do nutricionista Anderson Carlos (ID 76)
        cursor.execute("SELECT id, email, name, is_active FROM users_user WHERE id = 76")
        nutritionist = cursor.fetchone()
        
        if nutritionist:
            print(f"\nNutricionista Anderson Carlos (ID 76):")
            print(f"  - Email: {nutritionist[1]}")
            print(f"  - Nome: {nutritionist[2]}")
            print(f"  - Ativo: {'Sim' if nutritionist[3] else 'Não'}")
        else:
            print("\nERRO: Nutricionista Anderson Carlos (ID 76) não encontrado!")
            return False
        
        # Verificar informações da paciente Angela Cristina Portes de Sant Ana
        cursor.execute("SELECT id, email, name, is_active FROM users_user WHERE id = 78")
        patient_user = cursor.fetchone()
        
        if patient_user:
            print(f"\nPaciente Angela Cristina Portes de Sant Ana (ID 78):")
            print(f"  - Email: {patient_user[1]}")
            print(f"  - Nome: {patient_user[2]}")
            print(f"  - Ativo: {'Sim' if patient_user[3] else 'Não'}")
        else:
            print("\nERRO: Usuário da paciente Angela Cristina Portes de Sant Ana (ID 78) não encontrado!")
            return False
        
        # Verificar o perfil do paciente
        cursor.execute("SELECT id, user_id, nutritionist_id, is_active FROM patient_profiles WHERE id = 47")
        patient_profile = cursor.fetchone()
        
        if patient_profile:
            print(f"\nPerfil do Paciente (ID 47):")
            print(f"  - ID do Usuário: {patient_profile[1]}")
            print(f"  - ID do Nutricionista: {patient_profile[2]}")
            print(f"  - Ativo: {'Sim' if patient_profile[3] else 'Não'}")
            
            # Verificar se a associação está correta
            if patient_profile[2] == 76 and patient_profile[1] == 78:
                print("  - Associação CORRETA: Paciente está associada ao nutricionista correto")
            else:
                print("  - ERRO: Associação INCORRETA entre paciente e nutricionista")
                return False
        else:
            print("\nERRO: Perfil do paciente (ID 47) não encontrado!")
            return False
        
        # Verificar se o nutricionista tem outros pacientes
        cursor.execute("SELECT COUNT(*) FROM patient_profiles WHERE nutritionist_id = 76 AND is_active = 1")
        active_patients_count = cursor.fetchone()[0]
        print(f"\nNúmero de pacientes ativos associados ao nutricionista ID 76: {active_patients_count}")
        
        # Listar todos os pacientes do nutricionista ID 76
        cursor.execute("""
            SELECT pp.id, u.name, u.email, pp.is_active 
            FROM patient_profiles pp
            JOIN users_user u ON pp.user_id = u.id
            WHERE pp.nutritionist_id = 76
        """)
        all_patients = cursor.fetchall()
        
        print(f"\nTodos os pacientes associados ao nutricionista ID 76:")
        for patient in all_patients:
            print(f"  - ID: {patient[0]}, Nome: {patient[1]}, Email: {patient[2]}, Ativo: {'Sim' if patient[3] else 'Não'}")
        
        print("\n=== Diagnóstico Concluído ===")
        print("CONCLUSÃO: Todos os dados estão corretamente configurados no banco de dados.")
        print("O problema provavelmente está relacionado à autenticação ou sessão no frontend.")
        
        return True
        
    except Exception as e:
        print(f"Erro durante o diagnóstico: {str(e)}")
        return False
    finally:
        conn.close()

def suggest_solutions():
    """
    Sugere soluções para o problema de visibilidade
    """
    print("\n=== Soluções Recomendadas ===")
    print("1. Faça logout e login novamente como andersoncarlosvp@gmail.com")
    print("2. Limpe o cache do navegador e os cookies")
    print("3. Verifique se o token JWT está sendo enviado corretamente nas requisições")
    print("4. Tente acessar o endpoint /api/patients/ diretamente com as credenciais corretas")
    print("5. Verifique se há algum filtro adicional na interface que possa estar ocultando o paciente")

if __name__ == "__main__":
    success = diagnose_patient_visibility()
    if success:
        suggest_solutions()
    else:
        print("\nFalha no diagnóstico. Verifique se o banco de dados está acessível e os IDs estão corretos.")