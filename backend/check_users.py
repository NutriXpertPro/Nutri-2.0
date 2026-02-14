import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'setup.settings')
import django
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

print("=== NUTRITIONISTS ===")
nutris = User.objects.filter(user_type='nutricionista')
for u in nutris:
    print(f"  ID={u.id}, name={u.name}, email={u.email}")

print("\n=== USER ID=76 ===")
try:
    u = User.objects.get(id=76)
    print(f"  ID={u.id}, name={u.name}, email={u.email}, type={u.user_type}")
except User.DoesNotExist:
    print("  NOT FOUND")

print("\n=== MAIN NUTRITIONIST (login user) ===")
# Check for Anderson or main user
users = User.objects.filter(user_type='nutricionista').order_by('id')
for u in users:
    from patients.models import PatientProfile
    count = PatientProfile.objects.filter(nutritionist=u).count()
    print(f"  ID={u.id}, name={u.name}, patients={count}")
