from pathlib import Path
from datetime import timedelta
import dj_database_url
import os
import logging

logger = logging.getLogger(__name__)

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Configuração do python-decouple (lê nativamente de .env ou os.environ)
from decouple import config, Csv, undefined


if config("DEBUG", default=False, cast=bool):
    SECRET_KEY = config("SECRET_KEY", default="dev-secret-key-CHANGE-IN-PRODUCTION-!!!")
else:
    # Em produção, a falta da SECRET_KEY deve impedir o sistema de iniciar
    SECRET_KEY = config("SECRET_KEY")
GOOGLE_OAUTH2_CLIENT_ID = config("GOOGLE_OAUTH2_CLIENT_ID", default="")
GOOGLE_OAUTH2_CLIENT_SECRET = config("GOOGLE_OAUTH2_CLIENT_SECRET", default="")
BACKEND_URL = config("BACKEND_URL", default="http://localhost:8000")
FRONTEND_URL = config(
    "FRONTEND_URL", default="https://nutri-frontend-1wzv.onrender.com"
)
DEBUG = config("DEBUG", default=False, cast=bool)
print(f"DEBUG mode is: {DEBUG}")
ALLOWED_HOSTS = config("ALLOWED_HOSTS", default="*", cast=Csv())

# Validade do token de reset de senha: 24 horas (em segundos)
PASSWORD_RESET_TIMEOUT = 86400

# CORS Configuration
CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOW_CREDENTIALS = True

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "corsheaders",  # CORS
    "rest_framework",
    "rest_framework_simplejwt",
    "rest_framework_simplejwt.token_blacklist",
    "drf_spectacular",  # Documentation
    "django_filters",  # Filters
    "setup",
    "users.apps.UsersConfig",
    "patients.apps.PatientsConfig",
    "diets.apps.DietsConfig",
    "anamnesis.apps.AnamnesisConfig",
    "evaluations.apps.EvaluationsConfig",
    "appointments.apps.AppointmentsConfig",
    "payments.apps.PaymentsConfig",
    "notifications.apps.NotificationsConfig",
    "messages.apps.MessagesConfig",
    "lab_exams.apps.LabExamsConfig",
    "automation.apps.AutomationConfig",
    "branding.apps.BrandingConfig",
    "integrations",
    "dashboard",
    "django_celery_beat",
    "django_celery_results",
]

AUTHENTICATION_BACKENDS = [
    "users.authentication.EmailBackend",  # Backend personalizado para login com email
    "django.contrib.auth.backends.ModelBackend",  # Backend padrão do Django (mantido para o admin)
]

MIDDLEWARE = [
    "utils.debug_middleware.Debug400Middleware",
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",  # CORS Middleware (must be before CommonMiddleware)
    "django.middleware.locale.LocaleMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# CORS Configuration - SECURE MODE
CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOW_CREDENTIALS = True

# Inicializa as origens permitidas com localhost e URLs do Render
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",  # Frontend alternates
    "http://127.0.0.1:3001",
    "http://localhost:3002",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
]

# (Mantém a lógica de adição via env, mas o ALLOW_ALL acima tem precedência no django-cors-headers se configurado assim)
# Na verdade, django-cors-headers usa ALLOW_ALL_ORIGINS se True, ignorando a lista.

origins_env = config("CORS_ALLOWED_ORIGINS", default="", cast=Csv())
for o in origins_env:
    if o.strip():
        origins.append(o.strip().rstrip("/"))

if FRONTEND_URL:
    clean_frontend_url = FRONTEND_URL.strip().rstrip("/")
    if clean_frontend_url and clean_frontend_url not in origins:
        origins.append(clean_frontend_url)

CORS_ALLOWED_ORIGINS = list(set([o for o in origins if o]))

# Ensure production origins are always included
CORS_ALLOWED_ORIGINS.extend(
    [
        "https://srv1354256.hstgr.cloud",
        "https://api.srv1354256.hstgr.cloud",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]
)
CORS_ALLOWED_ORIGINS = list(set(CORS_ALLOWED_ORIGINS))

