# PLANO DE AUDITORIA E CORREÇÃO: MOTOR NUTRICIONAL 2026

## 1. ANÁLISE DO PROBLEMA (ROOT CAUSE ANALYSIS)
O erro "Macarrão 0g Carb" indica que o campo `carboidrato_g` está vindo zerado da fonte original ou o script de unificação falhou ao processar o recovery. Como o Arroz Integral funcionou e o Macarrão não, precisamos entender a diferença de processamento entre esses dois "Cereais".

## 2. FASES DE EXECUÇÃO

### FASE 1: AUDITORIA DE DADOS (DOMÍNIO: DEBUGGER)
- [ ] Localizar o item exato "Macarrão, trigo, integral, cozido, drenado, s/ sol" nas tabelas TACO, TBCA e USDA.
- [ ] Verificar os valores de `carboidrato_g` e `energia_kcal` nessas tabelas.
- [ ] Identificar por que o algoritmo de "Data Recovery" não preencheu o valor faltante.

### FASE 2: RECALIBRAÇÃO DE CLÃS E ÂNCORAS (DOMÍNIO: BACKEND-SPECIALIST)
- [ ] Implementar a regra de que NENHUM item do clã `CEREAL_TUBER` pode ter carboidrato zerado se as calorias forem > 50.
- [ ] Refinar a "Lista Negra" de marcas e produtos infantis (Froot Loops, Bisnaguinha) para que sejam categorizados como `ULTRA_PROCESSED` (Nível 4) e excluídos das sugestões de staple.
- [ ] Garantir que o `similarity_score` penalize drasticamente a falta de fibras em substitutos de grãos integrais.

### FASE 3: VALIDAÇÃO (DOMÍNIO: TEST-ENGINEER)
- [ ] Executar script de teste específico para o caso "Macarrão Integral".
- [ ] Verificar se as sugestões agora se limitam a: Batata Doce, Arroz Integral, Quinoa, etc.
- [ ] Rodar auditoria de segurança e lint.

## 3. AGENTES E RESPONSABILIDADES
- **Debugger**: Identificar onde o dado "sumiu".
- **Backend Specialist**: Corrigir o comando `unify_foods` e o motor `nutritional_substitution.py`.
- **Test Engineer**: Validar os resultados e rodar o `checklist.py`.

---
**ESTADO ATUAL**: Aguardando aprovação do usuário para iniciar a execução.
