export function formatNumber(value, casas = 3) {
  const n = Number(value);

  if (!isFinite(n)) {
    return Number(0).toFixed(casas);
  }

  return n.toFixed(casas);
}

export function formatNumberBR(value, casas = 3) {
  const n = Number(value);

  if (!isFinite(n)) {
    return Number(0).toFixed(casas).replace('.', ',');
  }

  return n.toFixed(casas).replace('.', ',');
}

export function formatMm(value, casas = 3) {
  return `${formatNumber(value, casas)} mm`;
}

export function formatDeg(value, casas = 3) {
  return `${formatNumber(value, casas)}°`;
}

export function formatRpm(value) {
  const n = Number(value);

  if (!isFinite(n)) {
    return '0 rpm';
  }

  return `${Math.round(n)} rpm`;
}

export function formatVc(value, casas = 2) {
  return `${formatNumber(value, casas)} m/min`;
}

export function formatFeedRev(value, casas = 3) {
  return `${formatNumber(value, casas)} mm/volta`;
}

export function formatFeedMin(value, casas = 2) {
  return `${formatNumber(value, casas)} mm/min`;
}

export function formatPercent(value, casas = 2) {
  return `${formatNumber(value, casas)}%`;
}

export function limparNumeroTexto(value) {
  if (value === null || value === undefined) return '';

  return String(value)
    .replace(',', '.')
    .replace(/[^\d.-]/g, '');
}

export function numeroParaInput(value, casas = 3) {
  const n = Number(value);

  if (!isFinite(n)) return '';

  return n.toFixed(casas);
}

export function montarLinhaRelatorio(nome, valor) {
  return `${nome}: ${valor}`;
}

export function montarRelatorioSimples(titulo, itens = [], terminal = '') {
  const linhas = itens.map((item) => {
    if (typeof item === 'string') return item;
    return `${item.n}: ${item.v}`;
  });

  return (
    `${titulo}\n\n` +
    `${linhas.join('\n')}\n\n` +
    `${terminal || ''}`
  );
}

// Funções utilitárias duplicadas nos screens
export function num(v) {
  const n = Number(v);
  return isFinite(n) ? n : 0;
}

export function n(v) {
  return num(v);
}

export function formatar(v) {
  const n = Number(v);
  if (!isFinite(n)) return '0.000';
  return n.toFixed(3);
}

export function formatMM(v) {
  return `${formatar(v)} mm`;
}

export function formatCoord(v) {
  const n = Number(v);
  if (!isFinite(n)) return '0.000';
  return n.toFixed(3);
}

export function formatAng(v) {
  const n = Number(v);
  if (!isFinite(n)) return '0.00';
  return n.toFixed(2);
}

export function formatarGcode(v) {
  const n = Number(v);
  if (!isFinite(n)) return '0.000';
  return n.toFixed(3);
}

// Funções matemáticas duplicadas
export function mdc(a, b) {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

export function simplificar(numerador, denominador) {
  if (!denominador) return { n: 0, d: 1 };
  const divisor = mdc(Math.abs(numerador), Math.abs(denominador));
  return {
    n: Math.round(numerador / divisor),
    d: Math.round(denominador / divisor)
  };
}

export function primo(n) {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i * i <= n; i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}