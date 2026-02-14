#!/usr/bin/env python3
"""
Script para verificar a associação exata entre nutricionista e paciente usando credenciais corretas
"""

import pymysql

def check_patient_nutritionist_link():
    """
    Verifica a associação entre o nutricionista Anderson e a paciente Angela usando credenciais corretas
    """
    password = '900113Acps@'
    db = 'nutrixpert_db'
    
    try:
        conn = pymysql.connect(host='localhost', user='root', password=password, database=db)
        cursor = conn.cursor()
        
        print("=== Verificação da Associação Nutricionista-Paciente ===\n")
        
        # Verificar o perfil do paciente ID 47 (conforme descoberto anteriormente)
        cursor.execute("SELECT * FROM patient_profiles WHERE id = 47")
        profile = cursor.fetchone()
        
        if profile:
            print(f"Perfil do Paciente (ID 47):")
            print(f"  - ID: {profile[0]}")
            print(f"  - ID do Nutricionista: {profile[8]}")
            print(f"  - ID do Usuário: {profile[9]}")
            print(f"  - Ativo: {profile[10]}")
            
            if profile[8] == 76 and profile[9] == 78:
                print("\nVERIFICADO: A associação está CORRETA!")
                print("- Paciente ID 78 está associado ao nutricionista ID 76")
                
                # Verificar se o nutricionista está ativo
                cursor.execute("SELECT is_active FROM users_user WHERE id = 76")
                nutritionist_active = cursor.fetchone()
                if nutritionist_active:
                    print(f"- Nutricionista ID 76 está ativo: {bool(nutritionist_active[0])}")
                
                # Verificar se o paciente está ativo
                cursor.execute("SELECT is_active FROM users_user WHERE id = 78")
                patient_active = cursor.fetchone()
                if patient_active:
                    print(f"- Paciente ID 78 está ativo: {bool(patient_active[0])}")
                    
            elif profile[8] != 76:
                print(f"\nALERTA: Paciente está associado ao nutricionista ID {profile[8]} em vez do esperado ID 76")
            elif profile[9] != 78:
                print(f"\nALERTA: Perfil está associado ao usuário ID {profile[9]} em vez do esperado ID 78")
        else:
            print("ERRO: Perfil do paciente (ID 47) não encontrado!")
            
            # Verificar se há algum perfil associado ao nutricionista ID 76
            cursor.execute("SELECT * FROM patient_profiles WHERE nutritionist_id = 76")
            profiles = cursor.fetchall()
            
            if profiles:
                print(f"\nEncontrados {len(profiles)} perfis associados ao nutricionista ID 76:")
                for p in profiles:
                    print(f"  - Perfil ID: {p[0]}, Usuário ID: {p[9]}, Ativo: {p[10]}")
            else:
                print("\nNenhum perfil encontrado associado ao nutricionista ID 76")
        
        # Verificar todos os perfis do nutricionista ID 76
        cursor.execute("SELECT * FROM patient_profiles WHERE nutritionist_id = 76")
        all_profiles = cursor.fetchall()
        
        print(f"\nTotal de pacientes do nutricionista ID 76: {len(all_profiles)}")
        for profile in all_profiles:
            print(f"  - Perfil ID: {profile[0]}, Usuário ID: {profile[9]}, Ativo: {profile[10]}")
        
        print("\n=== Verificação Concluída ===")
        
    except Exception as e:
        print(f"Erro ao conectar ao banco de dados: {str(e)}")
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    check_patient_nutritionist_link()