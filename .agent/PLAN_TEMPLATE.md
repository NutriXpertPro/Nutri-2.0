---
name: plan-template
description: Modelo padrão de PLAN.md para projetos. Use este template para planejar qualquer tarefa antes de invocar agentes especializados.
model: inherit
skills: plan-writing
---

# 📋 PLAN.md - Modelo Padrão

> **Versão:** 1.0  
> **Data:** {{DATA_ATUAL}}  
> **Status:** 📝 Rascunho | 🔄 Em Desenvolvimento | ✅ Concluído

---

## 🎯 Informações Gerais

| Campo | Descrição |
|-------|-----------|
| **Título** | Título claro da tarefa |
| **Projeto** | Nome do projeto (ex: Nutri 4.0) |
| **Tipo** | WEB \| BACKEND \| MOBILE \| FULLSTACK \| API |
| **Prioridade** | Alta \| Média \| Baixa |
| **Estimativa** | Tempo estimado (ex: 2h, 1 dia) |

---

## 📌 Contexto

### Problema / Necessidade
Descreva o problema ou necessidade que motivou esta tarefa.

### Escopo
- **Inclui:** O que faz parte desta tarefa
- **Exclui:** O que NÃO faz parte (para evitar escopo creep)

### Resultados Esperados
Liste os resultados concretos esperados ao final desta tarefa.

---

## 🔧 Especificações Técnicas

### Stack Tecnológico
- Frontend: [ex: Next.js, React, Tailwind]
- Backend: [ex: Django, FastAPI, PostgreSQL]
- Outras ferramentas: [ex: Docker, AWS]

### Dependências
Liste bibliotecas ou serviços externos necessários.

### Restrições
- Limitações técnicas conhecidas
- Requisitos de segurança
- Compatibilidade (ex: browser support)

---

## 📋 Tarefas

### Fase 1: Análise e Planejamento
- [ ] **T1.1** - Definir estrutura de dados
- [ ] **T1.2** - Identificar componentes afetados
- [ ] **T1.3** - Verificar dependências existentes

### Fase 2: Implementação
- [ ] **T2.1** - [Descrição da tarefa]
- [ ] **T2.2** - [Descrição da tarefa]
- [ ] **T2.3** - [Descrição da tarefa]

### Fase 3: Validação
- [ ] **T3.1** - Testar funcionalidades
- [ ] **T3.2** - Verificar performance
- [ ] **T3.3** - Revisão de código

### Fase 4: Deploy (se aplicável)
- [ ] **T4.1** - Preparar ambiente
- [ ] **T4.2** - Executar deploy
- [ ] **T4.3** - Verificar produção

---

## 👥 Agents Recomendados

| Agent | Responsabilidade | Prioridade |
|-------|-----------------|------------|
| `frontend-specialist` | Componentes UI | Alta |
| `backend-specialist` | API e lógica | Alta |
| `test-engineer` | Testes | Média |
| `security-auditor` | Segurança | Média |
| `database-architect` | Schema BD | Baixa |

---

## ⚠️ Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Ex: API não responde | Média | Alto | Implementar retry logic |
| Ex: Conflito de merge | Baixa | Médio | Code review obrigatório |

---

## 📝 Notas Adicionais

Adicione observações importantes, Links úteis, Referências, etc.

---

## 📊 Progresso

| Data | Status | Observações |
|------|--------|-------------|
| {{DATA}} | 📝 | Plano criado |
| | 🔄 | Em andamento |
| | ✅ | Concluído |

---

## ✅ Checklist Final

- [ ] Código implementado
- [ ] Testes passing
- [ ] Code review realizado
- [ ] Documentação atualizada
- [ ] Deploy em produção (se aplicável)

---

*Este modelo segue as melhores práticas de planejamento de projetos ágeis.*
