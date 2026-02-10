import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'setup.settings')
django.setup()

from django.contrib.auth import get_user_model
from patients.models import PatientProfile

User = get_user_model()

targets = ['Anderson', 'Angela', 'Elizabeth', 'Elisabeth']

print("--- Starting Clean Deletion ---")

for t in targets:
    # Delete based on name in User
    users = User.objects.filter(name__icontains=t) | User.objects.filter(email__icontains=t)
    for user in users:
        print(f"Deleting User: {user.name} ({user.email})")
        # PatientProfile usually has a CASCADE or we delete it first
        PatientProfile.objects.filter(user=user).delete()
        user.delete()

    # Also check if any PatientProfile exists without User link (unlikely but safe)
    # Actually, PatientProfile typically requires a User.
    
print("--- Clean Deletion Finished ---")
