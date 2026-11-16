// roleta.js - Roleta da Sorte (caça-níquel 3x3)
// Gira 9 símbolos. Se 3 iguais caírem em uma linha, o jogador ganha a aposta vezes o valor do símbolo.

const jogo = buscar_por_id(pegar_jogos(), 'roleta');

// peso = chance de aparecer (quanto maior, mais comum)
// imagem = foto que aparece na grade
const simbolos = [
  { nome: 'J', peso: 30, paga: 2, imagem: 'img/simbolos/j.png' },
  { nome: 'Q', peso: 25, paga: 3, imagem: 'img/simbolos/q.png' },
  { nome: 'K', peso: 20, paga: 5, imagem: 'img/simbolos/k.png' },
  { nome: 'A', peso: 13, paga: 10, imagem: 'img/simbolos/a.png' },
  { nome: 'BAR', peso: 8, paga: 20, imagem: 'img/simbolos/bar.png' },
  { nome: '7', peso: 4, paga: 50, imagem: 'img/simbolos/sete.png' }
];

// posições da grade:
// 0 1 2
// 3 4 5
// 6 7 8
const linhas = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 4, 8],
  [2, 4, 6]
];

let girando = false;

// sorteia um símbolo respeitando o peso de cada um
function sortear_simbolo() {
  const total = simbolos.reduce(function (soma, simbolo) { return soma + simbolo.peso; }, 0);
  let numero = Math.random() * total;
  for (const simbolo of simbolos) {
    if (numero < simbolo.peso) {
      return simbolo.nome;
    }
    numero -= simbolo.peso;
  }
  return simbolos[0].nome;
}

function imagem_do_simbolo(nome) {
  const simbolo = simbolos.find(function (item) { return item.nome === nome; });
  return simbolo.imagem;
}

// carrega as fotos antes, para a animação não piscar
function carregar_imagens() {
  simbolos.forEach(function (simbolo) {
    const imagem = new Image();
    imagem.src = simbolo.imagem;
  });
}

// cria as 9 casas da grade uma vez só
function criar_grade() {
  let html = '';
  for (let i = 0; i < 9; i++) {
    html += '<div class="celula"><img src="" alt=""></div>';
  }
  document.getElementById('grade').innerHTML = html;
}

// troca a foto de cada casa
function desenhar_grade(resultado) {
  const celulas = document.querySelectorAll('#grade .celula');
  resultado.forEach(function (nome, posicao) {
    const imagem = celulas[posicao].querySelector('img');
    imagem.src = imagem_do_simbolo(nome);
    imagem.alt = 'Símbolo ' + nome;
    celulas[posicao].classList.remove('ganhou');
  });
}

// confere as 5 linhas e soma os prêmios
function calcular_premio(resultado, aposta) {
  let premio = 0;
  let posicoes = [];

  linhas.forEach(function (linha) {
    const a = resultado[linha[0]];
    const b = resultado[linha[1]];
    const c = resultado[linha[2]];
    if (a === b && b === c) {
      const simbolo = simbolos.find(function (item) { return item.nome === a; });
      premio += aposta * simbolo.paga;
      posicoes = posicoes.concat(linha);
    }
  });

  return { premio: premio, posicoes: posicoes };
}

function preencher_jogadores() {
  const atual = document.getElementById('jogador').value;
  let opcoes = '<option value="">Selecione</option>';
  pegar_jogadores().forEach(function (jogador) {
    if (jogador.status === 'ativo') {
      opcoes += `<option value="${jogador.id}">${jogador.nome}</option>`;
    }
  });
  document.getElementById('jogador').innerHTML = opcoes;
  document.getElementById('jogador').value = atual;
}



function mostrar_tabela_premios() {
  let html = '';
  simbolos.slice().reverse().forEach(function (simbolo) {
    const foto = `<img src="${simbolo.imagem}" alt="${simbolo.nome}" class="mini">`;
    html += `<tr><td>${foto}${foto}${foto}</td><td class="align-middle">${simbolo.paga}x</td></tr>`;
  });
  document.getElementById('tabela-premios').innerHTML = html;
}

