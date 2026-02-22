---
name: PLAN_fix-substitution-500
description: Plano para diagnosticar e corrigir o erro 500 persistente em /api/v1/diets/substitutions/suggest/
model: inherit
skills: clean-code, parallel-agents, behavioral-modes, plan-writing, brainstorming, architecture, lint-and-validate, powershell-windows, bash-linux
---

# 📋 PLAN.md - Fix Substitution 500 Error

> ⚠️ **REGRA DE OURO - IMPORTANTE:**  
> **VOCÊ É TERMINANTEMENTE PROIBIDO DE FAZER QUALQUER ALTERAÇÃO, COMMIT OU DEPLOY SEM APROVAÇÃO EXPLÍCITA DO USUÁRIO.**  
> Qualquer mudança deve ser primeiro mostrada ao usuário para aprovação antes de implementar.

> **Versão:** 1.0  
> **Data:** 2026-02-18  
> **Localização:** `docs/PLAN_fix-substitution-500.md`  
> **Status:** 📝 Rascunho

---

## 🎯 Informações Gerais

| Campo | Descrição |
|-------|-----------|
| **Título** | Diagnosticar e corrigir erro 500 persistente em `/api/v1/diets/substitutions/suggest/` |
| **Projeto** | Nutri 4.0 |
| **Tipo** | BACKEND \| FULLSTACK |
| **Prioridade** | Alta |
| **Estimativa** | 2h (diagnóstico + correção + validação) |

---

## 📌 Contexto

### Problema / Necessidade
A API `/api/v1/diets/substitutions/suggest/?food_id=TACO_1&...` retorna **500 Internal Server Error** mesmo após:
- ✅ Correção no frontend (`DietMealCard.tsx`: `qty: ''` → numeric handling)
- ✅ Correção no backend (`services.py`: `calc_rel` fallback para `0.0` em vez de `None`)

O usuário confirmou que o erro persiste após essas correções, indicando que há outra camada de falha não identificada ainda.

### Escopo
- **Inclui:**
  - Diagnóstico completo da pilha de erros (logs, exceções, entrada/saída)
  - Validação dos parâmetros de entrada (`orig_ptn`, `orig_cho`, `orig_lip`, `orig_kcal`)
  - Verificação do fluxo completo do serviço de substituição (`substitution_service.py`, `services.py`, `models.py`)
  - Correção definitiva com teste E2E
- **Exclui:**
  - Refatoração completa do módulo de dietas
  - Mudanças na UI além das já aplicadas
  - Novas funcionalidades de substituição

### Resultados Esperados
1. Relatório detalhado com causa raiz do 500
2. Correção aplicada e testada (com script de teste)
3. Confirmação via curl ou Postman que `/substitutions/suggest/` retorna 200 com dados válidos
4. Documentação mínima da correção (no próprio código, se necessário)

---

## 🔧 Especificações Técnicas

### Stack Tecnológico
- Backend: Python/Django (v4.x), PostgreSQL
- Frontend: React/TypeScript, Tailwind
- Testes: pytest, Playwright (opcional)
- Ferramentas: VS Code, Antigravity, CLI

### Dependências
- `django-rest-framework`
- `pydantic` (para validação)
- `logging` configurado para DEBUG

### Restrições
- LGPD: não logar dados sensíveis de pacientes
- Não alterar comportamento de outros endpoints
- Manter compatibilidade com frontend existente

---

## 📋 Tarefas

### Fase 1: Análise e Planejamento
- [ ] **T1.1** - Usar `explorador-codigo` para mapear arquivos envolvidos: `substitution_service.py`, `services.py`, `models.py`, `views.py`
- [ ] **T1.2** - Usar `depurador` para rastrear exatamente onde ocorre a exceção (log completo, stack trace)
- [ ] **T1.3** - Usar `analista-dados-nutricionais` para validar se os parâmetros de entrada são válidos (ex: `orig_kcal = None`, `orig_ptn = ""`)

### Fase 2: Implementação
- [ ] **T2.1** - Correção proposta pelo `backend-specialist` com fallback robusto e logging
- [ ] **T2.2** - Adicionar validação de entrada explícita antes de chamar `calc_rel`
- [ ] **T2.3** - Atualizar `substitution_service.py` para tratar casos edge (ex: `food_id` inválido, valores negativos)

### Fase 3: Validação
- [ ] **T3.1** - Executar script de teste `scripts/test-substitution-service.py` (já existe)
- [ ] **T3.2** - Testar via curl: `GET /api/v1/diets/substitutions/suggest/?food_id=TACO_1&orig_ptn=20&orig_cho=40&orig_lip=10&orig_kcal=300`
- [ ] **T3.3** - Revisão de código por `test-engineer` (gerar testes unitários se ausentes)

### Fase 4: Deploy (após aprovação)
- [ ] **T4.1** - Preparar patch com `git diff`
- [ ] **T4.2** - Solicitar aprovação explícita do usuário
- [ ] **T4.3** - Commit e deploy (somente após confirmação)

---

## 👥 Agents Disponíveis (selecionados para esta tarefa)

| Agent | Responsabilidade | Justificativa |
|-------|-----------------|---------------|
| `explorador-codigo` | Mapear dependências e fluxo | Precisamos saber quais arquivos estão envolvidos além dos já conhecidos |
| `depurador` | Rastrear exceção exata | O 500 persiste — precisamos do stack trace real |
| `analista-dados-nutricionais` | Validar entradas numéricas | Parâmetros podem vir como string/None mesmo após frontend fix |
| `backend-specialist` | Propor correção robusta | Domínio backend é crítico aqui |
| `test-engineer` | Gerar/validar testes | Garantir que a correção não quebre nada |

---

## ⚠️ Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Erro em camada inferior (ex: DB query) | Média | Alto | `depurador` + logs de SQL |
| Validação insuficiente de entrada | Alta | Médio | Forçar conversão explícita para float/int |
| Conflito com cache ou Redis | Baixa | Médio | Limpar cache após correção |
| Regressão em outras rotas de dieta | Baixa | Alto | Testar rotas relacionadas após correção |

---

## 📝 Notas Adicionais
- O usuário já aplicou duas correções manuais — mas o 500 persiste. Isso sugere que o erro está em outro ponto do fluxo (ex: `substitution_service.py` → `calculate_substitutions()` → `get_nutritional_profile()`).
- Script de teste já existe: `scripts/test-substitution-service.py` — deve ser executado após cada correção.
- Orquestrador deve **suspender** após T1.x e aguardar aprovação do usuário antes de prosseguir.

---

## 📊 Progresso

| Data | Status | Observações |
|------|--------|-------------|
| 2026-02-18 | 📝 | Plano criado — aguardando aprovação |

---

## ✅ Checklist Final (para quando concluído)
- [ ] Código corrigido e testado
- [ ] Testes unitários/E2E passando
- [ ] Log de erro removido ou tratado
- [ ] Documentação mínima no código (comentários)
- [ ] Aprovação explícita do usuário para commit/deploy

---

> 🔴 **REGRA DO ORQUESTRADOR:**  
> Este plano **DEVE** ser aprovado pelo usuário antes de qualquer agente ser invocado.  
> Após aprovação:  
> 1. Orquestrador invoca `explorador-codigo` → `depurador` → `analista-dados-nutricionais`  
> 2. Aguarda resultados  
> 3. Apresenta recomendação de correção  
> 4. Solicita aprovação novamente  
> 5. Executa correção  
> 6. Valida e solicita aprovação final para deploy
