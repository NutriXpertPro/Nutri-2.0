# Guia Completo: Correção de Bordas dos Cards em Todas as Abas

## Descrição do Problema
As bordas dos cards na aplicação estão praticamente invisíveis tanto no modo claro quanto no escuro em todas as abas.

## Solução Implementada
Aumentar a visibilidade das bordas dos cards alterando a opacidade da borda de valores baixos (5%-10%) para 20%, garantindo visibilidade adequada em todos os modos e contextos.

## Arquivos Criados

### 1. correcao_bordas_globais.css
- Contém estilos CSS globais para corrigir as bordas em todos os componentes
- Aplica correções para diferentes classes de cards (glass-panel, glass-card)
- Inclui ajustes específicos para modo claro e escuro
- Define estilos para bordas coloridas, tracejadas e em diferentes contextos

### 2. aplicar_correcoes_bordas_todas_abas.js
- Script JavaScript para aplicação dinâmica das correções
- Funciona com aplicações React/Next.js que podem ter conteúdo dinâmico
- Inclui observador de mutações para aplicar correções em elementos recém-criados
- Considera mudanças de tema (modo claro/escuro)

## Como Implementar

### Opção 1: CSS Global (Recomendado)
1. Adicione o conteúdo de `correcao_bordas_globais.css` ao seu arquivo CSS global
2. Ou importe o arquivo CSS no componente de layout principal da aplicação

### Opção 2: Script Dinâmico
1. Adicione o script `aplicar_correcoes_bordas_todas_abas.js` ao seu projeto
2. Importe o script no componente principal ou layout que envolve todas as abas
3. O script irá automaticamente aplicar as correções em todos os cards existentes e futuros

## Classes Afetadas
- `.glass-panel` - Ajuste de `border-white/10` para visibilidade equivalente a 20%
- `.glass-card` - Ajuste de `border-white/5` para visibilidade equivalente a 20%
- Classes com bordas coloridas como `.border-primary/10`, `.border-secondary/10`, etc.
- Classes com diferentes tons de cinza e bordas tracejadas

## Validação
Após implementar as correções:

1. Verifique visualmente a visibilidade das bordas em todas as abas
2. Teste tanto no modo claro quanto no escuro
3. Confirme que as bordas são visíveis em diferentes dispositivos e tamanhos de tela
4. Verifique que a estética geral da interface foi mantida
5. Certifique-se de que os cards ainda mantêm seu efeito "glassmorphism"

## Benefícios
- Melhor acessibilidade devido ao aumento do contraste
- Consistência visual entre todas as abas da aplicação
- Melhor experiência do usuário com elementos UI mais definidos
- Conformidade com os modelos padrão estabelecidos