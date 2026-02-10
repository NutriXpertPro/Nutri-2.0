# RELATÓRIO DE AUDITORIA - FASE 2: SEGURANÇA (OWASP TOP 10)

## 1. Resumo Executivo
A auditoria revelou uma base de código geralmente bem estruturada usando boas práticas do Django (DRF, JWT), mas identificou vulnerabilidades de configuração e vazamento de informações que precisam ser corrigidas antes do deploy final.

## 2. Vulnerabilidades Identificadas

### 2.1 [ALTA] Vazamento de Informações (Information Leakage)
**OWASP Category**: Security Misconfiguration / Improper Error Handling
- **Localização**: `users/views.py`, `patients/views.py`, `diets/views.py`
- **Descrição**: O código retorna `str(e)` diretamente na resposta da API em blocos `except Exception as e`.
- **Exemplo**: `return Response({"error": str(e)}, status=500)`
- **Impacto**: Exposição de detalhes internos, nomes de tabelas, versões de bibliotecas ou stack traces que facilitam ataques direcionados.
- **Recomendação**: Retornar mensagens genéricas ("Erro interno no servidor") e logar o erro real apenas no servidor.

### 2.2 [MÉDIA] Quebra de Controle de Acesso (Potential BAC)
**OWASP Category**: Broken Access Control
- **Localização**: `diets/serializers.py` (DietSerializer)
- **Descrição**: Não há validação explícita de que o `patient_id` fornecido na criação de uma dieta pertence ao nutricionista autenticado. Embora a listagem seja filtrada, a criação pode permitir associar dados a pacientes de terceiros.
- **Recomendação**: Adicionar método `validate_patient` no serializer para garantir `patient.nutritionist == request.user`.

### 2.3 [MÉDIA] Configuração de Segredos (Hardcoded Secrets)
**OWASP Category**: Security Misconfiguration
- **Localização**: `setup/settings.py`
- **Descrição**: `SECRET_KEY` possui um valor default inseguro no código.
- **Impacto**: Se a variável de ambiente falhar, o sistema roda com uma chave conhecida, comprometendo assinaturas de sessão e tokens.
- **Recomendação**: Remover o valor default ou fazer o sistema falhar no start se a env var não estiver presente em produção (`ImproperlyConfigured`).

### 2.4 [BAIXA] Timing Attack em Login
**OWASP Category**: Authentication Failures
- **Localização**: `users/views.py`
- **Descrição**: Uso de `time.sleep(0.5)` para mitigar enumeração de usuários.
- **Impacto**: Em servidores síncronos (como Gunicorn sem threads suficientes), isso facilita ataques de Negação de Serviço (DoS) ocupando workers.
- **Recomendação**: Confiar no `RateLimiting` já implementado e remover o sleep ou usar autenticação assíncrona se possível.

## 3. Pontos Positivos (Segurança)
- **Sanitização**: Uso consistente de `sanitize_string` nos Models.
- **Auth**: JWT com rotação e blacklist implementados corretamente.
- **CSRF**: Cookies HttpOnly e SameSite=Lax configurados.
- **Isolamento**: `get_queryset` implementado corretamente na maioria dos ViewSets para filtrar por usuário.

## 4. Próximos Passos
O orquestrador procederá para a correção das vulnerabilidades de Vazamento de Informação e Controle de Acesso imediatamente.
