from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import UserProfile, AuthenticationLog
from utils.validators import validate_cpf
import re


User = get_user_model()


def validate_strong_password(value):
    """
    Validação adicional de força de senha
    - Pelo menos 8 caracteres
    - Pelo menos uma letra maiúscula
    - Pelo menos uma letra minúscula
    - Pelo menos um número
    - Pelo menos um caractere especial
    """
    if len(value) < 8:
        raise serializers.ValidationError("A senha deve ter pelo menos 8 caracteres.")

    if not re.search(r"[A-Z]", value):
        raise serializers.ValidationError(
            "A senha deve conter pelo menos uma letra maiúscula."
        )

    if not re.search(r"[a-z]", value):
        raise serializers.ValidationError(
            "A senha deve conter pelo menos uma letra minúscula."
        )

    if not re.search(r"[0-9]", value):
        raise serializers.ValidationError("A senha deve conter pelo menos um número.")

    if not re.search(r'[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?]', value):
        raise serializers.ValidationError(
            "A senha deve conter pelo menos um caractere especial."
        )

    return value


def validate_password_not_email_or_name(value, email, name):
    """
    Validação para garantir que a senha não seja igual ao email ou nome
    """
    if email.lower() in value.lower() or value.lower() in email.lower():
        raise serializers.ValidationError("A senha não pode conter seu email.")

    if name.lower() in value.lower() or value.lower() in name.lower():
        raise serializers.ValidationError("A senha não pode conter seu nome.")

    return value


class NutritionistRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    confirm_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = (
            "name",
            "email",
            "password",
            "confirm_password",
            "professional_title",
            "gender",
            "cpf",
            "crn",
        )

    def validate_password(self, value):
        # Validação padrão do Django
        validate_password(value)
        # Validação adicional de força
        validate_strong_password(value)
        return value

    def validate(self, attrs):
        # Verificar se as senhas coincidem
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError({"password": "As senhas não coincidem."})

        # Verificar se a senha não é igual ao email ou nome
        email = self.initial_data.get("email", "")
        name = self.initial_data.get("name", "")
        validate_password_not_email_or_name(attrs["password"], email, name)

        return attrs

    def create(self, validated_data):
        validated_data.pop("confirm_password")
        user = User.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"],
            name=validated_data["name"],
            user_type="nutricionista",
            professional_title=validated_data.get("professional_title"),
            gender=validated_data.get("gender"),
            cpf=validated_data.get("cpf"),
            crn=validated_data.get("crn"),
        )
        return user


class GoogleLoginSerializer(serializers.Serializer):
    id_token = serializers.CharField(required=True)


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()


class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()


class PasswordResetConfirmSerializer(serializers.Serializer):
    token = serializers.CharField()
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate_password(self, value):
        # Validação padrão do Django
        validate_password(value)
        # Validação adicional de força
        validate_strong_password(value)
        return value

    def validate(self, attrs):
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError({"password": "As senhas não coincidem."})

        # Obter o UID do usuário a partir do contexto
        # O UID é passado via URL, então precisamos extrair do contexto
        request = self.context.get("request")
        if request:
            # Tenta obter o uidb64 de diferentes lugares
            uidb64 = (
                request.resolver_match.kwargs.get("uidb64")
                if hasattr(request, "resolver_match") and request.resolver_match
                else None
            )

            # Se não estiver nos kwargs da URL, tentar obter de outros lugares
            if not uidb64:
                # Pode estar vindo de query params ou body
                uidb64 = (
                    request.query_params.get("uid")
                    if hasattr(request, "query_params")
                    else None
                )
                if not uidb64:
                    uidb64 = (
                        request.data.get("uid") if hasattr(request, "data") else None
                    )

            if uidb64:
                from django.utils.encoding import force_str
                from django.utils.http import urlsafe_base64_decode
                from django.contrib.auth import get_user_model

                User = get_user_model()

                try:
                    uid = force_str(urlsafe_base64_decode(uidb64))
                    user = User.objects.get(pk=uid)
                    validate_password_not_email_or_name(
                        attrs["password"], user.email, user.name
                    )
                except (TypeError, ValueError, OverflowError, User.DoesNotExist):
                    # Se não for possível obter o usuário, não fazemos a validação
                    pass

        return attrs


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    email = serializers.EmailField(required=False)
    password = serializers.CharField(write_only=True)
    username = serializers.CharField(required=False, allow_blank=True)

    def validate(self, attrs):
        # Aceita tanto email quanto username
        email = attrs.get("email")
        username = attrs.get("username")

        # Se email foi enviado, usar ele como username
        if email:
            attrs["username"] = email
        elif username:
            attrs["username"] = username

        # Não remover campos, apenas deixar o serializer pai lidar com isso
        data = super().validate(attrs)
        return data


