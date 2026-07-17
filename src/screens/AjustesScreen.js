import React, { useEffect, useState } from 'react';

import {
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity
} from 'react-native';

import CasillasLayout, {
  casillasStyles as styles,
  getCasillasStyles
} from '../components/CasillasLayout';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

const SUBABAS = [
  'Cálculo de Ajuste',
  'Escolher Tolerância',
  'Sugestão por Pedido',
  'Consulta ISO'
];

const SUBABA_KEYS = {
  'Cálculo de Ajuste': 'ajustes.tabCalculation',
  'Escolher Tolerância': 'ajustes.tabTolerance',
  'Sugestão por Pedido': 'ajustes.tabRequest',
  'Consulta ISO': 'ajustes.tabIsoLookup'
};

const LETRAS_FURO = ['H', 'G', 'F', 'JS', 'K', 'M', 'N', 'P'];
const LETRAS_EIXO = ['h', 'g', 'f', 'js', 'j', 'k', 'm', 'n', 'p', 's'];
const CLASSES_IT = ['4', '5', '6', '7', '8', '9'];

const DESCRICOES = {
  H: 'ajustes.descH', G: 'ajustes.descG', F: 'ajustes.descF', JS: 'ajustes.descJS',
  K: 'ajustes.descK', M: 'ajustes.descM', N: 'ajustes.descN', P: 'ajustes.descP',
  h: 'ajustes.desch', g: 'ajustes.descg', f: 'ajustes.descf', js: 'ajustes.descjs',
  j: 'ajustes.descj', k: 'ajustes.desck', m: 'ajustes.descm', n: 'ajustes.descn',
  p: 'ajustes.descp', s: 'ajustes.descs'
};

