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
  'Divisão direta',
  'Divisão indireta',
  'Divisão angular',
  'Cálculo inverso'
];

const SUBABA_KEYS = {
  'Divisão direta': 'divisor.tabDirect',
  'Divisão indireta': 'divisor.tabIndirect',
  'Divisão angular': 'divisor.tabAngular',
  'Cálculo inverso': 'divisor.tabInverse'
};

const RELACOES = ['40', '60', '90', '120'];

const CONTROLES = ['FANUC', 'SIEMENS', 'MITSUBISHI', 'HAAS', 'MACH3'];

const DISCOS = [
  15, 16, 17, 18, 19, 20,
  21, 23, 27, 29, 31, 33,
  37, 39, 41, 43, 47, 49
];

export default function DivisorScreen({ navigation }) {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const s = getCasillasStyles(theme);

  const [subAba, setSubAba] = useState('Divisão indireta');
  const [relacao, setRelacao] = useState('40');
  const [controle, setControle] = useState('FANUC');

  const [divisoes, setDivisoes] = useState('6');
  const [anguloDesejado, setAnguloDesejado] = useState('60.00');

  const [resultados, setResultados] = useState([]);
  const [sugestoes, setSugestoes] = useState([]);
  const [terminalDivisor, setTerminalDivisor] = useState('');
  const [gcode, setGcode] = useState('');
  const [gcodeAtivo, setGcodeAtivo] = useState(true);

  function num(valor) {
    return parseFloat(String(valor).replace(',', '.')) || 0;
  }

  function formatar(valor) {
    if (!isFinite(valor)) return '0.00';
    return valor.toFixed(2);
  }

  function formatarGcode(valor) {
    if (!isFinite(valor)) return '0.000';
    return valor.toFixed(3);
  }

  function mdc(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);

    while (b) {
      const temp = b;
      b = a % b;
      a = temp;
    }

    return a || 1;
  }

  function simplificar(numerador, denominador) {
    const divisor = mdc(numerador, denominador);

    return {
      n: numerador / divisor,
      d: denominador / divisor
    };
  }

  function encontrarSugestoes(fracaoVolta) {
    const lista = [];

    DISCOS.forEach((furosDisco) => {
      const furos = fracaoVolta * furosDisco;
      const arredondado = Math.round(furos);

      if (Math.abs(furos - arredondado) < 0.0001 && arredondado >= 0) {
        lista.push({
          disco: furosDisco,
          furos: arredondado
        });
      }
    });

    return lista;
  }

  function gerarGcodePorControle(controleAtual, subAbaAtual, n, anguloPorDivisao, r) {
    let codigo = '';

    const cabecalhoFanuc =
`%
O0006 (${controleAtual} - ${t('divisor.gcodeName')} ${t(SUBABA_KEYS[subAbaAtual]).toUpperCase()})
( ${t('divisor.gcodeRatio')}: ${formatar(r)} : 1 )
( ${t('divisor.gcodeDivisions')}: ${n} )
( ${t('divisor.gcodeAnglePerDivision')}: ${formatar(anguloPorDivisao)} ${t('divisor.gcodeDegrees')} )
G21 G40 G90
G00 X0.000 Y0.000 Z5.000

`;

    const cabecalhoSiemens =
`; SIEMENS - ${t('divisor.gcodeName')} ${t(SUBABA_KEYS[subAbaAtual]).toUpperCase()}
; ${t('divisor.gcodeRatio')}: ${formatar(r)} : 1
; ${t('divisor.gcodeDivisions')}: ${n}
; ${t('divisor.gcodeAnglePerDivision')}: ${formatar(anguloPorDivisao)} ${t('divisor.gcodeDegrees')}
G21 G90
G0 X0.000 Y0.000 Z5.000

`;

    const cabecalhoMach3 =
`(MACH3 - ${t('divisor.gcodeName')} ${t(SUBABA_KEYS[subAbaAtual]).toUpperCase()})
( ${t('divisor.gcodeRatio')}: ${formatar(r)} : 1 )
( ${t('divisor.gcodeDivisions')}: ${n} )
( ${t('divisor.gcodeAnglePerDivision')}: ${formatar(anguloPorDivisao)} ${t('divisor.gcodeDegrees')} )
G21 G90
G0 X0.000 Y0.000 Z5.000

`;

    if (controleAtual === 'FANUC' || controleAtual === 'MITSUBISHI' || controleAtual === 'HAAS') {
      codigo += cabecalhoFanuc;

      for (let i = 0; i < n; i++) {
        const a = i * anguloPorDivisao;

        codigo +=
`( ${t('divisor.gcodeDivision')} ${i + 1} - A${formatar(a)} ${t('divisor.gcodeDegrees')} )
G00 A${formatarGcode(a)}
( ${t('divisor.gcodeExecute')} )

`;
      }

      codigo += `M30\n%`;
    }

    if (controleAtual === 'SIEMENS') {
      codigo += cabecalhoSiemens;

      for (let i = 0; i < n; i++) {
        const a = i * anguloPorDivisao;

        codigo +=
`; ${t('divisor.gcodeDivision')} ${i + 1} - A${formatar(a)} ${t('divisor.gcodeDegrees')}
G0 A${formatarGcode(a)}
; ${t('divisor.gcodeExecute')}

`;
      }

      codigo += `M30`;
    }

    if (controleAtual === 'MACH3') {
      codigo += cabecalhoMach3;

      for (let i = 0; i < n; i++) {
        const a = i * anguloPorDivisao;

        codigo +=
`( ${t('divisor.gcodeDivision')} ${i + 1} - A${formatar(a)} ${t('divisor.gcodeDegrees')} )
G0 A${formatarGcode(a)}
( ${t('divisor.gcodeExecute')} )

`;
      }

      codigo += `M30`;
    }

    return codigo;
  }

  function calcularDivisor() {
    const r = num(relacao) || 40;
    const n = parseInt(divisoes) || 1;
    const ang = num(anguloDesejado);

    if (n <= 0) {
      setResultados([]);
      setSugestoes([]);
      setTerminalDivisor('');
      setGcode('');
      return;
    }

    let anguloPorDivisao = 360 / n;
    let voltasTotais = r / n;

    if (subAba === 'Divisão angular') {
      anguloPorDivisao = ang;
      voltasTotais = (r * ang) / 360;
    }

    const voltasInteiras = Math.floor(voltasTotais);
    const fracao = voltasTotais - voltasInteiras;

    const fracaoSimplificada = simplificar(
      Math.round(fracao * 100000),
      100000
    );

    const sugestoesCalculadas = encontrarSugestoes(fracao);
    const discoRecomendado = sugestoesCalculadas.length > 0
      ? sugestoesCalculadas[0]
      : null;

    const furosRecomendados = discoRecomendado
      ? discoRecomendado.furos
      : 0;

    const discoTexto = discoRecomendado
      ? t('divisor.exactDisk', { disk: discoRecomendado.disco, holes: discoRecomendado.furos })
      : t('divisor.noExactDisk');

    const lista = [
      { id: 'activeTab', n: t('divisor.activeTab'), v: t(SUBABA_KEYS[subAba]) },
      { id: 'cncSystem', n: t('divisor.cncSystem'), v: controle },
      { id: 'ratio', n: t('divisor.dividerRatio'), v: `${formatar(r)} : 1` },
      { id: 'divisions', n: t('divisor.numDivisions'), v: `${n}` },
      { id: 'angle', n: t('divisor.anglePerDivision'), v: `${formatar(anguloPorDivisao)}°` },
      { id: 'totalTurns', n: t('divisor.totalTurns'), v: `${formatar(voltasTotais)}` },
      { id: 'wholeTurns', n: t('divisor.wholeTurns'), v: `${voltasInteiras}` },
      { id: 'fraction', n: t('divisor.remainingFraction'), v: `${fracaoSimplificada.n}/${fracaoSimplificada.d}` },
      { id: 'disk', n: t('divisor.recommendedDisk'), v: discoTexto }
    ];

    if (subAba === 'Divisão direta') {
      lista.push({
        id: 'usage', n: t('divisor.usageRecommended'),
        v: t('divisor.usageDescription')
      });
    }

    if (subAba === 'Divisão angular') {
      lista.push({
        id: 'informedAngle', n: t('divisor.informedAngle'),
        v: `${formatar(ang)}°`
      });
    }

    if (subAba === 'Cálculo inverso') {
      lista.push({
        id: 'inverse', n: t('divisor.inverseReading'),
        v: t('divisor.inverseDescription')
      });
    }

    let terminal =
      `${t('divisor.terminalTitle')}\n` +
      `${t('divisor.gcodeRatio')}: ${formatar(r)} : 1\n` +
      `${t('divisor.desiredDivisions')}: ${n}\n` +
      `${t('divisor.anglePerDivision')}: ${formatar(anguloPorDivisao)}°\n` +
      `${t('divisor.cncControl')}: ${controle}\n\n` +
      `${t('divisor.movementPerDivision')}:\n` +
      t('divisor.fullTurns', { turns: voltasInteiras });

    if (discoRecomendado && furosRecomendados > 0) {
      terminal += ` + ${t('divisor.holesOnDisk', { holes: furosRecomendados, disk: discoRecomendado.disco })}.\n\n`;
    } else if (discoRecomendado && furosRecomendados === 0) {
      terminal += `.\n\n`;
    } else {
      terminal += ` + ${t('divisor.fractionWithoutDisk')}.\n\n`;
    }

    terminal +=
      `${t('divisor.stepByStep')}:\n` +
      `1. ${t('divisor.stepLockPiece')}\n`;

    if (discoRecomendado) {
      terminal +=
        `2. ${t('divisor.stepUseDisk', { disk: discoRecomendado.disco })}\n` +
        `3. ${t('divisor.stepAdjustArms', { holes: furosRecomendados })}\n` +
        `4. ${t('divisor.stepAdvance', { turns: voltasInteiras })}`;

      if (furosRecomendados > 0) {
        terminal += ` + ${t('divisor.holesCount', { holes: furosRecomendados })}.\n`;
      } else {
        terminal += `.\n`;
      }

      terminal += `5. ${t('divisor.stepRepeat', { divisions: n })}`;
    } else {
      terminal +=
        `2. ${t('divisor.stepNoDisk')}\n` +
        `3. ${t('divisor.stepTryAnother')}\n` +
        `4. ${t('divisor.stepCheckSuggestions')}`;
    }

    const codigo = gerarGcodePorControle(
      controle,
      subAba,
      n,
      anguloPorDivisao,
      r
    );

    setResultados(lista);
    setSugestoes(sugestoesCalculadas);
    setTerminalDivisor(terminal);
    setGcode(codigo);
  }

  useEffect(() => {
    calcularDivisor();
  }, [
    subAba,
    relacao,
    controle,
    divisoes,
    anguloDesejado,
    t
  ]);

  const relatorio =
    `${t('divisor.reportTitle')}\n\n` +
    resultados.map((item) => `${item.n}: ${item.v}`).join('\n') +
    `\n\n${t('divisor.alternativesTitle')}\n` +
    sugestoes.map((item) => `${t('divisor.disk')} ${item.disco}: ${t('divisor.holesCount', { holes: item.furos })}`).join('\n') +
    `\n\n${terminalDivisor}\n\n${gcode}`;

  return (
    <CasillasLayout
      navigation={navigation}
      activeRoute="Divisor"
      title={t('divisor.title')}
      subtitle={t('divisor.subtitle')}
      terminalText={terminalDivisor}
      shareText={relatorio}
    >
      <View style={s.card}>
        <Text style={s.cardTitle}>{t('divisor.subTabsTitle')}</Text>

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
        <Text style={s.cardTitle}>{t('divisor.dividerRatioTitle')}</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {RELACOES.map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => setRelacao(item)}
              style={[
                s.btnTipo,
                relacao === item && s.btnTipoAtivo
              ]}
            >
              <Text
                style={[
                  s.btnTipoText,
                  relacao === item && s.btnTipoTextAtivo
                ]}
              >
                {item}:1
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={s.card}>
        <Text style={s.cardTitle}>{t('divisor.inputDataFull')}</Text>

        <View style={s.gridInputs}>
          <View style={s.boxInputHalf}>
            <Text style={s.labelInput}>{t('divisor.divisionCount')}</Text>
            <TextInput
              style={s.input}
              value={divisoes}
              onChangeText={(txt) => setDivisoes(txt.replace(/[^0-9]/g, ''))}
              keyboardType="numeric"
            />
          </View>

          <View style={s.boxInputHalf}>
            <Text style={s.labelInput}>{t('divisor.calculatedAngle')}</Text>
            <View style={s.inputDisplay}>
              <Text style={s.txtYellow}>
                {resultados.find((i) => i.id === 'angle')?.v || '0.00°'}
              </Text>
            </View>
          </View>
        </View>

        {subAba === 'Divisão angular' && (
          <View style={s.gridInputs}>
            <View style={s.boxInputHalf}>
              <Text style={s.labelInput}>{t('divisor.desiredAngle')}</Text>
              <TextInput
                style={s.input}
                value={anguloDesejado}
                onChangeText={setAnguloDesejado}
                keyboardType="numeric"
              />
            </View>

            <View style={s.boxInputHalf}>
              <Text style={s.labelInput}>{t('divisor.use')}</Text>
              <View style={s.inputDisplay}>
                <Text style={s.txtYellow}>{t('divisor.tabAngular')}</Text>
              </View>
            </View>
          </View>
        )}

        <View style={s.gridInputs}>
          <View style={s.boxInputHalf}>
            <Text style={s.labelInput}>{t('divisor.recommendedDisk')}</Text>
            <View style={s.inputDisplay}>
              <Text style={s.txtYellow}>
                {resultados.find((i) => i.id === 'disk')?.v || t('common.loading')}
              </Text>
            </View>
          </View>

          <View style={s.boxInputHalf}>
            <Text style={s.labelInput}>{t('divisor.machine')}</Text>
            <View style={s.inputDisplay}>
              <Text style={s.txtYellow}>{t('divisor.machineValue')}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={s.card}>
        <Text style={s.cardTitle}>{t('divisor.resultsTitle')}</Text>

        {resultados.map((item, index) => {
          const destaque = ['ratio', 'divisions', 'angle', 'totalTurns', 'wholeTurns', 'disk'].includes(item.id);

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
                    width: 135,
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
        <Text style={s.cardTitle}>{t('divisor.alternativesTitle')}</Text>

        {sugestoes.length > 0 ? (
          sugestoes.map((item, index) => (
            <View key={index} style={s.linhaTabela}>
              <Text style={s.txtWhite}>{t('divisor.disk')} {item.disco}</Text>
              <Text style={s.txtYellow}>{t('divisor.holesCount', { holes: item.furos })}</Text>
            </View>
          ))
        ) : (
          <Text style={s.txtGray}>
            {t('divisor.noDiskSuggestion')}
          </Text>
        )}
      </View>

      <View style={s.card}>
        <Text style={s.cardTitle}>{t('divisor.manualExecution')}</Text>

        <View style={s.terminal}>
          <Text style={s.txtGcode}>
            {terminalDivisor}
          </Text>
        </View>
      </View>

      <View style={s.card}>
        <Text style={s.cardTitle}>{t('divisor.dimensionalVerification')}</Text>

        <View style={s.linhaTabela}>
          <Text style={s.txtWhite}>{t('divisor.checkDivisions')}</Text>
          <Text style={s.txtYellow}>{t('divisor.beforeMachining')}</Text>
        </View>

        <View style={s.linhaTabela}>
          <Text style={s.txtWhite}>{t('divisor.dividerLock')}</Text>
          <Text style={s.txtYellow}>{t('divisor.mandatory')}</Text>
        </View>

        <View style={s.linhaTabela}>
          <Text style={s.txtWhite}>{t('divisor.diskSector')}</Text>
          <Text style={s.txtYellow}>{t('divisor.checkHoles')}</Text>
        </View>

        <View style={s.linhaTabela}>
          <Text style={s.txtWhite}>{t('divisor.instruments')}</Text>
          <Text style={s.txtYellow}>{t('divisor.protractorIndicator')}</Text>
        </View>
      </View>

      <View style={s.card}>
        <Text style={s.cardTitle}>{t('divisor.tipsTitle')}</Text>

        <Text style={s.txtWhite}>{t('divisor.tip1')}</Text>
        <Text style={s.txtWhite}>{t('divisor.tip2')}</Text>
        <Text style={s.txtWhite}>{t('divisor.tip3')}</Text>
        <Text style={s.txtWhite}>{t('divisor.tip4')}</Text>
        <Text style={s.txtWhite}>{t('divisor.tip5')}</Text>
      </View>

      <View style={s.card}>
        <Text style={s.cardTitle}>{t('divisor.finalInspection')}</Text>

        <View style={s.linhaTabela}>
          <Text style={s.txtWhite}>{t('divisor.dialIndicator')}</Text>
          <Text style={s.txtYellow}>{t('divisor.runout')}</Text>
        </View>

        <View style={s.linhaTabela}>
          <Text style={s.txtWhite}>{t('divisor.protractor')}</Text>
          <Text style={s.txtYellow}>{t('divisor.angle')}</Text>
        </View>

        <View style={s.linhaTabela}>
          <Text style={s.txtWhite}>{t('divisor.gauge')}</Text>
          <Text style={s.txtYellow}>{t('divisor.optional')}</Text>
        </View>
      </View>

      <View style={s.card}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Text style={s.cardTitle}>{t('divisor.gcodeTitle')}</Text>

          <TouchableOpacity
            onPress={() => setGcodeAtivo(!gcodeAtivo)}
            style={{
              backgroundColor: gcodeAtivo ? '#FFD400' : '#111',
              borderWidth: 1,
              borderColor: gcodeAtivo ? '#FFD400' : '#333',
              paddingHorizontal: 12,
              paddingVertical: 5,
              borderRadius: 4
            }}
          >
            <Text style={{
              color: gcodeAtivo ? '#000' : '#777',
              fontSize: 10,
              fontWeight: 'bold'
            }}>
              {gcodeAtivo ? 'ON' : 'OFF'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={s.txtGray}>
          {t('divisor.machineDescription')}
        </Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {CONTROLES.map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => setControle(item)}
              style={[
                s.btnTipo,
                controle === item && s.btnTipoAtivo,
                { marginTop: 8 }
              ]}
            >
              <Text
                style={[
                  s.btnTipoText,
                  controle === item && s.btnTipoTextAtivo
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {gcodeAtivo && (
          <View style={s.terminal}>
            <Text style={s.txtGcode}>{gcode}</Text>
          </View>
        )}
      </View>
    </CasillasLayout>
  );
}
