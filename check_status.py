#!/usr/bin/env python3
import paramiko
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('187.77.32.191', 22, 'root', '900113Acps@senharoot')
stdin, stdout, stderr = ssh.exec_command('docker ps -a --format "{{.Names}}: {{.Status}}"')
print(stdout.read().decode())
ssh.close()
