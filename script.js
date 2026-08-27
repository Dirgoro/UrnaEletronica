// Base de dados e contadores da eleição
let candidatos = {}; // Armazena chave: número -> valor: { nome, ordemFoto }
let votosCandidatos = {}; // Armazena chave: número -> valor: quantidade de votos
let votosBrancos = 0;
let votosNulos = 0;
let totalGeralVotos = 0;
let contadorOrdemCadastro = 0; // Controla a sequência das fotos (1, 2, 3...)

// Elementos das Telas
const telaCadastro = document.getElementById('tela-cadastro');
const telaVotacao = document.getElementById('tela-votacao');
const telaConcluido = document.getElementById('tela-concluido');
const telaResultado = document.getElementById('tela-resultado');

// Elementos de Cadastro
const formCadastro = document.getElementById('form-cadastro');
const cadNumero = document.getElementById('cad-numero');
const cadNome = document.getElementById('cad-nome');
const msgCadastro = document.getElementById('msg-cadastro');
const btnIniciarEleicao = document.getElementById('btn-iniciar-eleicao');

// Elementos de Votação
const votoNumero = document.getElementById('voto-numero');
const votoNome = document.getElementById('voto-nome');
const votoFoto = document.getElementById('voto-foto'); // Elemento da foto
const btnBranco = document.getElementById('btn-branco');
const btnCorrige = document.getElementById('btn-corrige');
const btnConfirma = document.getElementById('btn-confirma');
const btnEncerrar = document.getElementById('btn-encerrar');

// Elementos do Relatório Final
const rankingCandidatos = document.getElementById('ranking-candidatos');
const totalBranco = document.getElementById('total-branco');
const totalNulos = document.getElementById('total-nulos');
const totalGeral = document.getElementById('total-geral');
const btnReiniciar = document.getElementById('btn-reiniciar');
const btnProximoEleitor = document.getElementById('btn-proximo-eleitor');

// ==========================================
// SINTETIZADOR IDÊNTICO AO CHIP DE SOM DA URNA
// ==========================================
function tocarSomUrna() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const tempoAtual = ctx.currentTime;

    const oscilador = ctx.createOscillator();
    const ganho = ctx.createGain();

    oscilador.type = 'square'; 

    oscilador.frequency.setValueAtTime(1050, tempoAtual);          
    oscilador.frequency.setValueAtTime(1175, tempoAtual + 0.07);   
    oscilador.frequency.setValueAtTime(1320, tempoAtual + 0.14);   
    oscilador.frequency.setValueAtTime(940, tempoAtual + 0.22);    

    ganho.gain.setValueAtTime(0, tempoAtual);
    ganho.gain.linearRampToValueAtTime(0.2, tempoAtual + 0.005);
    ganho.gain.setValueAtTime(0.2, tempoAtual + 1.15);
    ganho.gain.linearRampToValueAtTime(0, tempoAtual + 1.16);

    oscilador.connect(ganho);
    ganho.connect(ctx.destination);

    oscilador.start(tempoAtual);
    oscilador.stop(tempoAtual + 1.17); 
}

// ==========================================
// ETAPA 1: LÓGICA DE CADASTRO DE CANDIDATOS
// ==========================================
formCadastro.addEventListener('submit', (e) => {
    e.preventDefault();

    const numero = cadNumero.value.trim();
    const nome = cadNome.value.trim();

    if (candidatos[numero]) {
        msgCadastro.style.color = '#e74c3c';
        msgCadastro.innerText = "Este número de candidato já foi registrado.";
        return;
    }

    // Incrementa a ordem sequencial para a foto do candidato
    contadorOrdemCadastro++;

    // Salva o candidato associando seu nome à ordem sequencial da foto
    candidatos[numero] = {
        nome: nome,
        ordemFoto: contadorOrdemCadastro
    };
    votosCandidatos[numero] = 0;

    msgCadastro.style.color = '#27ae60';
    msgCadastro.innerText = `Candidato ${nome} (${numero}) cadastrado com sucesso! Foto associada: foto/${contadorOrdemCadastro}.jpg`;

    formCadastro.reset();
    cadNumero.focus();
});

if (btnIniciarEleicao) {
    btnIniciarEleicao.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (Object.keys(candidatos).length === 0) {
            msgCadastro.style.color = '#e74c3c';
            msgCadastro.innerText = "Cadastre pelo menos 1 candidato antes de iniciar!";
            return;
        }
        
        iniciarVotacao();
    });
}

function iniciarVotacao() {
    telaCadastro.style.display = 'none';
    telaVotacao.style.display = 'block';
    
    votoNumero.removeAttribute('disabled');
    votoNumero.value = '';
    votoNome.innerText = '...';
    votoFoto.style.display = 'none'; // Oculta a foto inicialmente
    
    setTimeout(() => {
        votoNumero.focus();
    }, 50);
}

