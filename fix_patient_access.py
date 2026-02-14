
import paramiko
import time

def fix_patient_access():
    host = '187.77.32.191'
    user = 'root'
    password = '900113Acps@senharoot'

    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(host, 22, user, password)

    # 1. Create the provisioning script locally
    provision_script = """
import sys
from django.contrib.auth import get_user_model
try:
    User = get_user_model()
    email = 'portes.angela09@gmail.com'
    password = 'Nutri@123'
    
    if not User.objects.filter(email=email).exists():
        print(f"Creating patient {email}...")
        user = User.objects.create_user(email=email, password=password, name='Angela Portes', user_type='paciente')
        user.is_active = True
        user.save()
        print(f"Patient {email} created successfully with ID {user.id}")
    else:
        print(f"Patient {email} already exists. Updating password...")
        u = User.objects.get(email=email)
        u.set_password(password)
        u.is_active = True
        # Ensure user_type is patient
        u.user_type = 'paciente'
        u.save()
        print(f"Patient {email} password updated.")
except Exception as e:
    print(f"ERROR: {e}")
"""
    with open('provision_patient.py', 'w', encoding='utf-8') as f:
        f.write(provision_script)

    # 2. Upload with SFTP
    print("Uploading provision script...")
    with ssh.open_sftp() as sftp:
        sftp.put('provision_patient.py', '/root/nutrixpertpro/provision_patient.py')

    # 3. Execute inside container
    print("Executing script inside container...")
    cmd = "cat /root/nutrixpertpro/provision_patient.py | docker exec -i nutrixpert-backend python manage.py shell"
    
    stdin, stdout, stderr = ssh.exec_command(cmd)
    
    out = stdout.read().decode()
    err = stderr.read().decode()
    
    print("--- Output ---")
    print(out)
    print("--- Error ---")
    print(err)
    
    ssh.close()
    import os
    os.remove('provision_patient.py')

if __name__ == "__main__":
    fix_patient_access()