export default function AjustesScreen({ navigation }) {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const s = getCasillasStyles(theme);

  const [subAba, setSubAba] = useState('Cálculo de Ajuste');

  const [diametro, setDiametro] = useState('50.00');
  const [letraFuro, setLetraFuro] = useState('H');
  const [classeFuro, setClasseFuro] = useState('7');
  const [letraEixo, setLetraEixo] = useState('p');
  const [classeEixo, setClasseEixo] = useState('6');

  const [sugestaoTextoKey, setSugestaoTextoKey] = useState('ajustes.suggestionStandardType');
  const [sugestaoPrincipal, setSugestaoPrincipal] = useState('H7/h6');
  const [sugestaoAlternativas, setSugestaoAlternativas] = useState(['H7/g6', 'H7/js6']);
  const [sugestaoMetodoKey, setSugestaoMetodoKey] = useState('ajustes.suggestionStandardMethod');
  const [sugestaoAplicacoesKey, setSugestaoAplicacoesKey] = useState('ajustes.suggestionStandardApplications');
  const [pedido, setPedido] = useState(() => t('ajustes.requestExampleValue'));

  const [resultados, setResultados] = useState([]);
  const [terminal, setTerminal] = useState('');
  const [plano, setPlano] = useState('');
  const [planoAtivo, setPlanoAtivo] = useState(true);

  function num(valor) {
    return parseFloat(String(valor).replace(',', '.')) || 0;
  }

  function mm(valor) {
    if (!isFinite(valor)) return '0.00';
    return valor.toFixed(2);
  }

  function microns(valor) {
    if (!isFinite(valor)) return '0';
    return valor.toFixed(0);
  }

  function toleranciaIT(d, classe) {
    const it = parseInt(classe);

    let base = 0;

    if (d <= 3) base = 1.4;
    else if (d <= 6) base = 1.8;
    else if (d <= 10) base = 2.2;
    else if (d <= 18) base = 2.7;
    else if (d <= 30) base = 3.3;
    else if (d <= 50) base = 4.0;
    else if (d <= 80) base = 4.8;
    else if (d <= 120) base = 5.8;
    else if (d <= 180) base = 7.0;
    else base = 9.0;

    const fator = {
      4: 1,
      5: 1.6,
      6: 2.5,
      7: 4,
      8: 6.3,
      9: 10
    };

    return base * (fator[it] || 4);
  }

  function desvioFuro(letra, it) {
    if (letra === 'H') return { EI: 0, ES: it };
    if (letra === 'G') return { EI: 8, ES: 8 + it };
    if (letra === 'F') return { EI: 20, ES: 20 + it };
    if (letra === 'JS') return { EI: -it / 2, ES: it / 2 };
    if (letra === 'K') return { EI: -4, ES: -4 + it };
    if (letra === 'M') return { EI: -10, ES: -10 + it };
    if (letra === 'N') return { EI: -18, ES: -18 + it };
    if (letra === 'P') return { EI: -30, ES: -30 + it };

    return { EI: 0, ES: it };
  }

  function desvioEixo(letra, it) {
    if (letra === 'h') return { es: 0, ei: -it };
    if (letra === 'g') return { es: -8, ei: -8 - it };
    if (letra === 'f') return { es: -20, ei: -20 - it };
    if (letra === 'js') return { es: it / 2, ei: -it / 2 };
    if (letra === 'j') return { es: 4, ei: 4 - it };
    if (letra === 'k') return { es: 8, ei: 8 - it };
    if (letra === 'm') return { es: 15, ei: 15 - it };
    if (letra === 'n') return { es: 25, ei: 25 - it };
    if (letra === 'p') return { es: 42, ei: 42 - it };
    if (letra === 's') return { es: 70, ei: 70 - it };

    return { es: 0, ei: -it };
  }

  function classificar(folgaMin, folgaMax) {
    if (folgaMin > 0 && folgaMax > 0) {
      return {
        tipo: t('ajustes.clearanceType'),
        detalhe: t('ajustes.clearanceDetail'),
        metodo: t('ajustes.clearanceMethod')
      };
    }

    if (folgaMin < 0 && folgaMax < 0) {
      return {
        tipo: t('ajustes.interferenceType'),
        detalhe: t('ajustes.interferenceDetail'),
        metodo: t('ajustes.interferenceMethod')
      };
    }

    return {
      tipo: t('ajustes.transitionType'),
      detalhe: t('ajustes.transitionDetail'),
      metodo: t('ajustes.transitionMethod')
    };
  }

  function analisarPedido() {
    const txt = pedido.toLowerCase();

    let sugestao = {
      furo: 'H',
      classeFuro: '7',
      eixo: 'h',
      classeEixo: '6',
      principal: 'H7/h6',
      alternativas: ['H7/g6', 'H7/js6'],
      tipoKey: 'ajustes.suggestionStandardType',
      metodoKey: 'ajustes.suggestionStandardMethod',
      aplicacoesKey: 'ajustes.suggestionStandardApplications'
    };

    if (
      txt.includes('prens') ||
      txt.includes('press') ||
      txt.includes('acopl') ||
      txt.includes('coupl') ||
      txt.includes('accoupl') ||
      txt.includes('cubo') ||
      txt.includes('hub') ||
      txt.includes('polia')
    ) {
      sugestao = {
        furo: 'H',
        classeFuro: '7',
        eixo: 'p',
        classeEixo: '6',
        principal: 'H7/p6',
        alternativas: ['H7/n6', 'H7/s6'],
        tipoKey: 'ajustes.suggestionPressType',
        metodoKey: 'ajustes.suggestionPressMethod',
        aplicacoesKey: 'ajustes.suggestionPressApplications'
      };
    }

    if (
      txt.includes('torque') ||
      txt.includes('permanente') ||
      txt.includes('permanent') ||
      txt.includes('alto aperto') ||
      txt.includes('high interference') ||
      txt.includes('não desmont') ||
      txt.includes('nao desmont')
    ) {
      sugestao = {
        furo: 'H',
        classeFuro: '7',
        eixo: 's',
        classeEixo: '6',
        principal: 'H7/s6',
        alternativas: ['H7/p6', 'H7/n6'],
        tipoKey: 'ajustes.suggestionStrongType',
        metodoKey: 'ajustes.suggestionStrongMethod',
        aplicacoesKey: 'ajustes.suggestionStrongApplications'
      };
    }

    if (
      txt.includes('desliz') ||
      txt.includes('slid') ||
      txt.includes('couliss') ||
      txt.includes('livre') ||
      txt.includes('free') ||
      txt.includes('libre') ||
      txt.includes('folga') ||
      txt.includes('clearance') ||
      txt.includes('holgura') ||
      txt.includes('encaixe livre')
    ) {
      sugestao = {
        furo: 'H',
        classeFuro: '7',
        eixo: 'g',
        classeEixo: '6',
        principal: 'H7/g6',
        alternativas: ['H8/f7', 'H7/h6'],
        tipoKey: 'ajustes.suggestionSlideType',
        metodoKey: 'ajustes.suggestionSlideMethod',
        aplicacoesKey: 'ajustes.suggestionSlideApplications'
      };
    }

    if (
      txt.includes('girar') ||
      txt.includes('rotação') ||
      txt.includes('rotacao') ||
      txt.includes('rotat') ||
      txt.includes('mancal') ||
      txt.includes('bucha') ||
      txt.includes('bushing') ||
      txt.includes('cojinete') ||
      txt.includes('palier')
    ) {
      sugestao = {
        furo: 'H',
        classeFuro: '8',
        eixo: 'f',
        classeEixo: '7',
        principal: 'H8/f7',
        alternativas: ['H7/g6', 'H8/h7'],
        tipoKey: 'ajustes.suggestionRotationType',
        metodoKey: 'ajustes.suggestionRotationMethod',
        aplicacoesKey: 'ajustes.suggestionRotationApplications'
      };
    }

    if (
      txt.includes('rolamento') ||
      txt.includes('rolamentos') ||
      txt.includes('bearing') ||
      txt.includes('rodamiento') ||
      txt.includes('roulement')
    ) {
      sugestao = {
        furo: 'H',
        classeFuro: '7',
        eixo: 'k',
        classeEixo: '6',
        principal: 'H7/k6',
        alternativas: ['H7/j6', 'H7/m6'],
        tipoKey: 'ajustes.suggestionBearingType',
        metodoKey: 'ajustes.suggestionBearingMethod',
        aplicacoesKey: 'ajustes.suggestionBearingApplications'
      };
    }

    if (
      txt.includes('centraliz') ||
      txt.includes('justo') ||
      txt.includes('precisão') ||
      txt.includes('precisao') ||
      txt.includes('precision') ||
      txt.includes('précis') ||
      txt.includes('posicionamento')
    ) {
      sugestao = {
        furo: 'H',
        classeFuro: '7',
        eixo: 'k',
        classeEixo: '6',
        principal: 'H7/k6',
        alternativas: ['H7/j6', 'H7/js6'],
        tipoKey: 'ajustes.suggestionPrecisionType',
        metodoKey: 'ajustes.suggestionPrecisionMethod',
        aplicacoesKey: 'ajustes.suggestionPrecisionApplications'
      };
    }

    if (
      txt.includes('chaveta') ||
      txt.includes('keyway') ||
      txt.includes('chavetero') ||
      txt.includes('clavette') ||
      txt.includes('rasgo') ||
      txt.includes('groove') ||
      txt.includes('ranura') ||
      txt.includes('rainure') ||
      txt.includes('canal')
    ) {
      sugestao = {
        furo: 'JS',
        classeFuro: '7',
        eixo: 'js',
        classeEixo: '6',
        principal: 'JS7/js6',
        alternativas: ['H7/js6', 'H7/k6'],
        tipoKey: 'ajustes.suggestionKeywayType',
        metodoKey: 'ajustes.suggestionKeywayMethod',
        aplicacoesKey: 'ajustes.suggestionKeywayApplications'
      };
    }

    setLetraFuro(sugestao.furo);
    setClasseFuro(sugestao.classeFuro);
    setLetraEixo(sugestao.eixo);
    setClasseEixo(sugestao.classeEixo);
    setSugestaoTextoKey(sugestao.tipoKey);
    setSugestaoPrincipal(sugestao.principal);
    setSugestaoAlternativas(sugestao.alternativas);
    setSugestaoMetodoKey(sugestao.metodoKey);
    setSugestaoAplicacoesKey(sugestao.aplicacoesKey);

    const texto =
      `${t('ajustes.mainSuggestion')}: ${sugestao.principal}\n\n` +
      `${t('ajustes.fitType')}: ${t(sugestao.tipoKey)}\n` +
      `${t('ajustes.method')}: ${t(sugestao.metodoKey)}\n` +
      `${t('ajustes.applications')}: ${t(sugestao.aplicacoesKey)}\n\n` +
      `${t('ajustes.alternatives')}: ${sugestao.alternativas.join(' / ')}`;

    setTerminal(texto);
    return texto;
  }

  function calcular() {
    const d = num(diametro) || 50;

    const itFuro = toleranciaIT(d, classeFuro);
    const itEixo = toleranciaIT(d, classeEixo);

    const furo = desvioFuro(letraFuro, itFuro);
    const eixo = desvioEixo(letraEixo, itEixo);

    const furoMin = d + furo.EI / 1000;
    const furoMax = d + furo.ES / 1000;

    const eixoMin = d + eixo.ei / 1000;
    const eixoMax = d + eixo.es / 1000;

    const folgaMin = furoMin - eixoMax;
    const folgaMax = furoMax - eixoMin;

    const classe = classificar(folgaMin, folgaMax);

    const lista = [
      { id: 'nominal', n: t('ajustes.nominalDiameter'), v: `${mm(d)} mm` },
      { id: 'hole', n: t('ajustes.selectedHole'), v: `${letraFuro}${classeFuro}` },
      { id: 'shaft', n: t('ajustes.selectedShaft'), v: `${letraEixo}${classeEixo}` },
      { id: 'fitType', n: t('ajustes.fitType'), v: classe.tipo },
      { id: 'holeMin', n: t('ajustes.holeMinLimit'), v: `${mm(furoMin)} mm` },
      { id: 'holeMax', n: t('ajustes.holeMaxLimit'), v: `${mm(furoMax)} mm` },
      { id: 'shaftMin', n: t('ajustes.shaftMinLimit'), v: `${mm(eixoMin)} mm` },
      { id: 'shaftMax', n: t('ajustes.shaftMaxLimit'), v: `${mm(eixoMax)} mm` },
      { id: 'clearanceMin', n: t('ajustes.minClearance'), v: `${mm(folgaMin)} mm` },
      { id: 'clearanceMax', n: t('ajustes.maxClearance'), v: `${mm(folgaMax)} mm` },
      { id: 'holeIT', n: t('ajustes.holeIT'), v: `${microns(itFuro)} µm` },
      { id: 'shaftIT', n: t('ajustes.shaftIT'), v: `${microns(itEixo)} µm` }
    ];

    const textoTerminal =
      `${t('ajustes.terminalTitle')}\n` +
      `${t('ajustes.nominalSymbol')}: ${mm(d)} mm\n\n` +
      `${t('ajustes.hole')}: ${letraFuro}${classeFuro}\n` +
      `${t('ajustes.limits')}: ${mm(furoMin)} / ${mm(furoMax)} mm\n\n` +
      `${t('ajustes.shaft')}: ${letraEixo}${classeEixo}\n` +
      `${t('ajustes.limits')}: ${mm(eixoMin)} / ${mm(eixoMax)} mm\n\n` +
      `${t('ajustes.classification')}: ${classe.tipo}\n` +
      `${classe.detalhe}\n\n` +
      `${t('ajustes.recommendedMethod')}:\n${classe.metodo}`;

    const planoTexto =
      `${t('ajustes.machiningInstructions')}\n\n` +
      `1. ${t('ajustes.machineHole', { fit: `${letraFuro}${classeFuro}`, min: mm(furoMin), max: mm(furoMax) })}\n` +
      `2. ${t('ajustes.machineShaft', { fit: `${letraEixo}${classeEixo}`, min: mm(eixoMin), max: mm(eixoMax) })}\n` +
      `3. ${t('ajustes.measureInstruction')}\n` +
      `4. ${t('ajustes.expectedResult')}: ${classe.tipo}.\n` +
      `5. ${t('ajustes.method')}: ${classe.metodo}`;

    setResultados(lista);
    setTerminal(textoTerminal);
    setPlano(planoTexto);
  }

  useEffect(() => {
    calcular();
  }, [
    diametro,
    letraFuro,
    classeFuro,
    letraEixo,
    classeEixo,
    t
  ]);

  const relatorio =
    `${t('ajustes.reportTitle')}\n\n` +
    resultados.map((item) => `${item.n}: ${item.v}`).join('\n') +
    `\n\n${terminal}\n\n${plano}`;

  return (
    <CasillasLayout
      navigation={navigation}
      activeRoute="Ajustes"
      title={t('ajustes.title')}
      subtitle={t('ajustes.subtitle')}
      terminalText={terminal}
      shareText={relatorio}
    >
      <View style={s.card}>
        <Text style={s.cardTitle}>{t('ajustes.subTabsTitle')}</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {SUBABAS.map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => setSubAba(item)}
              style={[
                s.btnTipo,
                subAba === item && s.btnTipoAtivo
              ]}
            >
              <Text
                style={[
                  s.btnTipoText,
                  subAba === item && s.btnTipoTextAtivo
                ]}
              >
                {t(SUBABA_KEYS[item])}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={s.card}>
        <Text style={s.cardTitle}>2. {t('ajustes.inputData')}</Text>

        <View style={s.gridInputs}>
          <View style={s.boxInputHalf}>
            <Text style={s.labelInput}>{t('ajustes.nominal')}</Text>
            <TextInput
              style={s.input}
              value={diametro}
              onChangeText={setDiametro}
              keyboardType="numeric"
            />
          </View>

          <View style={s.boxInputHalf}>
            <Text style={s.labelInput}>{t('ajustes.system')}</Text>
            <View style={s.inputDisplay}>
              <Text style={s.txtYellow}>ISO 286</Text>
            </View>
          </View>
        </View>
      </View>

      {(subAba === 'Cálculo de Ajuste' || subAba === 'Escolher Tolerância') && (
        <>
          <View style={s.card}>
            <Text style={s.cardTitle}>{t('ajustes.holeTitle')}</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {LETRAS_FURO.map((item) => (
                <TouchableOpacity
                  key={item}
                  onPress={() => setLetraFuro(item)}
                  style={[
                    s.btnTipo,
                    letraFuro === item && s.btnTipoAtivo
                  ]}
                >
                  <Text
                    style={[
                      s.btnTipoText,
                      letraFuro === item && s.btnTipoTextAtivo
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
              {CLASSES_IT.map((item) => (
                <TouchableOpacity
                  key={item}
                  onPress={() => setClasseFuro(item)}
                  style={[
                    s.btnTipo,
                    classeFuro === item && s.btnTipoAtivo
                  ]}
                >
                  <Text
                    style={[
                      s.btnTipoText,
                      classeFuro === item && s.btnTipoTextAtivo
                    ]}
                  >
                    IT{item}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={s.card}>
            <Text style={s.cardTitle}>{t('ajustes.shaftTitle')}</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {LETRAS_EIXO.map((item) => (
                <TouchableOpacity
                  key={item}
                  onPress={() => setLetraEixo(item)}
                  style={[
                    s.btnTipo,
                    letraEixo === item && s.btnTipoAtivo
                  ]}
                >
                  <Text
                    style={[
                      s.btnTipoText,
                      letraEixo === item && s.btnTipoTextAtivo
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
              {CLASSES_IT.map((item) => (
                <TouchableOpacity
                  key={item}
                  onPress={() => setClasseEixo(item)}
                  style={[
                    s.btnTipo,
                    classeEixo === item && s.btnTipoAtivo
                  ]}
                >
                  <Text
                    style={[
                      s.btnTipoText,
                      classeEixo === item && s.btnTipoTextAtivo
                    ]}
                  >
                    IT{item}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </>
      )}

      {subAba === 'Sugestão por Pedido' && (
        <>
          <View style={s.card}>
            <Text style={s.cardTitle}>{t('ajustes.assistantTitle')}</Text>

            <Text style={s.labelInput}>{t('ajustes.describeApplication')}</Text>

            <TextInput
              style={[s.input, { minHeight: 70, textAlignVertical: 'top' }]}
              value={pedido}
              onChangeText={setPedido}
              multiline
              placeholder={t('ajustes.requestPlaceholder')}
              placeholderTextColor="#555"
            />

            <TouchableOpacity
              style={[
                s.btnTipoAtivo,
                { padding: 10, borderRadius: 4, marginTop: 10 }
              ]}
              onPress={() => {
                const resposta = analisarPedido();
                setTerminal(resposta);
              }}
            >
              <Text style={[s.btnTipoTextAtivo, { textAlign: 'center' }]}>
                {t('ajustes.analyzeRequest')}
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              backgroundColor: '#141202',
              borderWidth: 1,
              borderColor: '#3a3200',
              borderRadius: 4,
              padding: 10,
              marginTop: 12
            }}
          >
            <Text style={{ color: '#FFD400', fontSize: 11, fontWeight: 'bold' }}>
              {t('ajustes.mainSuggestion').toUpperCase()}
            </Text>

            <Text style={{ color: '#FFF', fontSize: 18, fontWeight: 'bold', marginTop: 6 }}>
              {sugestaoPrincipal}
            </Text>

            <Text style={{ color: '#888', fontSize: 12, marginTop: 6 }}>
              {t(sugestaoTextoKey)}
            </Text>
          </View>

          <View style={s.card}>
            <Text style={s.cardTitle}>{t('ajustes.alternativesTitle')}</Text>

            {sugestaoAlternativas.map((item, index) => (
              <View key={index} style={s.linhaTabela}>
                <Text style={s.txtWhite}>{t('ajustes.option')} {index + 1}</Text>
                <Text style={s.txtYellow}>{item}</Text>
              </View>
            ))}
          </View>

          <View style={s.card}>
            <Text style={s.cardTitle}>{t('ajustes.methodApplicationTitle')}</Text>

            <Text style={s.txtGray}>
              {t('ajustes.method')}: {t(sugestaoMetodoKey)}
            </Text>

            <Text style={[s.txtGray, { marginTop: 8 }]}>
              {t('ajustes.applications')}: {t(sugestaoAplicacoesKey)}
            </Text>
          </View>
        </>
      )}

      {subAba === 'Consulta ISO' && (
        <View style={s.card}>
          <Text style={s.cardTitle}>{t('ajustes.letterLookupTitle')}</Text>

          {[...LETRAS_FURO, ...LETRAS_EIXO].map((item, index) => (
            <View key={index} style={s.linhaTabela}>
              <Text style={s.txtYellow}>{item}</Text>
              <Text style={[s.txtWhite, { flex: 1, textAlign: 'right', flexWrap: 'wrap' }]}>
                {t(DESCRICOES[item])}
              </Text>
            </View>
          ))}
        </View>
      )}

      <View style={s.card}>
        <Text style={s.cardTitle}>{t('ajustes.fitResultTitle')}</Text>

        {resultados.map((item, index) => {
          const destaque = ['nominal', 'hole', 'shaft', 'fitType', 'clearanceMin', 'clearanceMax'].includes(item.id);

          return (
            <View
              key={index}
              style={[
                {
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  paddingVertical: 8,
                  borderBottomWidth: 1,
                  borderColor: '#111',
                  gap: 10
                },
                destaque && {
                  backgroundColor: '#1C1A0A',
                  borderLeftWidth: 4,
                  borderLeftColor: '#FFD400',
                  paddingHorizontal: 6,
                  borderRadius: 4
                }
              ]}
            >
              <Text style={[s.txtWhite, { flex: 1, flexWrap: 'wrap' }]}>
                {item.n}
              </Text>

              <Text
                style={[
                  s.txtYellow,
                  {
                    width: 170,
                    textAlign: 'right',
                    flexWrap: 'wrap'
                  }
                ]}
              >
                {item.v}
              </Text>
            </View>
          );
        })}
      </View>

      <View style={s.card}>
        <Text style={s.cardTitle}>{t('ajustes.smartTipsTitle')}</Text>

        <Text style={s.txtWhite}>{t('ajustes.tip1')}</Text>
        <Text style={s.txtWhite}>{t('ajustes.tip2')}</Text>
        <Text style={s.txtWhite}>{t('ajustes.tip3')}</Text>
        <Text style={s.txtWhite}>{t('ajustes.tip4')}</Text>
        <Text style={s.txtWhite}>{t('ajustes.tip5')}</Text>
        <Text style={s.txtWhite}>{t('ajustes.tip6')}</Text>
        <Text style={s.txtWhite}>{t('ajustes.tip7')}</Text>
      </View>

      <View style={s.card}>
        <Text style={s.cardTitle}>{t('ajustes.finalInspection')}</Text>

        <View style={s.linhaTabela}>
          <Text style={s.txtWhite}>{t('ajustes.caliper')}</Text>
          <Text style={s.txtYellow}>{t('ajustes.preCheck')}</Text>
        </View>

        <View style={s.linhaTabela}>
          <Text style={s.txtWhite}>{t('ajustes.externalMicrometer')}</Text>
          <Text style={s.txtYellow}>{t('ajustes.shaft')}</Text>
        </View>

        <View style={s.linhaTabela}>
          <Text style={s.txtWhite}>{t('ajustes.boreGauge')}</Text>
          <Text style={s.txtYellow}>{t('ajustes.hole')}</Text>
        </View>

        <View style={s.linhaTabela}>
          <Text style={s.txtWhite}>{t('ajustes.plugGauge')}</Text>
          <Text style={s.txtYellow}>{t('ajustes.hole')}</Text>
        </View>

        <View style={s.linhaTabela}>
          <Text style={s.txtWhite}>{t('ajustes.ringGauge')}</Text>
          <Text style={s.txtYellow}>{t('ajustes.shaft')}</Text>
        </View>
      </View>

      <View style={s.card}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Text style={s.cardTitle}>{t('ajustes.machiningTitle')}</Text>

          <TouchableOpacity
            onPress={() => setPlanoAtivo(!planoAtivo)}
            style={{
              backgroundColor: planoAtivo ? '#FFD400' : '#111',
              borderWidth: 1,
              borderColor: planoAtivo ? '#FFD400' : '#333',
              paddingHorizontal: 12,
              paddingVertical: 5,
              borderRadius: 4
            }}
          >
            <Text
              style={{
                color: planoAtivo ? '#000' : '#777',
                fontSize: 10,
                fontWeight: 'bold'
              }}
            >
              {planoAtivo ? 'ON' : 'OFF'}
            </Text>
          </TouchableOpacity>
        </View>

        {planoAtivo && (
          <View style={s.terminal}>
            <Text style={s.txtGcode}>
              {plano}
            </Text>
          </View>
        )}
      </View>
    </CasillasLayout>
  );
}
