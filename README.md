# 🗳️ Urna Eletrônica - República Federativa do Berreta (v3.0.0)

Um simulador web avançado, panorâmico e responsivo de Urna Eletrônica fortemente inspirado no sistema eleitoral real brasileiro. O projeto conta com etapas de cadastro livre de candidatos, visor expandido de 1000px para nomes completos, carregamento automatizado de fotos, relatório final com ranking percentual monoespaçado e exportação limpa para documento PDF oficial.

---

## 🚀 Funcionalidades e Melhorias da Versão

* **Interface Panorâmica (1000px):** Tela de votação ampliada via CSS com contornos robustos e visores massivos, ideal para exibição imponente e confortável em qualquer monitor.
* **Visor com Nome Completo em Destaque:** Painel dividido (número à esquerda e nome à direita) configurado para forçar letras maiúsculas (caixa alta) e negrito robusto, comportando nomes longos sem quebras de layout.
* **Carregamento Automático de Fotos:** Associa de forma inteligente as imagens dos candidatos baseando-se estritamente na ordem cronológica de inscrição (1º cadastrado = `1.jpg`, 2º cadastrado = `2.jpg`, etc.).
* **Cadastro Livre de Candidatos:** Remoção de limites operacionais, permitindo registrar quantos candidatos forem necessários. O pleito inicia apenas com o comando manual do botão verde "Iniciar Eleição".
* **Áudio Oficial Calibrado ("Pilili"):** Engenharia acústica baseada na `Web Audio API` nativa. Sintetiza ondas quadradas de circuito (`square`) em fluxo contínuo para reproduzir o arpejo exato da urna real (3 bipes curtos e rápidos subindo a escala + 1 bipe longo e grave de encerramento). Não necessita de arquivos `.mp3`.
* **Relatório Final Monoespaçado e Percentual:** Exibe o resultado das eleições com alinhamento milimétrico reta-a-reta utilizando tipografia monoespaçada (`Courier New`). Traz a quantidade de votos e a respectiva porcentagem individual calculada sobre o total geral.
* **Função "Salvar em PDF":** Botão dedicado que aciona o gerenciador de impressão. O CSS conta com regras de mídia `@media print` que limpam o documento na hora de salvar, ocultando botões, fundo cinza, topo e rodapé para cuspir uma folha de apuração limpa e oficial.
* **Fluxo Seguro e Confidencial:** Mensagem intermediária de fim de voto (**FIM**) com botão para preparar e limpar o terminal para o próximo eleitor com total privacidade.

---

## 📁 Estrutura de Arquivos Obrigatória

Para que o carregamento das fotos e as importações funcionem sem erros, mantenha a seguinte árvore de diretórios em seu projeto:

```text
📁 projeto-urna/
│
├── 📁 foto/
│   ├── 📄 1.jpg
│   ├── 📄 2.jpg
│   └── 📄 3.jpg (e assim por diante...)
│
├── 📄 index.html
├── 📄 style.css
├── 📄 script.js
└── 📄 README.md
```

> ⚠️ **Notas Importantes sobre os Arquivos de Imagem:**
> * A pasta deve se chamar exatamente `foto` (no singular e com letras minúsculas).
> * As fotos devem ser renomeadas na sequência numérica exata (`1.jpg`, `2.jpg`, etc.) representando a ordem de cadastro, independente do número que o candidato usará para receber votos.
> * A extensão do arquivo deve ser obrigatoriamente `.jpg` em formato minúsculo.

---

## 🛠️ Como Executar o Simulador

O ecossistema foi construído com tecnologias web nativas standard (**HTML5 purificado, CSS3 modular e JavaScript Vanilla**). O projeto roda localmente sem pacotes, servidores ou instaladores:

1. Salve os códigos atualizados nos arquivos `index.html`, `style.css` e `script.js`.
2. Certifique-se de popular a pasta `foto/` conforme a regra descrita na seção anterior.
3. Clique com o botão direito no arquivo `index.html` e abra-o com o navegador de sua preferência (Google Chrome, Edge, Firefox, Opera ou Safari).

---

## 🖨️ Instruções para Geração de PDF Oficial

Ao encerrar a eleição na urna através do botão administrativo (canto inferior direito) e acessar a tela de resultados:
1. Clique no botão escuro **"Salvar em PDF"**.
2. Na caixa de diálogo de impressão que o seu navegador abrir, localize o campo **"Destino"** (ou Impressora).
3. Selecione a opção **"Salvar como PDF"**.
4. Defina o local de salvamento no seu computador. Graças ao filtro `@media print`, apenas a folha de apuração formatada será impressa.

---

## ⚙️ Tecnologias Utilizadas

* **HTML5 Semântico:** Divisão de fluxos por seções estruturadas invisíveis.
* **CSS3 (Grid Layout & Flexbox):** Organização panorâmica do terminal de 1000px, tabelas de dados milimétricas e regras de ocultação de mídia de impressão.
* **JavaScript (API de Áudio Web Nativa):** Persistência volátil em memória, controle de estados do DOM, bloqueios de segurança contra formulários fantasmas e modulação eletrônica de frequências sonoras analógicas.

---

## 📜 Licença e Propósito

Este projeto é de código aberto e uso livre para fins didáticos, simulações acadêmicas, eleições de grêmios estudantis, votações internas corporativas ou entretenimento.
