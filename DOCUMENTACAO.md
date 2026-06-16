# Documentação do Sistema de Impressão de Tickets em Lote

Este documento registra todas as funcionalidades, melhorias, correções de bugs e especificações técnicas implementadas no sistema de emissão de tickets.

---

## 🚀 1. Funcionalidades Gerais do Sistema

O sistema é uma aplicação web de página única (Single Page Application - SPA) desenvolvida para rodar diretamente no navegador (cliente) ou hospedada em nuvem (como no GitHub Pages). Ele automatiza o gerenciamento de lotes de notas de entrega, garantindo **impressão de 4 tickets distintos por folha A4** (grade de 2x2).

### Principais Recursos:
*   **Gerenciador em Tabela**: Digitação dinâmica e compacta em formato de linhas e colunas.
*   **Cálculo de Peso Líquido e Toneladas**: O peso líquido e as toneladas são calculados de forma automática em tempo real.
*   **Cálculo Automático de Volume (M3)**: O volume do material é calculado de forma automática com base na densidade de mercado para CBUQ (`2.4 t/m³`), utilizando a fórmula: `Volume = Peso Líquido / 2400`.
*   **Sequenciador Automático**: Auto-incremento sequencial do número da nota para novos registros.
*   **Configurações Globais**: Cabeçalho de empresa e emissor (usuário) editáveis em painel lateral único (não é necessário redigitar a cada ticket).
*   **Sistema de Backup (JSON)**: Botões para exportar todo o lote de tickets como arquivo de backup e importá-lo posteriormente.
*   **Navegação Inteligente**: Pressionar a tecla `Enter` navega horizontalmente entre os campos de digitação. No fim de uma linha, cria um novo ticket de forma automática.
*   **Visualização WYSIWYG**: Uma miniatura da folha A4 física que se atualiza na tela em tempo real à medida que o usuário escreve na tabela.

---

## 🐞 2. Bugs Resolvidos e Refinamentos

Para alcançar a fidelidade de 100% com o modelo original do ticket físico, foram resolvidos os seguintes pontos:

1.  **Bug do Esmagamento de Campos (Tabela)**:
    *   *Problema*: O navegador esmagava a largura das colunas da tabela para fazer tudo caber na largura da tela, impossibilitando a leitura e digitação.
    *   *Solução*: Configurado `width: max-content` e `table-layout: fixed` na tabela, permitindo a rolagem horizontal suave e garantindo o tamanho adequado para cada tipo de dado (6 caracteres para nota, 8 para pesos/placa e 20 para textos).
2.  **Adequação de Fontes (Arial/Helvetica)**:
    *   *Problema*: O ticket estava usando fontes monoespaçadas, mas a referência usava uma fonte sem serifa proporcional.
    *   *Solução*: Alterado o padrão para as fontes de impressão comercial **`Arial` e `Helvetica`**.
3.  **Hífen do CNPJ e Quebra de Linha**:
    *   *Problema*: O navegador interpretava o hífen do CNPJ como um ponto de quebra de palavra e quebrava o CNPJ da empresa para a segunda linha.
    *   *Solução*: Aplicado `white-space: nowrap` no nome da empresa, garantindo que o nome e o CNPJ fiquem na mesma linha.
4.  **Linha Sólida Acima da Nota de Entrega**:
    *   *Problema*: Faltava a linha superior preta no topo de cada ticket.
    *   *Solução*: Adicionado `border-top` no título `"NOTA DE ENTREGA"`, enquadrando-o entre duas linhas horizontais.
5.  **Linha Sólida Abaixo das Assinaturas**:
    *   *Problema*: Faltava a linha sólida que delimita a base do ticket abaixo dos nomes dos assinantes.
    *   *Solução*: Inserida uma borda sólida preta na base de cada ticket (`border-bottom` no `.ticket-wrapper`).
6.  **Descolamento da Linha de Corte**:
    *   *Problema*: A linha sólida da base de cada ticket coincidia exatamente com a linha tracejada de corte horizontal do meio da folha, gerando sobreposição.
    *   *Solução*: Reduzido o tamanho da caixa do ticket em 4mm (`height: calc(100% - 4mm)`) e adicionada margem inferior de `4mm`. Agora há um espaçamento em branco perfeito para passar a tesoura.
7.  **Estouro de Página (Impressão em 2 Folhas)**:
    *   *Problema*: Pequenos erros de arredondamento de pixels para milímetros cometidos pelos motores de renderização dos navegadores faziam com que o layout extrapolasse a folha e gerasse uma segunda página em branco.
    *   *Solução*: Reduzida a altura total da página de impressão no CSS de `297mm` para **`296mm`** e configurado o grid da folha com linhas de `1fr 1fr` (50% e 50%). O recuo de 1mm absorve os erros de cálculo do navegador, forçando os 4 tickets a ficarem em **apenas uma página**.
8.  **Remoção de Linha Tracejada Vertical**:
    *   *Problema*: O sistema original exibia uma divisória tracejada vertical que não existia na referência.
    *   *Solução*: Removida do código, mantendo apenas as divisórias horizontais (topo, centro e base).
9.  **Integração do Campo Pedido**:
    *   *Problema*: O pedido saía embutido no complemento.
    *   *Solução*: Separado o preenchimento e programada a quebra de linha automática no ticket para exibir o pedido perfeitamente alinhado abaixo do Complemento.
