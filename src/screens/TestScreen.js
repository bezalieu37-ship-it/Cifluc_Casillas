import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { getCasillasStyles } from '../components/CasillasLayout';

// ── Todas as funções de cálculo ──────────────────────────
import {
  PI, degToRad, radToDeg, arredondar,
  calcularRPM, calcularVC, calcularAvancoMmMin, calcularAvancoFresa,
  calcularDiametroPrimitivoEngrenagem, calcularDiametroExternoEngrenagem,
  calcularDentesPorDiametroExterno,
  calcularHipotenusa, calcularAnguloPorCatetos,
  calcularCoordenadaX, calcularCoordenadaY,
  calcularRaioPolar, calcularAnguloPolar,
  limitarValor,
} from '../utils/mathHelpers';

import {
  formatNumber, formatNumberBR, formatMm, formatDeg,
  formatRpm, formatVc, formatFeedRev, formatFeedMin, formatPercent,
  limparNumeroTexto, numeroParaInput,
  montarLinhaRelatorio, montarRelatorioSimples,
  num, n, formatar, formatMM, formatCoord, formatAng, formatarGcode,
  mdc, simplificar, primo,
} from '../utils/formatters';

import { gerarGcode, gerarGcodeRosca } from '../services/gcodeService';

// ── Framework de testes visual ────────────────────────────
function testar(nome, fn) {
  try {
    const resultado = fn();
    return { nome, passou: true, detalhe: resultado };
  } catch (e) {
    return { nome, passou: false, detalhe: e.message };
  }
}

function expect(valor) {
  return {
    toBe(expected) {
      if (valor !== expected) throw new Error(`Esperado ${expected}, recebido ${valor}`);
    },
    toBeCloseTo(expected, precision = 2) {
      const diff = Math.abs(valor - expected);
      const threshold = Math.pow(10, -precision) / 2;
      if (diff > threshold) throw new Error(`Esperado ~${expected}, recebido ${valor} (diff=${diff})`);
    },
    toContain(substring) {
      if (!String(valor).includes(substring)) {
        throw new Error(`Esperado conter "${substring}" em:\n${String(valor).substring(0, 200)}`);
      }
    },
    toEqual(expected) {
      const a = JSON.stringify(valor);
      const b = JSON.stringify(expected);
      if (a !== b) throw new Error(`Esperado ${b}, recebido ${a}`);
    },
  };
}