# CRITICAL: Cannot use ALLOW_ALL_ORIGINS with ALLOW_CREDENTIALS
# Must specify exact origins when using credentials
CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOW_CREDENTIALS = True

# Explicitly allow production origins
CORS_ALLOWED_ORIGINS.extend(
    [
        "https://srv1354256.hstgr.cloud",
        "https://api.srv1354256.hstgr.cloud",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]
)

CSRF_TRUSTED_ORIGINS = [
    "https://srv1354256.hstgr.cloud",
    "https://api.srv1354256.hstgr.cloud",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# Remove duplicates
CORS_ALLOWED_ORIGINS = list(set(CORS_ALLOWED_ORIGINS))
CSRF_TRUSTED_ORIGINS = list(set(CSRF_TRUSTED_ORIGINS))

print(f"DEBUG: CORS_ALLOW_ALL_ORIGINS = {CORS_ALLOW_ALL_ORIGINS}")
print(f"DEBUG: CORS_ALLOWED_ORIGINS = {CORS_ALLOWED_ORIGINS}")
print(f"DEBUG: FRONTEND_URL = {FRONTEND_URL}")

CORS_ALLOW_HEADERS = [
    "accept",
    "accept-encoding",
    "authorization",
    "content-type",
    "dnt",
    "origin",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
]

CORS_ALLOW_METHODS = [
    "DELETE",
    "GET",
    "OPTIONS",
    "PATCH",
    "POST",
    "PUT",
]

ROOT_URLCONF = "setup.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ]
        },
    }
]

WSGI_APPLICATION = "setup.wsgi.application"

print("DEBUG: Lendo configurações de banco de dados...")
DATABASE_URL_FROM_ENV = config("DATABASE_URL", default=None)

if not DATABASE_URL_FROM_ENV:
    # Fallback para construção manual se DATABASE_URL falhar (útil em Docker)
    DB_NAME = config("DB_NAME", default="nutrixpert_db")
    DB_USER = config("DB_USER", default="nutri_user")
    DB_PASSWORD = config("DB_PASSWORD", default="nutri_password")
    DB_HOST = config("DB_HOST", default="db")
    DB_PORT = config("DB_PORT", default="3306")
    DATABASE_URL_FROM_ENV = (
        f"mysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    )
    print(
        f"DEBUG: DATABASE_URL construída manualmente: mysql://{DB_USER}:****@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    )
else:
    print(
        f"DEBUG: DATABASE_URL encontrada no ambiente: {DATABASE_URL_FROM_ENV[:15]}... (masked)"
    )

# Limpeza do prefixo se necessário
if DATABASE_URL_FROM_ENV.startswith("mysql+pymysql://"):
    DATABASE_URL_FROM_ENV = DATABASE_URL_FROM_ENV.replace(
        "mysql+pymysql://", "mysql://", 1
    )

DATABASES = {
    "default": dj_database_url.config(
        default=DATABASE_URL_FROM_ENV,
        conn_max_age=600,
        conn_health_checks=True,
    )
}
print(f"DEBUG: Database User final: {DATABASES['default'].get('USER')}")
print(f"DEBUG: Database Host final: {DATABASES['default'].get('HOST')}")

# Redis Cache (with fallback to local memory for CI)
REDIS_URL = config("REDIS_URL", default="")
if REDIS_URL:
    CACHES = {
        "default": {
            "BACKEND": "django_redis.cache.RedisCache",
            "LOCATION": REDIS_URL,
            "OPTIONS": {
                "CLIENT_CLASS": "django_redis.client.DefaultClient",
            },
        }
    }
else:
    CACHES = {
        "default": {
            "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
            "LOCATION": "unique-snowflake",
        }
    }

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

LANGUAGE_CODE = "pt-br"
TIME_ZONE = "America/Sao_Paulo"
USE_I18N = True
USE_TZ = True

STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

STORAGES = {
    "default": {
        "BACKEND": config(
            "DEFAULT_FILE_STORAGE",
            default="django.core.files.storage.FileSystemStorage",
        ),
    },
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage"
        if not DEBUG
        else "django.contrib.staticfiles.storage.StaticFilesStorage",
    },
}

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
AUTH_USER_MODEL = "users.User"


INTERNAL_IPS = ["127.0.0.1"]

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 10,
    "DEFAULT_FILTER_BACKENDS": ["django_filters.rest_framework.DjangoFilterBackend"],
    "DEFAULT_THROTTLE_CLASSES": [
        "rest_framework.throttling.AnonRateThrottle",
        "rest_framework.throttling.UserRateThrottle",
        "rest_framework.throttling.ScopedRateThrottle",
    ],
    "DEFAULT_THROTTLE_RATES": {
        "anon": "20/minute",
        "user": "100/minute",
        "auth": "5/minute",  # Rate limit específico para endpoints de autenticação
        "search": "30/minute",  # Limite para buscas pesadas (icontains)
    },
}

