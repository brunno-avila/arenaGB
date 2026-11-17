// jogos.js - mostra os jogos do cassino

function mostrar_jogos() {
  const jogadas = pegar_jogadas();
  let cards = '';

  pegar_jogos().forEach(function (jogo) {
    const quantidade = jogadas.filter(function (jogada) {
      return jogada.jogo_id === jogo.id;
    }).length;

    // só jogo ativo tem o botão de jogar
    let botao = '<button class="btn btn-branco w-100" disabled>Em breve</button>';
    if (jogo.status === 'ativo') {
      botao = `<a href="${jogo.pagina}" class="btn btn-vermelho w-100">Jogar</a>`;
    }

    const texto_aposta = jogo.id === 'roleta'
      ? 'Aposta a partir de ' + formatar_dinheiro(jogo.aposta_minima)
      : 'Aposta de ' + formatar_dinheiro(jogo.aposta_minima) + ' a ' + formatar_dinheiro(jogo.aposta_maxima);
    cards += `
      <div class="col-sm-6 col-lg-4">
        <article class="jogo">
          <div class="jogo-capa">${jogo.sigla}</div>
          <div class="jogo-corpo">
            <h2>${jogo.nome}</h2>
            <p>${texto_aposta}<br>${quantidade} jogada(s)</p>
            ${botao}
          </div>
        </article>
      </div>`;
  });

  document.getElementById('lista-jogos').innerHTML = cards;
}

mostrar_jogos();


