// historico.js - lista de todas as jogadas

function preencher_filtro_jogos() {
  let opcoes = '<option value="">Todos os jogos</option>';
  pegar_jogos().forEach(function (jogo) {
    opcoes += `<option value="${jogo.id}">${jogo.nome}</option>`;
  });
  document.getElementById('filtro-jogo').innerHTML = opcoes;
}

function mostrar_historico() {
  const busca = document.getElementById('busca').value.toLowerCase();
  const resultado = document.getElementById('filtro-resultado').value;
  const jogo_id = document.getElementById('filtro-jogo').value;
  const ordem = document.getElementById('ordem').value;
  const jogadores = pegar_jogadores();
  const jogos = pegar_jogos();

  const lista = pegar_jogadas().filter(function (jogada) {
    const jogador = buscar_por_id(jogadores, jogada.jogador_id);
    if (!jogador.nome.toLowerCase().includes(busca)) return false;
    if (resultado === 'ganhou' && jogada.premio === 0) return false;
    if (resultado === 'perdeu' && jogada.premio > 0) return false;
    if (jogo_id !== '' && jogada.jogo_id !== jogo_id) return false;
    return true;
  });

  if (ordem === 'premio') {
    lista.sort(function (a, b) { return b.premio - a.premio; });
  } else if (ordem === 'aposta') {
    lista.sort(function (a, b) { return b.aposta - a.aposta; });
  } else {
    lista.sort(function (a, b) { return b.data.localeCompare(a.data); });
  }

  let linhas = '';
  lista.forEach(function (jogada) {
    const jogador = buscar_por_id(jogadores, jogada.jogador_id);
    const jogo = buscar_por_id(jogos, jogada.jogo_id);
    let selo = '<span class="badge status-pendente">Perdeu</span>';
    if (jogada.premio > 0) {
      selo = '<span class="badge status-bloqueado">Ganhou</span>';
    }
    linhas += `
      <tr>
        <td>${formatar_data(jogada.data)}</td>
        <td>${jogador.nome}</td>
        <td>${jogo.nome}</td>
        <td>${formatar_dinheiro(jogada.aposta)}</td>
        <td>${formatar_dinheiro(jogada.premio)}</td>
        <td>${selo}</td>
      </tr>`;
  });

  if (lista.length === 0) {
    linhas = '<tr><td colspan="6">Nenhuma jogada encontrada.</td></tr>';
  }
  document.getElementById('tabela-historico').innerHTML = linhas;
  document.getElementById('contador').textContent = lista.length + ' jogada(s).';
}

preencher_filtro_jogos();
mostrar_historico();