SPECTACULAR_SETTINGS = {
    "TITLE": "NutriXpertPro API",
    "DESCRIPTION": "API para gestão nutricional enterprise",
    "VERSION": "1.0.0",
    "SERVE_INCLUDE_SCHEMA": False,
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=15),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "UPDATE_LAST_LOGIN": False,
    "ALGORITHM": "HS256",
    "SIGNING_KEY": SECRET_KEY,
    "AUTH_HEADER_TYPES": ("Bearer",),
    "USER_ID_FIELD": "id",
    "USER_ID_CLAIM": "user_id",
    "AUTH_TOKEN_CLASSES": ("rest_framework_simplejwt.tokens.AccessToken",),
    "TOKEN_TYPE_CLAIM": "token_type",
    "JTI_CLAIM": "jti",
}

# Configurações de E-mail
# Tentar ler com decouple primeiro
try:
    EMAIL_HOST_USER = config("EMAIL_HOST_USER", default="")
    EMAIL_HOST_PASSWORD = config("EMAIL_HOST_PASSWORD", default="")

    # Se os valores estiverem vazios, tentar ler diretamente das variáveis de ambiente
    if not EMAIL_HOST_USER:
        EMAIL_HOST_USER = os.environ.get("EMAIL_HOST_USER", "")
    if not EMAIL_HOST_PASSWORD:
        EMAIL_HOST_PASSWORD = os.environ.get("EMAIL_HOST_PASSWORD", "")

    # Debug: imprimir valores lidos (apenas se não estiver em produção)
    if DEBUG and not EMAIL_HOST_USER:
        print("DEBUG: EMAIL_HOST_USER está vazio após tentativa de leitura")
    if DEBUG and not EMAIL_HOST_PASSWORD:
        print("DEBUG: EMAIL_HOST_PASSWORD está vazio após tentativa de leitura")

except Exception as e:
    print(f"DEBUG: Erro ao ler configurações de email com decouple: {e}")
    # Fallback para leitura direta do ambiente
    EMAIL_HOST_USER = os.environ.get("EMAIL_HOST_USER", "")
    EMAIL_HOST_PASSWORD = os.environ.get("EMAIL_HOST_PASSWORD", "")

# Determinar backend de email com base nas configurações
if EMAIL_HOST_USER and EMAIL_HOST_PASSWORD:
    # Se as credenciais estiverem configuradas, usar SMTP
    EMAIL_BACKEND = config(
        "EMAIL_BACKEND", default="django.core.mail.backends.smtp.EmailBackend"
    )
    if DEBUG:
        print("DEBUG: Usando backend SMTP porque credenciais estão definidas")
