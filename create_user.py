
import paramiko

def create_user():
    host = '187.77.32.191'
    user = 'root'
    password = '900113Acps@senharoot'

    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(host, 22, user, password)

    # Python script to run inside Django shell
    django_script = """
from django.contrib.auth import get_user_model
User = get_user_model()
email = 'andersoncarlosvp@gmail.com'
password = 'Nutri@123'
if not User.objects.filter(email=email).exists():
    user = User.objects.create_user(email=email, password=password, name='Anderson Carlos', user_type='nutricionista')
    user.is_active = True
    user.is_staff = True
    user.is_superuser = True
    user.save()
    print(f'User {email} created successfully.')
else:
    u = User.objects.get(email=email)
    u.set_password(password)
    u.is_active = True
    u.save()
    print(f'User {email} already exists. Password updated.')
"""
    # Escape quotes for bash
    # We use a heredoc or just write to a file in /tmp and run it
    
    # Simpler: Write to a file on remote, then run it
    with open('remote_create_user.py', 'w') as f:
        f.write(django_script)
    
    sftp = ssh.open_sftp()
    sftp.put('remote_create_user.py', '/root/nutrixpertpro/remote_create_user.py')
    sftp.close()

    cmd = "docker exec nutrixpert-backend python manage.py shell < /root/nutrixpertpro/remote_create_user.py"
    
    print(f"Executing: {cmd}")
    stdin, stdout, stderr = ssh.exec_command(cmd)
    
    out = stdout.read().decode()
    err = stderr.read().decode()
    
    print("--- Output ---")
    print(out)
    print("--- Error ---")
    print(err)
    
    ssh.close()
    import os
    os.remove('remote_create_user.py')

if __name__ == "__main__":
    create_user()
