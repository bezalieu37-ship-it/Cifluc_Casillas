import {
  PI, degToRad, radToDeg, arredondar,
  calcularRPM, calcularVC, calcularAvancoMmMin, calcularAvancoFresa,
  calcularDiametroPrimitivoEngrenagem, calcularDiametroExternoEngrenagem,
  calcularDentesPorDiametroExterno,
  calcularHipotenusa, calcularAnguloPorCatetos,
  calcularCoordenadaX, calcularCoordenadaY,
  calcularRaioPolar, calcularAnguloPolar,
  limitarValor,
} from '../mathHelpers';

describe('mathHelpers', () => {

  // ── Constantes e conversão de ângulos ─────────────────────
  describe('PI', () => {
    test('PI é o valor correto de pi', () => {
      expect(PI).toBe(Math.PI);
      expect(PI).toBeCloseTo(3.14159, 4);
    });
  });

  describe('degToRad / radToDeg', () => {
    test('0 graus = 0 rad', () => {
      expect(degToRad(0)).toBe(0);
      expect(radToDeg(0)).toBe(0);
    });

    test('90 graus = π/2 rad', () => {
      expect(degToRad(90)).toBeCloseTo(Math.PI / 2, 10);
    });

    test('π rad = 180 graus', () => {
      expect(radToDeg(Math.PI)).toBeCloseTo(180, 10);
    });

    test('ciclo completo: 360 graus = 2π rad', () => {
      expect(degToRad(360)).toBeCloseTo(2 * Math.PI, 10);
    });

    test('tratamento de string numérica', () => {
      expect(degToRad('45')).toBeCloseTo(Math.PI / 4, 10);
    });

    test('valor não numérico → NaN propagado', () => {
      expect(degToRad('abc')).toBeNaN();
    });
  });

  // ── Arredondamento ───────────────────────────────────────
  describe('arredondar', () => {
    test('arredonda para 3 casas por padrão', () => {
      expect(arredondar(3.14159)).toBe(3.142);
    });

    test('arredonda para 2 casas', () => {
      expect(arredondar(3.1456, 2)).toBe(3.15);
    });

    test('arredonda para 0 casas', () => {
      expect(arredondar(3.7, 0)).toBe(4);
    });

    test('NaN/Infinity retorna 0', () => {
      expect(arredondar(NaN)).toBe(0);
      expect(arredondar(Infinity)).toBe(0);
    });

    test('número negativo', () => {
      expect(arredondar(-3.14159)).toBe(-3.142);
    });
  });

  // ── RPM e Vc ─────────────────────────────────────────────
  describe('calcularRPM', () => {
    test('RPM = (1000 × Vc) / (π × D)', () => {
      // Vc=100 m/min, D=50mm → RPM ≈ 636.62
      const rpm = calcularRPM(100, 50);
      expect(rpm).toBeCloseTo(636.62, 0);
    });

    test('D=0 retorna 0', () => {
      expect(calcularRPM(100, 0)).toBe(0);
    });

    test('D negativo retorna 0', () => {
      expect(calcularRPM(100, -10)).toBe(0);
    });

    test('Vc=0 retorna 0', () => {
      expect(calcularRPM(0, 50)).toBe(0);
    });
  });

  describe('calcularVC', () => {
    test('Vc = (π × D × RPM) / 1000', () => {
      // RPM=1000, D=50mm → Vc ≈ 157.08
      const vc = calcularVC(1000, 50);
      expect(vc).toBeCloseTo(157.08, 1);
    });

    test('D=0 retorna 0', () => {
      expect(calcularVC(1000, 0)).toBe(0);
    });

    test('consistência entre RPM→Vc e Vc→RPM', () => {
      const vc = 100;
      const d = 40;
      const rpm = calcularRPM(vc, d);
      const vcVolta = calcularVC(rpm, d);
      expect(vcVolta).toBeCloseTo(vc, 2);
    });
  });

  // ── Avanço ───────────────────────────────────────────────
  describe('calcularAvancoMmMin', () => {
    test('F = RPM × avançoPorVolta', () => {
      expect(calcularAvancoMmMin(1000, 0.2)).toBeCloseTo(200, 5);
    });

    test('valores zero', () => {
      expect(calcularAvancoMmMin(0, 0.2)).toBe(0);
    });
  });

  describe('calcularAvancoFresa', () => {
    test('F = RPM × dentes × fz', () => {
      // 3000 RPM, 4 dentes, fz=0.1 → F=1200
      expect(calcularAvancoFresa(3000, 4, 0.1)).toBeCloseTo(1200, 5);
    });

    test('valores zero', () => {
      expect(calcularAvancoFresa(0, 4, 0.1)).toBe(0);
    });
  });

  // ── Engrenagens ──────────────────────────────────────────
  describe('calcularDiametroPrimitivoEngrenagem', () => {
    test('Dp = m × z', () => {
      // m=2, z=30 → Dp=60
      expect(calcularDiametroPrimitivoEngrenagem(2, 30)).toBe(60);
    });

    test('m=0', () => {
      expect(calcularDiametroPrimitivoEngrenagem(0, 30)).toBe(0);
    });
  });

  describe('calcularDiametroExternoEngrenagem', () => {
    test('De = m × (z + 2)', () => {
      // m=2, z=30 → De=64
      expect(calcularDiametroExternoEngrenagem(2, 30)).toBe(64);
    });
  });

  describe('calcularDentesPorDiametroExterno', () => {
    test('z = round(De/m - 2)', () => {
      expect(calcularDentesPorDiametroExterno(2, 64)).toBe(30);
    });

    test('m=0 retorna 0', () => {
      expect(calcularDentesPorDiametroExterno(0, 64)).toBe(0);
    });
  });

  // ── Trigonometria ────────────────────────────────────────
  describe('calcularHipotenusa', () => {
    test('3-4-5 triangle', () => {
      expect(calcularHipotenusa(3, 4)).toBeCloseTo(5, 5);
    });

    test('catetos zero', () => {
      expect(calcularHipotenusa(0, 0)).toBe(0);
    });
  });

  describe('calcularAnguloPorCatetos', () => {
    test('catetos iguais → 45°', () => {
      expect(calcularAnguloPorCatetos(1, 1)).toBeCloseTo(45, 5);
    });

    test('cateto oposto=0 → 0°', () => {
      expect(calcularAnguloPorCatetos(0, 5)).toBeCloseTo(0, 5);
    });

    test('cateto adjacente=0 → 0 (evita div por zero)', () => {
      expect(calcularAnguloPorCatetos(5, 0)).toBe(0);
    });
  });

  describe('calcularCoordenadaX / calcularCoordenadaY', () => {
    test('ângulo 0° → X=r, Y=0', () => {
      expect(calcularCoordenadaX(10, 0)).toBeCloseTo(10, 5);
      expect(calcularCoordenadaY(10, 0)).toBeCloseTo(0, 5);
    });

    test('ângulo 90° → X=0, Y=r', () => {
      expect(calcularCoordenadaX(10, 90)).toBeCloseTo(0, 5);
      expect(calcularCoordenadaY(10, 90)).toBeCloseTo(10, 5);
    });

    test('ângulo 45° → X=Y=r×cos(45)', () => {
      const expected = 10 * Math.cos(Math.PI / 4);
      expect(calcularCoordenadaX(10, 45)).toBeCloseTo(expected, 5);
      expect(calcularCoordenadaY(10, 45)).toBeCloseTo(expected, 5);
    });
  });

  describe('calcularRaioPolar / calcularAnguloPolar', () => {
    test('ponto (3, 4) → r=5, θ≈53.13°', () => {
      expect(calcularRaioPolar(3, 4)).toBeCloseTo(5, 5);
      expect(calcularAnguloPolar(3, 4)).toBeCloseTo(53.13, 1);
    });

    test('ponto (0, 0) → r=0', () => {
      expect(calcularRaioPolar(0, 0)).toBe(0);
    });
  });

  // ── Limitar ──────────────────────────────────────────────
  describe('limitarValor', () => {
    test('valor dentro do range', () => {
      expect(limitarValor(5, 0, 10)).toBe(5);
    });

    test('valor abaixo do mínimo', () => {
      expect(limitarValor(-5, 0, 10)).toBe(0);
    });

    test('valor acima do máximo', () => {
      expect(limitarValor(15, 0, 10)).toBe(10);
    });

    test('NaN retorna mínimo', () => {
      expect(limitarValor(NaN, 0, 10)).toBe(0);
    });
  });
});
