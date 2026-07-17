export function isEmpty(value) {
  return value === null || value === undefined || String(value).trim() === '';
}

export function toNumber(value) {
  if (value === null || value === undefined) return 0;

  const cleaned = String(value)
    .replace(',', '.')
    .replace(/[^\d.-]/g, '');

  const n = parseFloat(cleaned);

  return isNaN(n) ? 0 : n;
}

export function isPositiveNumber(value) {
  const n = toNumber(value);
  return n > 0 && isFinite(n);
}

export function isZeroOrPositive(value) {
  const n = toNumber(value);
  return n >= 0 && isFinite(n);
}

export function validarCampoObrigatorio(value, nomeCampo = 'Campo') {
  if (isEmpty(value)) {
    return {
      ok: false,
      mensagem: `${nomeCampo} é obrigatório.`
    };
  }

  return {
    ok: true,
    mensagem: ''
  };
}

export function validarNumeroPositivo(value, nomeCampo = 'Campo') {
  if (isEmpty(value)) {
    return {
      ok: false,
      mensagem: `${nomeCampo} é obrigatório.`
    };
  }

  const n = toNumber(value);

  if (!isFinite(n) || n <= 0) {
    return {
      ok: false,
      mensagem: `${nomeCampo} deve ser maior que zero.`
    };
  }

  return {
    ok: true,
    mensagem: ''
  };
}

export function validarNumeroNaoNegativo(value, nomeCampo = 'Campo') {
  if (isEmpty(value)) {
    return {
      ok: false,
      mensagem: `${nomeCampo} é obrigatório.`
    };
  }

  const n = toNumber(value);

  if (!isFinite(n) || n < 0) {
    return {
      ok: false,
      mensagem: `${nomeCampo} não pode ser negativo.`
    };
  }

  return {
    ok: true,
    mensagem: ''
  };
}

export function validarDivisao(divisor, nomeCampo = 'Divisor') {
  const n = toNumber(divisor);

  if (!isFinite(n) || n === 0) {
    return {
      ok: false,
      mensagem: `${nomeCampo} não pode ser zero.`
    };
  }

  return {
    ok: true,
    mensagem: ''
  };
}

export function validarIntervalo(value, min, max, nomeCampo = 'Campo') {
  const n = toNumber(value);

  if (!isFinite(n)) {
    return {
      ok: false,
      mensagem: `${nomeCampo} inválido.`
    };
  }

  if (n < min || n > max) {
    return {
      ok: false,
      mensagem: `${nomeCampo} deve estar entre ${min} e ${max}.`
    };
  }

  return {
    ok: true,
    mensagem: ''
  };
}

export function validarLista(validacoes = []) {
  for (const item of validacoes) {
    if (!item.ok) {
      return item;
    }
  }

  return {
    ok: true,
    mensagem: ''
  };
}