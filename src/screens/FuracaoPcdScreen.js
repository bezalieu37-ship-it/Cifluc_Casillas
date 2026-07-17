import React, { useEffect, useState } from 'react';

import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView
} from 'react-native';

import CasillasLayout, {
  casillasStyles as styles,
  getCasillasStyles
} from '../components/CasillasLayout';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

const CONTROLES_CNC = ['FANUC', 'SIEMENS', 'MITSUBISHI', 'HAAS', 'MACH3'];

export default function FuracaoPcdScreen({ navigation }) {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const s = getCasillasStyles(theme);

  const [pcdDiametro, setPcdDiametro] = useState('100');
  const [pcdFuros, setPcdFuros] = useState('6');
  const [pcdAnguloIni, setPcdAnguloIni] = useState('0');
  const [pcdCentroX, setPcdCentroX] = useState('0');
  const [pcdCentroY, setPcdCentroY] = useState('0');

  const [pcdResultados, setPcdResultados] = useState([]);
  const [pcdDistCordal, setPcdDistCordal] = useState('0.00');
  const [pcdGcode, setPcdGcode] = useState('');
  const [gcodeAtivo, setGcodeAtivo] = useState(true);
  const [controleCnc, setControleCnc] = useState('FANUC');

  function formatMM(valor) {
    return Number(valor || 0).toFixed(2);
  }

  function formatCoord(valor) {
    return Number(valor || 0).toFixed(3);
  }

  function formatAng(valor) {
    return Number(valor || 0).toFixed(2);
  }

  function calcularPCD() {
    const d = parseFloat(pcdDiametro.replace(',', '.')) || 0;
    const n = parseInt(pcdFuros) || 1;
    const angIni = parseFloat(pcdAnguloIni.replace(',', '.')) || 0;
    const cx = parseFloat(pcdCentroX.replace(',', '.')) || 0;
    const cy = parseFloat(pcdCentroY.replace(',', '.')) || 0;

    if (d <= 0 || n <= 0) {
      setPcdResultados([]);
      setPcdDistCordal('0.00');
      setPcdGcode('');
      return;
    }

    const raio = d / 2;
    const cordal = d * Math.sin((180 / n) * (Math.PI / 180));

    setPcdDistCordal(formatMM(cordal));

    const furos = [];

    for (let i = 0; i < n; i++) {
      const anguloGraus = angIni + i * (360 / n);
      let anguloExibicao = anguloGraus % 360;

      if (anguloExibicao < 0) {
        anguloExibicao += 360;
      }

      const rad = anguloGraus * (Math.PI / 180);
      const x = cx + raio * Math.cos(rad);
      const y = cy + raio * Math.sin(rad);

      furos.push({
        id: i + 1,
        ang: formatAng(anguloExibicao),
        x: formatCoord(x),
        y: formatCoord(y)
      });
    }

    const rpm = 1200;
    const zSeguro = 5.000;
    const zInicial = 2.000;
    const zFinal = -15.000;
    const retracao = 2.000;
    const incremento = 3.000;
    const avanco = 150;

    let gcode = '';

    if (controleCnc === 'FANUC') {
      gcode =
`%
O0200 (FANUC - ${t('furacao.gcodeDrilling')})
(PCD Ø${formatMM(d)} - ${n} ${t('furacao.gcodeHoles')})
G21 G40 G90 G94
G17
G97 S${Math.round(rpm)} M03
G00 X${formatCoord(cx)} Y${formatCoord(cy)} Z${formatCoord(zSeguro)}
G83 Z${formatCoord(zFinal)} R${formatCoord(retracao)} Q${formatCoord(incremento)} F${Math.round(avanco)}
`;

      furos.forEach((furo) => {
        gcode += `X${furo.x} Y${furo.y}\n`;
      });

      gcode += `G80
G00 Z50.000
M05
M30
%`;
    }

    if (controleCnc === 'SIEMENS') {
      gcode =
`; SIEMENS - ${t('furacao.gcodeDrilling')}
; PCD Ø${formatMM(d)} - ${n} ${t('furacao.gcodeHoles')}
G21 G90 G94
G17
S${Math.round(rpm)} M3
G0 X${formatCoord(cx)} Y${formatCoord(cy)} Z${formatCoord(zSeguro)}
; ${t('furacao.gcodeCycle83')}
; ${t('furacao.gcodeFinalZ')}: ${formatCoord(zFinal)}
; ${t('furacao.gcodeRetract')}: ${formatCoord(retracao)}
; ${t('furacao.gcodeIncrement')}: ${formatCoord(incremento)}
; ${t('furacao.gcodeFeed')}: ${Math.round(avanco)}
`;

      furos.forEach((furo) => {
        gcode += `G0 X${furo.x} Y${furo.y}\n`;
        gcode += `; CYCLE83 ${t('furacao.gcodeAtHole')} #${furo.id}\n`;
      });

      gcode += `M5
M30`;
    }

    if (controleCnc === 'MITSUBISHI') {
      gcode =
`%
O0200 (MITSUBISHI - ${t('furacao.gcodeDrilling')})
(PCD Ø${formatMM(d)} - ${n} ${t('furacao.gcodeHoles')})
G21 G40 G90 G94
G17
G97 S${Math.round(rpm)} M03
G00 X${formatCoord(cx)} Y${formatCoord(cy)} Z${formatCoord(zSeguro)}
G83 Z${formatCoord(zFinal)} R${formatCoord(retracao)} Q${formatCoord(incremento)} F${Math.round(avanco)}
`;

      furos.forEach((furo) => {
        gcode += `X${furo.x} Y${furo.y}\n`;
      });

      gcode += `G80
G00 Z50.000
M05
M30
%`;
    }

    if (controleCnc === 'HAAS') {
      gcode =
`%
O0200 (HAAS - ${t('furacao.gcodeDrilling')})
(PCD Ø${formatMM(d)} - ${n} ${t('furacao.gcodeHoles')})
G21 G40 G90 G94
G17
S${Math.round(rpm)} M03
G00 X${formatCoord(cx)} Y${formatCoord(cy)} Z${formatCoord(zSeguro)}
G83 Z${formatCoord(zFinal)} R${formatCoord(retracao)} Q${formatCoord(incremento)} F${Math.round(avanco)}
`;

      furos.forEach((furo) => {
        gcode += `X${furo.x} Y${furo.y}\n`;
      });

      gcode += `G80
G00 Z50.000
M05
M30
%`;
    }

    if (controleCnc === 'MACH3') {
      gcode =
`(MACH3 - ${t('furacao.gcodeDrilling')})
(PCD Ø${formatMM(d)} - ${n} ${t('furacao.gcodeHoles')})
G21 G90 G94
G17
S${Math.round(rpm)} M03
G00 Z${formatCoord(zSeguro)}
`;

      furos.forEach((furo) => {
        gcode += `G00 X${furo.x} Y${furo.y}\n`;
        gcode += `G81 Z${formatCoord(zFinal)} R${formatCoord(retracao)} F${Math.round(avanco)}\n`;
        gcode += `G80\n`;
      });

      gcode += `G00 Z50.000
M05
M30`;
    }

    setPcdResultados(furos);
    setPcdGcode(gcode);
  }

  useEffect(() => {
    calcularPCD();
  }, [
    pcdDiametro,
    pcdFuros,
    pcdAnguloIni,
    pcdCentroX,
    pcdCentroY,
    controleCnc,
    t
  ]);

  const relatorio =
    `${t('furacao.reportTitle')}\n\n` +
    `${t('furacao.cncSystem')}: ${controleCnc}\n` +
    `${t('furacao.pcdDiameter')}: ${formatMM(pcdDiametro.replace(',', '.'))} mm\n` +
    `${t('furacao.holeCount')}: ${parseInt(pcdFuros) || 0}\n` +
    `${t('furacao.startAngleLabel')}: ${formatAng(pcdAnguloIni.replace(',', '.'))}°\n` +
    `${t('furacao.centerX')}: ${formatCoord(pcdCentroX.replace(',', '.'))}\n` +
    `${t('furacao.centerY')}: ${formatCoord(pcdCentroY.replace(',', '.'))}\n` +
    `${t('furacao.chordalDist')}: ${pcdDistCordal} mm\n\n` +
    pcdResultados
      .map((furo) => `#${furo.id} | ${furo.ang}° | X${furo.x} | Y${furo.y}`)
      .join('\n') +
    `\n\n${pcdGcode}`;

  return (
    <CasillasLayout
      navigation={navigation}
      activeRoute="FuracaoPcd"
      title={t('furacao.title')}
      subtitle={t('furacao.subtitle')}
      terminalText={t('furacao.terminalText', { holes: pcdFuros, diameter: pcdDiametro, control: controleCnc })}
      shareText={relatorio}
    >
      <View style={s.card}>
        <Text style={s.cardTitle}>{t('furacao.configTitle')}</Text>

        <View style={s.gridInputs}>
          <View style={s.boxInputHalf}>
            <Text style={s.labelInput}>{t('furacao.centerDiameter')}</Text>
            <TextInput
              style={s.input}
              value={pcdDiametro}
              onChangeText={setPcdDiametro}
              keyboardType="numeric"
            />
          </View>

          <View style={s.boxInputHalf}>
            <Text style={s.labelInput}>{t('furacao.numHolesLabel')}</Text>
            <TextInput
              style={s.input}
              value={pcdFuros}
              onChangeText={(txt) => setPcdFuros(txt.replace(/[^0-9]/g, ''))}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={s.gridInputs}>
          <View style={s.boxInputHalf}>
            <Text style={s.labelInput}>{t('furacao.startAngleLabel')}</Text>
            <TextInput
              style={s.input}
              value={pcdAnguloIni}
              onChangeText={setPcdAnguloIni}
              keyboardType="numeric"
            />
          </View>

          <View style={s.boxInputHalf}>
            <Text style={s.labelInput}>{t('furacao.chordalDist')}</Text>
            <View style={s.inputDisplay}>
              <Text style={s.txtYellow}>{pcdDistCordal} mm</Text>
            </View>
          </View>
        </View>

        <View style={s.gridInputs}>
          <View style={s.boxInputHalf}>
            <Text style={s.labelInput}>{t('furacao.centerX')}</Text>
            <TextInput
              style={s.input}
              value={pcdCentroX}
              onChangeText={setPcdCentroX}
              keyboardType="numeric"
            />
          </View>

          <View style={s.boxInputHalf}>
            <Text style={s.labelInput}>{t('furacao.centerY')}</Text>
            <TextInput
              style={s.input}
              value={pcdCentroY}
              onChangeText={setPcdCentroY}
              keyboardType="numeric"
            />
          </View>
        </View>
      </View>

      <View style={s.card}>
        <Text style={s.cardTitle}>{t('furacao.coordinatesTitle')}</Text>

        {pcdResultados.map((furo) => (
          <View key={furo.id} style={s.linhaTabela}>
            <Text style={s.txtWhite}>#{furo.id}</Text>
            <Text style={s.txtGray}>{furo.ang}°</Text>
            <Text style={s.txtYellow}>X{furo.x}</Text>
            <Text style={s.txtYellow}>Y{furo.y}</Text>
          </View>
        ))}
      </View>

      <View style={s.card}>
        <Text style={s.cardTitle}>{t('furacao.verificationTitle')}</Text>

        <View style={s.linhaTabela}>
          <Text style={s.txtWhite}>{t('furacao.pcdDiameter')}</Text>
          <Text style={s.txtYellow}>{formatMM(pcdDiametro.replace(',', '.'))} mm</Text>
        </View>

        <View style={s.linhaTabela}>
          <Text style={s.txtWhite}>{t('furacao.pcdRadius')}</Text>
          <Text style={s.txtYellow}>{formatMM((parseFloat(pcdDiametro.replace(',', '.')) || 0) / 2)} mm</Text>
        </View>

        <View style={s.linhaTabela}>
          <Text style={s.txtWhite}>{t('furacao.chordalDist')}</Text>
          <Text style={s.txtYellow}>{pcdDistCordal} mm</Text>
        </View>

        <View style={s.linhaTabela}>
          <Text style={s.txtWhite}>{t('furacao.check')}</Text>
          <Text style={s.txtYellow}>{t('furacao.checkValues')}</Text>
        </View>
      </View>

      <View style={s.card}>
        <Text style={s.cardTitle}>{t('furacao.tipsTitle')}</Text>

        <Text style={s.txtWhite}>{t('furacao.tip1')}</Text>
        <Text style={s.txtWhite}>{t('furacao.tip2')}</Text>
        <Text style={s.txtWhite}>{t('furacao.tip3')}</Text>
        <Text style={s.txtWhite}>{t('furacao.tip4')}</Text>
        <Text style={s.txtWhite}>{t('furacao.tip5')}</Text>
        <Text style={s.txtWhite}>{t('furacao.tip6')}</Text>
      </View>

      <View style={s.card}>
        <Text style={s.cardTitle}>{t('furacao.inspectionTitle')}</Text>

        <View style={s.linhaTabela}>
          <Text style={s.txtWhite}>{t('furacao.caliper')}</Text>
          <Text style={s.txtYellow}>{t('furacao.caliperValue')}</Text>
        </View>

        <View style={s.linhaTabela}>
          <Text style={s.txtWhite}>{t('furacao.dialIndicator')}</Text>
          <Text style={s.txtYellow}>{t('furacao.dialIndicatorValue')}</Text>
        </View>

        <View style={s.linhaTabela}>
          <Text style={s.txtWhite}>{t('furacao.gauge')}</Text>
          <Text style={s.txtYellow}>{t('furacao.gaugeValue')}</Text>
        </View>

        <View style={s.linhaTabela}>
          <Text style={s.txtWhite}>{t('furacao.cmm')}</Text>
          <Text style={s.txtYellow}>{t('furacao.cmmValue')}</Text>
        </View>
      </View>

      <View style={s.card}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={s.cardTitle}>{t('furacao.gcodeTitle')}</Text>

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
              {gcodeAtivo ? t('furacao.on') : t('furacao.off')}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={s.txtGray}>
          {t('furacao.machineType')}
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 4, marginTop: 8, marginBottom: 8 }}
        >
          {CONTROLES_CNC.map((item) => (
            <TouchableOpacity
              key={item}
              style={[s.btnTipo, controleCnc === item && s.btnTipoAtivo]}
              onPress={() => setControleCnc(item)}
            >
              <Text style={[s.btnTipoText, controleCnc === item && s.btnTipoTextAtivo]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {gcodeAtivo && (
          <View style={s.terminal}>
            <Text style={s.txtGcode}>
              {pcdGcode}
            </Text>
          </View>
        )}
      </View>
    </CasillasLayout>
  );
}