else:
    # Caso contrário, usar console backend (útil para desenvolvimento sem credenciais)
    EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
    if DEBUG:
        print(
            "DEBUG: Using CONSOLE email backend because EMAIL_HOST_USER or EMAIL_HOST_PASSWORD is empty."
        )

EMAIL_HOST = config("EMAIL_HOST", default="smtp.gmail.com")
EMAIL_PORT = config("EMAIL_PORT", default=587, cast=int)
EMAIL_USE_TLS = config("EMAIL_USE_TLS", default=True, cast=bool)
EMAIL_USE_SSL = config("EMAIL_USE_SSL", default=False, cast=bool)
DEFAULT_FROM_EMAIL = config(
    "DEFAULT_FROM_EMAIL", default="Nutri Xpert <noreply@nutrixpertpro.com>"
)

# Configurações do Celery
# IMPORTANTE: Sem um worker Celery rodando, as tasks assíncronas não serão executadas.
# Habilitar ALWAYS_EAGER garante que as tasks rodem sincronicamente (sem Redis/worker)
CELERY_TASK_ALWAYS_EAGER = DEBUG  # Tarefas rodam sincronamente apenas em DEBUG
CELERY_TASK_EAGER_PROPAGATES = True

# Broker configuration with fallback for Dev (Windows)
REDIS_URL = config("REDIS_URL", default="")
if DEBUG and not REDIS_URL:
    # Use memory/cache fallback to avoid connection timeout on Windows/Dev
    CELERY_BROKER_URL = "memory://"
    CELERY_RESULT_BACKEND = "cache"
    CELERY_BROKER_CONNECTION_TIMEOUT = 1
else:
    CELERY_BROKER_URL = config("CELERY_BROKER_URL", default="redis://localhost:6379/0")
    CELERY_RESULT_BACKEND = config(
        "CELERY_RESULT_BACKEND", default="redis://localhost:6379/0"
    )

CELERY_ACCEPT_CONTENT = ["json"]
CELERY_TASK_SERIALIZER = "json"
CELERY_RESULT_SERIALIZER = "json"
CELERY_TIMEZONE = "America/Sao_Paulo"
CELERY_BROKER_CONNECTION_RETRY_ON_STARTUP = True

# Configuração de arquivos de mídia
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

# Storage para arquivos de mídia (fotos de avaliações, etc.)
# Configuração para ambiente de desenvolvimento (arquivos locais)
# Para produção, pode-se configurar django-storages com S3 ou CloudFlare R2:
# STORAGES["default"]["BACKEND"] = 'storages.backends.s3boto3.S3Boto3Storage'
# ou
# STORAGES["default"]["BACKEND"] = 'storages.backends.cloudflare_r2.CloudFlareR2Storage'  # se disponível

# Configurações específicas para django-storages (quando utilizado)
AWS_ACCESS_KEY_ID = config("AWS_ACCESS_KEY_ID", default="")
AWS_SECRET_ACCESS_KEY = config("AWS_SECRET_ACCESS_KEY", default="")
AWS_STORAGE_BUCKET_NAME = config("AWS_STORAGE_BUCKET_NAME", default="")
AWS_S3_REGION_NAME = config("AWS_S3_REGION_NAME", default="")  # ex: us-east-1
AWS_S3_CUSTOM_DOMAIN = config(
    "AWS_S3_CUSTOM_DOMAIN", default=""
)  # Para CloudFlare R2: <account_id>.r2.cloudflarestorage.com
AWS_S3_FILE_OVERWRITE = False
AWS_DEFAULT_ACL = "public-read"
AWS_S3_VERIFY = True
AWS_LOCATION = "media"
AWS_QUERYSTRING_AUTH = True  # Para gerar URLs com expiração

if not DEBUG:
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
    SECURE_SSL_REDIRECT = True
    SECURE_HSTS_SECONDS = 31536000
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    CSRF_COOKIE_SECURE = True
    SESSION_COOKIE_SECURE = True
    X_FRAME_OPTIONS = "DENY"