// ── Suite completa de testes ──────────────────────────────
function executarTodosOsTestes() {
  const resultados = [];

  // ── MATH HELPERS ─────────────────────────
  resultados.push({ suite: '📐 Math Helpers', testes: [
    testar('PI é π', () => { expect(PI).toBeCloseTo(3.14159, 4); }),
    testar('degToRad(0) = 0', () => { expect(degToRad(0)).toBe(0); }),
    testar('degToRad(90) = π/2', () => { expect(degToRad(90)).toBeCloseTo(Math.PI / 2, 10); }),
    testar('radToDeg(π) = 180', () => { expect(radToDeg(Math.PI)).toBeCloseTo(180, 10); }),
    testar('arredondar(3.14159) = 3.142', () => { expect(arredondar(3.14159)).toBe(3.142); }),
    testar('calcularRPM(100, 50) ≈ 636.62', () => { expect(calcularRPM(100, 50)).toBeCloseTo(636.62, 0); }),
    testar('calcularRPM(100, 0) = 0', () => { expect(calcularRPM(100, 0)).toBe(0); }),
    testar('calcularVC(1000, 50) ≈ 157.08', () => { expect(calcularVC(1000, 50)).toBeCloseTo(157.08, 1); }),
    testar('RPM↔Vc ida e volta', () => { const vc=100, d=40; expect(calcularVC(calcularRPM(vc,d),d)).toBeCloseTo(vc,2); }),
    testar('calcularAvancoMmMin(1000, 0.2) = 200', () => { expect(calcularAvancoMmMin(1000, 0.2)).toBeCloseTo(200, 5); }),
    testar('calcularAvancoFresa(3000, 4, 0.1) = 1200', () => { expect(calcularAvancoFresa(3000, 4, 0.1)).toBeCloseTo(1200, 5); }),
    testar('Dp(engrenagem) m=2,z=30 → 60', () => { expect(calcularDiametroPrimitivoEngrenagem(2, 30)).toBe(60); }),
    testar('De(engrenagem) m=2,z=30 → 64', () => { expect(calcularDiametroExternoEngrenagem(2, 30)).toBe(64); }),
    testar('Dentes(engrenagem) De=64,m=2 → 30', () => { expect(calcularDentesPorDiametroExterno(2, 64)).toBe(30); }),
    testar('Hipotenusa(3,4) = 5', () => { expect(calcularHipotenusa(3, 4)).toBeCloseTo(5, 5); }),
    testar('Ângulo(1,1) = 45°', () => { expect(calcularAnguloPorCatetos(1, 1)).toBeCloseTo(45, 5); }),
    testar('Coord X(10, 0°) = 10', () => { expect(calcularCoordenadaX(10, 0)).toBeCloseTo(10, 5); }),
    testar('Coord Y(10, 90°) = 10', () => { expect(calcularCoordenadaY(10, 90)).toBeCloseTo(10, 5); }),
    testar('RaioPolar(3,4) = 5', () => { expect(calcularRaioPolar(3, 4)).toBeCloseTo(5, 5); }),
    testar('AnguloPolar(3,4) ≈ 53.13°', () => { expect(calcularAnguloPolar(3, 4)).toBeCloseTo(53.13, 1); }),
    testar('limitar(5, 0, 10) = 5', () => { expect(limitarValor(5, 0, 10)).toBe(5); }),
    testar('limitar(-5, 0, 10) = 0', () => { expect(limitarValor(-5, 0, 10)).toBe(0); }),
    testar('limitar(15, 0, 10) = 10', () => { expect(limitarValor(15, 0, 10)).toBe(10); }),
  ]});

  // ── FORMATTERS ───────────────────────────
  resultados.push({ suite: '🔢 Formatters', testes: [
    testar('formatNumber(3.14159) = "3.142"', () => { expect(formatNumber(3.14159)).toBe('3.142'); }),
    testar('formatNumber(NaN) = "0.000"', () => { expect(formatNumber(NaN)).toBe('0.000'); }),
    testar('formatNumberBR(3.14) = "3,140"', () => { expect(formatNumberBR(3.14)).toBe('3,140'); }),
    testar('formatMm(12.5) = "12.500 mm"', () => { expect(formatMm(12.5)).toBe('12.500 mm'); }),
    testar('formatDeg(45.5) = "45.500°"', () => { expect(formatDeg(45.5)).toBe('45.500°'); }),
    testar('formatRpm(636.62) = "637 rpm"', () => { expect(formatRpm(636.62)).toBe('637 rpm'); }),
    testar('formatVc(100.567) = "100.57 m/min"', () => { expect(formatVc(100.567)).toBe('100.57 m/min'); }),
    testar('formatFeedRev(0.2) = "0.200 mm/volta"', () => { expect(formatFeedRev(0.2)).toBe('0.200 mm/volta'); }),
    testar('formatFeedMin(200) = "200.00 mm/min"', () => { expect(formatFeedMin(200)).toBe('200.00 mm/min'); }),
    testar('formatPercent(75.5) = "75.50%"', () => { expect(formatPercent(75.5)).toBe('75.50%'); }),
    testar('limparNumero("3,14") = "3.14"', () => { expect(limparNumeroTexto('3,14')).toBe('3.14'); }),
    testar('limparNumero(null) = ""', () => { expect(limparNumeroTexto(null)).toBe(''); }),
    testar('numeroParaInput(5.5) = "5.500"', () => { expect(numeroParaInput(5.5)).toBe('5.500'); }),
    testar('num("5.5") = 5.5', () => { expect(num('5.5')).toBe(5.5); }),
    testar('formatar(3.14) = "3.140"', () => { expect(formatar(3.14)).toBe('3.140'); }),
    testar('formatMM(3.14) = "3.140 mm"', () => { expect(formatMM(3.14)).toBe('3.140 mm'); }),
    testar('formatarGcode(1.2355) = "1.236"', () => { expect(formatarGcode(1.2355)).toBe('1.236'); }),
    testar('mdc(12, 8) = 4', () => { expect(mdc(12, 8)).toBe(4); }),
    testar('simplificar(12, 8) = 3/2', () => { expect(simplificar(12, 8)).toEqual({ n: 3, d: 2 }); }),
    testar('primo(2) = true', () => { expect(primo(2)).toBe(true); }),
    testar('primo(4) = false', () => { expect(primo(4)).toBe(false); }),
    testar('primo(97) = true', () => { expect(primo(97)).toBe(true); }),
    testar('montarLinha("RPM","1000")', () => { expect(montarLinhaRelatorio('RPM', '1000')).toBe('RPM: 1000'); }),
  ]});

  // ── GCODE SERVICE ────────────────────────
  resultados.push({ suite: '⚙️ G-Code Service', testes: [
    testar('FANUC: contém G21, G90, G99', () => {
      const g = gerarGcode('Furação', { rpm: 1000, x: 10, y: 20, z: 5, zFinal: -10, avanco: 0.2 }, 'FANUC');
      expect(g).toContain('G21 ; Milímetros');
      expect(g).toContain('G90 ; Absoluto');
      expect(g).toContain('G99 ; Avanço por volta');
      expect(g).toContain('M30 ; Fim do programa');
    }),
    testar('SIEMENS: contém G90, G710', () => {
      const g = gerarGcode('Furação', { rpm: 1000, x: 10, y: 20 }, 'SIEMENS');
      expect(g).toContain('G90 ; Absoluto');
      expect(g).toContain('G710 ; Milímetros');
    }),
    testar('MITSUBISHI: contém G21, G90', () => {
      const g = gerarGcode('Furação', { rpm: 1000 }, 'MITSUBISHI');
      expect(g).toContain('G21 ; Milímetros');
      expect(g).toContain('G90 ; Absoluto');
    }),
    testar('HAAS: contém G20 (polegadas)', () => {
      const g = gerarGcode('Furação', { rpm: 1000 }, 'HAAS');
      expect(g).toContain('G20 ; Polegadas');
      expect(g).toContain('G00 Z0.080 ; Retração');
    }),
    testar('MACH3: contém G21, M30', () => {
      const g = gerarGcode('Furação', { rpm: 1000 }, 'MACH3');
      expect(g).toContain('G21 ; Milímetros');
      expect(g).toContain('M30 ; Fim do programa');
    }),
    testar('FANUC rosca: contém G76', () => {
      const dados = { norma: 'M12', rpm: 500, xInicial: 25, zInicial: 5, xFinal: 22.5, zFinal: -20, qMinimo: 0.1, rSobremetal: 0.05, pPassada: 0.1, qPassada: 0.05, passo: 1.75 };
      const g = gerarGcodeRosca(dados, 'FANUC');
      expect(g).toContain('G76 P010060');
      expect(g).toContain('MÉTRICA');
    }),
    testar('SIEMENS rosca: contém CYCLE97', () => {
      const dados = { norma: 'M12', rpm: 500, xInicial: 25, zInicial: 5, xFinal: 22.5, zFinal: -20, passo: 1.75 };
      const g = gerarGcodeRosca(dados, 'SIEMENS');
      expect(g).toContain('CYCLE97(');
    }),
    testar('Todos 5 controladores terminam M30', () => {
      const ctrls = ['FANUC','SIEMENS','MITSUBISHI','HAAS','MACH3'];
      for (const c of ctrls) {
        const g = gerarGcodeRosca({ norma:'M12', rpm:500, xInicial:25, zInicial:5, xFinal:22.5, zFinal:-20, passo:1.75 }, c);
        expect(g).toContain('M30 ; Fim do programa');
      }
    }),
  ]});

  // ── I18N INTEGRITY ───────────────────────
  const countLeafKeys = (obj) => {
    let count = 0;
    for (const key of Object.keys(obj)) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        count += countLeafKeys(obj[key]);
      } else {
        count++;
      }
    }
    return count;
  };

  resultados.push({ suite: '🌍 I18N Integrity', testes: [
    testar('PT-BR: 1610 chaves', () => {
      const pt = require('../i18n/pt-BR').default;
      expect(countLeafKeys(pt)).toBe(1610);
    }),
    testar('EN: 1610 chaves', () => {
      const en = require('../i18n/en').default;
      expect(countLeafKeys(en)).toBe(1610);
    }),
    testar('ES: 1610 chaves', () => {
      const es = require('../i18n/es').default;
      expect(countLeafKeys(es)).toBe(1610);
    }),
    testar('FR: 1610 chaves', () => {
      const fr = require('../i18n/fr').default;
      expect(countLeafKeys(fr)).toBe(1610);
    }),
  ]});

  return resultados;
}

