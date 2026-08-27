// ==============================================================================
// URNA ELETRÔNICA - SCRIPT COMPLETO DE FUNCIONAMENTO E APURAÇÃO
// ==============================================================================

// Aguarda o HTML carregar completamente na tela antes de executar o script
document.addEventListener('DOMContentLoaded', () => {

    // --------------------------------------------------------------------------
    // BASE DE DADOS E CONTADORES DA ELEIÇÃO
    // --------------------------------------------------------------------------
    let candidatos = {}; 
    let votosCandidatos = {}; 
    let votosBrancos = 0;
    let votosNulos = 0;
    let totalGeralVotos = 0;
    let contadorOrdemCadastro = 0; 

    // --------------------------------------------------------------------------
    // ELEMENTOS DE CONFIGURAÇÃO INICIAL (ETAPA 0)
    // --------------------------------------------------------------------------
    const telaConfiguracao = document.getElementById('tela-configuracao');
    const formConfiguracao = document.getElementById('form-configuracao'); 
    const cfgTopo = document.getElementById('cfg-topo');
    const cfgRodape = document.getElementById('cfg-rodape');
    const textoTopo = document.getElementById('texto-topo');
    const textoRodape = document.getElementById('texto-rodape');

    // --------------------------------------------------------------------------
    // ELEMENTOS DAS TELAS
    // --------------------------------------------------------------------------
    const telaCadastro = document.getElementById('tela-cadastro');
    const telaVotacao = document.getElementById('tela-votacao');
    const telaConcluido = document.getElementById('tela-concluido');
    const telaResultado = document.getElementById('tela-resultado');

    // --------------------------------------------------------------------------
    // ELEMENTOS DE CADASTRO
    // --------------------------------------------------------------------------
    const formCadastro = document.getElementById('form-cadastro');
    const cadNumero = document.getElementById('cad-numero');
    const cadNome = document.getElementById('cad-nome');
    const msgCadastro = document.getElementById('msg-cadastro');
    const btnIniciarEleicao = document.getElementById('btn-iniciar-eleicao');

    // --------------------------------------------------------------------------
    // ELEMENTOS DE VOTAÇÃO
    // --------------------------------------------------------------------------
    const votoNumero = document.getElementById('voto-numero');
    const votoNome = document.getElementById('voto-nome');
    const votoFoto = document.getElementById('voto-foto'); 
    const btnBranco = document.getElementById('btn-branco');
    const btnCorrige = document.getElementById('btn-corrige');
    const btnConfirma = document.getElementById('btn-confirma');
    const btnEncerrar = document.getElementById('btn-encerrar');

    // --------------------------------------------------------------------------
    // ELEMENTOS DO RELATÓRIO FINAL
    // --------------------------------------------------------------------------
    const rankingCandidatos = document.getElementById('ranking-candidatos'); // Elemento <tbody> da tabela
    const totalBranco = document.getElementById('total-branco');
    const totalNulos = document.getElementById('total-nulos');
    const totalGeral = document.getElementById('total-geral');
    const btnReiniciar = document.getElementById('btn-reiniciar');
    const btnPdf = document.getElementById('btn-pdf'); 
    const btnProximoEleitor = document.getElementById('btn-proximo-eleitor');

    // ==========================================================================
    // ETAPA 0: LÓGICA DA TELA DE PERSONALIZAÇÃO
    // ==========================================================================
    if (formConfiguracao) {
        formConfiguracao.addEventListener('submit', (e) => {
            e.preventDefault(); // Bloqueia o recarregamento da página

            // Injeta os textos personalizados nos elementos do Topo e Rodapé
            if (textoTopo && cfgTopo) textoTopo.innerText = cfgTopo.value.trim().toUpperCase();
            if (textoRodape && cfgRodape) textoRodape.innerText = cfgRodape.value.trim().toUpperCase();

            // Executa a mudança física das telas
            if (telaConfiguracao) telaConfiguracao.style.display = 'none';
            if (telaCadastro) telaCadastro.style.display = 'block';
            
            // Coloca o cursor do teclado piscando no primeiro campo do cadastro
            setTimeout(() => {
                if (cadNumero) cadNumero.focus();
            }, 50);
        });
    }

    // ==========================================================================
    // SINTETIZADOR DO SOM DA URNA ("PILILI")
    // ==========================================================================
    function tocarSomUrna() {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        
        try {
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
        } catch (err) {
            console.warn("Áudio não suportado ou bloqueado pelo navegador:", err);
        }
    }

    // ==========================================================================
    // ETAPA 1: LÓGICA DE CADASTRO DE CANDIDATOS
    // ==========================================================================
    if (formCadastro) {
        formCadastro.addEventListener('submit', (e) => {
            e.preventDefault();

            const numero = cadNumero.value.trim();
            const nome = cadNome.value.trim();

            if (!numero || !nome) {
                if (msgCadastro) {
                    msgCadastro.style.color = '#e74c3c';
                    msgCadastro.innerText = "Por favor, preencha o número e o nome do candidato.";
                }
                return;
            }

            if (candidatos[numero]) {
                if (msgCadastro) {
                    msgCadastro.style.color = '#e74c3c';
                    msgCadastro.innerText = "Este número de candidato já foi registrado.";
                }
                return;
            }

            contadorOrdemCadastro++;

            candidatos[numero] = {
                nome: nome,
                ordemFoto: contadorOrdemCadastro
            };
            votosCandidatos[numero] = 0;

            if (msgCadastro) {
                msgCadastro.style.color = '#27ae60';
                msgCadastro.innerText = `Candidato ${nome} (${numero}) cadastrado com sucesso! Foto esperada: foto/${contadorOrdemCadastro}.jpg`;
            }

            formCadastro.reset();
            cadNumero.focus();
        });
    }

    if (btnIniciarEleicao) {
        btnIniciarEleicao.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (Object.keys(candidatos).length === 0) {
                if (msgCadastro) {
                    msgCadastro.style.color = '#e74c3c';
                    msgCadastro.innerText = "Cadastre pelo menos 1 candidato antes de iniciar!";
                }
                return;
            }
            
            iniciarVotacao();
        });
    }

    function iniciarVotacao() {
        if (telaCadastro) telaCadastro.style.display = 'none';
        if (telaVotacao) telaVotacao.style.display = 'block';
        
        limparCamposVoto();
    }

    // ==========================================================================
    // ETAPA 2: LÓGICA DA TELA DE VOTAÇÃO
    // ==========================================================================
    if (votoNumero) {
        votoNumero.addEventListener('input', () => {
            const numDigitado = votoNumero.value.trim();

            if (numDigitado === '') {
                if (votoNome) votoNome.innerText = '...';
                if (votoFoto) votoFoto.style.display = 'none';
                return;
            }

            if (candidatos[numDigitado]) {
                if (votoNome) votoNome.innerText = candidatos[numDigitado].nome;
                if (votoFoto) {
                    votoFoto.src = `foto/${candidatos[numDigitado].ordemFoto}.jpg`;
                    votoFoto.style.display = 'block'; 
                }
            } else {
                if (votoNome) votoNome.innerText = 'VOTO NULO (Candidato não encontrado)';
                if (votoFoto) votoFoto.style.display = 'none'; 
            }
        });
    }

    if (btnBranco) {
        btnBranco.addEventListener('click', (e) => {
            e.preventDefault();
            if (votoNumero) {
                votoNumero.value = '';
                votoNumero.disabled = true;
            }
            if (votoNome) votoNome.innerText = 'VOTO EM BRANCO';
            if (votoFoto) votoFoto.style.display = 'none'; 
        });
    }

    if (btnCorrige) {
        btnCorrige.addEventListener('click', (e) => {
            e.preventDefault();
            limparCamposVoto();
        });
    }

    if (btnConfirma) {
        btnConfirma.addEventListener('click', (e) => {
            e.preventDefault();
            const numVoto = votoNumero ? votoNumero.value.trim() : '';
            const textoNome = votoNome ? votoNome.innerText : '';

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

            if (telaVotacao) telaVotacao.style.display = 'none';
            if (telaConcluido) telaConcluido.style.display = 'block';
        });
    }

    function limparCamposVoto() {
        if (votoNumero) {
            votoNumero.value = '';
            votoNumero.disabled = false;
            votoNumero.focus();
        }
        if (votoNome) votoNome.innerText = '...';
        if (votoFoto) votoFoto.style.display = 'none'; 
    }

    // ==========================================================================
    // ETAPA: LÓGICA DO PRÓXIMO ELEITOR
    // ==========================================================================
    if (btnProximoEleitor) {
        btnProximoEleitor.addEventListener('click', (e) => {
            e.preventDefault();
            limparCamposVoto();
            
            if (telaConcluido) telaConcluido.style.display = 'none';
            if (telaVotacao) telaVotacao.style.display = 'block';
        });
    }

    // ==========================================================================
    // ETAPA 3: ENCERRAMENTO E RELATÓRIO FINAL ORGANIZADO EM COLUNAS
    // ==========================================================================
    if (btnEncerrar) {
        btnEncerrar.addEventListener('click', (e) => {
            e.preventDefault();
            const confirmar = confirm("Tem certeza de que deseja encerrar a votação e gerar o relatório final?");
            if (!confirmar) return;

            if (telaVotacao) telaVotacao.style.display = 'none';
            if (telaConcluido) telaConcluido.style.display = 'none';
            if (telaResultado) telaResultado.style.display = 'block';

            gerarRelatorioFinal();
        });
    }

    function gerarRelatorioFinal() {
        if (!rankingCandidatos) return;
        
        rankingCandidatos.innerHTML = ''; 

        // Converte o objeto de candidatos em Array e ordena em ordem decrescente de votos
        const listaCandidatos = Object.keys(candidatos).map(num => ({
            numero: num,
            nome: candidatos[num].nome,
            votos: votosCandidatos[num] || 0
        })).sort((a, b) => b.votos - a.votos);

        // Renderiza cada candidato em uma linha de tabela com colunas alinhadas
        listaCandidatos.forEach((cand, index) => {
            const perc = totalGeralVotos > 0 ? ((cand.votos / totalGeralVotos) * 100).toFixed(1) : "0.0";
            const tr = document.createElement('tr');

            const eMaiorVotado = index === 0 && cand.votos > 0;
            const badgeEleito = eMaiorVotado ? '<span class="badge-eleito">Eleito</span>' : '';

            tr.innerHTML = `
                <td class="col-center"><strong>${index + 1}º</strong></td>
                <td class="col-numero"><strong>${cand.numero}</strong></td>
                <td class="col-nome">${cand.nome} ${badgeEleito}</td>
                <td class="col-right"><strong>${cand.votos}</strong></td>
                <td class="col-perc">
                    <div class="bar-container">
                        <div class="bar-fill" style="width: ${perc}%;"></div>
                    </div>
                    <span>${perc}%</span>
                </td>
            `;
            rankingCandidatos.appendChild(tr);
        });

        // Atualiza os indicadores do resumo geral
        const percBrancos = totalGeralVotos > 0 ? ((votosBrancos / totalGeralVotos) * 100).toFixed(1) : "0.0";
        const percNulos = totalGeralVotos > 0 ? ((votosNulos / totalGeralVotos) * 100).toFixed(1) : "0.0";

        if (totalBranco) totalBranco.innerText = `${votosBrancos} (${percBrancos}%)`;
        if (totalNulos) totalNulos.innerText = `${votosNulos} (${percNulos}%)`;
        if (totalGeral) totalGeral.innerText = totalGeralVotos;
    }

    // Eventos dos botões do Relatório Final
    if (btnReiniciar) {
        btnReiniciar.addEventListener('click', () => {
            window.location.reload();
        });
    }

    if (btnPdf) {
        btnPdf.addEventListener('click', () => {
            window.print();
        });
    }
});