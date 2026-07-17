export const PI = Math.PI;

export function degToRad(graus) {
  return (Number(graus) * Math.PI) / 180;
}

export function radToDeg(rad) {
  return (Number(rad) * 180) / Math.PI;
}

export function arredondar(value, casas = 3) {
  const n = Number(value);

  if (!isFinite(n)) return 0;

  const fator = Math.pow(10, casas);
  return Math.round(n * fator) / fator;
}

export function calcularRPM(vc, diametro) {
  const v = Number(vc);
  const d = Number(diametro);

  if (!isFinite(v) || !isFinite(d) || d <= 0) return 0;

  return (1000 * v) / (Math.PI * d);
}

export function calcularVC(rpm, diametro) {
  const r = Number(rpm);
  const d = Number(diametro);

  if (!isFinite(r) || !isFinite(d) || d <= 0) return 0;

  return (Math.PI * d * r) / 1000;
}

export function calcularAvancoMmMin(rpm, avancoPorVolta) {
  const r = Number(rpm);
  const f = Number(avancoPorVolta);

  if (!isFinite(r) || !isFinite(f)) return 0;

  return r * f;
}

export function calcularAvancoFresa(rpm, dentes, fz) {
  const r = Number(rpm);
  const z = Number(dentes);
  const f = Number(fz);

  if (!isFinite(r) || !isFinite(z) || !isFinite(f)) return 0;

  return r * z * f;
}

export function calcularDiametroPrimitivoEngrenagem(modulo, dentes) {
  const m = Number(modulo);
  const z = Number(dentes);

  if (!isFinite(m) || !isFinite(z)) return 0;

  return m * z;
}

export function calcularDiametroExternoEngrenagem(modulo, dentes) {
  const m = Number(modulo);
  const z = Number(dentes);

  if (!isFinite(m) || !isFinite(z)) return 0;

  return m * (z + 2);
}

export function calcularDentesPorDiametroExterno(modulo, diametroExterno) {
  const m = Number(modulo);
  const de = Number(diametroExterno);

  if (!isFinite(m) || !isFinite(de) || m <= 0) return 0;

  return Math.round((de / m) - 2);
}

export function calcularHipotenusa(catetoA, catetoB) {
  const a = Number(catetoA);
  const b = Number(catetoB);

  if (!isFinite(a) || !isFinite(b)) return 0;

  return Math.sqrt((a * a) + (b * b));
}

export function calcularAnguloPorCatetos(catetoOposto, catetoAdjacente) {
  const op = Number(catetoOposto);
  const adj = Number(catetoAdjacente);

  if (!isFinite(op) || !isFinite(adj) || adj === 0) return 0;

  return radToDeg(Math.atan(op / adj));
}

export function calcularCoordenadaX(raio, anguloGraus) {
  const r = Number(raio);
  const ang = degToRad(anguloGraus);

  if (!isFinite(r) || !isFinite(ang)) return 0;

  return r * Math.cos(ang);
}

export function calcularCoordenadaY(raio, anguloGraus) {
  const r = Number(raio);
  const ang = degToRad(anguloGraus);

  if (!isFinite(r) || !isFinite(ang)) return 0;

  return r * Math.sin(ang);
}

export function calcularRaioPolar(x, y) {
  const nx = Number(x);
  const ny = Number(y);

  if (!isFinite(nx) || !isFinite(ny)) return 0;

  return Math.sqrt((nx * nx) + (ny * ny));
}

export function calcularAnguloPolar(x, y) {
  const nx = Number(x);
  const ny = Number(y);

  if (!isFinite(nx) || !isFinite(ny)) return 0;

  return radToDeg(Math.atan2(ny, nx));
}

export function limitarValor(value, min, max) {
  const n = Number(value);

  if (!isFinite(n)) return min;

  if (n < min) return min;
  if (n > max) return max;

  return n;
}