// ── Componente de Linha de Teste ──────────────────────────
function TestLinha({ resultado, theme, index }) {
  return (
    <View style={[s.testRow, { borderBottomColor: theme.border }]}>
      <View style={[s.testIcon, { backgroundColor: resultado.passou ? '#00FF7F22' : '#FF444422' }]}>
        <Text style={[s.testIconText, { color: resultado.passou ? theme.green : theme.red }]}>
          {resultado.passou ? '✓' : '✗'}
        </Text>
      </View>
      <View style={s.testInfo}>
        <Text style={[s.testName, { color: theme.text }]} numberOfLines={1}>{resultado.nome}</Text>
        {resultado.detalhe && !resultado.passou && (
          <Text style={[s.testDetail, { color: theme.red }]} numberOfLines={2}>{String(resultado.detalhe)}</Text>
        )}
      </View>
    </View>
  );
}

// ── Componente de Suite ───────────────────────────────────
function TestSuite({ suite, testes, theme, expandido, onToggle }) {
  const passaram = testes.filter((t) => t.passou).length;
  const total = testes.length;
  const todosPassaram = passaram === total;

  return (
    <View style={[s.suiteContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <TouchableOpacity style={s.suiteHeader} onPress={onToggle} activeOpacity={0.7}>
        <View style={s.suiteTitleRow}>
          <Text style={[s.suiteTitle, { color: theme.text }]}>{suite}</Text>
          <View style={[s.suiteBadge, { backgroundColor: todosPassaram ? '#00FF7F22' : '#FF444422' }]}>
            <Text style={[s.suiteBadgeText, { color: todosPassaram ? theme.green : theme.red }]}>
              {passaram}/{total}
            </Text>
          </View>
        </View>
        <View style={[s.progressBar, { backgroundColor: theme.inputBg }]}>
          <View style={[s.progressFill, {
            width: `${(passaram / total) * 100}%`,
            backgroundColor: todosPassaram ? theme.green : theme.yellow,
          }]} />
        </View>
      </TouchableOpacity>

      {expandido && (
        <View style={s.suiteBody}>
          {testes.map((t, i) => (
            <TestLinha key={i} resultado={t} theme={theme} index={i} />
          ))}
        </View>
      )}
    </View>
  );
}

// ── Tela Principal ────────────────────────────────────────
export default function TestScreen() {
  const { theme } = useTheme();
  const s2 = getCasillasStyles(theme);
  const [resultados, setResultados] = useState([]);
  const [expandido, setExpandido] = useState({});
  const [running, setRunning] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const rodarTestes = useCallback(() => {
    setRunning(true);
    setElapsed(0);
    const start = Date.now();
    // Pequeno delay para a UI atualizar antes do loop pesado
    setTimeout(() => {
      const res = executarTodosOsTestes();
      setResultados(res);
      // Expandir todas as suites automaticamente
      const exp = {};
      res.forEach((r, i) => { exp[i] = true; });
      setExpandido(exp);
      setElapsed(Date.now() - start);
      setRunning(false);
    }, 100);
  }, []);

  useEffect(() => { rodarTestes(); }, [rodarTestes]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    rodarTestes();
    setTimeout(() => setRefreshing(false), 500);
  }, [rodarTestes]);

  const totalTestes = resultados.reduce((acc, r) => acc + r.testes.length, 0);
  const totalPassaram = resultados.reduce((acc, r) => acc + r.testes.filter((t) => t.passou).length, 0);
  const totalFalharam = totalTestes - totalPassaram;
  const todosOk = totalFalharam === 0 && totalTestes > 0;

  const toggleSuite = (idx) => {
    setExpandido((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <View style={[s.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={theme.statusBar} backgroundColor={theme.statusBarBg} />

      {/* Header */}
      <View style={[s.header, { backgroundColor: theme.headerBg, borderBottomColor: theme.border }]}>
        <Text style={[s.headerTitle, { color: theme.yellow }]}>🧪 TEST RUNNER</Text>
        <Text style={[s.headerSub, { color: theme.muted }]}>
          {running ? 'Executando...' : totalTestes > 0 ? `${totalTestes} testes em ${elapsed}ms` : ''}
        </Text>
      </View>

      {/* Resumo */}
      {totalTestes > 0 && (
        <View style={[s.summary, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={s.summaryRow}>
            <View style={[s.summaryItem, { borderRightColor: theme.border }]}>
              <Text style={[s.summaryNumber, { color: theme.text }]}>{totalTestes}</Text>
              <Text style={[s.summaryLabel, { color: theme.muted }]}>Total</Text>
            </View>
            <View style={[s.summaryItem, { borderRightColor: theme.border }]}>
              <Text style={[s.summaryNumber, { color: theme.green }]}>{totalPassaram}</Text>
              <Text style={[s.summaryLabel, { color: theme.muted }]}>Passaram</Text>
            </View>
            <View style={s.summaryItem}>
              <Text style={[s.summaryNumber, { color: totalFalharam > 0 ? theme.red : theme.muted }]}>
                {totalFalharam}
              </Text>
              <Text style={[s.summaryLabel, { color: theme.muted }]}>Falharam</Text>
            </View>
          </View>

          {todosOk && (
            <View style={[s.successBanner, { backgroundColor: '#00FF7F15', borderColor: '#00FF7F40' }]}>
              <Text style={[s.successText, { color: theme.green }]}>
                ✅ TODOS OS TESTES PASSARAM
              </Text>
            </View>
          )}

          {!todosOk && totalTestes > 0 && (
            <View style={[s.successBanner, { backgroundColor: '#FF444415', borderColor: '#FF444440' }]}>
              <Text style={[s.successText, { color: theme.red }]}>
                ❌ {totalFalharam} TESTE(S) FALHARAM
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[s.rerunBtn, { backgroundColor: theme.yellow }]}
            onPress={rodarTestes}
            disabled={running}
          >
            <Text style={[s.rerunBtnText, { color: '#000' }]}>
              {running ? '⏳ Rodando...' : '🔄 Re-executar'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Lista de Suites */}
      {running && resultados.length === 0 ? (
        <View style={s.loadingContainer}>
          <Text style={[s.loadingText, { color: theme.yellow }]}>⚙️ Executando testes...</Text>
        </View>
      ) : (
        <ScrollView
          style={s.scroll}
          contentContainerStyle={s.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.yellow}
              colors={[theme.yellow]}
            />
          }
        >
          {resultados.map((r, idx) => (
            <TestSuite
              key={idx}
              suite={r.suite}
              testes={r.testes}
              theme={theme}
              expandido={expandido[idx]}
              onToggle={() => toggleSuite(idx)}
            />
          ))}

          {/* Footer info */}
          <View style={s.footer}>
            <Text style={[s.footerText, { color: theme.muted }]}>
              Rodando via Expo Go no celular
            </Text>
            <Text style={[s.footerText, { color: theme.muted }]}>
              mathHelpers + formatters + gcodeService + i18n
            </Text>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 50,
    paddingBottom: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 20, fontWeight: '900', letterSpacing: 2 },
  headerSub: { fontSize: 12, marginTop: 4, fontFamily: 'monospace' },
  summary: {
    margin: 12,
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
  },
  summaryRow: { flexDirection: 'row' },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    borderRightWidth: 1,
  },
  summaryNumber: { fontSize: 22, fontWeight: '900' },
  summaryLabel: { fontSize: 11, marginTop: 2 },
  successBanner: {
    marginTop: 10,
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
  },
  successText: { fontSize: 14, fontWeight: '800' },
  rerunBtn: {
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  rerunBtnText: { fontSize: 14, fontWeight: '700' },
  scroll: { flex: 1 },
  scrollContent: { padding: 12, paddingBottom: 40 },
  suiteContainer: {
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 10,
    overflow: 'hidden',
  },
  suiteHeader: { padding: 12 },
  suiteTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  suiteTitle: { fontSize: 15, fontWeight: '700' },
  suiteBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  suiteBadgeText: { fontSize: 12, fontWeight: '700', fontFamily: 'monospace' },
  progressBar: { height: 4, borderRadius: 2, marginTop: 8, overflow: 'hidden' },
  progressFill: { height: 4, borderRadius: 2 },
  suiteBody: { borderTopWidth: 1, borderTopColor: '#222' },
  testRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 0.5,
  },
  testIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  testIconText: { fontSize: 13, fontWeight: '900' },
  testInfo: { flex: 1 },
  testName: { fontSize: 13 },
  testDetail: { fontSize: 11, marginTop: 2, fontFamily: 'monospace' },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { fontSize: 16, fontWeight: '700' },
  footer: { alignItems: 'center', paddingVertical: 20 },
  footerText: { fontSize: 11, marginBottom: 4 },
});
