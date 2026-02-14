import os
import django
from datetime import timedelta

def verify_numbering_logic():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'setup.settings')
    try:
        django.setup()
    except Exception as e:
        print(f"Setup error: {e}")
        return
    
    from patients.models import PatientProfile
    from django.contrib.auth import get_user_model
    User = get_user_model()
    
    # Use Anderson's account for testing
    email = 'andersoncarlosvp@gmail.com'
    nutrix = User.objects.filter(email=email).first()
    
    if not nutrix:
        print(f"User {email} not found.")
        return

    print(f"Verifying for Nutri: {nutrix.email}")
    
    # 1. Check current patients
    patients = PatientProfile.objects.filter(nutritionist=nutrix, is_active=True).order_by('created_at')
    print(f"Active patients: {patients.count()}")
    
    from patients.serializers import PatientProfileSerializer
    
    for p in patients:
        ser = PatientProfileSerializer(p)
        print(f"Patient: {p.user.name} | Created: {p.created_at} | Display ID: {ser.data['display_id']}")

    # 2. Add a dummy patient to test increment
    # We need a new User first
    import random
    import string
    random_str = ''.join(random.choices(string.ascii_lowercase + string.digits, k=6))
    dummy_email = f"test_{random_str}@example.com"
    dummy_user = User.objects.create_user(
        email=dummy_email,
        password='password123',
        name=f"Test Patient {random_str}",
        user_type='paciente'
    )
    
    dummy_patient = PatientProfile.objects.create(
        user=dummy_user,
        nutritionist=nutrix,
        is_active=True
    )
    
    print("\n--- After adding a new patient ---")
    patients = PatientProfile.objects.filter(nutritionist=nutrix, is_active=True).order_by('created_at')
    for p in patients:
        ser = PatientProfileSerializer(p)
        print(f"Patient: {p.user.name} | Display ID: {ser.data['display_id']}")
    
    # 3. Simulate deletion of the first patient (if exists)
    if patients.count() > 1:
        first_patient = patients[0]
        print(f"\n--- Deactivating first patient: {first_patient.user.name} ---")
        first_patient.is_active = False
        first_patient.save()
        
        remaining_patients = PatientProfile.objects.filter(nutritionist=nutrix, is_active=True).order_by('created_at')
        for p in remaining_patients:
            ser = PatientProfileSerializer(p)
            print(f"Patient: {p.user.name} | Display ID: {ser.data['display_id']}")
        
        # Restore (cleanup)
        first_patient.is_active = True
        first_patient.save()
    
    # Cleanup dummy
    dummy_patient.delete()
    dummy_user.delete()
    print("\nDone.")

if __name__ == "__main__":
    verify_numbering_logic()
