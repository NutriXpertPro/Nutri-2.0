---
name: plan-template-nutri40
description: Modelo de PLAN.md para projetos Nutri 4.0. Use para planejar tarefas antes de invocar agentes especializados via Orquestrador.
model: inherit
skills: clean-code, parallel-agents, behavioral-modes, plan-writing, brainstorming, architecture, lint-and-validate, powershell-windows, bash-linux
---

# 📋 PLAN.md - Nutri 4.0

> **Versão:** 3.0  
> **Data:** {{DATA_ATUAL}}  
> **Localização:** `docs/PLAN-{slug}.md`
> **Status:** 📝 Rascunho | 🔄 Em Desenvolvimento | ✅ Concluído

---

## 🎯 Informações Gerais

| Campo | Descrição |
|-------|-----------|
| **Título** | Título claro da tarefa |
| **Projeto** | Nutri 4.0 |
| **Tipo** | WEB \| BACKEND \| FULLSTACK \| MOBILE |
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
- Frontend: Next.js, React, Tailwind
- Backend: Django, PostgreSQL, Redis
- Outras ferramentas: Docker, AWS

### Dependências
Liste bibliotecas ou serviços externos necessários.

### Restrições
- Limitações técnicas conhecidas
- Requisitos de segurança (dados de pacientes)
- LGPD compliance

---

## 📋 Tarefas

### Fase 1: Análise e Planejamento
- [ ] **T1.1** - [Descrição da tarefa]
- [ ] **T1.2** - [Descrição da tarefa]
- [ ] **T1.3** - [Descrição da tarefa]

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

## 👥 Agents Disponíveis (39 total)

> ⚠️ **IMPORTANTE:** Use apenas agents que existem em `.agent/agents/`. O Orquestrador só consegue invocar agents que estão definidos.

### 🔬 Domain: Nutri 4.0 - Nutricional (12 agents)

| Agent | Responsabilidade | Quando Usar |
|-------|-----------------|--------------|
| `analista-anamneses` | Análise de anamnese e objetivos | Avaliação de pacientes |
| `calculador-macros` | Cálculo de TMB, GCDT, macros | Planejamento de dietas |
| `conversor-medidas` | Conversão de unidades | Cálculos nutricionais |
| `gerente-pacientes` | Gestão de pacientes | Cadastro, histórico |
| `planejador-dietas` | Planejamento de dietas | Criação de planos |
| `validador-dados-nutricionais` | Validação de dados | Verificar consistência |
| `otimizador-substituicoes` | Substituições saudáveis | Melhoria de receitas |
| `especialista-substituicoes` | Análise de substituições | Alternativas alimentares |
| `gerador-relatorios` | Geração de relatórios | Relatórios nutricionais |
| `analista-dados-nutricionais` | Análise de dados | Insights e estatísticas |
| `assistente-atendimento` | Atendimento ao cliente | Suporte inicial |
| `coordenador-consultas` | Coordenação de consultas | Agendamento |

### 🏗️ Domain: Arquitetura (5 agents)

| Agent | Responsabilidade | Quando Usar |
|-------|-----------------|--------------|
| `arquiteto-banco-dados` | Schema, migrations | Prisma, SQL |
| `arquiteto-backend` | API, lógica server | Django, FastAPI |
| `planejador-projetos` | Planejamento | Task breakdown |
| `guardiao-isolamento-dados` | Privacidade | LGPD, segurança |
| `gerente-integracoes` | APIs externas | Integrações |

### 🎨 Domain: Frontend & UI (4 agents)

| Agent | Responsabilidade | Quando Usar |
|-------|-----------------|--------------|
| `especialista-frontend` | Componentes React | UI/UX |
| `agent-especialista-em-pagina` | Páginas específicas | Landing pages |
| `especialista-em-conteudo-marketing-nutrixpertpro` | Marketing | Conteúdo |
| `ui-ux-designer` | Design system | (se existir) |

### 🔐 Domain: Segurança & Auth (2 agents)

| Agent | Responsabilidade | Quando Usar |
|-------|-----------------|--------------|
| `auditor-seguranca` | OWASP, vulnerabilidades | Auditoria |
| `especialista-autenticacao` | Auth, OAuth | Login, GDPR |

### 🧪 Domain: Qualidade (4 agents)

| Agent | Responsabilidade | Quando Usar |
|-------|-----------------|--------------|
| `engenheiro-testes` | Testes unitários | Jest, pytest |
| `engenheiro-qa-automacao` | E2E testing | Playwright |
| `depurador` | Debugging | Bug fixing |
| `rastreador-progresso` | Tracking | Métricas |

### 📊 Domain: Dados & Medidas (3 agents)

| Agent | Responsabilidade | Quando Usar |
|-------|-----------------|--------------|
| `gerenciador-medidas-ibge` | Medidas antropométricas | IBGE |
| `gerenciador-perfis-usuarios` | Perfis de usuários | Gestão |
| `gerente-presets-refeicoes` | Presets de refeições | Templates |

