# Emissor de Tickets de Entrega em Lote

Este é um sistema web extremamente simples, leve e 100% funcional projetado para rodar na nuvem (diretamente no GitHub Pages) ou localmente. O objetivo principal é facilitar ao máximo o preenchimento de dados e a impressão de tickets/notas de entrega em lote, otimizando o uso do papel ao organizar exatamente **4 tickets distintos por folha A4** (em uma grade de 2x2).

## 🚀 Funcionalidades Principais

*   **Tabela Dinâmica Interativa**: Adicione, duplique ou exclua linhas com facilidade. Cada linha representa um ticket individual.
*   **Cálculo Automático**: Preencha apenas o *Peso Bruto* e a *Tara*; o *Líquido* (KG) e as *Toneladas* (T) são calculados automaticamente e em tempo real.
*   **Auto-incremento de Notas**: Configuração inteligente para sugerir o próximo número de nota com base no último inserido.
*   **Foco Inteligente (Teclado)**: Pressione `Enter` para navegar rapidamente entre os campos. Ao chegar no final de um ticket, um novo é criado automaticamente se necessário.
*   **Configurações Globais**: Altere o cabeçalho (Nome da Empresa, CNPJ, Endereço, Telefone) e o Usuário padrão uma única vez, aplicando a todos os tickets.
*   **Controle de Acesso (Login)**: Tela de acesso moderna baseada em sessões com o banco de dados editável (`users.js`). Preenche automaticamente o nome da assinatura do ticket com o usuário autenticado.
*   **Persistência Local (Offline-first)**: Os dados são salvos automaticamente no navegador (`localStorage`). Se fechar a janela ou atualizar a página, nada será perdido.
*   **Backup e Importação (JSON)**: Salve lotes de trabalho em seu computador e recarregue-os quando desejar.
*   **Pré-visualização Fiel**: Painel interativo mostrando em tempo real o layout miniaturizado da folha física A4.
*   **Impressão e Salvamento em PDF Perfeitos**: Regras de impressão CSS (`@media print`) avançadas que ocultam o painel de edição e imprimem exclusivamente os tickets com fontes monoespaçadas, linhas pretas horizontais e divisórias pontilhadas idênticas ao modelo real fornecido.

---

## 💻 Como Executar Localmente

Como o sistema é 100% construído em HTML, CSS e JavaScript puros (sem a necessidade de servidores ou compiladores):

1. Dê um duplo clique no arquivo `index.html` para abrir diretamente no seu navegador.
2. O sistema já está totalmente funcional e pronto para uso!

---

## ☁️ Como Hospedar no GitHub (Grátis e Rápido)

Para colocar o sistema na nuvem de forma gratuita através do **GitHub Pages**:

1. Crie um repositório no seu GitHub (ex: `tickets-entrega`).
2. Faça o upload dos arquivos do projeto (`index.html`, `styles.css`, `app.js`, `users.js`) para a branch principal (geralmente `main`).
3. Vá nas **Configurações (Settings)** do repositório no GitHub.
4. No menu lateral esquerdo, clique em **Pages**.
5. Em **Build and deployment -> Source**, selecione **Deploy from a branch**.
6. Logo abaixo, selecione a branch `main` (ou `master`) e a pasta `/ (root)`. Clique em **Save**.
7. Aguarde de 1 a 2 minutos. O GitHub disponibilizará um link público funcional (ex: `https://seu-usuario.github.io/tickets-entrega/`) onde o sistema estará hospedado 100% funcional.

---

## 🖨️ Instruções para Impressão e Salvamento em PDF

Ao clicar no botão **Imprimir Lote (A4)** ou pressionar `Ctrl + P`:

1. A janela de impressão do seu navegador será aberta.
2. **Importante**: No menu de configurações de impressão:
    *   **Destino**: Selecione a sua impressora física ou escolha **Salvar como PDF** para gerar um arquivo digital.
    *   **Layout**: Certifique-se de que está definido como **Retrato (Portrait)**.
    *   **Margens**: Selecione **Nenhuma (None)** para garantir o alinhamento perfeito de 210mm x 297mm da folha A4 e exibição correta dos tracejados de corte.
    *   **Gráficos de segundo plano (Background graphics)**: Certifique-se de que está **marcado/ativado** para que as linhas e divisores apareçam perfeitamente.
3. Clique em **Imprimir** ou **Salvar**.
