# RELATÓRIO DE AUDITORIA - FASE 1: MAPEAMENTO E ANÁLISE INICIAL

## 1. Inventário do Sistema

### 1.1 Stack Tecnológico
**Backend**
- **Framework**: Django 5.0.2 + Django REST Framework 3.15.1
- **Linguagem**: Python 3.x
- **Banco de Dados**: MySQL/MariaDB (via PyMySQL)
- **Cache/Queue**: Redis (Celery configured but finding `CELERY_TASK_ALWAYS_EAGER = True`)
- **Autenticação**: SimpleJWT (JWT) com Rotação e Blacklist
- **Servidor Web**: Gunicorn + Whitenoise (Static files)

**Frontend**
- **Framework**: Next.js 16.1.0 (App Router)
- **Linguagem**: TypeScript
- **UI Libs**: Tailwind CSS 4, Shadcn UI, Framer Motion
- **State**: Zustand, React Query
- **Forms**: React Hook Form + Zod

### 1.2 Mapeamento de Rotas (Endpoints Principais)
Prefixo Global: `/api/v1/`

| Módulo | Endpoint Base | Descrição |
|--------|---------------|-----------|
| **Auth** | `/auth/` | Login, Logout, Password Reset |
| **Users** | `/users/me/` | Perfil do usuário logado |
| **Patients** | `/patients/` | CRUD de pacientes |
| **Appointments** | `/appointments/` | Agendamentos |
| **Anamnesis** | `/anamnesis/` | Fichas de anamnese |
| **Diets** | `/diets/` | Criação e gestão de dietas |
| **Evaluations** | `/evaluations/` | Avaliações antropométricas |
| **Notifications** | `/notifications/` | Sistema de notificações |
| **Messages** | `/messages/` | Chat/Mensagens internas |
| **Lab Exams** | `/lab_exams/` | Exames laboratoriais |
| **Automation** | `/automation/` | Automação de tarefas |
| **Branding** | `/branding/` | Personalização visual |
| **Integrations** | `/integrations/` | Google Calendar, etc. |
| **Dashboard** | `/dashboard/` | Métricas e resumos |

### 1.3 Superfície de Ataque

**Pontos de Entrada Públicos:**
- `/api/token/` (Login)
- `/api/token/refresh/`
- `/api/token/verify/`
- `/health/`
- `/admin/` (Django Admin - Protegido por auth padrão, mas exposto na URL)

**Pontos de Atenção Identificados (Preliminary):**
1.  **SECRET_KEY Default**: O `settings.py` possui um valor default inseguro. É CRÍTICO garantir que a variável de ambiente `SECRET_KEY` esteja definida em produção.
2.  **Allowed Hosts**: `ALLOWED_HOSTS` default é `*`. Risco de Host Header attacks se não configurado corretamente.
3.  **Celery Sync**: `CELERY_TASK_ALWAYS_EAGER = True` significa que tarefas pesadas podem bloquear o request HTTP, possivelmente facilitando DoS.
4.  **CORS**: Configuração parece robusta (`False` para allow all), mas depende de lista branca correta.

## 2. Próximos Passos (Fase 2)
Iniciar auditoria profunda de segurança focando em:
1.  Verificar injeção de SQL/Comando nos filtros e views.
2.  Auditar controle de acesso (Isolamento de dados entre Nutricionistas).
3.  Validar fluxo de autenticação e gerenciamento de permissões.
