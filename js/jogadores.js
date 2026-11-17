// jogadores.js - cadastrar, listar, editar e excluir jogadores
// e mudar o status: pendente -> ativo -> bloqueado

const formulario = document.getElementById('form-jogador');
const modal_exclusao = new bootstrap.Modal(document.getElementById('modal-exclusao'));
let id_para_excluir = null;

const nomes_status = { pendente: 'Pendente', ativo: 'Ativo', bloqueado: 'Bloqueado' };

function mostrar_jogadores() {
  const busca = document.getElementById('busca').value.toLowerCase();
  const status = document.getElementById('filtro-status').value;
  const ordem = document.getElementById('ordem').value;

  const lista = pegar_jogadores().filter(function (jogador) {
    if (!jogador.nome.toLowerCase().includes(busca)) return false;
    if (status !== '' && jogador.status !== status) return false;
    return true;
  });

  if (ordem === 'saldo') {
    lista.sort(function (a, b) { return b.saldo - a.saldo; });
  } else {
    lista.sort(function (a, b) { return a.nome.localeCompare(b.nome); });
  }

  const tabela = document.getElementById('tabela-jogadores');
  if (lista.length === 0) {
    tabela.innerHTML = '<tr><td colspan="5">Nenhum jogador encontrado.</td></tr>';
    return;
  }

  let linhas = '';
  lista.forEach(function (jogador) {
    linhas += `
      <tr>
        <td>${jogador.nome}</td>
        <td>${jogador.idade}</td>
        <td>${formatar_dinheiro(jogador.saldo)}</td>
        <td><span class="badge status-${jogador.status}">${nomes_status[jogador.status]}</span></td>
        <td class="text-end">${botoes_do_jogador(jogador)}</td>
      </tr>`;
  });
  tabela.innerHTML = linhas;
}

// os botões de status mudam conforme a situação do jogador
function botoes_do_jogador(jogador) {
  let botoes = '';
  if (jogador.status === 'pendente') {
    botoes += `<button class="btn btn-sm btn-preto" onclick="mudar_status('${jogador.id}', 'ativo')">Ativar</button> `;
  }
  if (jogador.status === 'ativo') {
    botoes += `<button class="btn btn-sm btn-vermelho" onclick="mudar_status('${jogador.id}', 'bloqueado')">Bloquear</button> `;
  }
  if (jogador.status === 'bloqueado') {
    botoes += `<button class="btn btn-sm btn-preto" onclick="mudar_status('${jogador.id}', 'ativo')">Desbloquear</button> `;
  }
  botoes += `<button class="btn btn-sm btn-branco" onclick="editar_jogador('${jogador.id}')">Editar</button> `;
  botoes += `<button class="btn btn-sm btn-branco" onclick="pedir_exclusao('${jogador.id}')">Excluir</button>`;
  return botoes;
}

function validar_jogador(nome, idade, saldo) {
  if (nome.length < 3) {
    return 'O nome precisa ter pelo menos 3 letras.';
  }
  if (isNaN(idade)) {
    return 'Informe a idade.';
  }
  if (idade < 18) {
    return 'Proibido para menores de 18 anos.';
  }
  if (idade > 100) {
    return 'Idade inválida.';
  }
  if (isNaN(saldo) || saldo < 0) {
    return 'O saldo não pode ser negativo.';
  }
  if (saldo > 10000) {
    return 'O saldo máximo é R$ 10.000,00.';
  }
  return '';
}

function salvar_jogador(evento) {
  evento.preventDefault();

  const id = document.getElementById('jogador-id').value;
  const nome = document.getElementById('nome').value.trim();
  const idade = parseInt(document.getElementById('idade').value);
  const saldo = parseFloat(document.getElementById('saldo').value);

  const erro = validar_jogador(nome, idade, saldo);
  if (erro !== '') {
    mostrar_mensagem(erro, 'erro');
    return;
  }

  const lista = pegar_jogadores();
  if (id === '') {
    // todo jogador novo começa pendente
    lista.push({ id: novo_id(), nome: nome, idade: idade, saldo: saldo, status: 'pendente' });
    mostrar_mensagem('Jogador cadastrado.', 'ok');
  } else {
    const jogador = buscar_por_id(lista, id);
    jogador.nome = nome;
    jogador.idade = idade;
    jogador.saldo = saldo;
    mostrar_mensagem('Jogador atualizado.', 'ok');
  }

  salvar_jogadores(lista);
  limpar_formulario();
  mostrar_jogadores();
}

function editar_jogador(id) {
  const jogador = buscar_por_id(pegar_jogadores(), id);
  document.getElementById('jogador-id').value = jogador.id;
  document.getElementById('nome').value = jogador.nome;
  document.getElementById('idade').value = jogador.idade;
  document.getElementById('saldo').value = jogador.saldo;

  document.getElementById('titulo-formulario').textContent = 'Editar jogador';
  document.getElementById('botao-salvar').textContent = 'Salvar';
  document.getElementById('botao-cancelar').classList.remove('d-none');
}

function limpar_formulario() {
  formulario.reset();
  document.getElementById('jogador-id').value = '';
  document.getElementById('titulo-formulario').textContent = 'Novo jogador';
  document.getElementById('botao-salvar').textContent = 'Cadastrar';
  document.getElementById('botao-cancelar').classList.add('d-none');
}

// quem já jogou não pode ser excluído (o histórico perderia o nome)
function pedir_exclusao(id) {
  const ja_jogou = pegar_jogadas().some(function (jogada) {
    return jogada.jogador_id === id;
  });
  if (ja_jogou) {
    mostrar_mensagem('Este jogador tem jogadas no histórico. Bloqueie em vez de excluir.', 'erro');
    return;
  }

  const jogador = buscar_por_id(pegar_jogadores(), id);
  id_para_excluir = id;
  document.getElementById('texto-exclusao').textContent = 'Excluir ' + jogador.nome + '?';
  modal_exclusao.show();
}

function confirmar_exclusao() {
  const lista = pegar_jogadores().filter(function (jogador) {
    return jogador.id !== id_para_excluir;
  });
  salvar_jogadores(lista);
  modal_exclusao.hide();
  mostrar_mensagem('Jogador excluído.', 'ok');
  mostrar_jogadores();
}

// só jogador ativo pode jogar
function mudar_status(id, novo_status) {
  const lista = pegar_jogadores();
  const jogador = buscar_por_id(lista, id);
  jogador.status = novo_status;
  salvar_jogadores(lista);
  mostrar_mensagem(jogador.nome + ' agora está ' + nomes_status[novo_status].toLowerCase() + '.', 'ok');
  mostrar_jogadores();
}

formulario.addEventListener('submit', salvar_jogador);
mostrar_jogadores();
