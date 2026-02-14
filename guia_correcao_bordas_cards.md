# Guia de Correção: Visibilidade das Bordas dos Cards

## Problema Identificado
As bordas dos cards na página `http://localhost:3000/patient-dashboard-v2` estão praticamente invisíveis tanto no modo claro quanto no escuro.

## Análise Comparativa
Após análise comparativa com os modelos padrão, identificamos que:

- **Modelos Padrão**: Usam `border border-white/10` (10% de opacidade)
- **Página Atual**: Usa classes semelhantes mas com valores que resultam em baixa visibilidade

## Solução Proposta
Aumentar a visibilidade das bordas alterando a opacidade da cor da borda de 10% para 20%.

## Arquivos Afetados
O código-fonte está localizado em: `frontend/src/app/patient-dashboard-v2/page.tsx` ou componentes relacionados

## Instruções de Correção

### 1. Cards de Métricas (Calorias, Água, Objetivo)
**Localizar classes:** `glass-panel rounded-3xl`
**Alterar de:** `border border-white/10`
**Para:** `border border-white/20`

### 2. Cards de Refeição
**Localizar classes:** `glass-panel p-4 rounded-2xl`
**Alterar de:** `border border-white/10`
**Para:** `border border-white/20`

### 3. Card de Dica do Coach
**Localizar classes:** `rounded-3xl bg-gradient-to-br p-5`
**Alterar de:** `border border-white/10`
**Para:** `border border-white/20`

### 4. Card de Refeição Ativa
**Localizar classes:** `bg-surface border border-primary/20`
**Manter a cor primária mas garantir visibilidade adequada**

### 5. Cards em Outras Seções
**Localizar classes:** `glass-card`
**Alterar de:** `border border-white/5`
**Para:** `border border-white/20`

## Código CSS Alternativo (se necessário)
Se as classes Tailwind não forem suficientes, adicione este CSS:

```css
.glass-panel {
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
}

.glass-card {
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
}

/* Para modo claro */
.light .glass-panel,
.light .glass-card {
  border: 1px solid rgba(0, 0, 0, 0.2) !important;
}
```

## Validação
Após aplicar as correções:

1. Verificar visualmente a visibilidade das bordas em todos os cards
2. Testar tanto no modo claro quanto no escuro
3. Confirmar que as bordas são visíveis em diferentes dispositivos e tamanhos de tela
4. Verificar que a estética geral da interface foi mantida

## Arquivos de Suporte
- `correcao_bordas_cards.css` - Folha de estilos com as correções
- `correcao_bordas_cards.js` - Script para aplicação dinâmica das correções