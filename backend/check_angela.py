import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'setup.settings')
import django
django.setup()

from patients.models import PatientProfile
from django.contrib.auth import get_user_model
from django.db.models import Q

User = get_user_model()

# Check user 76
user76 = User.objects.get(id=76)
print(f"=== User 76: {user76.name}, email={user76.email}, type={user76.user_type} ===")

# Direct query for Angela
print("\n=== Direct patient query for nutritionist=76 ===")
patients_76 = PatientProfile.objects.filter(nutritionist_id=76)
for p in patients_76:
    print(f"  Patient ID={p.id}, user_id={p.user_id}, name={p.user.name}, is_active={p.is_active}")

# Check patient list view logic
print("\n=== Simulating PatientListView (nutritionist=76, is_active=True) ===")
active_patients = PatientProfile.objects.filter(nutritionist=user76, is_active=True)
for p in active_patients:
    print(f"  Patient ID={p.id}, user={p.user.name}")

# Check if user 76 is_active
print(f"\n=== User 76 is_active={user76.is_active} ===")

# Check Angela's user
print("\n=== Angela's User Details ===")
angela_patient = PatientProfile.objects.filter(user__name__icontains='angela').first()
if angela_patient:
    au = angela_patient.user
    print(f"  User ID={au.id}, name={au.name}, email={au.email}")
    print(f"  is_active={au.is_active}, user_type={au.user_type}")
    print(f"  Patient is_active={angela_patient.is_active}")
    print(f"  nutritionist_id={angela_patient.nutritionist_id}")
else:
    print("  NOT FOUND")

# Check PatientListView serializer to see if it has extra filters
print("\n=== Check user model for any extra filtering ===")
from django.contrib.auth import get_user_model
User = get_user_model()
angela_user = User.objects.filter(name__icontains='angela').first()
if angela_user:
    print(f"  email_verified: {getattr(angela_user, 'email_verified', 'N/A')}")
    print(f"  is_staff: {angela_user.is_staff}")
    print(f"  is_superuser: {angela_user.is_superuser}")
    # Check all fields
    for field in angela_user._meta.fields:
        val = getattr(angela_user, field.name, None)
        print(f"  {field.name}: {val}")
