import React, { useEffect, useState } from 'react';

import {
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity
} from 'react-native';

import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import CasillasLayout, {
  casillasStyles as styles,
  getCasillasStyles
} from '../components/CasillasLayout';

const SUBABAS = [
  'Quadrado',
  'Sextavado',
  'Outros',
  'Cálculo inverso'
];
const PROFILE_KEYS = {
  Quadrado: 'perfis.profileSquare', Sextavado: 'perfis.profileHexagon',
  Outros: 'perfis.profileOther', 'Cálculo inverso': 'perfis.profileInverse'
};
const CONTROLES_CNC = ['FANUC', 'SIEMENS', 'MITSUBISHI', 'HAAS', 'MACH3'];
export default function PerfisScreen({ navigation }) {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const s = getCasillasStyles(theme);

  const [subAba, setSubAba] = useState('Sextavado');

  const [diametroBruto, setDiametroBruto] = useState('50.00');
const [entreFaces, setEntreFaces] = useState('43.30');
const [raioVertice, setRaioVertice] = useState('25.00');
  const [numLados, setNumLados] = useState('6');
  const [comprimento, setComprimento] = useState('30.00');
const [profundidadePasse, setProfundidadePasse] = useState('1.00');

  const [campoEditado, setCampoEditado] = useState('diametroBruto');

  const [resultados, setResultados] = useState([]);
  const [coordenadas, setCoordenadas] = useState([]);
  const [gcode, setGcode] = useState('');
  const [gcodeAtivo, setGcodeAtivo] = useState(true);
const [controleCnc, setControleCnc] = useState('FANUC');
  function num(valor) {
    return parseFloat(String(valor).replace(',', '.')) || 0;
  }

  function formatar(valor) {
  if (!isFinite(valor)) {
    return '0.00';
  }

  return valor.toFixed(2);
}

function formatCoord(valor) {
  if (!isFinite(valor)) {
    return '0.000';
  }

  return valor.toFixed(3);
}

  function obterLados() {
    if (subAba === 'Quadrado') {
      return 4;
    }

    if (subAba === 'Sextavado') {
      return 6;
    }

    const ladosInformados = parseInt(numLados) || 6;

    return Math.max(3, ladosInformados);
  }

  function atualizarPorCampo(campo, valor) {
    const lados = obterLados();
    const cosValor = Math.cos(Math.PI / lados);
    const valorNumerico = num(valor);

    setCampoEditado(campo);

    if (campo === 'diametroBruto') {
      const novoDiametro = valorNumerico;
      const novoRaio = novoDiametro / 2;
      const novoEntreFaces = novoDiametro * cosValor;

      setDiametroBruto(valor);
      setRaioVertice(formatar(novoRaio));
      setEntreFaces(formatar(novoEntreFaces));
    }

    if (campo === 'entreFaces') {
      const novoEntreFaces = valorNumerico;
      const novoDiametro = novoEntreFaces / cosValor;
      const novoRaio = novoDiametro / 2;

      setEntreFaces(valor);
      setDiametroBruto(formatar(novoDiametro));
      setRaioVertice(formatar(novoRaio));
    }

    if (campo === 'raioVertice') {
      const novoRaio = valorNumerico;
      const novoDiametro = novoRaio * 2;
      const novoEntreFaces = novoDiametro * cosValor;

      setRaioVertice(valor);
      setDiametroBruto(formatar(novoDiametro));
      setEntreFaces(formatar(novoEntreFaces));
    }
  }

  function trocarSubAba(novaSubAba) {
    setSubAba(novaSubAba);

    let novosLados = 6;

    if (novaSubAba === 'Quadrado') {
      novosLados = 4;
    }

    if (novaSubAba === 'Sextavado') {
      novosLados = 6;
    }

    if (novaSubAba === 'Outros' || novaSubAba === 'Cálculo inverso') {
      novosLados = parseInt(numLados) || 6;
    }

    setNumLados(String(novosLados));

    const cosValor = Math.cos(Math.PI / novosLados);
    const d = num(diametroBruto) || 50;

    setRaioVertice(formatar(d / 2));
    setEntreFaces(formatar(d * cosValor));
    setCampoEditado('diametroBruto');
  }

  function calcularPerfis() {
    const lados = obterLados();

    const dBruto = num(diametroBruto);
    const af = num(entreFaces);
    const rv = num(raioVertice);
    const comp = num(comprimento);
    const passe = num(profundidadePasse) || 1;

    const cosValor = Math.cos(Math.PI / lados);

    let dBrutoCalc = dBruto;
    let entreFacesCalc = af;
    let raioVerticeCalc = rv;

    if (campoEditado === 'diametroBruto') {
      raioVerticeCalc = dBrutoCalc / 2;
      entreFacesCalc = dBrutoCalc * cosValor;
    }

    if (campoEditado === 'entreFaces') {
      dBrutoCalc = entreFacesCalc / cosValor;
      raioVerticeCalc = dBrutoCalc / 2;
    }

    if (campoEditado === 'raioVertice') {
      dBrutoCalc = raioVerticeCalc * 2;
      entreFacesCalc = dBrutoCalc * cosValor;
    }

    const profundidadeRadial = (dBrutoCalc - entreFacesCalc) / 2;
    const anguloEntreDivisoes = 360 / lados;
    const passes = Math.ceil(Math.abs(profundidadeRadial) / passe);

    const pontos = [];

    for (let i = 0; i < lados; i++) {
      const ang = i * anguloEntreDivisoes;
      const rad = ang * Math.PI / 180;

      const x = raioVerticeCalc * Math.cos(rad);
      const y = raioVerticeCalc * Math.sin(rad);

      pontos.push({
  id: i + 1,
  ang: ang.toFixed(2),
  x: formatCoord(x),
  y: formatCoord(y)
});
    }

    const lista = [
      { n: t('perfis.activeSubTab'), v: t(PROFILE_KEYS[subAba]) },
      { n: t('perfis.numSides'), v: lados.toFixed(0) },
      { n: t('perfis.diameterBruto'), v: `${formatar(dBrutoCalc)} mm` },
      { n: t('perfis.betweenFaces'), v: `${formatar(entreFacesCalc)} mm` },
      { n: t('perfis.vertexRadius'), v: `${formatar(raioVerticeCalc)} mm` },
      { n: t('perfis.radialDepth'), v: `${formatar(profundidadeRadial)} mm` },
      { n: t('perfis.angleBetweenDivisions'), v: `${anguloEntreDivisoes.toFixed(2)}°` },
      { n: t('perfis.pieceLength'), v: `${formatar(comp)} mm` },
      { n: t('perfis.suggestedPasses'), v: `${passes}` }
    ];

    let codigo = '';

if (controleCnc === 'FANUC') {
  codigo =
`%
O0300 (FANUC - ${t('perfis.gcodeProfile')} ${t(PROFILE_KEYS[subAba]).toUpperCase()})
G21 G40 G90 G94
G17
G00 Z5.000
M03 S1200

`;

  pontos.forEach((ponto) => {
    codigo += `(${t('perfis.gcodePoint')} ${ponto.id} - ${t('perfis.gcodeAngle')} ${ponto.ang})
G00 X${ponto.x} Y${ponto.y}
G01 Z-${Math.abs(profundidadeRadial).toFixed(2)} F120
G00 Z5.000

`;
  });

  codigo += `M05
G00 Z50.000
M30
%`;
}

if (controleCnc === 'SIEMENS') {
  codigo =
`; SIEMENS - ${t('perfis.gcodeProfile')} ${t(PROFILE_KEYS[subAba]).toUpperCase()}
G21 G90 G94
G17
S1200 M3
G0 Z5.000

`;

  pontos.forEach((ponto) => {
    codigo += `; ${t('perfis.gcodePoint')} ${ponto.id} - ${t('perfis.gcodeAngle')} ${ponto.ang}
G0 X${ponto.x} Y${ponto.y}
G1 Z-${Math.abs(profundidadeRadial).toFixed(2)} F120
G0 Z5.000

`;
  });

  codigo += `M5
G0 Z50.000
M30`;
}

if (controleCnc === 'MITSUBISHI') {
  codigo =
`%
O0300 (MITSUBISHI - ${t('perfis.gcodeProfile')} ${t(PROFILE_KEYS[subAba]).toUpperCase()})
G21 G40 G90 G94
G17
G00 Z5.000
M03 S1200

`;

  pontos.forEach((ponto) => {
    codigo += `(${t('perfis.gcodePoint')} ${ponto.id} - ${t('perfis.gcodeAngle')} ${ponto.ang})
G00 X${ponto.x} Y${ponto.y}
G01 Z-${Math.abs(profundidadeRadial).toFixed(2)} F120
G00 Z5.000

`;
  });

  codigo += `M05
G00 Z50.000
M30
%`;
}

if (controleCnc === 'HAAS') {
  codigo =
`%
O0300 (HAAS - ${t('perfis.gcodeProfile')} ${t(PROFILE_KEYS[subAba]).toUpperCase()})
G21 G40 G90 G94
G17
G00 Z5.000
S1200 M03

`;

  pontos.forEach((ponto) => {
    codigo += `(${t('perfis.gcodePoint')} ${ponto.id} - ${t('perfis.gcodeAngle')} ${ponto.ang})
G00 X${ponto.x} Y${ponto.y}
G01 Z-${Math.abs(profundidadeRadial).toFixed(2)} F120
G00 Z5.000

`;
  });

  codigo += `M05
G00 Z50.000
M30
%`;
}

if (controleCnc === 'MACH3') {
  codigo =
`(MACH3 - ${t('perfis.gcodeProfile')} ${t(PROFILE_KEYS[subAba]).toUpperCase()})
G21 G90 G94
G17
G00 Z5.000
S1200 M03

`;

  pontos.forEach((ponto) => {
    codigo += `(${t('perfis.gcodePoint')} ${ponto.id} - ${t('perfis.gcodeAngle')} ${ponto.ang})
G00 X${ponto.x} Y${ponto.y}
G01 Z-${Math.abs(profundidadeRadial).toFixed(2)} F120
G00 Z5.000

`;
  });

  codigo += `M05
G00 Z50.000
M30`;
}

    setResultados(lista);
    setCoordenadas(pontos);
    setGcode(codigo);
  }

  useEffect(() => {
  calcularPerfis();
}, [
  subAba,
  diametroBruto,
  entreFaces,
  raioVertice,
  numLados,
  comprimento,
  profundidadePasse,
  campoEditado,
  controleCnc,
  t
]);

  const terminalManual =
  `=== ${t('perfis.terminalTitle')}\n` +
  `${t('perfis.activeProfile')}: ${t(PROFILE_KEYS[subAba])}\n` +
  `${t('perfis.numSides')}: ${coordenadas.length}\n` +
  `${t('perfis.diameterBruto')}: ${diametroBruto} mm\n` +
  `${t('perfis.betweenFaces')}: ${entreFaces} mm\n` +
  `${t('perfis.vertexRadius')}: ${raioVertice} mm\n` +
  `${t('perfis.angleBetweenDivisions')}: ${
    coordenadas.length > 0
      ? (360 / coordenadas.length).toFixed(2)
      : '0.00'
  }°\n` +
  `${t('perfis.passDepth')}: ${profundidadePasse} mm\n` +
  `${t('perfis.terminalFooter')}`;

  const relatorio =
    `${t('perfis.reportTitle')}\n\n` +
    resultados.map((item) => `${item.n}: ${item.v}`).join('\n') +
    `\n\n${t('perfis.manualCoordinates')}\n` +
    coordenadas
      .map((p) => `P${p.id} | ${p.ang}° | X${p.x} | Y${p.y}`)
      .join('\n') +
    `\n\n${gcode}`;

  return (
    <CasillasLayout
      navigation={navigation}
      activeRoute="Perfis"
      title={t('perfis.title')}
      subtitle={t('perfis.subtitle')}
      terminalText={terminalManual}
      shareText={relatorio}
    >
      <View style={s.card}>
        <Text style={s.cardTitle}>
          {t('perfis.calcTabs')}
        </Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {SUBABAS.map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => trocarSubAba(item)}
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
              {t(PROFILE_KEYS[item])}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={s.card}>
        <Text style={s.cardTitle}>
          {t('perfis.inputData')}
        </Text>

        <View style={s.gridInputs}>
          <View style={s.boxInputHalf}>
            <Text style={s.labelInput}>
              {t('perfis.diameterBruto')}
            </Text>

            <TextInput
              style={s.input}
              value={diametroBruto}
              onChangeText={(txt) => atualizarPorCampo('diametroBruto', txt)}
              keyboardType="numeric"
            />
          </View>

          <View style={s.boxInputHalf}>
            <Text style={s.labelInput}>
              {t('perfis.betweenFaces')}
            </Text>

            <TextInput
              style={s.input}
              value={entreFaces}
              onChangeText={(txt) => atualizarPorCampo('entreFaces', txt)}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={s.gridInputs}>
          <View style={s.boxInputHalf}>
            <Text style={s.labelInput}>
              {t('perfis.vertexRadius')}
            </Text>

            <TextInput
              style={s.input}
              value={raioVertice}
              onChangeText={(txt) => atualizarPorCampo('raioVertice', txt)}
              keyboardType="numeric"
            />
          </View>

          <View style={s.boxInputHalf}>
            <Text style={s.labelInput}>
              {t('perfis.numSidesOther')}
            </Text>

            <TextInput
              style={s.input}
              value={numLados}
              onChangeText={(txt) => {
                setNumLados(txt);
                setCampoEditado('diametroBruto');
              }}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={s.gridInputs}>
          <View style={s.boxInputHalf}>
            <Text style={s.labelInput}>
              {t('perfis.pieceLength')}
            </Text>

            <TextInput
              style={s.input}
              value={comprimento}
              onChangeText={setComprimento}
              keyboardType="numeric"
            />
          </View>

          <View style={s.boxInputHalf}>
            <Text style={s.labelInput}>
              {t('perfis.passDepth')}
            </Text>

            <TextInput
              style={s.input}
              value={profundidadePasse}
              onChangeText={setProfundidadePasse}
              keyboardType="numeric"
            />
          </View>
        </View>
      </View>

      <View style={s.card}>
        <Text style={s.cardTitle}>
          {t('perfis.results')}
        </Text>
{subAba === 'Cálculo inverso' && (
  <View
    style={{
      backgroundColor: '#141202',
      borderWidth: 1,
      borderColor: '#3a3200',
      borderRadius: 4,
      padding: 8,
      marginBottom: 10
    }}
  >
    <Text
      style={{
        color: '#FFD400',
        fontSize: 11
      }}
    >
      {t('perfis.inverseCalcHint')}
    </Text>
  </View>
)}
        {resultados.map((item, index) => (
          <View key={index} style={s.linhaTabela}>
            <Text style={s.txtWhite}>
              {item.n}
            </Text>

            <Text
  style={[
    s.txtYellow,
    {
      flex: 1,
      textAlign: 'left',
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
  <Text style={s.cardTitle}>
    {t('perfis.dimVerification')}
  </Text>

  <View style={s.linhaTabela}>
    <Text style={s.txtWhite}>{t('perfis.betweenFaces')}</Text>
    <Text style={s.txtYellow}>{entreFaces} mm</Text>
  </View>

  <View style={s.linhaTabela}>
    <Text style={s.txtWhite}>{t('perfis.diameterBruto')}</Text>
    <Text style={s.txtYellow}>{diametroBruto} mm</Text>
  </View>

  <View style={s.linhaTabela}>
    <Text style={s.txtWhite}>{t('perfis.vertexRadius')}</Text>
    <Text style={s.txtYellow}>{raioVertice} mm</Text>
  </View>

  <View style={s.linhaTabela}>
    <Text style={s.txtWhite}>{t('perfis.numSides')}</Text>
    <Text style={s.txtYellow}>{obterLados()}</Text>
  </View>

  <View style={s.linhaTabela}>
    <Text style={s.txtWhite}>{t('perfis.instruments')}</Text>
    <Text style={s.txtYellow}>{t('perfis.caliperMicrometer')}</Text>
  </View>
</View>

<View style={s.card}>
  <Text style={s.cardTitle}>
    {t('perfis.fabTips')}
  </Text>

  <Text style={s.txtWhite}>{t('perfis.tip1')}</Text>
  <Text style={s.txtWhite}>{t('perfis.tip2')}</Text>
  <Text style={s.txtWhite}>{t('perfis.tip3')}</Text>
  <Text style={s.txtWhite}>{t('perfis.tip4')}</Text>
  <Text style={s.txtWhite}>{t('perfis.tip5')}</Text>
  <Text style={s.txtWhite}>{t('perfis.tip6')}</Text>
</View>
      <View style={s.card}>
        <Text style={s.cardTitle}>
          {t('perfis.coordinates')}
        </Text>

        {coordenadas.map((ponto) => (
          <View key={ponto.id} style={s.linhaTabela}>
            <Text style={s.txtWhite}>
              P{ponto.id}
            </Text>

            <Text style={s.txtGray}>
              {ponto.ang}°
            </Text>

            <Text style={s.txtYellow}>
              X {ponto.x}
            </Text>

            <Text style={s.txtYellow}>
              Y {ponto.y}
            </Text>
          </View>
        ))}
      </View>

      <View style={s.card}>
  <Text style={s.cardTitle}>
    {t('perfis.finalInspection')}
  </Text>

  <View style={s.linhaTabela}>
    <Text style={s.txtWhite}>{t('perfis.caliper')}</Text>
    <Text style={s.txtYellow}>{t('perfis.checkBetweenFaces')}</Text>
  </View>

  <View style={s.linhaTabela}>
    <Text style={s.txtWhite}>{t('perfis.micrometer')}</Text>
    <Text style={s.txtYellow}>{t('perfis.checkDiameter')}</Text>
  </View>

  <View style={s.linhaTabela}>
    <Text style={s.txtWhite}>{t('perfis.protractor')}</Text>
    <Text style={s.txtYellow}>{t('perfis.checkAngularDivision')}</Text>
  </View>

  <View style={s.linhaTabela}>
    <Text style={s.txtWhite}>{t('perfis.dialIndicator')}</Text>
    <Text style={s.txtYellow}>{t('perfis.checkConcentricity')}</Text>
  </View>
</View>

      <View style={s.card}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Text style={s.cardTitle}>
            {t('perfis.gcodeGen')}
          </Text>

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
  {t('perfis.machineDesc')}
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
      {gcode}
    </Text>
  </View>
)}

      </View>
    </CasillasLayout>
  );
}
