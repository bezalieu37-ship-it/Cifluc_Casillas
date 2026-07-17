import AsyncStorage from '@react-native-async-storage/async-storage';

const HISTORICO_KEY = '@CIFLUC_CASILLAS_HISTORICO';
const LIMITE_HISTORICO = 50;

function gerarId() {
  return `${Date.now()}_${Math.floor(Math.random() * 100000)}`;
}

function dataAtualFormatada() {
  const agora = new Date();

  const dia = String(agora.getDate()).padStart(2, '0');
  const mes = String(agora.getMonth() + 1).padStart(2, '0');
  const ano = agora.getFullYear();

  const hora = String(agora.getHours()).padStart(2, '0');
  const minuto = String(agora.getMinutes()).padStart(2, '0');

  return `${dia}/${mes}/${ano} ${hora}:${minuto}`;
}

export async function listarHistorico() {
  try {
    const dados = await AsyncStorage.getItem(HISTORICO_KEY);

    if (!dados) {
      return [];
    }

    const lista = JSON.parse(dados);

    if (!Array.isArray(lista)) {
      return [];
    }

    return lista;
  } catch (error) {
    console.log('Erro ao listar histórico:', error);
    return [];
  }
}

export async function salvarHistorico(item) {
  try {
    const listaAtual = await listarHistorico();

    const novoItem = {
      id: gerarId(),
      data: dataAtualFormatada(),
      modulo: item?.modulo || 'Módulo não informado',
      titulo: item?.titulo || 'Cálculo técnico',
      resumo: item?.resumo || '',
      dados: item?.dados || [],
      terminal: item?.terminal || '',
      relatorio: item?.relatorio || ''
    };

    const novaLista = [novoItem, ...listaAtual].slice(0, LIMITE_HISTORICO);

    await AsyncStorage.setItem(HISTORICO_KEY, JSON.stringify(novaLista));

    return {
      ok: true,
      item: novoItem,
      lista: novaLista
    };
  } catch (error) {
    console.log('Erro ao salvar histórico:', error);

    return {
      ok: false,
      item: null,
      lista: [],
      erro: error
    };
  }
}

export async function buscarItemHistorico(id) {
  try {
    const lista = await listarHistorico();

    const item = lista.find((registro) => registro.id === id);

    return item || null;
  } catch (error) {
    console.log('Erro ao buscar item do histórico:', error);
    return null;
  }
}

export async function removerItemHistorico(id) {
  try {
    const listaAtual = await listarHistorico();

    const novaLista = listaAtual.filter((item) => item.id !== id);

    await AsyncStorage.setItem(HISTORICO_KEY, JSON.stringify(novaLista));

    return {
      ok: true,
      lista: novaLista
    };
  } catch (error) {
    console.log('Erro ao remover item do histórico:', error);

    return {
      ok: false,
      lista: [],
      erro: error
    };
  }
}

export async function limparHistorico() {
  try {
    await AsyncStorage.removeItem(HISTORICO_KEY);

    return {
      ok: true,
      lista: []
    };
  } catch (error) {
    console.log('Erro ao limpar histórico:', error);

    return {
      ok: false,
      lista: [],
      erro: error
    };
  }
}

export async function contarHistorico() {
  try {
    const lista = await listarHistorico();

    return lista.length;
  } catch (error) {
    console.log('Erro ao contar histórico:', error);
    return 0;
  }
}

export async function exportarHistoricoTexto() {
  try {
    const lista = await listarHistorico();

    if (lista.length === 0) {
      return 'HISTÓRICO VAZIO';
    }

    const texto = lista.map((item, index) => {
      return (
        `#${index + 1}\n` +
        `Data: ${item.data}\n` +
        `Módulo: ${item.modulo}\n` +
        `Título: ${item.titulo}\n` +
        `Resumo: ${item.resumo}\n` +
        `Terminal:\n${item.terminal}\n` +
        `----------------------------------------`
      );
    }).join('\n\n');

    return (
      `CIFLUC GEMINI CASILLAS\n` +
      `HISTÓRICO DE CÁLCULOS\n\n` +
      `${texto}`
    );
  } catch (error) {
    console.log('Erro ao exportar histórico:', error);
    return 'ERRO AO EXPORTAR HISTÓRICO';
  }
}