10. **Assinatura do Motorista Dinâmica**:
    *   *Problema*: O ticket físico exibia apenas o rótulo fixo `MOTORISTA_ASSINATURA_TICKE` no campo destinado à assinatura do motorista. O operador não conseguia digitar o nome do motorista na tabela de edição.
    *   *Solução*: Adicionado um campo de texto "Motorista" na tabela de dados (entre "Placa" e "Destino") e atualizada a renderização dos tickets para imprimir o nome correspondente do motorista (com fallback para "MOTORISTA" se vazio).
11. **Incremento de Horário na Duplicação**:
    *   *Problema*: Ao duplicar um ticket, o sistema mantinha exatamente o mesmo horário do ticket original, exigindo que o operador editasse manualmente a hora de cada novo registro para simular saídas sequenciais.
    *   *Solução*: Programado um incremento automático e aleatório entre 12 e 15 minutos no horário (`time`) do ticket clonado. O cálculo utiliza o objeto `Date` nativo, ajustando automaticamente a data (`date`) para o dia seguinte caso o horário ultrapasse a meia-noite.
12. **Autocompletar Inteligente e Persistente**:
    *   *Problema*: O operador necessitava digitar repetidamente dados comuns que já haviam sido digitados anteriormente (como Clientes, Materiais, Motoristas, Placas, etc.), tornando o preenchimento de lotes demorado.
    *   *Solução*: Implementado um mecanismo de autocompletar inteligente com elementos `<datalist>` do HTML5 em 9 campos de texto. O sistema aprende automaticamente novos termos inseridos e os armazena de forma persistente e independente no `localStorage`, disponibilizando as sugestões instantaneamente à medida que o operador digita, mesmo em dias/sessões posteriores.
13. **Visibilidade do Ícone de Calendário/Relógio**:
    *   *Problema*: Em alguns navegadores baseados em Chromium (como Chrome e Edge), o ícone do calendário/relógio nos inputs de Data e Hora sumia devido ao espaço interno (padding) apertado e à largura reduzida das colunas. Além disso, o ícone nativo ficava pouco visível sobre o tema escuro.
    *   *Solução*: Ajustadas as larguras das colunas de "Data Saída" para `145px` e "Hora Saída" para `100px` no `index.html`. No `styles.css`, reduzimos as margens internas (padding) desses inputs e aplicamos `filter: invert(1)` para tornar os ícones nativos brancos e perfeitamente visíveis no tema escuro.

---

## 📂 3. Estrutura de Arquivos Criados

Os seguintes arquivos compõem o sistema no workspace:
1.  [index.html](file:///c:/Users/wnilo/OneDrive/NILO/PYTHON/TICKET/index.html): Código estrutural da página.
2.  [styles.css](file:///c:/Users/wnilo/OneDrive/NILO/PYTHON/TICKET/styles.css): Folha de estilos (layout e impressão).
3.  [app.js](file:///c:/Users/wnilo/OneDrive/NILO/PYTHON/TICKET/app.js): Lógica de funcionamento em Javascript.
4.  [users.js](file:///c:/Users/wnilo/OneDrive/NILO/PYTHON/TICKET/users.js): Banco de dados local de credenciais.
5.  [README.md](file:///c:/Users/wnilo/OneDrive/NILO/PYTHON/TICKET/README.md): Manual de instruções gerais e deploy.
6.  [DOCUMENTACAO.md](file:///c:/Users/wnilo/OneDrive/NILO/PYTHON/TICKET/DOCUMENTACAO.md): Este documento de registro.

---

## 🔒 4. Controle de Acesso e Login

Foi desenvolvido um sistema de autenticação client-side robusto e simples de configurar:

### Funcionamento:
*   Ao carregar o aplicativo, o sistema verifica se há uma sessão de autenticação ativa (`sessionStorage`).
*   Se o usuário não estiver logado, uma tela de login moderna com efeito de desfoque de vidro (Glassmorphism) e fundo degradê é exibida, bloqueando o acesso ao painel de gerenciamento.
*   Ao inserir credenciais corretas, a tela de login desaparece e o sistema é iniciado de forma automática.
*   **Default de Assinatura Automático**: Ao logar, o sistema de forma inteligente altera o valor do "Usuário Padrão (Assinatura)" nas configurações globais para o nome do usuário logado em letras maiúsculas (ex: `NILO` ou `NAZARE`), poupando ainda mais tempo do operador.
*   **Identificação do Usuário**: É exibido um badge na barra lateral identificando quem está logado, acompanhado de um botão de logout ("Sair").

### Como Editar Usuários e Senhas:
As credenciais estão centralizadas no arquivo [users.js](file:///c:/Users/wnilo/OneDrive/NILO/PYTHON/TICKET/users.js). Para cadastrar novos usuários ou alterar as senhas existentes, basta abrir esse arquivo em qualquer editor de textos e modificar a lista estruturada `USERS_DATABASE`.

#### Exemplo de Estrutura do Arquivo:
```javascript
const USERS_DATABASE = {
    "nilo": "Usina@2026",
    "nazare": "Iza@2026",
    "novo_usuario": "sua_senha_aqui"
};
```

