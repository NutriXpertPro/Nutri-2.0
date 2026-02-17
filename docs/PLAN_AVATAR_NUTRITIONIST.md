# 📋 PLAN.md - Nutricionista Avatar no Patient Dashboard

> **Versão:** 1.0  
> **Data:** 2026-02-17  
> **Status:** ✅ Concluído

---

## 🎯 Informações Gerais

| Campo | Descrição |
|-------|-----------|
| **Título** | Exibir foto real do nutricionista no patient-dashboard-v2 |
| **Projeto** | Nutri 4.0 |
| **Tipo** | FULLSTACK (Frontend + Backend) |
| **Prioridade** | Alta |
| **Estimativa** | 30 min |

---

## 📌 Contexto

### Problema / Necessidade
Na página `https://srv1354256.hstgr.cloud/patient-dashboard-v2`, na aba inicial onde tem uma mensagem de saudação, está aparecendo uma foto fake do nutritionist ao invés da foto real que está salva no sistema.

### Escopo
- **Inclui:** Buscar foto do nutricionista no backend e exibir no frontend
- **Exclui:** Alterar outras partes do dashboard

### Resultados Esperados
Foto real do nutritionist deve aparecer na saudação do patient-dashboard-v2.

---

## 🔧 Especificações Técnicas

### Stack Tecnológico
- Frontend: Next.js, React, TypeScript
- Backend: Django REST Framework, Python

### Arquivos Envolvidos
- `backend/patients/serializers.py` - PatientProfileSerializer
- `frontend/src/components/patient/tabs/HomeTab.tsx`
- `frontend/src/contexts/patient-context.tsx`

---

## 📋 Tarefas

### Fase 1: Backend
- [✅] **T1.1** - Verificar como o campo `nutritionist_avatar` é retornado na API
- [✅] **T1.2** - Melhorar método `get_nutritionist_avatar` para buscar corretamente

### Fase 2: Frontend  
- [✅] **T2.1** - Verificar se o campo está sendo passado ao contexto
- [✅] **T2.2** - Implementar fallback com iniciais caso não haja foto

---

## 👥 Agents Utilizados

| Agent | Responsabilidade |
|-------|-----------------|
| `backend-specialist` | Ajustar serializer |
| `frontend-specialist` | Atualizar componente HomeTab |

---

## ✅ Checklist Final

- [x] Código implementado
- [x] Testado em produção

---

*Modelo baseado em .agent/PLAN_TEMPLATE.md*