function mostrar_saldo() {
  const jogador = buscar_por_id(pegar_jogadores(), document.getElementById('jogador').value);
  document.getElementById('saldo-atual').textContent = jogador ? formatar_dinheiro(jogador.saldo) : '-';
}

function girar() {
  if (girando) return;

  const jogadores = pegar_jogadores();
  const jogador = buscar_por_id(jogadores, document.getElementById('jogador').value);
  const aposta = Number(document.getElementById('aposta').value);

  // regras antes de girar
  if (jogo.status !== 'ativo') {
    mostrar_mensagem('Este jogo não está disponível.', 'erro');
    return;
  }
  if (!jogador) {
    mostrar_mensagem('Escolha um jogador.', 'erro');
    return;
  }
  if (jogador.status !== 'ativo') {
    mostrar_mensagem('Só jogadores ativos podem jogar.', 'erro');
    return;
  }
  if (!Number.isFinite(aposta) || aposta < jogo.aposta_minima) {
    mostrar_mensagem('Digite uma aposta de pelo menos ' + formatar_dinheiro(jogo.aposta_minima) + '.', 'erro');
    return;
  }
  if (aposta > jogador.saldo) {
    mostrar_mensagem('Saldo insuficiente.', 'erro');
    return;
  }

  document.getElementById('mensagem').innerHTML = '';

  // a aposta sai do saldo antes de girar
  jogador.saldo = jogador.saldo - aposta;
  salvar_jogadores(jogadores);
  mostrar_saldo();

  const resultado = [];
  for (let i = 0; i < 9; i++) {
    resultado.push(sortear_simbolo());
  }

  girando = true;
  document.getElementById('botao-girar').disabled = true;
  document.getElementById('premio').classList.add('d-none');

  // animação: troca os símbolos rapidamente e para uma coluna de cada vez
  let colunas_paradas = 0;
  const tela = [];
  for (let i = 0; i < 9; i++) {
    tela.push(sortear_simbolo());
  }

  const animacao = setInterval(function () {
    for (let i = 0; i < 9; i++) {
      const coluna = i % 3;
      tela[i] = coluna < colunas_paradas ? resultado[i] : sortear_simbolo();
    }
    desenhar_grade(tela);
  }, 70);

  [600, 900, 1200].forEach(function (tempo) {
    setTimeout(function () {
      colunas_paradas++;
    }, tempo);
  });

  setTimeout(function () {
    clearInterval(animacao);
    desenhar_grade(resultado);
    terminar_giro(jogador.id, aposta, resultado);
  }, 1300);
}

function terminar_giro(jogador_id, aposta, resultado) {
  const conta = calcular_premio(resultado, aposta);

  // pinta de vermelho as casas que formaram linha
  const celulas = document.querySelectorAll('#grade .celula');
  conta.posicoes.forEach(function (posicao) {
    celulas[posicao].classList.add('ganhou');
  });

  const jogadores = pegar_jogadores();
  const jogador = buscar_por_id(jogadores, jogador_id);
  jogador.saldo = jogador.saldo + conta.premio;
  salvar_jogadores(jogadores);

  const jogadas = pegar_jogadas();
  jogadas.push({
    id: novo_id(),
    jogador_id: jogador_id,
    jogo_id: jogo.id,
    aposta: aposta,
    premio: conta.premio,
    data: new Date().toISOString()
  });
  salvar_jogadas(jogadas);

  // o aviso de prêmio só aparece quando ganha
  if (conta.premio > 0) {
    const aviso = document.getElementById('premio');
    aviso.textContent = 'Ganhou ' + formatar_dinheiro(conta.premio);
    aviso.classList.remove('d-none');
  }

  mostrar_saldo();
  girando = false;
  document.getElementById('botao-girar').disabled = false;
}

carregar_imagens();
criar_grade();
preencher_jogadores();
mostrar_tabela_premios();
desenhar_grade(['7', 'BAR', 'A', 'K', '7', 'Q', 'J', 'A', '7']);



