# 🗳️ Urna Eletrônica - República Federativa do Berreta

Um simulador web completo e responsivo de Urna Eletrônica inspirado no sistema eleitoral brasileiro. O projeto conta com etapas de cadastro dinâmico de candidatos (sem limite de quantidade), visor expandido para nomes completos, carregamento automatizado de fotos por ordem de inscrição e o som característico ("pilili") sintetizado nativamente via código.

---

## 🚀 Funcionalidades

* **Cadastro Livre de Candidatos:** Permite registrar o número e o nome completo de quantos candidatos desejar, sem travas de limite.
* **Avanço Manual:** Botão "Iniciar Eleição" centralizado para dar início ao pleito apenas quando o gerenciador desejar.
* **Visor da Urna Expandido:** Retângulo maior projetado via CSS para exibir confortavelmente nomes completos em letras maiúsculas (caixa alta) e negrito robusto.
* **Carregamento de Fotos Dinâmico:** Associa de forma automática as fotos dos candidatos baseando-se estritamente na ordem em que foram cadastrados (1º cadastrado = `1.jpg`, 2º cadastrado = `2.jpg`, etc.).
* **Áudio Oficial ("Pilili"):** Reprodução idêntica da assinatura acústica da urna real (arpejo de 3 bipes contínuos ultra rápidos subindo a frequência, emendados com um bipe longo e grave de finalização). Gerado de forma 100% nativa sem arquivos externos `.mp3`.
* **Fluxo Contínuo de Eleitores:** Tela de conclusão de voto (**FIM**) com botão para limpar o visor com segurança e preparar o terminal para o próximo eleitor.
* **Relatório Final com Ranking:** Apresenta o resultado da eleição ordenando os candidatos do mais votado ao menos votado, contabilizando também votos brancos, nulos e o total geral.

---

## 📁 Estrutura de Arquivos

Para que o projeto funcione perfeitamente (especialmente o carregamento de fotos), os arquivos devem estar organizados na mesma pasta seguindo este padrão:

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

> ⚠️ **Importante sobre as fotos:** 
> * A pasta deve se chamar exatamente `foto` (no singular e em letras minúsculas).
> * As imagens devem ser nomeadas sequencialmente em formato numérico (`1.jpg`, `2.jpg`, `3.jpg`, etc.), correspondendo à ordem cronológica de cadastro dos candidatos na tela inicial, independentemente do número de votação escolhido para eles.
> * Certifique-se de que a extensão seja sempre `.jpg` em letras minúsculas.

---

## 🛠️ Como Executar o Projeto

Como o projeto foi desenvolvido utilizando tecnologias web nativas standard (**HTML5, CSS3 e JavaScript Vanilla**), ele não necessita de instaladores ou servidores complexos:

1. Baixe ou clone os arquivos do projeto para o seu computador.
2. Certifique-se de preencher a pasta `foto/` com algumas imagens de teste nomeadas como `1.jpg`, `2.jpg`, etc.
3. Dê um duplo clique no arquivo `index.html` para abri-lo diretamente em qualquer navegador moderno (Google Chrome, Microsoft Edge, Mozilla Firefox, Opera ou Safari).

---

## ⚙️ Tecnologias Utilizadas

* **HTML5:** Estruturação semântica das etapas e painéis da urna.
* **CSS3 (Grid & Flexbox):** Responsividade, alinhamentos complexos do visor dividido e formatação tradicional de documentos eleitorais oficiais (Topo e Rodapé fixos).
* **JavaScript (Web Audio API):** Lógica de persistência em memória dos votos, transição inteligente de telas, manipulação dinâmica da árvore do DOM e síntese de ondas sonoras quadradas para replicação acústica fiel do *buzzer* físico da urna eletrônica.

---

## 📜 Licença

Este projeto é de uso livre para fins didáticos, simulações acadêmicas, eleições internas de organizações ou entretenimento. 

Desenvolvido com carinho para o **Tribunal Eleitoral do Berreta**. 🦅
