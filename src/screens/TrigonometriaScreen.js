import React, { useEffect, useState } from 'react';

import {
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity
} from 'react-native';

import CasillasLayout, {
  casillasStyles as styles
} from '../components/CasillasLayout';
import { useLanguage } from '../contexts/LanguageContext';

const SUBABAS = [
  'Triângulo Retângulo',
  'Seno/Cosseno/Tangente',
  'Coordenadas X/Y',
  'Polar → Cartesiano',
  'Cartesiano → Polar',
  'Chanfro / Inclinação',
  'Coordenadas CNC'
];

const SUBTAB_LABEL_KEYS = {
  'Triângulo Retângulo': 'trigonometria.tabRightTriangle',
  'Seno/Cosseno/Tangente': 'trigonometria.tabTrigFunctions',
  'Coordenadas X/Y': 'trigonometria.tabCoordinates',
  'Polar → Cartesiano': 'trigonometria.tabPolarCartesian',
  'Cartesiano → Polar': 'trigonometria.tabCartesianPolar',
  'Chanfro / Inclinação': 'trigonometria.tabChamfer',
  'Coordenadas CNC': 'trigonometria.tabCncCoordinates'
};

const CONTROLES = ['FANUC', 'SIEMENS', 'MITSUBISHI', 'HAAS', 'MACH3'];

