import os
import django

def check_global_ids():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'setup.settings')
    django.setup()
    
    from patients.models import PatientProfile
    from django.contrib.auth import get_user_model
    User = get_user_model()
    
    total_patients = PatientProfile.objects.count()
    highest_id = PatientProfile.objects.order_by("-id").first().id if PatientProfile.objects.exists() else 0
    total_users = User.objects.count()
    
    # Check if there are other nutritionists
    nutritionists_count = User.objects.filter(user_type='nutricionista').count()
    
    print(f"Total global patients: {total_patients}")
    print(f"Highest Patient ID: {highest_id}")
    print(f"Total users in system: {total_users}")
    print(f"Total nutritionists: {nutritionists_count}")

if __name__ == "__main__":
    check_global_ids()
