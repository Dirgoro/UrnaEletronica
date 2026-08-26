// Armazenamento de dados do sistema
let candidatos = [];
let votosCandidatos = {}; // Estrutura: { numero: total_votos }
let votosBrancos = 0;
let votosNulos = 0;

// Mapeamento dos elementos do HTML
const telaCadastro = document.getElementById('tela-cadastro');
const formCadastro = document.getElementById('form-cadastro');
const cadNumero = document.getElementById('cad-numero');
const cadNome = document.getElementById('cad-nome');
const msgCadastro = document.getElementById('msg-cadastro');

const telaVotacao = document.getElementById('tela-votacao');
const votoNumero = document.getElementById('voto-numero');
const votoNome = document.getElementById('voto-nome');
const btnBranco = document.getElementById('btn-branco');
const btnCorrige = document.getElementById('btn-corrige');
const btnConfirma = document.getElementById('btn-confirma');
const btnEncerrar = document.getElementById('btn-encerrar');

const telaResultado = document.getElementById('tela-resultado');
const rankingCandidatos = document.getElementById('ranking-candidatos');
const totalBranco = document.getElementById('total-branco');
const totalNulos = document.getElementById('total-nulos');
const totalGeral = document.getElementById('total-geral');
const btnReiniciar = document.getElementById('btn-reiniciar');

// ==========================================
// ETAPA 1: FLUXO DE CADASTRO DE CANDIDATOS
// ==========================================
formCadastro.addEventListener('submit', function(e) {
    e.preventDefault();

    const numero = cadNumero.value.trim();
    // Força o nome a ficar em LETRA MAIÚSCULA conforme a regra
    const nome = cadNome.value.trim().toUpperCase();

    // Valida se o número já foi cadastrado
    const numeroExiste = candidatos.some(c => c.numero === numero);
    if (numeroExiste) {
        alert('Este número de candidato já foi registrado!');
        return;
    }

    // Registra o candidato
    candidatos.push({ numero: numero, nome: nome });
    votosCandidatos[numero] = 0; // Inicializa o contador de votos dele

    msgCadastro.textContent = `Candidato ${nome} (${numero}) cadastrado com sucesso!`;
    formCadastro.reset();

    // Verifica o limite máximo de 10 candidatos ou pergunta se quer continuar
    if (candidatos.length >= 10) {
        alert('Limite máximo de 10 candidatos atingido. Iniciando votação!');
        irParaVotacao();
    } else {
        // Sempre perguntando se tem outro candidato para inserir
        const desejaContinuar = confirm(`Candidatos cadastrados: ${candidatos.length}/10\nDeseja inserir outro candidato?`);
        if (!desejaContinuar) {
            irParaVotacao();
        }
    }
});

function irParaVotacao() {
    telaCadastro.style.display = 'none';
    telaVotacao.style.display = 'block';
    votoNumero.focus();
}

// ==========================================
// ETAPA 2: FLUXO DA TELA DE VOTAÇÃO
// ==========================================

// Monitora o retângulo numérico para buscar o candidato em tempo real
votoNumero.addEventListener('input', function() {
    const numeroDigitado = votoNumero.value.trim();

    if (numeroDigitado === "") {
        votoNome.textContent = "...";
        return;
    }

    // Busca o candidato cadastrado
    const candidatoEncontrado = candidatos.find(c => c.numero === numeroDigitado);

    if (candidatoEncontrado) {
        votoNome.textContent = candidatoEncontrado.nome;
    } else {
        // Regra: caso o valor digitado não seja de nenhum candidato, aparece voto nulo
        votoNome.textContent = "VOTO NULO";
    }
});

// Ação do Botão CORRIGE
btnCorrige.addEventListener('click', function() {
    votoNumero.value = "";
    votoNome.textContent = "...";
    votoNumero.focus();
});

// Ação do Botão BRANCO
btnBranco.addEventListener('click', function() {
    votoNumero.value = "";
    votoNome.textContent = "VOTO EM BRANCO";
});

// Ação do Botão CONFIRMA (Armazena o voto)
btnConfirma.addEventListener('click', function() {
    const numeroDigitado = votoNumero.value.trim();
    const textoPainel = votoNome.textContent;

    if (textoPainel === "...") {
        alert("Por favor, digite um número ou vote em Branco antes de confirmar.");
        return;
    }

    // Processa e computa o voto correto
    if (textoPainel === "VOTO EM BRANCO") {
        votosBrancos++;
    } else if (textoPainel === "VOTO NULO") {
        votosNulos++;
    } else {
        // Voto nominal válido
        votosCandidatos[numeroDigitado]++;
    }

    alert("Voto confirmado com sucesso!");
    
    // Limpa a tela para o próximo eleitor
    votoNumero.value = "";
    votoNome.textContent = "...";
    votoNumero.focus();
});

// Encerra a votação e monta o relatório final
btnEncerrar.addEventListener('click', function() {
    if (confirm("Deseja realmente encerrar a votação e ver o relatório final?")) {
        exibirRelatorio();
    }
});

// ==========================================
// ETAPA 3: RELATÓRIO FINAL E RESULTADOS
// ==========================================
function exibirRelatorio() {
    telaVotacao.style.display = 'none';
    telaResultado.style.display = 'block';

    // Limpa listagem anterior do ranking
    rankingCandidatos.innerHTML = "<h3>Resultado dos Candidatos:</h3>";

    // Calcula o total geral de votos computados
    let totalVotosNominais = Object.values(votosCandidatos).reduce((a, b) => a + b, 0);
    let totalGeralVotos = totalVotosNominais + votosBrancos + votosNulos;

    // Gera dinamicamente a lista com o total de votos de cada candidato relacionado
    candidatos.forEach(c => {
        const totalVotosDoCandidato = votosCandidatos[c.numero];
        const p = document.createElement('p');
        p.textContent = `${c.nome} (Nº ${c.numero}): ${totalVotosDoCandidato} voto(s)`;
        rankingCandidatos.appendChild(p);
    });

    // Atualiza os contadores textuais do relatório
    totalBranco.textContent = votosBrancos;
    totalNulos.textContent = votosNulos;
    totalGeral.textContent = totalGeralVotos;
}

// Botão para reiniciar todo o sistema e apagar os dados da memória
btnReiniciar.addEventListener('click', function() {
    if (confirm("Isso apagará todos os dados e candidatos. Continuar?")) {
        candidatos = [];
        votosCandidatos = {};
        votosBrancos = 0;
        votosNulos = 0;
        
        telaResultado.style.display = 'none';
        telaCadastro.style.display = 'block';
        msgCadastro.textContent = "";
    }
});