export default function TrigonometriaScreen({ navigation }) {
  const { t } = useLanguage();
  const [subAba, setSubAba] = useState('Triângulo Retângulo');
  const [controle, setControle] = useState('FANUC');

  const [angulo, setAngulo] = useState('30.00');
  const [catetoX, setCatetoX] = useState('43.30');
  const [catetoY, setCatetoY] = useState('25.00');
  const [hipotenusa, setHipotenusa] = useState('50.00');

  const [raio, setRaio] = useState('50.00');
  const [coordX, setCoordX] = useState('43.30');
  const [coordY, setCoordY] = useState('25.00');

  const [baseChanfro, setBaseChanfro] = useState('10.00');
  const [alturaChanfro, setAlturaChanfro] = useState('10.00');

  const [campoEditado, setCampoEditado] = useState('triangulo');
  const [resultados, setResultados] = useState([]);
  const [terminalTrig, setTerminalTrig] = useState('');
  const [gcode, setGcode] = useState('');
  const [gcodeAtivo, setGcodeAtivo] = useState(true);

  const subTabLabel = (value) => t(SUBTAB_LABEL_KEYS[value] || 'trigonometria.tabRightTriangle');

  function num(valor) {
    return parseFloat(String(valor).replace(',', '.')) || 0;
  }

  function formatar(valor) {
    if (!isFinite(valor)) return '0.00';
    return valor.toFixed(2);
  }

  function formatarTrig(valor) {
    if (!isFinite(valor)) return '0.000000';
    return valor.toFixed(6);
  }

  function formatarGcode(valor) {
    if (!isFinite(valor)) return '0.000';
    return valor.toFixed(3);
  }

  function obterQuadrante(x, y) {
    if (x >= 0 && y >= 0) return t('trigonometria.quadrant1');
    if (x < 0 && y >= 0) return t('trigonometria.quadrant2');
    if (x < 0 && y < 0) return t('trigonometria.quadrant3');
    return t('trigonometria.quadrant4');
  }

  function atualizarCampo(campo, valor) {
    setCampoEditado(campo);

    if (campo === 'angulo') setAngulo(valor);
    if (campo === 'catetoX') setCatetoX(valor);
    if (campo === 'catetoY') setCatetoY(valor);
    if (campo === 'hipotenusa') setHipotenusa(valor);
    if (campo === 'raio') setRaio(valor);
    if (campo === 'coordX') setCoordX(valor);
    if (campo === 'coordY') setCoordY(valor);
    if (campo === 'baseChanfro') setBaseChanfro(valor);
    if (campo === 'alturaChanfro') setAlturaChanfro(valor);
  }

  function trocarSubAba(novaSubAba) {
    setSubAba(novaSubAba);

    if (novaSubAba === 'Triângulo Retângulo') {
      setCampoEditado('triangulo');
    }

    if (novaSubAba === 'Seno/Cosseno/Tangente') {
      setCampoEditado('angulo');
    }

    if (
      novaSubAba === 'Coordenadas X/Y' ||
      novaSubAba === 'Polar → Cartesiano' ||
      novaSubAba === 'Coordenadas CNC'
    ) {
      setCampoEditado('polar');
    }

    if (novaSubAba === 'Cartesiano → Polar') {
      setCampoEditado('cartesiano');
    }

    if (novaSubAba === 'Chanfro / Inclinação') {
      setCampoEditado('chanfro');
    }
  }

  function gerarGcode(x, y, r, a) {
    if (controle === 'FANUC') {
      return (
        `%\n` +
        `O0008 (FANUC - ${t('trigonometria.gcodeName')})\n` +
        `( ${t('trigonometria.gcodeAngle')}: ${formatar(a)} ${t('trigonometria.gcodeDegrees')} )\n` +
        `( ${t('trigonometria.gcodeRadius')}: ${formatar(r)} MM )\n` +
        `( ${t('trigonometria.gcodeCoordinate')}: X${formatarGcode(x)} Y${formatarGcode(y)} )\n` +
        `G21 G40 G90 G17\n` +
        `G00 X0.000 Y0.000\n` +
        `G01 X${formatarGcode(x)} Y${formatarGcode(y)} F200\n` +
        `G00 X0.000 Y0.000\n` +
        `M30\n` +
        `%`
      );
    }

    if (controle === 'SIEMENS') {
      return (
        `; SIEMENS - ${t('trigonometria.gcodeName')}\n` +
        `; ${t('trigonometria.gcodeAngle')}: ${formatar(a)} ${t('trigonometria.gcodeDegrees')}\n` +
        `; ${t('trigonometria.gcodeRadius')}: ${formatar(r)} MM\n` +
        `; ${t('trigonometria.gcodeCoordinate')}: X${formatarGcode(x)} Y${formatarGcode(y)}\n` +
        `G21 G90 G17\n` +
        `G0 X0.000 Y0.000\n` +
        `G1 X${formatarGcode(x)} Y${formatarGcode(y)} F200\n` +
        `G0 X0.000 Y0.000\n` +
        `M30`
      );
    }

    if (controle === 'MITSUBISHI') {
      return (
        `%\n` +
        `O0008 (MITSUBISHI - ${t('trigonometria.gcodeName')})\n` +
        `( ${t('trigonometria.gcodeAngle')}: ${formatar(a)} ${t('trigonometria.gcodeDegrees')} )\n` +
        `( ${t('trigonometria.gcodeRadius')}: ${formatar(r)} MM )\n` +
        `( ${t('trigonometria.gcodeCoordinate')}: X${formatarGcode(x)} Y${formatarGcode(y)} )\n` +
        `G21 G40 G90 G17\n` +
        `G00 X0.000 Y0.000\n` +
        `G01 X${formatarGcode(x)} Y${formatarGcode(y)} F200\n` +
        `G00 X0.000 Y0.000\n` +
        `M30\n` +
        `%`
      );
    }

    if (controle === 'HAAS') {
      return (
        `%\n` +
        `O0008 (HAAS - ${t('trigonometria.gcodeName')})\n` +
        `( ${t('trigonometria.gcodeAngle')}: ${formatar(a)} ${t('trigonometria.gcodeDegrees')} )\n` +
        `( ${t('trigonometria.gcodeRadius')}: ${formatar(r)} MM )\n` +
        `( ${t('trigonometria.gcodeCoordinate')}: X${formatarGcode(x)} Y${formatarGcode(y)} )\n` +
        `G21 G40 G90 G17\n` +
        `G00 X0.000 Y0.000\n` +
        `G01 X${formatarGcode(x)} Y${formatarGcode(y)} F200\n` +
        `G00 X0.000 Y0.000\n` +
        `M30\n` +
        `%`
      );
    }

    return (
      `(MACH3 - ${t('trigonometria.gcodeName')})\n` +
      `( ${t('trigonometria.gcodeAngle')}: ${formatar(a)} ${t('trigonometria.gcodeDegrees')} )\n` +
      `( ${t('trigonometria.gcodeRadius')}: ${formatar(r)} MM )\n` +
      `( ${t('trigonometria.gcodeCoordinate')}: X${formatarGcode(x)} Y${formatarGcode(y)} )\n` +
      `G21 G90 G17\n` +
      `G0 X0.000 Y0.000\n` +
      `G1 X${formatarGcode(x)} Y${formatarGcode(y)} F200\n` +
      `G0 X0.000 Y0.000\n` +
      `M30`
    );
  }

  function calcularTrigonometria() {
    let a = num(angulo);
    let x = num(catetoX);
    let y = num(catetoY);
    let r = num(hipotenusa);

    const raioBase = num(raio);
    const xBase = num(coordX);
    const yBase = num(coordY);
    const base = num(baseChanfro);
    const altura = num(alturaChanfro);

    if (
      subAba === 'Coordenadas X/Y' ||
      subAba === 'Polar → Cartesiano' ||
      subAba === 'Coordenadas CNC' ||
      campoEditado === 'polar'
    ) {
      const rad = a * Math.PI / 180;

      r = raioBase;
      x = r * Math.cos(rad);
      y = r * Math.sin(rad);

      setCoordX(formatar(x));
      setCoordY(formatar(y));
      setCatetoX(formatar(x));
      setCatetoY(formatar(y));
      setHipotenusa(formatar(r));
    }

    if (subAba === 'Cartesiano → Polar' || campoEditado === 'cartesiano') {
      x = xBase;
      y = yBase;
      r = Math.sqrt(x * x + y * y);
      a = Math.atan2(y, x) * 180 / Math.PI;

      if (a < 0) a += 360;

      setRaio(formatar(r));
      setAngulo(formatar(a));
      setCatetoX(formatar(x));
      setCatetoY(formatar(y));
      setHipotenusa(formatar(r));
    }

    if (
      subAba === 'Triângulo Retângulo' ||
      subAba === 'Seno/Cosseno/Tangente'
    ) {
      x = num(catetoX);
      y = num(catetoY);
      r = num(hipotenusa);

      if (campoEditado === 'catetoX' || campoEditado === 'catetoY' || campoEditado === 'triangulo') {
        r = Math.sqrt(x * x + y * y);
        a = Math.atan2(y, x) * 180 / Math.PI;

        setHipotenusa(formatar(r));
        setRaio(formatar(r));
        setAngulo(formatar(a));
        setCoordX(formatar(x));
        setCoordY(formatar(y));
      }

      if (campoEditado === 'hipotenusa') {
        const rad = a * Math.PI / 180;

        x = r * Math.cos(rad);
        y = r * Math.sin(rad);

        setCatetoX(formatar(x));
        setCatetoY(formatar(y));
        setRaio(formatar(r));
        setCoordX(formatar(x));
        setCoordY(formatar(y));
      }

      if (campoEditado === 'angulo') {
        const rad = a * Math.PI / 180;

        r = num(hipotenusa) || num(raio);
        x = r * Math.cos(rad);
        y = r * Math.sin(rad);

        setCatetoX(formatar(x));
        setCatetoY(formatar(y));
        setRaio(formatar(r));
        setCoordX(formatar(x));
        setCoordY(formatar(y));
      }
    }

    if (subAba === 'Chanfro / Inclinação' || campoEditado === 'chanfro') {
      x = base;
      y = altura;
      r = Math.sqrt(x * x + y * y);
      a = Math.atan2(y, x) * 180 / Math.PI;

      setCatetoX(formatar(x));
      setCatetoY(formatar(y));
      setHipotenusa(formatar(r));
      setRaio(formatar(r));
      setCoordX(formatar(x));
      setCoordY(formatar(y));
      setAngulo(formatar(a));
    }

    const seno = r !== 0 ? y / r : 0;
    const cosseno = r !== 0 ? x / r : 0;
    const tangente = x !== 0 ? y / x : 0;
    const quadrante = obterQuadrante(x, y);

    const lista = [
      { n: t('trigonometria.activeMode'), v: subTabLabel(subAba) },
      { n: t('trigonometria.angle'), v: `${formatar(a)}°`, highlight: true },
      { n: t('trigonometria.legXAdjacent'), v: `${formatar(x)} mm`, highlight: true },
      { n: t('trigonometria.legYOpposite'), v: `${formatar(y)} mm`, highlight: true },
      { n: t('trigonometria.hypotenuseRadius'), v: `${formatar(r)} mm`, highlight: true },
      { n: t('trigonometria.sine'), v: formatarTrig(seno) },
      { n: t('trigonometria.cosine'), v: formatarTrig(cosseno) },
      { n: t('trigonometria.tangent'), v: formatarTrig(tangente) },
      { n: t('trigonometria.quadrant'), v: quadrante, highlight: true }
    ];

    if (subAba === 'Chanfro / Inclinação') {
      lista.push(
        { n: t('trigonometria.chamferBase'), v: `${formatar(x)} mm` },
        { n: t('trigonometria.chamferHeight'), v: `${formatar(y)} mm` },
        { n: t('trigonometria.inclination'), v: `${formatar(a)}°` }
      );
    }

    const terminal =
      `${t('trigonometria.terminalExecution')}\n` +
      `${t('trigonometria.mode')}: ${subTabLabel(subAba)}\n` +
      `${t('trigonometria.cncControl')}: ${controle}\n` +
      `${t('trigonometria.angle')}: ${formatar(a)}°\n` +
      `X: ${formatar(x)} mm\n` +
      `Y: ${formatar(y)} mm\n` +
      `R: ${formatar(r)} mm\n\n` +
      `${t('trigonometria.sine')}: ${formatarTrig(seno)}\n` +
      `${t('trigonometria.cosine')}: ${formatarTrig(cosseno)}\n` +
      `${t('trigonometria.tangent')}: ${formatarTrig(tangente)}\n` +
      `${t('trigonometria.quadrant')}: ${quadrante}\n\n` +
      `${t('trigonometria.application')}:\n` +
      t('trigonometria.applicationText');

    setResultados(lista);
    setTerminalTrig(terminal);
    setGcode(gerarGcode(x, y, r, a));
  }

  useEffect(() => {
    calcularTrigonometria();
  }, [
    subAba,
    controle,
    angulo,
    catetoX,
    catetoY,
    hipotenusa,
    raio,
    coordX,
    coordY,
    baseChanfro,
    alturaChanfro,
    campoEditado,
    t
  ]);

  const relatorio =
    `${t('trigonometria.reportTitle')}\n\n` +
    resultados.map((item) => `${item.n}: ${item.v}`).join('\n') +
    `\n\n${terminalTrig}\n\n${gcode}`;

  function renderCampo(label, valor, campo) {
    return (
      <View style={styles.boxInputHalf}>
        <Text style={styles.labelInput}>{label}</Text>
        <TextInput
          style={styles.input}
          value={valor}
          onChangeText={(txt) => atualizarCampo(campo, txt)}
          keyboardType="numeric"
        />
      </View>
    );
  }

  function renderCamposEntrada() {
    if (subAba === 'Triângulo Retângulo') {
      return (
        <View style={styles.gridInputs}>
          {renderCampo(t('trigonometria.legX'), catetoX, 'catetoX')}
          {renderCampo(t('trigonometria.legY'), catetoY, 'catetoY')}
        </View>
      );
    }

    if (subAba === 'Seno/Cosseno/Tangente') {
      return (
        <View style={styles.gridInputs}>
          {renderCampo(t('trigonometria.angle'), angulo, 'angulo')}
          {renderCampo(t('trigonometria.hypotenuseRadius'), hipotenusa, 'hipotenusa')}
        </View>
      );
    }

    if (
      subAba === 'Coordenadas X/Y' ||
      subAba === 'Polar → Cartesiano' ||
      subAba === 'Coordenadas CNC'
    ) {
      return (
        <View style={styles.gridInputs}>
          {renderCampo(t('trigonometria.angle'), angulo, 'angulo')}
          {renderCampo(t('trigonometria.radius'), raio, 'raio')}
        </View>
      );
    }

    if (subAba === 'Cartesiano → Polar') {
      return (
        <View style={styles.gridInputs}>
          {renderCampo(t('trigonometria.coordinateX'), coordX, 'coordX')}
          {renderCampo(t('trigonometria.coordinateY'), coordY, 'coordY')}
        </View>
      );
    }

    if (subAba === 'Chanfro / Inclinação') {
      return (
        <View style={styles.gridInputs}>
          {renderCampo(t('trigonometria.chamferBase'), baseChanfro, 'baseChanfro')}
          {renderCampo(t('trigonometria.chamferHeight'), alturaChanfro, 'alturaChanfro')}
        </View>
      );
    }

    return null;
  }

  return (
    <CasillasLayout
      navigation={navigation}
      activeRoute="Trigonometria"
      title={t('trigonometria.title')}
      subtitle={t('trigonometria.subtitle')}
      terminalText={terminalTrig}
      shareText={relatorio}
    >
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t('trigonometria.subTabsTitle')}</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {SUBABAS.map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => trocarSubAba(item)}
              style={[
                styles.btnTipo,
                subAba === item && styles.btnTipoAtivo
              ]}
            >
              <Text style={[
                styles.btnTipoText,
                subAba === item && styles.btnTipoTextAtivo
              ]}>
                {subTabLabel(item)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t('trigonometria.inputData')}</Text>
        {renderCamposEntrada()}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t('trigonometria.graphicTitle')}</Text>

        <View style={{
          height: 220,
          backgroundColor: '#030303',
          borderWidth: 1,
          borderColor: '#222',
          borderRadius: 6,
          position: 'relative',
          overflow: 'hidden'
        }}>
          <View style={{ position: 'absolute', left: 25, right: 25, top: 110, height: 1, backgroundColor: '#444' }} />
          <View style={{ position: 'absolute', left: 110, top: 20, bottom: 20, width: 1, backgroundColor: '#444' }} />

          <View style={{ position: 'absolute', left: 110, top: 110, width: 110, height: 3, backgroundColor: '#FFD400' }} />
          <View style={{ position: 'absolute', left: 217, top: 50, width: 3, height: 63, backgroundColor: '#00FF00' }} />
          <View style={{ position: 'absolute', left: 110, top: 50, width: 130, height: 3, backgroundColor: '#38bdf8', transform: [{ rotate: '-30deg' }] }} />

          <View
            style={{
              position: 'absolute',
              left: 18,
              top: 14,
              backgroundColor: '#141202',
              borderWidth: 1,
              borderColor: '#FFD400',
              borderRadius: 4,
              paddingHorizontal: 8,
              paddingVertical: 4
            }}
          >
            <Text style={{ color: '#FFD400', fontWeight: 'bold', fontSize: 12 }}>
              θ = {angulo}°
            </Text>
          </View>

          <Text style={{ position: 'absolute', left: 155, top: 118, color: '#FFD400', fontWeight: 'bold' }}>X</Text>
          <Text style={{ position: 'absolute', left: 226, top: 78, color: '#00FF00', fontWeight: 'bold' }}>Y</Text>
          <Text style={{ position: 'absolute', left: 160, top: 58, color: '#38bdf8', fontWeight: 'bold' }}>R</Text>

          <Text style={{ position: 'absolute', left: 20, bottom: 12, color: '#888', fontSize: 11 }}>
            {t('trigonometria.diagramText')}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t('trigonometria.resultsTitle')}</Text>

        {resultados.map((item, index) => {
          const destaque = item.highlight;

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
              <Text style={[styles.txtWhite, { flex: 1, flexWrap: 'wrap' }]}>
                {item.n}
              </Text>

              <Text style={[styles.txtYellow, { width: 135, textAlign: 'right', flexWrap: 'wrap' }]}>
                {item.v}
              </Text>
            </View>
          );
        })}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t('trigonometria.terminalSection')}</Text>

        <View style={styles.terminal}>
          <Text style={styles.txtGcode}>{terminalTrig}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t('trigonometria.dimVerification')}</Text>

        <View style={styles.linhaTabela}>
          <Text style={styles.txtWhite}>{t('trigonometria.checkXY')}</Text>
          <Text style={styles.txtYellow}>{t('trigonometria.caliperCnc')}</Text>
        </View>

        <View style={styles.linhaTabela}>
          <Text style={styles.txtWhite}>{t('trigonometria.checkAngle')}</Text>
          <Text style={styles.txtYellow}>{t('trigonometria.protractorCnc')}</Text>
        </View>

        <View style={styles.linhaTabela}>
          <Text style={styles.txtWhite}>{t('trigonometria.checkRadius')}</Text>
          <Text style={styles.txtYellow}>{t('trigonometria.polarCoordinate')}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t('trigonometria.fabTips')}</Text>

        {[1, 2, 3, 4, 5].map((item) => (
          <Text key={item} style={styles.txtWhite}>{t(`trigonometria.tip${item}`)}</Text>
        ))}
      </View>

      <View style={styles.card}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={styles.cardTitle}>{t('trigonometria.gcodeTitle')}</Text>

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
              {gcodeAtivo ? t('trigonometria.on') : t('trigonometria.off')}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.txtGray}>{t('trigonometria.machineDescription')}</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {CONTROLES.map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => setControle(item)}
              style={[
                styles.btnTipo,
                controle === item && styles.btnTipoAtivo,
                { marginTop: 8 }
              ]}
            >
              <Text style={[
                styles.btnTipoText,
                controle === item && styles.btnTipoTextAtivo
              ]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {gcodeAtivo && (
          <View style={styles.terminal}>
            <Text style={styles.txtGcode}>{gcode}</Text>
          </View>
        )}
      </View>
    </CasillasLayout>
  );
}
