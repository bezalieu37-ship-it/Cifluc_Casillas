import {
  formatNumber, formatNumberBR, formatMm, formatDeg,
  formatRpm, formatVc, formatFeedRev, formatFeedMin, formatPercent,
  limparNumeroTexto, numeroParaInput,
  montarLinhaRelatorio, montarRelatorioSimples,
  num, n, formatar, formatMM, formatCoord, formatAng, formatarGcode,
  mdc, simplificar, primo,
} from '../formatters';

describe('formatters', () => {

  // ── formatNumber ─────────────────────────────────────────
  describe('formatNumber', () => {
    test('formata para 3 casas por padrão', () => {
      expect(formatNumber(3.14159)).toBe('3.142');
    });

    test('formata para 2 casas', () => {
      expect(formatNumber(3.14159, 2)).toBe('3.14');
    });

    test('NaN retorna 0.000', () => {
      expect(formatNumber(NaN)).toBe('0.000');
    });

    test('Infinity retorna 0.000', () => {
      expect(formatNumber(Infinity)).toBe('0.000');
    });

    test('número negativo', () => {
      expect(formatNumber(-5.678)).toBe('-5.678');
    });
  });

  // ── formatNumberBR ───────────────────────────────────────
  describe('formatNumberBR', () => {
    test('usa vírgula como separador decimal', () => {
      expect(formatNumberBR(3.14)).toBe('3,140');
    });

    test('NaN retorna 0,000', () => {
      expect(formatNumberBR(NaN)).toBe('0,000');
    });
  });

  // ── Formatações com unidade ──────────────────────────────
  describe('formatMm', () => {
    test('adiciona "mm"', () => {
      expect(formatMm(12.5)).toBe('12.500 mm');
    });
  });

  describe('formatDeg', () => {
    test('adiciona "°"', () => {
      expect(formatDeg(45.5)).toBe('45.500°');
    });
  });

  describe('formatRpm', () => {
    test('arredonda e adiciona "rpm"', () => {
      expect(formatRpm(636.62)).toBe('637 rpm');
    });

    test('NaN retorna "0 rpm"', () => {
      expect(formatRpm(NaN)).toBe('0 rpm');
    });
  });

  describe('formatVc', () => {
    test('formata com "m/min"', () => {
      expect(formatVc(100.567)).toBe('100.57 m/min');
    });
  });

  describe('formatFeedRev', () => {
    test('formata com "mm/volta"', () => {
      expect(formatFeedRev(0.2)).toBe('0.200 mm/volta');
    });
  });

  describe('formatFeedMin', () => {
    test('formata com "mm/min"', () => {
      expect(formatFeedMin(200)).toBe('200.00 mm/min');
    });
  });

  describe('formatPercent', () => {
    test('formata com "%"', () => {
      expect(formatPercent(75.5)).toBe('75.50%');
    });
  });

  // ── limparNumeroTexto ────────────────────────────────────
  describe('limparNumeroTexto', () => {
    test('troca vírgula por ponto', () => {
      expect(limparNumeroTexto('3,14')).toBe('3.14');
    });

    test('remove caracteres não numéricos', () => {
      expect(limparNumeroTexto('abc123')).toBe('123');
    });

    test('null/undefined retorna string vazia', () => {
      expect(limparNumeroTexto(null)).toBe('');
      expect(limparNumeroTexto(undefined)).toBe('');
    });

    test('preserva negativo', () => {
      expect(limparNumeroTexto('-5.5')).toBe('-5.5');
    });
  });

  // ── numeroParaInput ──────────────────────────────────────
  describe('numeroParaInput', () => {
    test('formata número para input', () => {
      expect(numeroParaInput(5.5)).toBe('5.500');
    });

    test('NaN retorna string vazia', () => {
      expect(numeroParaInput(NaN)).toBe('');
    });
  });

  // ── Relatório ────────────────────────────────────────────
  describe('montarLinhaRelatorio', () => {
    test('combina nome e valor', () => {
      expect(montarLinhaRelatorio('RPM', '1000')).toBe('RPM: 1000');
    });
  });

  describe('montarRelatorioSimples', () => {
    test('monta relatório com array de strings', () => {
      const result = montarRelatorioSimples('Título', ['Linha 1', 'Linha 2']);
      expect(result).toContain('Título');
      expect(result).toContain('Linha 1');
      expect(result).toContain('Linha 2');
    });

    test('monta relatório com array de objetos', () => {
      const result = montarRelatorioSimples('Título', [{ n: 'RPM', v: '1000' }]);
      expect(result).toContain('RPM: 1000');
    });

    test('inclui terminal se fornecido', () => {
      const result = montarRelatorioSimples('Título', [], 'G01 X10');
      expect(result).toContain('G01 X10');
    });
  });

  // ── Funções utilitárias ──────────────────────────────────
  describe('num / n', () => {
    test('converte para número válido', () => {
      expect(num('5.5')).toBe(5.5);
      expect(n('5.5')).toBe(5.5);
    });

    test('NaN retorna 0', () => {
      expect(num('abc')).toBe(0);
      expect(n(NaN)).toBe(0);
    });
  });

  describe('formatar / formatMM', () => {
    test('formatar retorna 3 casas', () => {
      expect(formatar(3.14)).toBe('3.140');
    });

    test('formatMM retorna com "mm"', () => {
      expect(formatMM(3.14)).toBe('3.140 mm');
    });

    test('formatar NaN retorna "0.000"', () => {
      expect(formatar(NaN)).toBe('0.000');
    });
  });

  describe('formatCoord / formatAng / formatarGcode', () => {
    test('formatCoord retorna 3 casas', () => {
      expect(formatCoord(5.5)).toBe('5.500');
    });

    test('formatAng retorna 2 casas', () => {
      expect(formatAng(45.567)).toBe('45.57');
    });

    test('formatarGcode retorna 3 casas', () => {
      expect(formatarGcode(1.2355)).toBe('1.236');
    });
  });

  // ── MDC e simplificar ────────────────────────────────────
  describe('mdc', () => {
    test('mdc(12, 8) = 4', () => {
      expect(mdc(12, 8)).toBe(4);
    });

    test('mdc(7, 5) = 1 (primos entre si)', () => {
      expect(mdc(7, 5)).toBe(1);
    });

    test('mdc(0, 5) = 5', () => {
      expect(mdc(0, 5)).toBe(5);
    });

    test('negativos são tratados como absolutos', () => {
      expect(mdc(-12, 8)).toBe(4);
    });
  });

  describe('simplificar', () => {
    test('simplifica 12/8 → 3/2', () => {
      expect(simplificar(12, 8)).toEqual({ n: 3, d: 2 });
    });

    test('simplifica 7/5 → 7/5 (já simplificado)', () => {
      expect(simplificar(7, 5)).toEqual({ n: 7, d: 5 });
    });

    test('denominador zero → 0/1', () => {
      expect(simplificar(5, 0)).toEqual({ n: 0, d: 1 });
    });
  });

  // ── Primo ────────────────────────────────────────────────
  describe('primo', () => {
    test('2 é primo', () => {
      expect(primo(2)).toBe(true);
    });

    test('3 é primo', () => {
      expect(primo(3)).toBe(true);
    });

    test('4 não é primo', () => {
      expect(primo(4)).toBe(false);
    });

    test('1 não é primo', () => {
      expect(primo(1)).toBe(false);
    });

    test('0 não é primo', () => {
      expect(primo(0)).toBe(false);
    });

    test('17 é primo', () => {
      expect(primo(17)).toBe(true);
    });

    test('97 é primo', () => {
      expect(primo(97)).toBe(true);
    });

    test('100 não é primo', () => {
      expect(primo(100)).toBe(false);
    });
  });
});
