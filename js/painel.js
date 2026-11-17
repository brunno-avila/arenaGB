// painel.js - números calculados a partir das jogadas salvas

function calcular_painel() {
  const jogadas = pegar_jogadas();
  const jogadores = pegar_jogadores();

  let total_apostado = 0;
  let total_premios = 0;
  jogadas.forEach(function (jogada) {
    total_apostado += jogada.aposta;
    total_premios += jogada.premio;
  });

  document.getElementById('total-apostado').textContent = formatar_dinheiro(total_apostado);
  document.getElementById('total-premios').textContent = formatar_dinheiro(total_premios);
  document.getElementById('lucro-casa').textContent = formatar_dinheiro(total_apostado - total_premios);
  document.getElementById('total-jogadas').textContent = jogadas.length;

  // ranking por saldo
  jogadores.sort(function (a, b) { return b.saldo - a.saldo; });
  let linhas = '';
  jogadores.forEach(function (jogador, posicao) {
    const quantidade = jogadas.filter(function (jogada) {
      return jogada.jogador_id === jogador.id;
    }).length;
    linhas += `
      <tr>
        <td>${posicao + 1}</td>
        <td>${jogador.nome}</td>
        <td>${quantidade}</td>
        <td>${formatar_dinheiro(jogador.saldo)}</td>
      </tr>`;
  });
  document.getElementById('tabela-ranking').innerHTML = linhas;
}

calcular_painel();
