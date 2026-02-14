#!/usr/bin/env python3
"""
Script para verificar a associação entre nutricionista e paciente no banco de dados
"""

import subprocess
import sys
import os

def run_patient_check_script():
    """
    Executa o script que verifica a associação entre nutricionista e paciente
    """
    # Script para verificar a associação específica
    script_content = '''
import pymysql
import os
from dotenv import load_dotenv

# Carregar variáveis de ambiente
load_dotenv()

def check_patient_nutritionist_association():
    """
    Verifica a associação entre nutricionista ID 76 e paciente ID 78
    """
    # Obter credenciais do banco de dados
    password = os.getenv('MYSQL_ROOT_PASSWORD', 'root')
    db = 'nutrixpert_db'
    
    try:
        conn = pymysql.connect(
            host='localhost',
            user='root',
            password=password,
            database=db,
            charset='utf8mb4'
        )
        cursor = conn.cursor()
        
        print("=== Verificação de Associação Nutricionista-Paciente ===\\n")
        
        # Verificar o perfil do paciente ID 47 (conforme descoberto anteriormente)
        cursor.execute("SELECT * FROM patient_profiles WHERE id = 47")
        profile = cursor.fetchone()
        
        if profile:
            print(f"Perfil do Paciente (ID 47):")
            print(f"  - ID: {profile[0]}")
            print(f"  - Data de nascimento: {profile[1]}")
            print(f"  - Telefone: {profile[2]}")
            print(f"  - Endereço: {profile[3]}")
            print(f"  - Criado em: {profile[4]}")
            print(f"  - Meta: {profile[5]}")
            print(f"  - Tipo de serviço: {profile[6]}")
            print(f"  - Data de início: {profile[7]}")
            print(f"  - ID do Nutricionista: {profile[8]}")
            print(f"  - ID do Usuário: {profile[9]}")
            print(f"  - Ativo: {profile[10]}")
            print(f"  - Meta de gordura corporal: {profile[11]}")
            print(f"  - Peso alvo: {profile[12]}")
            
            if profile[8] == 76 and profile[9] == 78:
                print("\\nVERIFICAÇÃO: A associação está CORRETA!")
                print("- Paciente ID 78 está associado ao nutricionista ID 76")
            elif profile[8] != 76:
                print(f"\\nALERTA: Paciente está associado ao nutricionista ID {profile[8]} em vez do esperado ID 76")
            elif profile[9] != 78:
                print(f"\\nALERTA: Perfil está associado ao usuário ID {profile[9]} em vez do esperado ID 78")
        else:
            print("ERRO: Perfil do paciente (ID 47) não encontrado!")
            
            # Verificar se há algum perfil associado ao nutricionista ID 76
            cursor.execute("SELECT * FROM patient_profiles WHERE nutritionist_id = 76")
            profiles = cursor.fetchall()
            
            if profiles:
                print(f"\\nEncontrados {len(profiles)} perfis associados ao nutricionista ID 76:")
                for p in profiles:
                    print(f"  - Perfil ID: {p[0]}, Usuário ID: {p[9]}, Ativo: {p[10]}")
            else:
                print("\\nNenhum perfil encontrado associado ao nutricionista ID 76")
        
        # Verificar todos os perfis do nutricionista ID 76
        cursor.execute("SELECT * FROM patient_profiles WHERE nutritionist_id = 76")
        all_profiles = cursor.fetchall()
        
        print(f"\\nTotal de pacientes do nutricionista ID 76: {len(all_profiles)}")
        for profile in all_profiles:
            print(f"  - Perfil ID: {profile[0]}, Usuário ID: {profile[9]}, Ativo: {profile[10]}")
        
        print("\\n=== Verificação Concluída ===")
        
    except Exception as e:
        print(f"Erro ao conectar ao banco de dados: {str(e)}")
        print("Talvez seja necessário verificar as credenciais do banco de dados.")
    finally:
        if 'conn' in locals() and conn:
            conn.close()

if __name__ == "__main__":
    check_patient_nutritionist_association()
'''

    # Escrever o script temporário
    with open('temp_check_assoc.py', 'w', encoding='utf-8') as f:
        f.write(script_content)
    
    # Executar o script com o Python do ambiente virtual
    try:
        result = subprocess.run([
            r'C:\Nutri 4.0\backend\.venv\Scripts\python.exe',
            'temp_check_assoc.py'
        ], capture_output=True, text=True, cwd=os.getcwd())
        
        print("Saída do script:")
        print(result.stdout)
        if result.stderr:
            print("Erros:")
            print(result.stderr)
            
    except Exception as e:
        print(f"Erro ao executar o script: {str(e)}")
    finally:
        # Remover o script temporário
        if os.path.exists('temp_check_assoc.py'):
            os.remove('temp_check_assoc.py')

if __name__ == "__main__":
    run_patient_check_script()