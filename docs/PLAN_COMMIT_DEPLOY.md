# 📋 PLAN.md - Commit, Push e Deploy

> **Versão:** 1.0  
> **Data:** 2026-02-17  
> **Status:** 🔄 Em Desenvolvimento

---

## 🎯 Informações Gerais

| Campo | Descrição |
|-------|-----------|
| **Título** | Commit todas alterações, push para main e deploy |
| **Projeto** | Nutri 4.0 |
| **Tipo** | DEVOPS |
| **Prioridade** | Alta |
| **Estimativa** | 15 min |

---

## 📌 Contexto

### Problema / Necessidade
Preciso fazer commit de todas as alterações realizadas no projeto, fazer push para branch main e fazer deploy.

### Escopo
- **Inclui:** Commit, push, deploy
- **Exclui:** Alterações de código

### Resultados Esperados
Código em produção com as últimas alterações.

---

## 🔧 Especificações Técnicas

### Alterações detectadas (25 arquivos):

| Área | Arquivos | Descrição |
|------|----------|-----------|
| **Backend** | serializers.py, views.py, settings.py | Correção foto paciente/nutricionista |
| **Frontend** | HomeTab.tsx, EcoHeader.tsx, settings-service.ts | UI e correção de bugs |
| **Orquestrador** | orquestrador.md, PLAN_TEMPLATE.md | Sistema de agents |
| **Configs** | docker-compose.yml, Dockerfile | Deploy |

### Novos arquivos:
- `.agent/PLAN_TEMPLATE.md`
- `docs/PLAN_AVATAR_NUTRITIONIST.md`
- `frontend/src/app/landing-v3/`
- `frontend/src/components/landing-v3/`
- Arquivos de teste (backend/check_profile_db.py, etc)

---

## 📋 Tarefas

### Fase 1: Análise e Prep
- [✅] **T1.1** - Verificar git status
- [✅] **T1.2** - Analisar alterações
- [ ] **T1.3** - Remover arquivos desnecessários do commit

### Fase 2: Commit
- [ ] **T2.1** - Adicionar arquivos relevantes
- [ ] **T2.2** - Criar mensagem de commit
- [ ] **T2.3** - Executar commit

### Fase 3: Push e Deploy
- [ ] **T3.1** - Push para origin/main
- [ ] **T3.2** - Executar deploy

---

## 👥 Agents Recomendados

| Agent | Responsabilidade |
|-------|-----------------|
| `devops-engineer` | Deploy |
| `project-planner` | Coordenação |

---

## ⚠️ Observações Importantes

- Usar branch main
- NÃO incluir arquivos de teste/debug no commit
- Arquivos landing-v3 são novos - incluir?

---

## 📝 Notas Adicionais

Revisar se todos os arquivos são necessários antes do commit.

---

## 📊 Progresso

| Data | Status | Observações |
|------|--------|-------------|
| 2026-02-17 | 🔄 | Em andamento |

---

*Modelo baseado em .agent/PLAN_TEMPLATE.md*
