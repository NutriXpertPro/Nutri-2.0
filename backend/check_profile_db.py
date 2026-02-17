import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'setup.settings')
django.setup()

from django.contrib.auth import get_user_model
from users.models import UserProfile

User = get_user_model()
email = 'andersoncarlosvp@gmail.com'

try:
    user = User.objects.get(email=email)
    print(f"User: {user.name} ({user.email})")
    
    try:
        profile = user.profile
        print(f"Profile Picture: {profile.profile_picture}")
        if profile.profile_picture:
            print(f"  URL: {profile.profile_picture.url}")
            print(f"  Path exists: {os.path.exists(profile.profile_picture.path)}")
        else:
            print("  Profile picture is EMPTY")
            
        print(f"Theme: {profile.theme}")
    except UserProfile.DoesNotExist:
        print("UserProfile DOES NOT EXIST")
except User.DoesNotExist:
    print(f"User {email} NOT FOUND")