### 🔧 Domain: Desenvolvimento (5 agents)

| Agent | Responsabilidade | Quando Usar |
|-------|-----------------|--------------|
| `explorador-codigo` | Codebase discovery | Mapear dependências |
| `arqueologo-codigo` | Legacy code | Refatoração |
| `otimizador-performance` | Performance | Otimização |
| `especialista-seo` | SEO | Meta tags |
| `criador-alimentos-personalizados` | Alimentos customizados | CRUD |

### 📝 Domain: Documentação (2 agents)

| Agent | Responsabilidade | Quando Usar |
|-------|-----------------|--------------|
| `escritor-documentacao` | Docs | README, API docs |
| `gerente-produto` | Product management | (se necessário) |

### 🚀 Domain: DevOps & Deploy (2 agents)

| Agent | Responsabilidade | Quando Usar |
|-------|-----------------|--------------|
| `engenheiro-deplay` | Deploy | Docker, CI/CD |

---

## 🧩 Skills Disponíveis (33 total)

### Core (5 skills)
| Skill | Descrição |
|-------|-----------|
| `clean-code` | Padrões de código (GLOBAL) |
| `parallel-agents` | Orquestração multi-agent |
| `behavioral-modes` | Modos de comportamento |
| `plan-writing` | Escrita de planos |
| `brainstorming` | Questionamento Socrático |

### Arquitetura (3 skills)
| Skill | Descrição |
|-------|-----------|
| `architecture` | Arquitetura de sistemas |
| `database-design` | Schema design |
| `api-patterns` | REST, GraphQL |

### Frontend (5 skills)
| Skill | Descrição |
|-------|-----------|
| `react-patterns` | React hooks, state |
| `nextjs-best-practices` | Next.js App Router |
| `tailwind-patterns` | Tailwind CSS |
| `frontend-design` | UI/UX patterns |
| `mobile-design` | Mobile UI/UX |

### Backend (4 skills)
| Skill | Descrição |
|-------|-----------|
| `nodejs-best-practices` | Node.js async |
| `python-patterns` | Python, FastAPI |
| `django-best-practices` | Django patterns |
| `server-management` | Infra |

### Qualidade (5 skills)
| Skill | Descrição |
|-------|-----------|
| `testing-patterns` | Jest, Vitest |
| `tdd-workflow` | TDD |
| `webapp-testing` | E2E, Playwright |
| `lint-and-validate` | Linting |
| `code-review-checklist` | Reviews |

### Segurança (2 skills)
| Skill | Descrição |
|-------|-----------|
| `vulnerability-scanner` | OWASP |
| `red-team-tactics` | Offensive security |

### SEO & Growth (2 skills)
| Skill | Descrição |
|-------|-----------|
| `seo-fundamentals` | SEO |
| `geo-fundamentals` | GenAI optimization |

### DevOps (3 skills)
| Skill | Descrição |
|-------|-----------|
| `deployment-procedures` | CI/CD |
| `docker-expert` | Docker |
| `bash-linux` | Linux commands |

### Utilities (4 skills)
| Skill | Descrição |
|-------|-----------|
| `powershell-windows` | Windows |
| `i18n-localization` | i18n |
| `performance-profiling` | Profiling |
| `systematic-debugging` | Troubleshooting |

---

## 📁 Workflows Disponíveis (11)

| Workflow | Comando | Descrição |
|----------|---------|-----------|
| `/orchestrate` | Multi-agent | Coordenar múltiplos agents |
| `/plan` | Planejamento | Criar PLAN.md |
| `/create` | Criação | Criar novas features |
| `/debug` | Debug | Resolver problemas |
| `/deploy` | Deploy | Fazer deploy |
| `/enhance` | Melhoria | Melhorar código existente |
| `/brainstorm` | Brainstorm | Descoberta Socrática |
| `/test` | Testes | Executar testes |
| `/preview` | Preview | Visualizar mudanças |
| `/status` | Status | Verificar status |
| `/ui-ux-pro-max` | Design | Design com 50 estilos |

---

## ⚠️ Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| API não responde | Média | Alto | Implementar retry logic |
| Conflito de merge | Baixa | Médio | Code review obrigatório |
| Dados de pacientes expostos | Baixa | Crítico | LGPD compliance |

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
- [ ] Documentação atualizada (se solicitado)
- [ ] Deploy em produção (se aplicável)

---

> 🔴 **REGRA DO ORQUESTRADOR:** Antes de invocar qualquer agent especializado, você DEVE ter um PLAN.md válido em `docs/PLAN-{slug}.md`. Sem PLAN = Sem agents.

> 💡 **COMO USAR:** 
> 1. Execute `/orchestrate [tarefa]` 
> 2. Orquestrador verifica se existe `docs/PLAN-{slug}.md`
> 3. Se não existir → usa `project-planner` para criar
> 4. Se existir → segue as instruções do PLAN