// ==========================================
// ETAPA 2: LÓGICA DA TELA DE VOTAÇÃO
// ==========================================
votoNumero.addEventListener('input', () => {
    const numDigitado = votoNumero.value.trim();

    if (numDigitado === '') {
        votoNome.innerText = '...';
        votoFoto.style.display = 'none';
        return;
    }

    if (candidatos[numDigitado]) {
        votoNome.innerText = candidatos[numDigitado].nome;
        
        // AJUSTADO: Agora busca na pasta "foto" no singular conforme sua estrutura
        votoFoto.src = `foto/${candidatos[numDigitado].ordemFoto}.jpg`;
        votoFoto.style.display = 'block'; // Mostra a imagem do candidato encontrado
    } else {
        votoNome.innerText = 'VOTO NULO (Candidato não encontrado)';
        votoFoto.style.display = 'none'; // Não exibe foto em votos nulos
    }
});

btnBranco.addEventListener('click', (e) => {
    e.preventDefault();
    votoNumero.value = '';
    votoNome.innerText = 'VOTO EM BRANCO';
    votoFoto.style.display = 'none'; // Sem foto para voto em branco
    votoNumero.disabled = true;
});

btnCorrige.addEventListener('click', (e) => {
    e.preventDefault();
    limparCamposVoto();
});

btnConfirma.addEventListener('click', (e) => {
    e.preventDefault();
    const numVoto = votoNumero.value.trim();
    const textoNome = votoNome.innerText;

    if (numVoto === '' && textoNome === '...') {
        alert('Por favor, digite um número ou vote em Branco antes de confirmar.');
        return;
    }

    if (textoNome === 'VOTO EM BRANCO') {
        votosBrancos++;
    } else if (textoNome === 'VOTO NULO (Candidato não encontrado)') {
        votosNulos++;
    } else if (candidatos[numVoto]) {
        votosCandidatos[numVoto]++;
    }

    totalGeralVotos++;
    tocarSomUrna();

    telaVotacao.style.display = 'none';
    telaConcluido.style.display = 'block';
});

function limparCamposVoto() {
    votoNumero.value = '';
    votoNumero.disabled = false;
    votoNome.innerText = '...';
    votoFoto.style.display = 'none'; // Reseta o espaço da foto
    votoNumero.focus();
}

// ==========================================
// ETAPA: LÓGICA DO PRÓXIMO ELEITOR
// ==========================================
btnProximoEleitor.addEventListener('click', (e) => {
    e.preventDefault();
    limparCamposVoto();
    
    telaConcluido.style.display = 'none';
    telaVotacao.style.display = 'block';
    votoNumero.focus();
});

// ==========================================
// ETAPA 3: ENCERRAMENTO E RELATÓRIO FINAL
// ==========================================
btnEncerrar.addEventListener('click', (e) => {
    e.preventDefault();
    const confirmar = confirm("Tem certeza de que deseja encerrar a votação e gerar o relatório final?");
    if (!confirmar) return;

    telaVotacao.style.display = 'none';
    telaResultado.style.display = 'block';

    gerarRelatorioFinal();
});

function gerarRelatorioFinal() {
    rankingCandidatos.innerHTML = ''; 

    const listaOrdenada = Object.keys(votosCandidatos).map(numero => {
        return {
            numero: numero,
            nome: candidatos[numero].nome,
            votos: votosCandidatos[numero]
        };
    });

    listaOrdenada.sort((a, b) => b.votos - a.votos);

    if (listaOrdenada.length === 0) {
        rankingCandidatos.innerHTML = '<p>Nenhum candidato cadastrado na eleição.</p>';
    } else {
        listaOrdenada.forEach((cand, index) => {
            const p = document.createElement('p');
            p.innerHTML = `<strong>${index + 1}º Lugar:</strong> ${cand.nome} (Nº ${cand.numero}) — <span>${cand.votos} voto(s)</span>`;
            rankingCandidatos.appendChild(p);
        });
    }

    totalBranco.innerText = votosBrancos;
    totalNulos.innerText = votosNulos;
    totalGeral.innerText = totalGeralVotos;
}

btnReiniciar.addEventListener('click', (e) => {
    e.preventDefault();
    candidatos = {};
    votosCandidatos = {};
    votosBrancos = 0;
    votosNulos = 0;
    totalGeralVotos = 0;
    contadorOrdemCadastro = 0; // Reseta a contagem de fotos para a nova eleição

    limparCamposVoto();
    msgCadastro.innerText = '';
    
    telaResultado.style.display = 'none';
    telaCadastro.style.display = 'block';
    cadNumero.focus();
});
