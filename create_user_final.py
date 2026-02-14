
import paramiko
import time

def create_user_final():
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
    email = 'andersoncarlosvp@gmail.com'
    password = 'Nutri@123'
    
    if not User.objects.filter(email=email).exists():
        print(f"Creating user {email}...")
        user = User.objects.create_user(email=email, password=password, name='Anderson Carlos', user_type='nutricionista')
        user.is_active = True
        user.is_staff = True
        user.is_superuser = True
        user.save()
        print(f"User {email} created successfully with ID {user.id}")
    else:
        print(f"User {email} already exists. Updating password...")
        u = User.objects.get(email=email)
        u.set_password(password)
        u.is_active = True
        u.save()
        print(f"User {email} password updated.")
except Exception as e:
    print(f"ERROR: {e}")
"""
    with open('provision_user.py', 'w', encoding='utf-8') as f:
        f.write(provision_script)

    # 2. Upload with SFTP
    print("Uploading provision script...")
    with ssh.open_sftp() as sftp:
        sftp.put('provision_user.py', '/root/nutrixpertpro/provision_user.py')

    # 3. Execute inside container
    print("Executing script inside container...")
    # Using 'cat ... | docker exec -i ...' to avoid shell path issues
    # Ensure -i is used for stdin
    cmd = "cat /root/nutrixpertpro/provision_user.py | docker exec -i nutrixpert-backend python manage.py shell"
    
    stdin, stdout, stderr = ssh.exec_command(cmd)
    
    # Wait for completion?
    # exec_command returns streams that block on read
    
    out = stdout.read().decode()
    err = stderr.read().decode()
    
    print("--- Output ---")
    print(out)
    print("--- Error ---")
    print(err)
    
    ssh.close()
    import os
    os.remove('provision_user.py')

if __name__ == "__main__":
    create_user_final()
