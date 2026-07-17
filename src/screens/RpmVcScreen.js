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

const MODOS = [
  'Torneamento',
  'Fresamento',
  'Furação',
  'Avanço',
  'Tempo'
];

const MODO_LABEL_KEYS = {
  Torneamento: 'rpmVc.modeTurning',
  Fresamento: 'rpmVc.modeMilling',
  Furação: 'rpmVc.modeDrilling',
  Avanço: 'rpmVc.modeFeed',
  Tempo: 'rpmVc.modeTime'
};

const CONTROLES_CNC = ['FANUC', 'SIEMENS', 'MITSUBISHI', 'HAAS', 'MACH3'];

const MATERIAIS = {
  'Aço carbono': { vc: 120, fz: 0.08, fTorno: 0.25 },
  'Aço inox': { vc: 70, fz: 0.05, fTorno: 0.15 },
  'Alumínio': { vc: 250, fz: 0.12, fTorno: 0.35 },
  'Latão': { vc: 180, fz: 0.10, fTorno: 0.30 },
  'Ferro fundido': { vc: 90, fz: 0.07, fTorno: 0.20 }
};

const MATERIAL_LABEL_KEYS = {
  'Aço carbono': 'rpmVc.materialCarbonSteel',
  'Aço inox': 'rpmVc.materialStainless',
  Alumínio: 'rpmVc.materialAluminum',
  Latão: 'rpmVc.materialBrass',
  'Ferro fundido': 'rpmVc.materialCastIron'
};

