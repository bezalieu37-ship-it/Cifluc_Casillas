import { gerarGcode, gerarGcodeRosca } from '../gcodeService';

describe('gcodeService', () => {

  // ── gerarGcode ──────────────────────────────────────────
  describe('gerarGcode', () => {
    const dadosBasicos = { rpm: 1000, x: 10, y: 20, z: 5, zFinal: -10, avanco: 0.2 };

    test('FANUC: contém G21, G90, G99 e M30 no fim', () => {
      const gcode = gerarGcode('Furação', dadosBasicos, 'FANUC');
      expect(gcode).toContain('G21 ; Milímetros');
      expect(gcode).toContain('G90 ; Absoluto');
      expect(gcode).toContain('G99 ; Avanço por volta');
      expect(gcode).toContain('M30 ; Fim do programa');
      expect(gcode).toContain('S1000.000 M03');
    });

    test('SIEMENS: contém G90 e G710', () => {
      const gcode = gerarGcode('Furação', dadosBasicos, 'SIEMENS');
      expect(gcode).toContain('G90 ; Absoluto');
      expect(gcode).toContain('G710 ; Milímetros');
      expect(gcode).toContain('M30 ; Fim do programa');
    });

    test('MITSUBISHI: contém G21 e G90', () => {
      const gcode = gerarGcode('Furação', dadosBasicos, 'MITSUBISHI');
      expect(gcode).toContain('G21 ; Milímetros');
      expect(gcode).toContain('G90 ; Absoluto');
      expect(gcode).toContain('M30 ; Fim do programa');
    });

    test('HAAS: contém G20 (polegadas) e retração em polegadas', () => {
      const gcode = gerarGcode('Furação', dadosBasicos, 'HAAS');
      expect(gcode).toContain('G20 ; Polegadas');
      expect(gcode).toContain('G90 ; Absoluto');
      expect(gcode).toContain('G00 Z0.080 ; Retração');
    });

    test('MACH3: contém G21 e G90', () => {
      const gcode = gerarGcode('Furação', dadosBasicos, 'MACH3');
      expect(gcode).toContain('G21 ; Milímetros');
      expect(gcode).toContain('G90 ; Absoluto');
      expect(gcode).toContain('M30 ; Fim do programa');
    });

    test('header contém tipo e controle', () => {
      const gcode = gerarGcode('Furação', dadosBasicos, 'FANUC');
      expect(gcode).toContain('; CIFLUC CASILLAS - Furação');
      expect(gcode).toContain('; Controle: FANUC');
    });

    test('posicionamento XY e Z aparecem quando dados fornecidos', () => {
      const gcode = gerarGcode('Furação', dadosBasicos, 'FANUC');
      expect(gcode).toContain('G00 X');
      expect(gcode).toContain('Y');
      expect(gcode).toContain('G00 Z');
    });

    test('zFinal e avanco geram corte G01', () => {
      const gcode = gerarGcode('Furação', dadosBasicos, 'FANUC');
      expect(gcode).toContain('G01 Z');
      expect(gcode).toContain('F0.200 ; Corte');
    });

    test('sem dados opcionais não gera linhas vazias', () => {
      const gcode = gerarGcode('Teste', {}, 'FANUC');
      expect(gcode).toContain('; CIFLUC CASILLAS - Teste');
      expect(gcode).not.toContain('SNaN');
      expect(gcode).not.toContain('XNaN');
    });
  });

  // ── gerarGcodeRosca ─────────────────────────────────────
  describe('gerarGcodeRosca', () => {
    const dadosRosca = {
      norma: 'MÉTRICA ISO GROSSA',
      rpm: 500,
      xInicial: 25,
      zInicial: 5,
      xFinal: 22.5,
      zFinal: -20,
      qMinimo: 0.1,
      rSobremetal: 0.05,
      pPassada: 0.1,
      qPassada: 0.05,
      passo: 1.5,
    };

    test('FANUC: contém G76 ciclagem de rosca', () => {
      const gcode = gerarGcodeRosca(dadosRosca, 'FANUC');
      expect(gcode).toContain('G76 P010060');
      expect(gcode).toContain('MÉTRICA ISO GROSSA');
      expect(gcode).toContain('G99 ; Avanço por volta');
      expect(gcode).toContain('M30 ; Fim do programa');
    });

    test('SIEMENS: contém CYCLE97', () => {
      const gcode = gerarGcodeRosca(dadosRosca, 'SIEMENS');
      expect(gcode).toContain('CYCLE97(');
      expect(gcode).toContain('MÉTRICA ISO GROSSA');
    });

    test('MITSUBISHI: contém G72', () => {
      const gcode = gerarGcodeRosca(dadosRosca, 'MITSUBISHI');
      expect(gcode).toContain('G72 P01 Q02');
    });

    test('HAAS: converte mm para polegadas (÷25.4)', () => {
      const gcode = gerarGcodeRosca(dadosRosca, 'HAAS');
      expect(gcode).toContain('G20 ; Polegadas');
      // xInicial=25 → 25/25.4≈0.984
      expect(gcode).toContain('X0.984');
    });

    test('MACH3: contém G32 rosca simples', () => {
      const gcode = gerarGcodeRosca(dadosRosca, 'MACH3');
      expect(gcode).toContain('G32 X');
    });

    test('todos os controladores terminam com M30', () => {
      const controladores = ['FANUC', 'SIEMENS', 'MITSUBISHI', 'HAAS', 'MACH3'];
      for (const ctrl of controladores) {
        const gcode = gerarGcodeRosca(dadosRosca, ctrl);
        expect(gcode).toContain('M30 ; Fim do programa');
      }
    });

    test('todos os controladores têm S + M03 (rotação)', () => {
      const controladores = ['FANUC', 'SIEMENS', 'MITSUBISHI', 'HAAS', 'MACH3'];
      for (const ctrl of controladores) {
        const gcode = gerarGcodeRosca(dadosRosca, ctrl);
        expect(gcode).toContain('S500.000 M03 ; RPM');
      }
    });
  });
});
