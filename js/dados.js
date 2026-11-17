// dados.js - funções usadas em todas as páginas
// Tudo fica salvo no localStorage do navegador.

function ler_lista(chave) {
  const texto = localStorage.getItem(chave);
  if (texto) {
    return JSON.parse(texto);
  }
  return [];
}

function salvar_lista(chave, lista) {
  localStorage.setItem(chave, JSON.stringify(lista));
}

function pegar_jogadores() {
  return ler_lista('jogadores');
}

function pegar_jogos() {
  return ler_lista('jogos');
}

function pegar_jogadas() {
  return ler_lista('jogadas');
}

function salvar_jogadores(lista) {
  salvar_lista('jogadores', lista);
}

function salvar_jogos(lista) {
  salvar_lista('jogos', lista);
}

function salvar_jogadas(lista) {
  salvar_lista('jogadas', lista);
}

function buscar_por_id(lista, id) {
  return lista.find(function (item) {
    return item.id === id;
  });
}

function novo_id() {
  return Date.now().toString() + Math.floor(Math.random() * 1000);
}

function formatar_dinheiro(valor) {
  return 'R$ ' + Number(valor).toFixed(2).replace('.', ',');
}

function formatar_data(texto) {
  const data = new Date(texto);
  return data.toLocaleDateString('pt-BR') + ' ' + data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

// tipo: 'ok' (preto) ou 'erro' (vermelho)
function mostrar_mensagem(texto, tipo) {
  const area = document.getElementById('mensagem');
  area.innerHTML = '<div class="mensagem mensagem-' + tipo + '">' + texto + '</div>';
  setTimeout(function () {
    area.innerHTML = '';
  }, 4000);
}

// dados de exemplo, criados só na primeira vez
function criar_dados_iniciais() {
  if (localStorage.getItem('iniciado')) {
    return;
  }

  salvar_jogadores([
    { id: '1', nome: 'Ana Souza', idade: 25, saldo: 200, status: 'ativo' },
    { id: '2', nome: 'Bruno Lima', idade: 32, saldo: 150, status: 'ativo' },
    { id: '3', nome: 'Carla Mendes', idade: 21, saldo: 80, status: 'pendente' }
  ]);

  salvar_jogos([
    { id: 'roleta', nome: 'Roleta da Sorte', sigla: '7 7 7', pagina: 'roleta.html', aposta_minima: 1, aposta_maxima: 50, status: 'ativo' },
    { id: 'dados', nome: 'Dados', sigla: '6 6', pagina: '', aposta_minima: 1, aposta_maxima: 50, status: 'em breve' },
    { id: 'cartas', nome: 'Cartas', sigla: 'A K', pagina: '', aposta_minima: 1, aposta_maxima: 50, status: 'em breve' }
  ]);

  salvar_jogadas([
    { id: '1', jogador_id: '1', jogo_id: 'roleta', aposta: 10, premio: 0, data: '2026-11-05T19:10:00' },
    { id: '2', jogador_id: '1', jogo_id: 'roleta', aposta: 10, premio: 30, data: '2026-11-05T19:11:00' },
    { id: '3', jogador_id: '2', jogo_id: 'roleta', aposta: 5, premio: 0, data: '2026-11-05T20:02:00' }
  ]);

  localStorage.setItem('iniciado', 'sim');
}

criar_dados_iniciais();
