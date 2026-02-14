#!/usr/bin/env python3
"""
Script para verificar a associação exata entre nutricionista e paciente
"""

import pymysql
import os
from dotenv import load_dotenv

# Carregar variáveis de ambiente
load_dotenv()

def check_patient_nutritionist_link():
    """
    Verifica a associação entre o nutricionista Anderson e a paciente Angela
    """
    # Obter credenciais do banco de dados
    password = os.getenv('MYSQL_PASSWORD', 'root')
    db = os.getenv('MYSQL_DATABASE', 'nutrixpert_db')
    
    try:
        conn = pymysql.connect(
            host='localhost',
            user='root',
            password=password,
            database=db,
            charset='utf8mb4'
        )
        cursor = conn.cursor()
        
        print("=== Verificação da Associação Nutricionista-Paciente ===\n")
        
        # Verificar o nutricionista Anderson (ID 76)
        cursor.execute("SELECT id, name, email, is_active FROM users_user WHERE id = 76")
        nutritionist = cursor.fetchone()
        
        if nutritionist:
            print(f"Nutricionista Anderson (ID 76):")
            print(f"  - Nome: {nutritionist[1]}")
            print(f"  - Email: {nutritionist[2]}")
            print(f"  - Ativo: {'Sim' if nutritionist[3] else 'Não'}")
        else:
            print("ERRO: Nutricionista Anderson (ID 76) não encontrado!")
            return
        
        # Verificar a paciente Angela (ID 78)
        cursor.execute("SELECT id, name, email, is_active FROM users_user WHERE id = 78")
        patient = cursor.fetchone()
        
        if patient:
            print(f"\nPaciente Angela (ID 78):")
            print(f"  - Nome: {patient[1]}")
            print(f"  - Email: {patient[2]}")
            print(f"  - Ativo: {'Sim' if patient[3] else 'Não'}")
        else:
            print("ERRO: Paciente Angela (ID 78) não encontrada!")
            return
        
        # Verificar o perfil do paciente (ID 47)
        cursor.execute("SELECT id, user_id, nutritionist_id, is_active FROM patient_profiles WHERE id = 47")
        profile = cursor.fetchone()
        
        if profile:
            print(f"\nPerfil do Paciente (ID 47):")
            print(f"  - ID do Usuário: {profile[1]}")
            print(f"  - ID do Nutricionista: {profile[2]}")
            print(f"  - Ativo: {'Sim' if profile[3] else 'Não'}")
            
            if profile[2] == 76:
                print("  - VERIFICADO: Associado ao nutricionista correto (ID 76)")
            else:
                print(f"  - ALERTA: Associado ao nutricionista incorreto (ID {profile[2]})")
        else:
            print("ERRO: Perfil do paciente (ID 47) não encontrado!")
            return
        
        # Verificar todos os pacientes do nutricionista ID 76
        cursor.execute("""
            SELECT pp.id, u.name, u.email, pp.is_active 
            FROM patient_profiles pp
            JOIN users_user u ON pp.user_id = u.id
            WHERE pp.nutritionist_id = 76
        """)
        patients = cursor.fetchall()
        
        print(f"\nTodos os pacientes do nutricionista ID 76:")
        if patients:
            for patient in patients:
                print(f"  - Perfil ID: {patient[0]}, Nome: {patient[1]}, Email: {patient[2]}, Ativo: {'Sim' if patient[3] else 'Não'}")
        else:
            print("  - Nenhum paciente encontrado")
        
        # Verificar se o paciente ID 47 está ativo
        cursor.execute("SELECT is_active FROM patient_profiles WHERE id = 47")
        result = cursor.fetchone()
        if result:
            is_active = bool(result[0])
            print(f"\nStatus de ativação do paciente ID 47: {'Ativo' if is_active else 'Inativo'}")
        
        print("\n=== Verificação Concluída ===")
        
    except Exception as e:
        print(f"Erro ao conectar ao banco de dados: {str(e)}")
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    check_patient_nutritionist_link()