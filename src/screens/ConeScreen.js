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
  'Cone Externo',
  'Cone Interno',
  'Cálculo Inverso',
  'Cone Morse'
];

const SUBABA_KEYS = {
  'Cone Externo': 'cone.tabExternal',
  'Cone Interno': 'cone.tabInternal',
  'Cálculo Inverso': 'cone.tabInverse',
  'Cone Morse': 'cone.tabMorse'
};

const CONTROLES = [
  'FANUC',
  'SIEMENS',
  'MITSUBISHI',
  'HAAS',
  'MACH3'
];

const CONE_MORSE = {
  MT0: { maior: 9.045, menor: 6.401, comprimento: 56.5 },
  MT1: { maior: 12.065, menor: 9.373, comprimento: 65.0 },
  MT2: { maior: 17.780, menor: 14.529, comprimento: 80.0 },
  MT3: { maior: 23.825, menor: 19.761, comprimento: 99.0 },
  MT4: { maior: 31.267, menor: 25.933, comprimento: 123.0 },
  MT5: { maior: 44.399, menor: 37.584, comprimento: 156.0 },
  MT6: { maior: 63.348, menor: 53.752, comprimento: 218.0 }
};

export default function ConeScreen({ navigation }) {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const s = getCasillasStyles(theme);

  const [subAba, setSubAba] = useState('Cone Externo');
  const [controle, setControle] = useState('FANUC');
  const [morseAtivo, setMorseAtivo] = useState('MT3');

  const [diametroMaior, setDiametroMaior] = useState('50.00');
  const [diametroMenor, setDiametroMenor] = useState('30.00');
  const [comprimento, setComprimento] = useState('100.00');

  const [conicidadeEntrada, setConicidadeEntrada] = useState('5.00');
  const [anguloEntrada, setAnguloEntrada] = useState('11.42');

  const [resultados, setResultados] = useState([]);
  const [gcode, setGcode] = useState('');
  const [terminalCone, setTerminalCone] = useState('');
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

  function trocarMorse(tipo) {
    const dados = CONE_MORSE[tipo];

    setMorseAtivo(tipo);
    setSubAba('Cone Morse');

    setDiametroMaior(formatar(dados.maior));
    setDiametroMenor(formatar(dados.menor));
    setComprimento(formatar(dados.comprimento));
    setConicidadeEntrada(formatar(dados.comprimento / Math.abs(dados.maior - dados.menor)));
  }

  function gerarGcode({
    dMaior,
    dMenor,
    l,
    meioAngulo,
    conicidade,
    deslocamentoContraponto
  }) {
    const rpm = 1200;
    const avanco = '0.200';
    const xInicial = dMaior + 2;
    const zInicial = 2.000;
    const zFinal = -Math.abs(l);

    let codigo = '';

    if (controle === 'FANUC') {
      codigo =
`%
O0005 (FANUC - ${t('cone.gcodeName')} ${t(SUBABA_KEYS[subAba]).toUpperCase()})
( ${t('cone.taperRatio').toUpperCase()} 1:${formatar(conicidade)} )
( ${t('cone.halfAngle').toUpperCase()}: ${formatar(meioAngulo)} ${t('cone.gcodeDegrees')} )
( ${t('cone.tailstockOffset').toUpperCase()}: ${formatar(deslocamentoContraponto)} MM )
G21 G40 G90 G99
G97 S${Math.round(rpm)} M03
G00 X${formatarGcode(xInicial)} Z${formatarGcode(zInicial)}
G01 X${formatarGcode(dMenor)} Z${formatarGcode(zFinal)} F${avanco}
G00 X${formatarGcode(xInicial)}
M05
M30
%`;
    }

    if (controle === 'SIEMENS') {
      codigo =
`; SIEMENS - ${t('cone.gcodeName')} ${t(SUBABA_KEYS[subAba]).toUpperCase()}
; ${t('cone.taperRatio').toUpperCase()} 1:${formatar(conicidade)}
; ${t('cone.halfAngle').toUpperCase()}: ${formatar(meioAngulo)} ${t('cone.gcodeDegrees')}
; ${t('cone.tailstockOffset').toUpperCase()}: ${formatar(deslocamentoContraponto)} MM
G21 G90 G95
S${Math.round(rpm)} M3
G0 X${formatarGcode(xInicial)} Z${formatarGcode(zInicial)}
G1 X${formatarGcode(dMenor)} Z${formatarGcode(zFinal)} F${avanco}
G0 X${formatarGcode(xInicial)}
M5
M30`;
    }

    if (controle === 'MITSUBISHI') {
      codigo =
`%
O0005 (MITSUBISHI - ${t('cone.gcodeName')} ${t(SUBABA_KEYS[subAba]).toUpperCase()})
( ${t('cone.taperRatio').toUpperCase()} 1:${formatar(conicidade)} )
( ${t('cone.halfAngle').toUpperCase()}: ${formatar(meioAngulo)} ${t('cone.gcodeDegrees')} )
( ${t('cone.tailstockOffset').toUpperCase()}: ${formatar(deslocamentoContraponto)} MM )
G21 G40 G90 G99
G97 S${Math.round(rpm)} M03
G00 X${formatarGcode(xInicial)} Z${formatarGcode(zInicial)}
G01 X${formatarGcode(dMenor)} Z${formatarGcode(zFinal)} F${avanco}
G00 X${formatarGcode(xInicial)}
M05
M30
%`;
    }

    if (controle === 'HAAS') {
      codigo =
`%
O0005 (HAAS - ${t('cone.gcodeName')} ${t(SUBABA_KEYS[subAba]).toUpperCase()})
( ${t('cone.taperRatio').toUpperCase()} 1:${formatar(conicidade)} )
( ${t('cone.halfAngle').toUpperCase()}: ${formatar(meioAngulo)} ${t('cone.gcodeDegrees')} )
( ${t('cone.tailstockOffset').toUpperCase()}: ${formatar(deslocamentoContraponto)} MM )
G21 G40 G90 G99
G97 S${Math.round(rpm)} M03
G00 X${formatarGcode(xInicial)} Z${formatarGcode(zInicial)}
G01 X${formatarGcode(dMenor)} Z${formatarGcode(zFinal)} F${avanco}
G00 X${formatarGcode(xInicial)}
M05
M30
%`;
    }

    if (controle === 'MACH3') {
      codigo =
`(MACH3 - ${t('cone.gcodeName')} ${t(SUBABA_KEYS[subAba]).toUpperCase()})
( ${t('cone.taperRatio').toUpperCase()} 1:${formatar(conicidade)} )
( ${t('cone.halfAngle').toUpperCase()}: ${formatar(meioAngulo)} ${t('cone.gcodeDegrees')} )
( ${t('cone.tailstockOffset').toUpperCase()}: ${formatar(deslocamentoContraponto)} MM )
G21 G90 G95
S${Math.round(rpm)} M03
G00 X${formatarGcode(xInicial)} Z${formatarGcode(zInicial)}
G01 X${formatarGcode(dMenor)} Z${formatarGcode(zFinal)} F${avanco}
G00 X${formatarGcode(xInicial)}
M05
M30`;
    }

    return codigo;
  }

  function calcularCone() {
    let dMaior = num(diametroMaior);
    let dMenor = num(diametroMenor);
    const l = num(comprimento);

    const anguloInformado = num(anguloEntrada);

    if (l <= 0) {
      setResultados([]);
      setGcode('');
      setTerminalCone('');
      return;
    }

   if (subAba === 'Cálculo Inverso' && anguloInformado > 0) {
  const meioAnguloInformado = anguloInformado / 2;

  const diferenca =
    2 * l * Math.tan(meioAnguloInformado * Math.PI / 180);

  dMenor = dMaior - diferenca;

  const novoDiametroMenor = formatar(dMenor);

  if (diametroMenor !== novoDiametroMenor) {
    setDiametroMenor(novoDiametroMenor);
  }
}

    const diferencaDiametros = dMaior - dMenor;

    const conicidade = diferencaDiametros !== 0
      ? l / Math.abs(diferencaDiametros)
      : 0;

    const interpretacaoConicidade = t('cone.taperInterpretation', { value: formatar(conicidade) });

    const meioAngulo =
      Math.atan(Math.abs(diferencaDiametros) / (2 * l)) * 180 / Math.PI;

    const anguloTotal = meioAngulo * 2;
    const deslocamentoContraponto = diferencaDiametros / 2;
    const deslocamentoPor100 = l > 0 ? (diferencaDiametros / l) * 100 : 0;
    const diametroMedio = (dMaior + dMenor) / 2;
    const comprimentoReal = Math.sqrt(Math.pow(l, 2) + Math.pow(diferencaDiametros / 2, 2));
    const areaLateral = Math.PI * diametroMedio * comprimentoReal / 100;
    const sobremetal = Math.abs(diferencaDiametros) > 0 ? 0.20 : 0;
    const passadaRecomendada = Math.abs(diferencaDiametros) <= 5 ? 0.25 : 0.50;

    const lista = [
      { id: 'type', n: t('cone.taperType'), v: t(SUBABA_KEYS[subAba]) },
      { id: 'cnc', n: t('cone.cncSystem'), v: controle },
      { id: 'major', n: t('cone.majorDiameterInput'), v: `${formatar(dMaior)} mm` },
      { id: 'minor', n: t('cone.minorDiameterInput'), v: `${formatar(dMenor)} mm` },
      { id: 'length', n: t('cone.lengthInput'), v: `${formatar(l)} mm` },
      { id: 'difference', n: t('cone.diameterDifference'), v: `${formatar(diferencaDiametros)} mm` },
      { id: 'ratio', n: t('cone.appliedTaper'), v: `1 : ${formatar(conicidade)}` },
      { id: 'interpretation', n: t('cone.interpretation'), v: interpretacaoConicidade },
      { id: 'halfAngle', n: t('cone.halfAngle'), v: `${formatar(meioAngulo)}°` },
      { id: 'totalAngle', n: t('cone.totalAngle'), v: `${formatar(anguloTotal)}°` },
      { id: 'offset', n: t('cone.tailstockOffset'), v: `${formatar(deslocamentoContraponto)} mm` },
      { id: 'offset100', n: t('cone.offsetPer100'), v: `${formatar(deslocamentoPor100)} mm` },
      { id: 'meanDiameter', n: t('cone.meanDiameter'), v: `${formatar(diametroMedio)} mm` },
      { id: 'realLength', n: t('cone.realLength'), v: `${formatar(comprimentoReal)} mm` },
      { id: 'lateralArea', n: t('cone.lateralArea'), v: `${formatar(areaLateral)} cm²` },
      { id: 'pass', n: t('cone.recommendedPass'), v: `${formatar(passadaRecomendada)} mm` },
      { id: 'allowance', n: t('cone.suggestedAllowance'), v: `${formatar(sobremetal)} mm` }
    ];

    const codigo = gerarGcode({
      dMaior,
      dMenor,
      l,
      meioAngulo,
      conicidade,
      deslocamentoContraponto
    });

    const terminal =
      `${t('cone.terminalTitle')}\n` +
      `${t('cone.taperType')}: ${t(SUBABA_KEYS[subAba])}\n` +
      `${t('cone.cncControl')}: ${controle}\n` +
      `${t('cone.majorDiameterShort')}: ${formatar(dMaior)} mm\n` +
      `${t('cone.minorDiameterShort')}: ${formatar(dMenor)} mm\n` +
      `${t('cone.lengthShort')}: ${formatar(l)} mm\n\n` +
      `${t('cone.appliedTaper')}: 1 : ${formatar(conicidade)}\n` +
      `${t('cone.interpretation')}: ${interpretacaoConicidade}\n\n` +
      `${t('cone.halfAngle')}: ${formatar(meioAngulo)}°\n` +
      `${t('cone.totalAngle')}: ${formatar(anguloTotal)}°\n` +
      `${t('cone.tailstockOffset')}: ${formatar(deslocamentoContraponto)} mm\n\n` +
      `${t('cone.stepByStep')}:\n` +
      `1. ${t('cone.stepAdjustSlide', { angle: formatar(meioAngulo) })}\n` +
      `2. ${t('cone.stepTailstock', { offset: formatar(deslocamentoContraponto) })}\n` +
      `3. ${t('cone.stepMachineLength', { length: formatar(l) })}\n` +
      `4. ${t('cone.stepCheckDiameters')}\n` +
      `5. ${t('cone.stepFinish', { allowance: formatar(sobremetal) })}`;

    setResultados(lista);
    setGcode(codigo);
    setTerminalCone(terminal);
  }

  useEffect(() => {
    calcularCone();
  }, [
    subAba,
    controle,
    diametroMaior,
    diametroMenor,
    comprimento,
    anguloEntrada,
    t
  ]);

  const relatorio =
    `${t('cone.reportTitle')}\n\n` +
    resultados.map((item) => `${item.n}: ${item.v}`).join('\n') +
    `\n\n${terminalCone}\n\n${gcode}`;

  return (
    <CasillasLayout
      navigation={navigation}
      activeRoute="Cone"
      title={t('cone.title')}
      subtitle={t('cone.subtitle')}
      terminalText={terminalCone}
      shareText={relatorio}
    >
      <View style={s.card}>
        <Text style={s.cardTitle}>{t('cone.calcTabsTitle')}</Text>

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
        <Text style={s.cardTitle}>{t('cone.quickMorseTitle')}</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {Object.keys(CONE_MORSE).map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => trocarMorse(item)}
              style={[
                s.btnTipo,
                morseAtivo === item && subAba === 'Cone Morse' && s.btnTipoAtivo
              ]}
            >
              <Text
                style={[
                  s.btnTipoText,
                  morseAtivo === item && subAba === 'Cone Morse' && s.btnTipoTextAtivo
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={s.card}>
        <Text style={s.cardTitle}>3. {t('cone.inputData')}</Text>

        <View style={s.gridInputs}>
          <View style={s.boxInputHalf}>
            <Text style={s.labelInput}>{t('cone.majorDiameterInput')}</Text>
            <TextInput
              style={s.input}
              value={diametroMaior}
              onChangeText={setDiametroMaior}
              keyboardType="numeric"
            />
          </View>

          <View style={s.boxInputHalf}>
            <Text style={s.labelInput}>
  {subAba === 'Cálculo Inverso' ? t('cone.calculatedMinorDiameter') : t('cone.minorDiameterInput')}
</Text>
            <TextInput
  style={s.input}
  value={diametroMenor}
  onChangeText={setDiametroMenor}
  keyboardType="numeric"
  editable={subAba !== 'Cálculo Inverso'}
/>
          </View>
        </View>

        <View style={s.gridInputs}>
          <View style={s.boxInputHalf}>
            <Text style={s.labelInput}>{t('cone.lengthInput')}</Text>
            <TextInput
              style={s.input}
              value={comprimento}
              onChangeText={setComprimento}
              keyboardType="numeric"
            />
          </View>

          
        </View>

        {subAba === 'Cálculo Inverso' && (
          <View style={s.gridInputs}>
            <View style={s.boxInputHalf}>
              <Text style={s.labelInput}>{t('cone.enteredTotalAngle')}</Text>
              <TextInput
                style={s.input}
                value={anguloEntrada}
                onChangeText={setAnguloEntrada}
                keyboardType="numeric"
              />
            </View>

            <View style={s.boxInputHalf}>
              <Text style={s.labelInput}>{t('cone.machine')}</Text>
              <View style={s.inputDisplay}>
                <Text style={s.txtYellow}>{t('cone.cncLathe')}</Text>
              </View>
            </View>
          </View>
        )}
      </View>

      <View style={s.card}>
        <Text style={s.cardTitle}>{t('cone.resultsTitle')}</Text>

        {resultados.map((item, index) => {
  const destaque = ['major', 'minor', 'length', 'halfAngle', 'totalAngle', 'offset'].includes(item.id);

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

      <Text style={[s.txtYellow, { width: 135, textAlign: 'right', flexWrap: 'wrap' }]}>
        {item.v}
      </Text>
    </View>
  );
})}
      </View>

      <View style={s.card}>
        <Text style={s.cardTitle}>{t('cone.latheExecution')}</Text>

        <View style={s.terminal}>
          <Text style={s.txtGcode}>{terminalCone}</Text>
        </View>
      </View>

      <View style={s.card}>
        <Text style={s.cardTitle}>{t('cone.dimensionalVerification')}</Text>

        <View style={s.linhaTabela}>
          <Text style={s.txtWhite}>{t('cone.instruments')}</Text>
          <Text style={s.txtYellow}>{t('cone.caliperMicrometer')}</Text>
        </View>

        <View style={s.linhaTabela}>
          <Text style={s.txtWhite}>{t('cone.check')}</Text>
          <Text style={s.txtYellow}>Ø1 / Ø2 / L</Text>
        </View>

        <View style={s.linhaTabela}>
          <Text style={s.txtWhite}>{t('cone.angle')}</Text>
          <Text style={s.txtYellow}>{t('cone.protractorSineBar')}</Text>
        </View>

        <View style={s.linhaTabela}>
          <Text style={s.txtWhite}>{t('cone.concentricity')}</Text>
          <Text style={s.txtYellow}>{t('cone.dialIndicator')}</Text>
        </View>
      </View>

      <View style={s.card}>
        <Text style={s.cardTitle}>{t('cone.tipsTitle')}</Text>

        <Text style={s.txtWhite}>{t('cone.tip1')}</Text>
        <Text style={s.txtWhite}>{t('cone.tip2')}</Text>
        <Text style={s.txtWhite}>{t('cone.tip3')}</Text>
        <Text style={s.txtWhite}>{t('cone.tip4')}</Text>
        <Text style={s.txtWhite}>{t('cone.tip5')}</Text>
        <Text style={s.txtWhite}>{t('cone.tip6')}</Text>
      </View>

      <View style={s.card}>
        <Text style={s.cardTitle}>{t('cone.finalInspection')}</Text>

        <View style={s.linhaTabela}>
          <Text style={s.txtWhite}>{t('cone.micrometer')}</Text>
          <Text style={s.txtYellow}>{t('cone.checkMajorMinor')}</Text>
        </View>

        <View style={s.linhaTabela}>
          <Text style={s.txtWhite}>{t('cone.indicator')}</Text>
          <Text style={s.txtYellow}>{t('cone.checkRunout')}</Text>
        </View>

        <View style={s.linhaTabela}>
          <Text style={s.txtWhite}>{t('cone.blueDye')}</Text>
          <Text style={s.txtYellow}>{t('cone.taperContact')}</Text>
        </View>

        <View style={s.linhaTabela}>
          <Text style={s.txtWhite}>{t('cone.sineBar')}</Text>
          <Text style={s.txtYellow}>{t('cone.optional')}</Text>
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
          <Text style={s.cardTitle}>{t('cone.gcodeTitle')}</Text>

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
            <Text
              style={{
                color: gcodeAtivo ? '#000' : '#777',
                fontSize: 10,
                fontWeight: 'bold'
              }}
            >
              {gcodeAtivo ? 'ON' : 'OFF'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={s.txtGray}>
          {t('cone.machineDescription')}
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