export default function RpmVcScreen({ navigation }) {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const s = getCasillasStyles(theme);

  const [modo, setModo] = useState('Torneamento');
  const [material, setMaterial] = useState('Aço carbono');

  const [diametro, setDiametro] = useState('50.00');
  const [vc, setVc] = useState('120.00');
  const [rpm, setRpm] = useState('38197');

  const [fz, setFz] = useState('0.08');
  const [dentes, setDentes] = useState('4');
  const [avancoMmMin, setAvancoMmMin] = useState('1.00');

  const [comprimento, setComprimento] = useState('100.00');
  const [profundidade, setProfundidade] = useState('1.00');

  const [campoEditado, setCampoEditado] = useState('vc');
  const [resultados, setResultados] = useState([]);
  const [gcode, setGcode] = useState('');
  const [gcodeAtivo, setGcodeAtivo] = useState(true);
  const [controleCnc, setControleCnc] = useState('FANUC');

  const modeLabel = (value) => t(MODO_LABEL_KEYS[value] || 'rpmVc.modeTurning');
  const materialLabel = (value) => t(MATERIAL_LABEL_KEYS[value] || 'rpmVc.materialCarbonSteel');

  function num(valor) {
    return parseFloat(String(valor).replace(',', '.')) || 0;
  }

  function formatMM(valor) {
    if (!isFinite(valor)) return '0.00';
    return valor.toFixed(2);
  }

  function formatRPM(valor) {
    if (!isFinite(valor)) return '0';
    return String(Math.round(valor));
  }

  function formatAvanco(valor) {
    if (!isFinite(valor)) return '0.00';
    return valor.toFixed(2);
  }

  function formatCoord(valor) {
    if (!isFinite(valor)) return '0.000';
    return valor.toFixed(3);
  }

 function selecionarMaterial(nome) {
  const dados = MATERIAIS[nome];

  setMaterial(nome);
  setVc(formatMM(dados.vc));
  setFz(formatMM(dados.fz));
  setCampoEditado('vc');

  const rpmCalculado = (1000 * dados.vc) / (Math.PI * num(diametro));

  if (modo === 'Torneamento') {
  const vfTorno = dados.fTorno * rpmCalculado;

  setAvancoMmMin(formatRPM(vfTorno));
}

if (modo === 'Fresamento' || modo === 'Avanço') {
  const dentesAtual = parseInt(dentes) || 4;
  const avancoCalculado = dados.fz * dentesAtual * rpmCalculado;

  setFz(formatMM(dados.fz));
  setAvancoMmMin(formatRPM(avancoCalculado));
}

if (modo === 'Furação') {
  const furoFz = dados.fz * 0.6;
  const dentesFuro = 2;

  const avancoCalculado =
    furoFz * dentesFuro * rpmCalculado;

  setFz(formatMM(furoFz));
  setDentes('2');
  setAvancoMmMin(formatRPM(avancoCalculado));
}
}
function trocarModo(novoModo) {
  const dados = MATERIAIS[material];
  const rpmCalculado = (1000 * dados.vc) / (Math.PI * num(diametro));

  setModo(novoModo);
  setCampoEditado('vc');

  if (novoModo === 'Torneamento') {
  const vfTorno = dados.fTorno * rpmCalculado;

  setAvancoMmMin(formatRPM(vfTorno));
}

if (novoModo === 'Fresamento' || novoModo === 'Avanço') {
  const dentesAtual = parseInt(dentes) || 4;
  const avancoCalculado = dados.fz * dentesAtual * rpmCalculado;

  setFz(formatMM(dados.fz));
  setAvancoMmMin(formatRPM(avancoCalculado));
}

if (novoModo === 'Furação') {
  const furoFz = dados.fz * 0.6;
  const dentesFuro = 2;

  const avancoCalculado =
    furoFz * dentesFuro * rpmCalculado;

  setFz(formatMM(furoFz));
  setDentes('2');
  setAvancoMmMin(formatRPM(avancoCalculado));
}
}
  function gerarGcode({
    maquina,
    rotacao,
    d,
    comp,
    prof,
    avanco,
    avancoPorVolta
  }) {
    let codigo = '';

    const rpmInt = formatRPM(rotacao);
    const feedMin = formatAvanco(avanco);
    const feedVolta = formatAvanco(avancoPorVolta);
    const xInicial = formatCoord(d + 2);
    const zSeguro = '5.000';
    const zInicial = '2.000';
    const zFinal = formatCoord(-Math.abs(prof));
    const compFinal = formatCoord(comp);

    if (controleCnc === 'FANUC') {
      codigo =
`%
O0400 (FANUC - RPM / VC - ${modeLabel(modo).toUpperCase()})
( ${t('rpmVc.gcodeMaterial')}: ${materialLabel(material).toUpperCase()} )
( ${t('rpmVc.gcodeMachine')}: ${maquina.toUpperCase()} )
G21 G40 G90 G94
`;

      if (modo === 'Torneamento') {
        codigo +=
`G97 S${rpmInt} M03
G00 X${xInicial} Z${zInicial}
G01 Z-${compFinal} F${feedVolta}
M05
M30
%`;
      } else if (modo === 'Furação') {
        codigo +=
`G17
S${rpmInt} M03
G00 X0.000 Y0.000 Z${zSeguro}
G83 Z${zFinal} R2.000 Q3.000 F${feedMin}
G80
M05
M30
%`;
      } else {
        codigo +=
`G17
S${rpmInt} M03
G00 X0.000 Y0.000 Z${zSeguro}
G01 Z${zFinal} F${feedMin}
G01 X${compFinal} F${feedMin}
G00 Z50.000
M05
M30
%`;
      }
    }

        if (controleCnc === 'SIEMENS') {
      codigo =
`; SIEMENS - RPM / VC - ${modeLabel(modo).toUpperCase()}
; ${t('rpmVc.gcodeMaterial')}: ${materialLabel(material).toUpperCase()}
; ${t('rpmVc.gcodeMachine')}: ${maquina.toUpperCase()}
G21 G90 G94
`;

      if (modo === 'Torneamento') {
        codigo +=
`G95
S${rpmInt} M3
G0 X${xInicial} Z${zInicial}
G1 Z-${compFinal} F${feedVolta}
M5
M30`;
      } else if (modo === 'Furação') {
        codigo +=
`G17
S${rpmInt} M3
G0 X0.000 Y0.000 Z${zSeguro}
; ${t('rpmVc.gcodeCycleCheck')}
; ${t('rpmVc.gcodeFinalZ')}: ${zFinal}
; ${t('rpmVc.gcodeFeed')}: ${feedMin}
M5
M30`;
      } else {
        codigo +=
`G17
S${rpmInt} M3
G0 X0.000 Y0.000 Z${zSeguro}
G1 Z${zFinal} F${feedMin}
G1 X${compFinal} F${feedMin}
G0 Z50.000
M5
M30`;
      }
    }

    if (controleCnc === 'MITSUBISHI') {
      codigo =
`%
O0400 (MITSUBISHI - RPM / VC - ${modeLabel(modo).toUpperCase()})
( ${t('rpmVc.gcodeMaterial')}: ${materialLabel(material).toUpperCase()} )
( ${t('rpmVc.gcodeMachine')}: ${maquina.toUpperCase()} )
G21 G40 G90 G94
`;

      if (modo === 'Torneamento') {
        codigo +=
`G97 S${rpmInt} M03
G00 X${xInicial} Z${zInicial}
G01 Z-${compFinal} F${feedVolta}
M05
M30
%`;
      } else if (modo === 'Furação') {
        codigo +=
`G17
S${rpmInt} M03
G00 X0.000 Y0.000 Z${zSeguro}
G83 Z${zFinal} R2.000 Q3.000 F${feedMin}
G80
M05
M30
%`;
      } else {
        codigo +=
`G17
S${rpmInt} M03
G00 X0.000 Y0.000 Z${zSeguro}
G01 Z${zFinal} F${feedMin}
G01 X${compFinal} F${feedMin}
G00 Z50.000
M05
M30
%`;
      }
    }

    if (controleCnc === 'HAAS') {
      codigo =
`%
O0400 (HAAS - RPM / VC - ${modeLabel(modo).toUpperCase()})
( ${t('rpmVc.gcodeMaterial')}: ${materialLabel(material).toUpperCase()} )
( ${t('rpmVc.gcodeMachine')}: ${maquina.toUpperCase()} )
G21 G40 G90 G94
`;

      if (modo === 'Torneamento') {
        codigo +=
`G97 S${rpmInt} M03
G00 X${xInicial} Z${zInicial}
G01 Z-${compFinal} F${feedVolta}
M05
M30
%`;
      } else if (modo === 'Furação') {
        codigo +=
`G17
S${rpmInt} M03
G00 X0.000 Y0.000 Z${zSeguro}
G83 Z${zFinal} R2.000 Q3.000 F${feedMin}
G80
M05
M30
%`;
      } else {
        codigo +=
`G17
S${rpmInt} M03
G00 X0.000 Y0.000 Z${zSeguro}
G01 Z${zFinal} F${feedMin}
G01 X${compFinal} F${feedMin}
G00 Z50.000
M05
M30
%`;
      }
    }

    if (controleCnc === 'MACH3') {
      codigo =
`(MACH3 - RPM / VC - ${modeLabel(modo).toUpperCase()})
( ${t('rpmVc.gcodeMaterial')}: ${materialLabel(material).toUpperCase()} )
( ${t('rpmVc.gcodeMachine')}: ${maquina.toUpperCase()} )
G21 G90 G94
`;

      if (modo === 'Torneamento') {
        codigo +=
`G95
S${rpmInt} M03
G00 X${xInicial} Z${zInicial}
G01 Z-${compFinal} F${feedVolta}
M05
M30`;
      } else if (modo === 'Furação') {
        codigo +=
`G17
S${rpmInt} M03
G00 X0.000 Y0.000 Z${zSeguro}
G81 Z${zFinal} R2.000 F${feedMin}
G80
M05
M30`;
      } else {
        codigo +=
`G17
S${rpmInt} M03
G00 X0.000 Y0.000 Z${zSeguro}
G01 Z${zFinal} F${feedMin}
G01 X${compFinal} F${feedMin}
G00 Z50.000
M05
M30`;
      }
    }

       return codigo;
  }

  function calcular() {
    const d = num(diametro);
    let velocidadeCorte = num(vc);
    let rotacao = num(rpm);

    const avancoDente = num(fz);
    const z = parseInt(dentes) || 1;
    let avanco = num(avancoMmMin);

    const comp = num(comprimento);
    const prof = num(profundidade);

    if (d <= 0) {
      setResultados([]);
      setGcode('');
      return;
    }

    if (campoEditado === 'vc') {
      rotacao = (1000 * velocidadeCorte) / (Math.PI * d);
setRpm(formatRPM(rotacao));
    }

    if (campoEditado === 'rpm') {
      velocidadeCorte = (Math.PI * d * rotacao) / 1000;
      setVc(formatMM(velocidadeCorte));
    }

    if (modo === 'Fresamento' || modo === 'Furação' || modo === 'Avanço') {
      avanco = avancoDente * z * rotacao;
      setAvancoMmMin(formatRPM(avanco));
    }

    if (modo === 'Torneamento') {
      avanco = num(avancoMmMin);
    }

    const avancoPorVolta = rotacao > 0 ? avanco / rotacao : 0;
    const tempoMin = avanco > 0 ? comp / avanco : 0;
    const rpmLimiteSeguro = rotacao * 1.15;

    const lista = [
      { n: t('rpmVc.resultMode'), v: modeLabel(modo) },
      { n: t('rpmVc.resultMaterial'), v: materialLabel(material) },
      { n: t('rpmVc.cncSystem'), v: controleCnc },
      { n: t('rpmVc.diameter'), v: `${formatMM(d)} mm` },
      { n: t('rpmVc.cuttingSpeed'), v: `${formatMM(velocidadeCorte)} m/min` },
      { n: t('rpmVc.calculatedRotation'), v: `${formatRPM(rotacao)} rpm` },
      { n: t('rpmVc.suggestedRpmLimit'), v: `${formatRPM(rpmLimiteSeguro)} rpm` }
    ];

    if (modo === 'Fresamento' || modo === 'Furação' || modo === 'Avanço') {
      lista.push(
        { n: t('rpmVc.feedPerTooth'), v: `${formatMM(avancoDente)} ${t('conversoes.mmPerToothUnit')}` },
        { n: t('rpmVc.numberCuts'), v: `${z}` },
        { n: t('rpmVc.calculatedFeed'), v: `${formatRPM(avanco)} mm/min` }
      );
    }

    if (modo === 'Tempo') {
      lista.push(
        { n: t('rpmVc.machinedLength'), v: `${formatMM(comp)} mm` },
        { n: t('rpmVc.usedFeed'), v: `${formatRPM(avanco)} mm/min` },
        { n: t('rpmVc.estimatedTime'), v: `${formatMM(tempoMin)} min` }
      );
    }

    if (modo === 'Torneamento') {
      lista.push(
        { n: t('rpmVc.informedLinearFeed'), v: `${formatRPM(avanco)} mm/min` },
        { n: t('rpmVc.feedPerRevLabel'), v: `${formatAvanco(avancoPorVolta)} mm/rev` },
        { n: t('rpmVc.cuttingDepth'), v: `${formatMM(prof)} mm` }
      );
    }

    let maquina = t('rpmVc.machineCnc');

    if (modo === 'Torneamento') {
      maquina = t('rpmVc.machineLathe');
    }

    if (modo === 'Fresamento' || modo === 'Avanço') {
      maquina = t('rpmVc.machineMill');
    }

    if (modo === 'Furação') {
      maquina = t('rpmVc.machineDrill');
    }

    const codigo = gerarGcode({
      maquina,
      rotacao,
      d,
      comp,
      prof,
      avanco,
      avancoPorVolta
    });

    setResultados(lista);
    setGcode(codigo);
  }
    useEffect(() => {
    calcular();
  }, [
    modo,
    material,
    diametro,
    vc,
    rpm,
    fz,
    dentes,
    avancoMmMin,
    comprimento,
    profundidade,
    campoEditado,
    controleCnc,
    t
  ]);

  const terminalText =
    `${t('rpmVc.terminalTitle')}\n` +
    `${t('rpmVc.terminalMode')}: ${modeLabel(modo)}\n` +
    `${t('rpmVc.material')}: ${materialLabel(material)}\n` +
    `${t('rpmVc.cncSystem')}: ${controleCnc}\n` +
    `${t('rpmVc.terminalVcHint')}\n` +
    `${t('rpmVc.terminalFeedHint')}\n` +
    `${t('rpmVc.terminalStartHint')}\n` +
    t('rpmVc.terminalCheckHint');

  const relatorio =
    `${t('rpmVc.reportTitle')}\n\n` +
    resultados.map((item) => `${item.n}: ${item.v}`).join('\n') +
    `\n\n${gcode}`;

  return (
    <CasillasLayout
      navigation={navigation}
      activeRoute="RpmVc"
      title={t('rpmVc.title')}
      subtitle={t('rpmVc.subtitle')}
      terminalText={terminalText}
      shareText={relatorio}
    >
      <View style={s.card}>
        <Text style={s.cardTitle}>1. {t('rpmVc.calcMode')}</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {MODOS.map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => trocarModo(item)}
              style={[
                s.btnTipo,
                modo === item && s.btnTipoAtivo
              ]}
            >
              <Text
                style={[
                  s.btnTipoText,
                  modo === item && s.btnTipoTextAtivo
                ]}
              >
                {modeLabel(item)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={s.card}>
        <Text style={s.cardTitle}>2. {t('rpmVc.material')}</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {Object.keys(MATERIAIS).map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => selecionarMaterial(item)}
              style={[
                s.btnTipo,
                material === item && s.btnTipoAtivo
              ]}
            >
              <Text
                style={[
                  s.btnTipoText,
                  material === item && s.btnTipoTextAtivo
                ]}
              >
                {materialLabel(item)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={s.card}>
        <Text style={s.cardTitle}>3. {t('rpmVc.inputData')}</Text>

        <View style={s.gridInputs}>
          <View style={s.boxInputHalf}>
            <Text style={s.labelInput}>{t('rpmVc.cuttingDia')}</Text>
            <TextInput
              style={s.input}
              value={diametro}
              onChangeText={setDiametro}
              keyboardType="numeric"
            />
          </View>

          <View style={s.boxInputHalf}>
            <Text style={s.labelInput}>{t('rpmVc.cuttingSpeed')}</Text>
            <TextInput
              style={s.input}
              value={vc}
              onChangeText={(txt) => {
                setCampoEditado('vc');
                setVc(txt);
              }}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={s.gridInputs}>
          <View style={s.boxInputHalf}>
            <Text style={s.labelInput}>{t('rpmVc.rpm')}</Text>
            <TextInput
              style={s.input}
              value={rpm}
              onChangeText={setRpm}
editable={false}
              keyboardType="numeric"
            />
          </View>

          <View style={s.boxInputHalf}>
            <Text style={s.labelInput}>
              {t('rpmVc.feedMmMin')}
            </Text>
            <TextInput
              style={s.input}
              value={avancoMmMin}
              onChangeText={setAvancoMmMin}
              keyboardType="numeric"
            />
          </View>
        </View>

        {(modo === 'Fresamento' || modo === 'Furação' || modo === 'Avanço') && (
          <View style={s.gridInputs}>
            <View style={s.boxInputHalf}>
              <Text style={s.labelInput}>{t('rpmVc.feedPerTooth')}</Text>
              <TextInput
                style={s.input}
                value={fz}
                onChangeText={setFz}
                keyboardType="numeric"
              />
            </View>

            <View style={s.boxInputHalf}>
              <Text style={s.labelInput}>{t('rpmVc.teeth')}</Text>
              <TextInput
                style={s.input}
                value={dentes}
                onChangeText={(txt) => setDentes(txt.replace(/[^0-9]/g, ''))}
                keyboardType="numeric"
              />
            </View>
          </View>
        )}

        <View style={s.gridInputs}>
          <View style={s.boxInputHalf}>
            <Text style={s.labelInput}>{t('rpmVc.length')}</Text>
            <TextInput
              style={s.input}
              value={comprimento}
              onChangeText={setComprimento}
              keyboardType="numeric"
            />
          </View>

          <View style={s.boxInputHalf}>
            <Text style={s.labelInput}>{t('rpmVc.depth')}</Text>
            <TextInput
              style={s.input}
              value={profundidade}
              onChangeText={setProfundidade}
              keyboardType="numeric"
            />
          </View>
        </View>
      </View>

      <View style={s.card}>
        <Text style={s.cardTitle}>4. {t('rpmVc.results')}</Text>

        {resultados.map((item, index) => (
          <View
            key={index}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              paddingVertical: 8,
              borderBottomWidth: 1,
              borderColor: '#111',
              gap: 10
            }}
          >
            <Text
              style={[
                s.txtWhite,
                {
                  flex: 1,
                  flexWrap: 'wrap'
                }
              ]}
            >
              {item.n}
            </Text>

            <Text
              style={[
                s.txtYellow,
                {
                  width: 130,
                  textAlign: 'right',
                  flexWrap: 'wrap'
                }
              ]}
            >
              {item.v}
            </Text>
          </View>
        ))}
      </View>

      <View style={s.card}>
        <Text style={s.cardTitle}>{t('rpmVc.machiningTips')}</Text>

        {[1, 2, 3, 4, 5, 6, 7].map((item) => (
          <Text key={item} style={s.txtWhite}>{t(`rpmVc.tip${item}`)}</Text>
        ))}
      </View>

      <View style={s.card}>
        <Text style={s.cardTitle}>{t('rpmVc.finalInspection')}</Text>

        <View style={s.linhaTabela}>
          <Text style={s.txtWhite}>{t('rpmVc.tachometer')}</Text>
          <Text style={s.txtYellow}>{t('rpmVc.actualRpm')}</Text>
        </View>

        <View style={s.linhaTabela}>
          <Text style={s.txtWhite}>{t('rpmVc.caliper')}</Text>
          <Text style={s.txtYellow}>{t('rpmVc.checkDiameter')}</Text>
        </View>

        <View style={s.linhaTabela}>
          <Text style={s.txtWhite}>{t('rpmVc.roughness')}</Text>
          <Text style={s.txtYellow}>{t('rpmVc.checkFinish')}</Text>
        </View>

        <View style={s.linhaTabela}>
          <Text style={s.txtWhite}>{t('rpmVc.chip')}</Text>
          <Text style={s.txtYellow}>{t('rpmVc.colorShape')}</Text>
        </View>
      </View>

      <View style={s.card}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Text style={s.cardTitle}>{t('rpmVc.gcodeTitle')}</Text>

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
              {gcodeAtivo ? t('rpmVc.gcodeOn') : t('rpmVc.gcodeOff')}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={s.txtGray}>
          {t('rpmVc.machineDescription')}
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 4, marginTop: 8, marginBottom: 8 }}
        >
          {CONTROLES_CNC.map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                s.btnTipo,
                controleCnc === item && s.btnTipoAtivo
              ]}
              onPress={() => setControleCnc(item)}
            >
              <Text
                style={[
                  s.btnTipoText,
                  controleCnc === item && s.btnTipoTextAtivo
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
