import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'setup.settings')
import django
django.setup()

from diets.models import UnifiedFood, AlimentoTACO, AlimentoTBCA, AlimentoUSDA
from patients.models import PatientProfile
from django.db.models import Q
from django.contrib.auth import get_user_model

User = get_user_model()

print("=== FOOD TABLE COUNTS ===")
print(f"UnifiedFood: {UnifiedFood.objects.count()}")
print(f"TACO: {AlimentoTACO.objects.count()}")
print(f"TBCA: {AlimentoTBCA.objects.count()}")
print(f"USDA: {AlimentoUSDA.objects.count()}")

print("\n=== ANGELA SEARCH (Users) ===")
users = User.objects.filter(Q(name__icontains='angela') | Q(name__icontains='portes'))
for u in users:
    print(f"  ID={u.id}, name={u.name}, email={u.email}")

print("\n=== ANGELA SEARCH (ALL Patients incl. inactive) ===")
patients = PatientProfile.objects.filter(
    Q(user__name__icontains='angela') | Q(user__name__icontains='portes')
)
for p in patients:
    print(f"  ID={p.id}, user={p.user.name}, is_active={p.is_active}, nutri_id={p.nutritionist_id}")

print("\n=== ALL PATIENTS ===")
all_patients = PatientProfile.objects.all()
for p in all_patients:
    print(f"  ID={p.id}, user={p.user.name}, is_active={p.is_active}")
