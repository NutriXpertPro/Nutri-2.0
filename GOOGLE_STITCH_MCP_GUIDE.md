# Guia de Uso do Google Stitch MCP no VS Code

## Configuração Atual

O sistema está configurado corretamente para usar o Google Stitch MCP com as seguintes configurações:

```json
{
    "mcpServers": {
        "stitch": {
            "serverUrl": "https://stitch.googleapis.com/mcp",
            "headers": {
                "X-Goog-Api-Key": "AQ.Ab8RN6JdjcQYxhWzHKwNO5h3usaScSd8esyJCc85EyTPtJ62VA"
            }
        }
    }
}
```

## Como Usar o Google Stitch

### 1. Integração com VS Code
O Google Stitch é um serviço da Google para criação de designers de página e aplicações com integração MCP. Para usá-lo:

1. Certifique-se de que o arquivo `.mcp.json` está na raiz do seu projeto
2. O VS Code deve reconhecer automaticamente o protocolo MCP
3. Ferramentas compatíveis com MCP (como Claude Desktop) irão utilizar esta configuração

### 2. Funcionalidades do Google Stitch
O Google Stitch permite:
- Análise de estrutura de projetos
- Geração de designs de páginas
- Criação de aplicações com interface visual
- Integração com ferramentas de IA através do protocolo MCP

### 3. Uso com Agentes de IA
Os agentes de IA configurados no seu projeto (como o `agent-especialista-em-pagina.md`) estão preparados para usar comandos do tipo:
- `stitch list-files` - para mapear estrutura de arquivos
- `stitch read-file` - para ler conteúdo de arquivos específicos
- `stitch search` - para buscar termos em arquivos

### 4. Configuração do VS Code
Certifique-se de que o VS Code tenha suporte a MCP ativado. Algumas extensões que podem ajudar:
- Extensões compatíveis com MCP
- Claude Desktop (se estiver usando)
- Outras ferramentas de IA que suportem o protocolo MCP

## Importante
- Mantenha sua chave de API segura
- O Google Stitch é um serviço pago da Google
- Verifique a disponibilidade do serviço na sua região