class UserProfileSettingsSerializer(serializers.ModelSerializer):
    """Serializer for the nested 'settings' object (read and write)."""

    class Meta:
        model = UserProfile
        fields = ("theme", "language", "notifications_email", "notifications_push")


class UserDetailSerializer(serializers.ModelSerializer):
    """
    Serializer for the /users/me/ endpoint to retrieve and update user details.
    """

    settings = UserProfileSettingsSerializer(source="profile", required=False)
    avatar = serializers.ImageField(source="profile.profile_picture", read_only=True)
    profile_picture = serializers.ImageField(
        source="profile.profile_picture", required=False, allow_null=True
    )
    profile_picture_file = serializers.ImageField(
        required=False, allow_null=True, write_only=True
    )

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "name",
            "user_type",
            "professional_title",
            "gender",
            "avatar",
            "profile_picture",
            "profile_picture_file",
            "settings",
            "created_at",
        )
        read_only_fields = ("id", "email", "user_type", "created_at")

    def update(self, instance, validated_data):
        request = self.context.get("request")

        print(f"[DEBUG] ====== UserDetailView.update START ======")
        print(
            f"[DEBUG] request.FILES keys: {list(request.FILES.keys()) if request else 'No request'}"
        )
        print(
            f"[DEBUG] request.data keys: {list(request.data.keys()) if request else 'No request'}"
        )
        print(
            f"[DEBUG] request.content_type: {request.content_type if request else 'No request'}"
        )
        print(f"[DEBUG] validated_data: {validated_data}")

        # 1. Extrair dados de perfil do validated_data (onde o DRF normalmente coloca)
        profile_data = validated_data.pop("profile", {})

        # 2. Se profile_picture veio no nível superior (por causa do source decorado)
        if "profile_picture" in validated_data:
            profile_data["profile_picture"] = validated_data.pop("profile_picture")

        # 2.5. Handle profile_picture_file from root level (new field for direct file upload)
        profile_picture_file = validated_data.pop("profile_picture_file", None)
        if profile_picture_file is not None:
            if profile_picture_file == "":
                profile_data["profile_picture"] = None
            else:
                profile_data["profile_picture"] = profile_picture_file

        # 3. SEGURANÇA: Se estivermos em um multipart/form-data, o DRF pode falhar no mapeamento aninhado
        # Vamos garantir que pegamos os arquivos e dados brutos do request
        if request:
            # Prioridade: arquivo enviado em request.FILES
            if "profile_picture" in request.FILES:
                profile_data["profile_picture"] = request.FILES["profile_picture"]
                print(
                    f"[DEBUG] Profile picture file received: {request.FILES['profile_picture']}"
                )
            # Só remove a foto se vier EXPLICITAMENTE '' ou null no FormData
            # Não removemos se o campo simplesmente não estiver presente
            elif "profile_picture" in request.data:
                val = request.data.get("profile_picture")
                # Verifica se é string vazia ou null explícito
                if val == "" or val is None:
                    profile_data["profile_picture"] = None
                    print(f"[DEBUG] Profile picture removal requested")
                # Se tiver qualquer outro valor, mantém (não faz nada)
            else:
                print(
                    f"[DEBUG] No profile_picture in request.FILES or request.data, keeping existing"
                )

        # 4. Lidar com campos de configurações achatados ('settings.theme')
        settings_update = {}
        if request:
            for key, value in request.data.items():
                if key.startswith("settings."):
                    attr = key.split(".", 1)[1]
                    # Converter valores booleanos e nuláveis
                    if value in ["true", "True"]:
                        value = True
                    elif value in ["false", "False"]:
                        value = False
                    elif value == "null":
                        value = None
                    settings_update[attr] = value

        # 5. Atualizar campos do User (super().update lida com name, professional_title, gender etc)
        instance = super().update(instance, validated_data)

        # 6. Garantir que o perfil existe e aplicar atualizações
        profile, created = UserProfile.objects.get_or_create(user=instance)
        print(
            f"[DEBUG] Profile before update: profile_picture = {profile.profile_picture}"
        )

        # Aplicar configurações (theme, language, etc)
        if settings_update:
            for attr, value in settings_update.items():
                if hasattr(profile, attr):
                    setattr(profile, attr, value)

        # Se vierem no formato aninhado via JSON normal
        if isinstance(profile_data, dict):
            # Extrair settings aninhados se houver (enviados via JSON)
            # DRF coloca os campos de UserProfileSettingsSerializer aqui
            pass

        # 7. Aplicar campos diretos do perfil (incluindo profile_picture)
        for attr, value in profile_data.items():
            if hasattr(profile, attr):
                setattr(profile, attr, value)
                print(f"[DEBUG] Setting profile.{attr} = {value}")

        print(f"[DEBUG] Saving profile, profile_picture = {profile.profile_picture}")
        profile.save()
        print(f"[DEBUG] After save, profile_picture = {profile.profile_picture}")
        print(f"[DEBUG] ====== UserDetailView.update END ======")
        return instance

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        request = self.context.get("request")

        # Garantir que as URLs das imagens sejam absolutas para o frontend
        if request:
            try:
                # O DRF já pode ter colocado os campos relativos no representation
                # Mas garantimos que as URLs de imagem sejam absolutas para o frontend
                if (
                    "profile_picture" in representation
                    and representation["profile_picture"]
                ):
                    if not representation["profile_picture"].startswith("http"):
                        representation["profile_picture"] = request.build_absolute_uri(
                            representation["profile_picture"]
                        )

                if "avatar" in representation and representation["avatar"]:
                    if not representation["avatar"].startswith("http"):
                        representation["avatar"] = request.build_absolute_uri(
                            representation["avatar"]
                        )
                elif "profile_picture" in representation:
                    representation["avatar"] = representation["profile_picture"]
            except Exception:
                pass

        return representation


