import os
import django
from django.conf import settings
from django.core.files.uploadedfile import SimpleUploadedFile
import sys

# Setup Django
sys.path.append(os.path.join(os.getcwd(), 'backend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'setup.settings')
django.setup()

from users.models import User, UserProfile
from users.serializers import UserDetailSerializer

def test_image_save():
    # Pegar o primeiro usuário nutricionista
    user = User.objects.filter(user_type='nutricionista').first()
    if not user:
        print("Nenhum usuário nutricionista encontrado.")
        return

    print(f"Testando com usuário: {user.email}")
    
    # Criar um arquivo dummy
    image_content = b"GIF89a\x01\x00\x01\x00\x00\x00\x00!"
    dummy_image = SimpleUploadedFile("test_api.gif", image_content, content_type="image/gif")

    # Dados para o serializer
    data = {
        'name': user.name,
        'profile_picture': dummy_image,
        'settings.theme': 'dark'
    }

    print("Tentando atualizar via serializer...")
    serializer = UserDetailSerializer(instance=user, data=data, partial=True)
    if serializer.is_valid():
        serializer.save()
        print("Serializer salvo com sucesso.")
        
        # Verificar se salvou no perfil
        user.refresh_from_db()
        profile = user.profile
        print(f"URL da imagem salva: {profile.profile_picture.url if profile.profile_picture else 'NONE'}")
        
        # Verificar se o arquivo existe no disco
        if profile.profile_picture:
            file_path = os.path.join(settings.MEDIA_ROOT, profile.profile_picture.name)
            if os.path.exists(file_path):
                print(f"Arquivo existe no disco em: {file_path}")
            else:
                print(f"ERRO: Arquivo NÃO existe no disco em: {file_path}")
    else:
        print(f"Erro no serializer: {serializer.errors}")

if __name__ == "__main__":
    test_image_save()
