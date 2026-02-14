# Instruções para Corrigir Bordas dos Cards em Todas as Abas

## Problema
As bordas dos cards estão praticamente invisíveis tanto no modo claro como no escuro em todas as abas da aplicação.

## Solução
Aumentar a visibilidade das bordas dos cards alterando a opacidade da borda de 10% para 20%.

## Classes a serem modificadas em todas as abas:

### 1. Classe principal para cards: `glass-panel`
- **Atual:** `border border-white/10`
- **Correção:** `border border-white/20`

### 2. Classe para cards especiais: `glass-card`
- **Atual:** `border border-white/5`
- **Correção:** `border border-white/20`

### 3. Cards com bordas coloridas (ex: `border-primary/20`)
- **Manter a cor mas aumentar a visibilidade geral**
- **Exemplo:** `border-primary/20` pode permanecer mas garantir contraste adequado

## Aplicação em todas as abas:
Essas correções devem ser aplicadas em:
- Página inicial (dashboard)
- Agenda
- Dieta
- Evolução
- Exames
- Chat
- Configurações
- E quaisquer outras abas que contenham cards com classes `glass-panel` ou `glass-card`

## Estilo CSS adicional (se necessário):
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

## Observação
Certifique-se de manter a consistência visual entre todas as abas após aplicar as correções.