class ChangePasswordSerializer(serializers.Serializer):
    """
    Serializer for password change endpoint.
    """

    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    confirm_new_password = serializers.CharField(required=True)

    def validate_new_password(self, value):
        # Validação padrão do Django
        validate_password(value)
        # Validação adicional de força
        validate_strong_password(value)
        return value

    def validate_old_password(self, value):
        user = self.context["request"].user
        if not user.check_password(value):
            raise serializers.ValidationError(
                "Your old password was entered incorrectly. Please enter it again."
            )
        return value

    def validate(self, data):
        if data["new_password"] != data["confirm_new_password"]:
            raise serializers.ValidationError(
                {"new_password": "The two password fields didn't match."}
            )

        # Verificar se a nova senha é diferente da antiga
        old_password = data.get("old_password")
        new_password = data["new_password"]
        if old_password and old_password == new_password:
            raise serializers.ValidationError(
                {"new_password": "A nova senha deve ser diferente da antiga."}
            )

        return data

    def save(self, **kwargs):
        password = self.validated_data["new_password"]
        user = self.context["request"].user
        user.set_password(password)
        user.save()
        return user


class AuthenticationLogSerializer(serializers.ModelSerializer):
    user_id = serializers.PrimaryKeyRelatedField(source="user", read_only=True)

    class Meta:
        model = AuthenticationLog
        fields = ("user_id", "ip_address", "user_agent")
