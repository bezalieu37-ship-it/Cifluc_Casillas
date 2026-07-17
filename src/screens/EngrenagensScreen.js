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

const SUBABAS = ['Cálculo', 'Consulta Fórmulas', 'Divisor / Trem', 'Verificação'];

const TIPOS = ['Reta', 'Helicoidal', 'Cônica', 'Cremalheira', 'Sem-fim', 'Planetária'];

const SUBABA_KEYS = {
  'Cálculo': 'engrenagens.tabCalculation',
  'Consulta Fórmulas': 'engrenagens.tabFormulas',
  'Divisor / Trem': 'engrenagens.tabDividerTrain',
  'Verificação': 'engrenagens.tabVerification'
};

const TYPE_KEYS = {
  Reta: 'engrenagens.typeSpur',
  Helicoidal: 'engrenagens.typeHelical',
  Cônica: 'engrenagens.typeBevel',
  Cremalheira: 'engrenagens.typeRack',
  'Sem-fim': 'engrenagens.typeWorm',
  Planetária: 'engrenagens.typePlanetary'
};

const TYPE_RESULT_KEYS = {
  Reta: 'engrenagens.resultSpur', Helicoidal: 'engrenagens.resultHelical',
  Cônica: 'engrenagens.resultBevel', Cremalheira: 'engrenagens.resultRack',
  'Sem-fim': 'engrenagens.resultWorm', Planetária: 'engrenagens.resultPlanetary'
};

const LABEL_KEYS = {
  'Tipo': 'engrenagens.resultType', 'Número de dentes': 'engrenagens.numberTeeth',
  'Módulo': 'engrenagens.moduleLabel', 'Ângulo de pressão utilizado': 'engrenagens.usedPressureAngle',
  'Dp / Diâmetro primitivo': 'engrenagens.pitchDiameterResult', 'DiE / Diâmetro externo': 'engrenagens.outsideDiameterResult',
  'DiF / Diâmetro de fundo': 'engrenagens.rootDiameterResult', 'Passo circular': 'engrenagens.circularPitch',
  'Espessura do dente': 'engrenagens.toothThickness', 'Altura total': 'engrenagens.totalHeight',
  'Adendo': 'engrenagens.addendum', 'Dedendo': 'engrenagens.dedendum', 'DiE informado': 'engrenagens.enteredOutsideDiameter',
  'Módulo calculado pelo DiE': 'engrenagens.moduleFromOutsideDiameter', 'Diferença DiE informado/calculado': 'engrenagens.outsideDiameterDifference',
  'Dentes pinhão': 'engrenagens.pinionTeeth', 'Dentes coroa': 'engrenagens.gearTeeth', 'Módulo normal': 'engrenagens.normalModuleLabel',
  'Ângulo da hélice': 'engrenagens.helixAngleLabel', 'Módulo transversal': 'engrenagens.transverseModule',
  'Dp pinhão': 'engrenagens.pinionPitchDiameter', 'Dp coroa': 'engrenagens.gearPitchDiameter',
  'De pinhão': 'engrenagens.pinionOutsideDiameter', 'De coroa': 'engrenagens.gearOutsideDiameter',
  'DiE pinhão': 'engrenagens.pinionOutsideDiameter', 'DiE coroa': 'engrenagens.gearOutsideDiameter',
  'DiF pinhão': 'engrenagens.pinionRootDiameter', 'DiF coroa': 'engrenagens.gearRootDiameter',
  'Centro a centro': 'engrenagens.centerDistance', 'Passo normal': 'engrenagens.normalPitch',
  'Passo transversal': 'engrenagens.transversePitch', 'Relação': 'engrenagens.ratioLabel',
  'Ângulo pinhão': 'engrenagens.pinionAngle', 'Ângulo coroa': 'engrenagens.gearAngle',
  'Dentes do pinhão': 'engrenagens.pinionTeeth', 'Dp do pinhão': 'engrenagens.pinionPitchDiameter',
  'De do pinhão': 'engrenagens.pinionOutsideDiameter', 'Passo linear': 'engrenagens.linearPitch',
  'Altura total do dente': 'engrenagens.totalToothHeight', 'Comprimento da cremalheira': 'engrenagens.rackLength',
  'Dentes equivalentes': 'engrenagens.equivalentTeeth', 'Curso por volta do pinhão': 'engrenagens.travelPerPinionRev',
  'Velocidade linear': 'engrenagens.linearSpeed', 'Entradas do sem-fim': 'engrenagens.wormStarts',
  'Ø primitivo sem-fim': 'engrenagens.wormPitchDiameter', 'Ø externo sem-fim': 'engrenagens.wormOutsideDiameter',
  'Ø fundo sem-fim': 'engrenagens.wormRootDiameter', 'Ø primitivo coroa': 'engrenagens.gearPitchDiameter',
  'Ø externo coroa': 'engrenagens.gearOutsideDiameter', 'Ø fundo coroa': 'engrenagens.gearRootDiameter',
  'Distância entre centros': 'engrenagens.centerDistance', 'Passo axial': 'engrenagens.axialPitch',
  'Avanço do sem-fim': 'engrenagens.wormLead', 'RPM entrada': 'engrenagens.inputRpm',
  'RPM saída estimado': 'engrenagens.estimatedOutputRpm', 'Dentes solar': 'engrenagens.sunTeeth',
  'Dentes coroa interna': 'engrenagens.ringTeeth', 'Dentes satélite teórico': 'engrenagens.theoreticalPlanetTeeth',
  'Dp solar': 'engrenagens.sunPitchDiameter', 'Dp coroa interna': 'engrenagens.ringPitchDiameter',
  'Dp satélite': 'engrenagens.planetPitchDiameter', 'Relação básica': 'engrenagens.basicRatio',
  'Divisões pelo número de dentes': 'engrenagens.divisionsByTeeth', 'Ângulo por dente': 'engrenagens.anglePerTooth',
  'Relação do divisor': 'engrenagens.dividerRatio', 'Voltas por dente': 'engrenagens.turnsPerTooth',
  'Voltas inteiras': 'engrenagens.wholeTurns', 'Fração restante': 'engrenagens.remainingFraction',
  'Disco recomendado': 'engrenagens.recommendedPlate', 'Relação de transmissão': 'engrenagens.transmissionRatio',
  'Motor / pinhão / sem-fim': 'engrenagens.driverElement', 'Movida / coroa': 'engrenagens.drivenElement',
  'Pinhão Dp': 'engrenagens.pinionPitchDiameter', 'Pinhão De': 'engrenagens.pinionOutsideDiameter',
  'Coroa Dp': 'engrenagens.gearPitchDiameter', 'Coroa De': 'engrenagens.gearOutsideDiameter',
  'Diâmetro de fundo': 'engrenagens.rootDiameterResult', 'Diâmetro externo': 'engrenagens.outsideDiameterResult',
  'Ângulo pinhão': 'engrenagens.pinionAngle', 'Ângulo coroa': 'engrenagens.gearAngle',
  'Curso por volta': 'engrenagens.travelPerRev', 'Avanço': 'engrenagens.feedLabel',
  'Sem-fim Dp': 'engrenagens.wormPitchDiameter', 'Sem-fim De': 'engrenagens.wormOutsideDiameter',
  'Sem-fim Df': 'engrenagens.wormRootDiameter', 'Coroa Df': 'engrenagens.gearRootDiameter',
  'Solar Dp': 'engrenagens.sunPitchDiameter', 'Coroa interna Dp': 'engrenagens.ringPitchDiameter',
  'Satélite': 'engrenagens.planetTeeth'
};

const CONTROLES = ['FANUC', 'SIEMENS', 'MITSUBISHI', 'HAAS', 'MACH3'];

const DISCOS = [15, 16, 17, 18, 19, 20, 21, 23, 27, 29, 31, 33, 37, 39, 41, 43, 47, 49];

const FORMULAS = {
  Reta: [
    ['Pinhão Dp', 'Dp1 = m × Z1'],
    ['Pinhão De', 'De1 = m × (Z1 + 2)'],
    ['Coroa Dp', 'Dp2 = m × Z2'],
    ['Coroa De', 'De2 = m × (Z2 + 2)'],
    ['Diâmetro de fundo', 'Df = Dp - 2.5m'],
    ['Passo circular', 'p = π × m'],
    ['Espessura do dente', 's = p / 2'],
    ['Centro a centro', 'C = (Dp1 + Dp2) / 2'],
    ['Relação', 'i = Z2 / Z1']
  ],
  Helicoidal: [
    ['Módulo transversal', 'mt = mn / cos(β)'],
    ['Pinhão Dp', 'Dp1 = mt × Z1'],
    ['Coroa Dp', 'Dp2 = mt × Z2'],
    ['Diâmetro externo', 'De = Dp + 2mn'],
    ['Passo normal', 'pn = π × mn'],
    ['Passo transversal', 'pt = π × mt'],
    ['Centro a centro', 'C = (Dp1 + Dp2) / 2']
  ],
  Cônica: [
    ['Relação', 'i = Z2 / Z1'],
    ['Pinhão Dp', 'Dp1 = m × Z1'],
    ['Coroa Dp', 'Dp2 = m × Z2'],
    ['Ângulo pinhão', 'δ1 = atan(Z1 / Z2)'],
    ['Ângulo coroa', 'δ2 = atan(Z2 / Z1)']
  ],
  Cremalheira: [
    ['Passo linear', 'p = π × m'],
    ['Espessura do dente', 's = p / 2'],
    ['Altura total', 'h = 2.25m'],
    ['Curso por volta', 'L = π × Dp do pinhão'],
    ['Dentes equivalentes', 'Zeq = comprimento / passo'],
    ['Velocidade linear', 'V = RPM × curso por volta']
  ],
  'Sem-fim': [
    ['Relação', 'i = Zcoroa / entradas'],
    ['Sem-fim Dp', 'Dp_sf = Ø primitivo informado'],
    ['Sem-fim De', 'De_sf = Dp_sf + 2m'],
    ['Sem-fim Df', 'Df_sf = Dp_sf - 2.5m'],
    ['Coroa Dp', 'Dp_c = m × Zcoroa'],
    ['Coroa De', 'De_c = Dp_c + 2m'],
    ['Coroa Df', 'Df_c = Dp_c - 2.5m'],
    ['Centro a centro', 'C = (Dp_sf + Dp_c) / 2'],
    ['Passo axial', 'px = π × m'],
    ['Avanço', 'L = px × entradas']
  ],
  Planetária: [
    ['Relação básica', 'i = 1 + (Zcoroa / Zsolar)'],
    ['Solar Dp', 'Dp_s = m × Zsolar'],
    ['Coroa interna Dp', 'Dp_c = m × Zcoroa'],
    ['Satélite', 'Zsat = (Zcoroa - Zsolar) / 2']
  ]
};

export default function EngrenagensScreen({ navigation }) {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const s = getCasillasStyles(theme);

  const [subAba, setSubAba] = useState('Cálculo');
  const [tipo, setTipo] = useState('Reta');
  const [campoRetaEditado, setCampoRetaEditado] = useState('z');
  const [controle, setControle] = useState('FANUC');

  const [dentes, setDentes] = useState('30');
  const [modulo, setModulo] = useState('2.00');
  const [diametroExternoInformado, setDiametroExternoInformado] = useState('');
  const [anguloHelice, setAnguloHelice] = useState('20.00');
  const [anguloPressao, setAnguloPressao] = useState('20.00');
  const [dentesCoroa, setDentesCoroa] = useState('60');
  const [entradasSemFim, setEntradasSemFim] = useState('1');
  const [diametroSemFim, setDiametroSemFim] = useState('40.00');
  const [comprimentoCremalheira, setComprimentoCremalheira] = useState('500.00');
  const [relacaoDivisor, setRelacaoDivisor] = useState('40');
  const [rpmEntrada, setRpmEntrada] = useState('1200');

  const [resultados, setResultados] = useState([]);
  const [divisor, setDivisor] = useState([]);
  const [trem, setTrem] = useState([]);
  const [verificacao, setVerificacao] = useState('');
  const [terminal, setTerminal] = useState('');
  const [gcode, setGcode] = useState('');
  const [gcodeAtivo, setGcodeAtivo] = useState(true);

  function num(v) {
    return parseFloat(String(v).replace(',', '.')) || 0;
  }

  function translateLabel(label) {
    return LABEL_KEYS[label] ? t(LABEL_KEYS[label]) : label;
  }

  function fmt(v) {
    if (!isFinite(v)) return '0.00';
    return v.toFixed(2);
  }

  function fmtG(v) {
    if (!isFinite(v)) return '0.000';
    return v.toFixed(3);
  }

  function mdc(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);

    while (b) {
      const t = b;
      b = a % b;
      a = t;
    }

    return a || 1;
  }

  function simplificar(n, d) {
    const x = mdc(n, d);
    return { n: n / x, d: d / x };
  }

  function discosPossiveis(fracao) {
    return DISCOS.map((disco) => {
      const furos = fracao * disco;
      const arredondado = Math.round(furos);

      if (Math.abs(furos - arredondado) < 0.0001 && arredondado >= 0) {
        return { disco, furos: arredondado };
      }

      return null;
    }).filter(Boolean);
  }

  function gerarGcode(z, anguloDivisao, passoCremalheira) {
    let cab = '';
    let fim = '';

    if (controle === 'FANUC') {
      cab = `%\nO0009 (FANUC - ${t('engrenagens.gcodeGear')} ${t(TYPE_KEYS[tipo]).toUpperCase()})\nG21 G40 G90 G17\n`;
      fim = `M30\n%`;
    }

    if (controle === 'SIEMENS') {
      cab = `; SIEMENS - ${t('engrenagens.gcodeGear')} ${t(TYPE_KEYS[tipo]).toUpperCase()}\nG21 G90 G17\n`;
      fim = `M30`;
    }

    if (controle === 'MITSUBISHI') {
  cab =
    `%\n` +
    `O0009 (MITSUBISHI - ${t('engrenagens.gcodeGear')} ${t(TYPE_KEYS[tipo]).toUpperCase()})\n` +
    `( ${t('engrenagens.gcodeFourthAxisMode')} )\n` +
    `( ${t('engrenagens.gcodeVerifyMitsubishi')} )\n` +
    `G21 G17 G90 G94\n`;
  fim = `M05\nM30\n%`;
}

    if (controle === 'HAAS') {
  cab =
    `%\n` +
    `O0009 (HAAS - ${t('engrenagens.gcodeGear')} ${t(TYPE_KEYS[tipo]).toUpperCase()})\n` +
    `( ${t('engrenagens.gcodeHaasIndexing')} )\n` +
    `( ${t('engrenagens.gcodeHaasSetting')} )\n` +
    `G21 G17 G90 G94\n`;
  fim = `M05\nM30\n%`;
}

    if (controle === 'MACH3') {
      cab = `(MACH3 - ${t('engrenagens.gcodeGear')} ${t(TYPE_KEYS[tipo]).toUpperCase()})\nG21 G90 G17\n`;
      fim = `M30`;
    }

    if (tipo === 'Cremalheira') {
      let codigo =
        cab +
        `( ${t('engrenagens.linearPitch').toUpperCase()}: ${fmt(passoCremalheira)} MM )\n` +
        `G00 X0.000 Y0.000 Z5.000\n\n`;

      for (let i = 0; i < Math.min(z, 80); i++) {
        const x = i * passoCremalheira;

        codigo +=
          `( ${t('engrenagens.gcodeTooth')} ${i + 1} )\n` +
          `G00 X${fmtG(x)}\n` +
          `( ${t('engrenagens.gcodeExecuteToothCut')} )\n\n`;
      }

      return codigo + fim;
    }

    let codigo =
      cab +
      `( ${t('engrenagens.gcodeTeeth')}: ${z} )\n` +
      `( ${t('engrenagens.gcodeAnglePerTooth')}: ${fmt(anguloDivisao)} ${t('engrenagens.gcodeDegrees')} )\n`;

    if (tipo === 'Helicoidal') {
      codigo += `( ${t('engrenagens.gcodeHelixNote', { angle: fmt(num(anguloHelice)) })} )\n`;
    }

    if (tipo === 'Cônica') {
      codigo += `( ${t('engrenagens.gcodeBevelNote')} )\n`;
    }

    if (tipo === 'Sem-fim') {
      codigo += `( ${t('engrenagens.gcodeWormNote')} )\n`;
    }

    if (tipo === 'Planetária') {
      codigo += `( ${t('engrenagens.gcodePlanetaryNote')} )\n`;
    }

    codigo += `G00 X0.000 Y0.000 Z5.000\n\n`;

    for (let i = 0; i < Math.min(z, 120); i++) {
      const a = i * anguloDivisao;

      codigo +=
        `( ${t('engrenagens.gcodeTooth')} ${i + 1} - A${fmt(a)} )\n` +
        `G00 A${fmtG(a)}\n` +
        `( ${t('engrenagens.gcodeExecuteToothCut')} )\n\n`;
    }

    return codigo + fim;
  }

  function calcular() {
  let z = num(dentes) || 1;
  const m = num(modulo);

  const dieInformado = num(diametroExternoInformado);

  if (tipo === 'Reta') {
    if (campoRetaEditado === 'die' && dieInformado > 0 && m > 0) {
      const zCalculado = Math.round((dieInformado / m) - 2);

      if (zCalculado > 0 && String(zCalculado) !== dentes) {
        setDentes(String(zCalculado));
      }

      z = zCalculado;
    }

    if (campoRetaEditado === 'z' && z > 0 && m > 0) {
      const dieCalculado = m * (z + 2);
      const dieTexto = fmt(dieCalculado);

      if (diametroExternoInformado !== dieTexto) {
        setDiametroExternoInformado(dieTexto);
      }
    }
  }

  const beta = num(anguloHelice);
  const pressao = num(anguloPressao);
  const z2 = num(dentesCoroa) || 1;
  const entradas = num(entradasSemFim) || 1;
  const dpSf = num(diametroSemFim);
  const compRack = num(comprimentoCremalheira);
  const relDiv = num(relacaoDivisor) || 40;
  const rpmIn = num(rpmEntrada);

  const passo = Math.PI * m;
  const adendo = m;
  const dedendo = 1.25 * m;
  const altura = 2.25 * m;
  const espessura = passo / 2;

  let lista = [];
  let relacao = z2 / z;
  let rpmSaida = relacao ? rpmIn / relacao : 0;
  let anguloDiv = 360 / z;
  let passoRack = passo;

    if (tipo === 'Reta') {
  const dp1 = m * z;
  const de1 = m * (z + 2);
  const df1 = dp1 - 2.5 * m;

  const dieInformado = num(diametroExternoInformado);
  const moduloPorDie = dieInformado > 0 && z > 0
    ? dieInformado / (z + 2)
    : 0;

  const diferencaDie = dieInformado > 0
    ? dieInformado - de1
    : 0;

  lista = [
    ['Tipo', 'Engrenagem cilíndrica reta'],
    ['Número de dentes', z.toFixed(0)],
    ['Módulo', `${fmt(m)} mm`],
    ['Ângulo de pressão utilizado', `${fmt(pressao)}°`],
    ['Dp / Diâmetro primitivo', `${fmt(dp1)} mm`],
    ['DiE / Diâmetro externo', `${fmt(de1)} mm`],
    ['DiF / Diâmetro de fundo', `${fmt(df1)} mm`],
    ['Passo circular', `${fmt(passo)} mm`],
    ['Espessura do dente', `${fmt(espessura)} mm`],
    ['Altura total', `${fmt(altura)} mm`],
    ['Adendo', `${fmt(adendo)} mm`],
    ['Dedendo', `${fmt(dedendo)} mm`]
  ];

  if (dieInformado > 0) {
    lista.push(
      ['DiE informado', `${fmt(dieInformado)} mm`],
      ['Módulo calculado pelo DiE', `${fmt(moduloPorDie)} mm`],
      ['Diferença DiE informado/calculado', `${fmt(diferencaDie)} mm`]
    );
  }

  lista = lista.map(([n, v]) => ({ n, v }));
}

    if (tipo === 'Helicoidal') {
      const betaRad = beta * Math.PI / 180;
      const mt = m / Math.cos(betaRad);
      const dp1 = mt * z;
      const dp2 = mt * z2;
      const de1 = dp1 + 2 * m;
      const de2 = dp2 + 2 * m;
      const centro = (dp1 + dp2) / 2;
      const passoNormal = Math.PI * m;
      const passoTransversal = Math.PI * mt;

      lista = [
        ['Tipo', 'Engrenagem helicoidal'],
        ['Dentes pinhão', z.toFixed(0)],
        ['Dentes coroa', z2.toFixed(0)],
        ['Módulo normal', `${fmt(m)} mm`],
        ['Ângulo da hélice', `${fmt(beta)}°`],
        ['Ângulo de pressão utilizado', `${fmt(pressao)}°`],
        ['Módulo transversal', `${fmt(mt)} mm`],
        ['Dp pinhão', `${fmt(dp1)} mm`],
        ['Dp coroa', `${fmt(dp2)} mm`],
        ['De pinhão', `${fmt(de1)} mm`],
        ['De coroa', `${fmt(de2)} mm`],
        ['Centro a centro', `${fmt(centro)} mm`],
        ['Passo normal', `${fmt(passoNormal)} mm`],
        ['Passo transversal', `${fmt(passoTransversal)} mm`],
        ['Relação', `${fmt(relacao)} : 1`]
      ].map(([n, v]) => ({ n, v }));
    }

    if (tipo === 'Cônica') {
  const dp1 = m * z;
  const dp2 = m * z2;

  const de1 = m * (z + 2);
  const de2 = m * (z2 + 2);

  const df1 = dp1 - 2.5 * m;
  const df2 = dp2 - 2.5 * m;

  const angPinhao = Math.atan(z / z2) * 180 / Math.PI;
  const angCoroa = Math.atan(z2 / z) * 180 / Math.PI;

  lista = [
    ['Tipo', 'Engrenagem cônica reta'],
    ['Dentes pinhão', z.toFixed(0)],
    ['Dentes coroa', z2.toFixed(0)],
    ['Módulo', `${fmt(m)} mm`],
    ['Ângulo de pressão utilizado', `${fmt(pressao)}°`],
    ['Relação', `${fmt(relacao)} : 1`],

    ['Dp pinhão', `${fmt(dp1)} mm`],
    ['DiE pinhão', `${fmt(de1)} mm`],
    ['DiF pinhão', `${fmt(df1)} mm`],

    ['Dp coroa', `${fmt(dp2)} mm`],
    ['DiE coroa', `${fmt(de2)} mm`],
    ['DiF coroa', `${fmt(df2)} mm`],

    ['Ângulo pinhão', `${fmt(angPinhao)}°`],
    ['Ângulo coroa', `${fmt(angCoroa)}°`]
  ].map(([n, v]) => ({ n, v }));
}

    if (tipo === 'Cremalheira') {
      const dpPinhao = m * z;
      const dePinhao = m * (z + 2);
      const cursoVolta = Math.PI * dpPinhao;
      const dentesEquiv = passo ? compRack / passo : 0;
      const velLinear = rpmIn * cursoVolta / 1000;

      lista = [
        ['Tipo', 'Cremalheira e pinhão'],
        ['Módulo', `${fmt(m)} mm`],
        ['Ângulo de pressão utilizado', `${fmt(pressao)}°`],
        ['Dentes do pinhão', z.toFixed(0)],
        ['Dp do pinhão', `${fmt(dpPinhao)} mm`],
        ['De do pinhão', `${fmt(dePinhao)} mm`],
        ['Passo linear', `${fmt(passo)} mm`],
        ['Espessura do dente', `${fmt(espessura)} mm`],
        ['Altura total do dente', `${fmt(altura)} mm`],
        ['Comprimento da cremalheira', `${fmt(compRack)} mm`],
        ['Dentes equivalentes', fmt(dentesEquiv)],
        ['Curso por volta do pinhão', `${fmt(cursoVolta)} mm`],
        ['Velocidade linear', `${fmt(velLinear)} m/min`]
      ].map(([n, v]) => ({ n, v }));

      passoRack = passo;
    }

    if (tipo === 'Sem-fim') {
      relacao = z2 / entradas;
      rpmSaida = relacao ? rpmIn / relacao : 0;

      const deSf = dpSf + 2 * m;
      const dfSf = dpSf - 2.5 * m;
      const dpCoroa = m * z2;
      const deCoroa = dpCoroa + 2 * m;
      const dfCoroa = dpCoroa - 2.5 * m;
      const centro = (dpSf + dpCoroa) / 2;
      const passoAxial = Math.PI * m;
      const avanco = passoAxial * entradas;

      lista = [
        ['Tipo', 'Sem-fim e coroa'],
        ['Entradas do sem-fim', entradas.toFixed(0)],
        ['Dentes da coroa', z2.toFixed(0)],
        ['Módulo', `${fmt(m)} mm`],
        ['Ângulo de pressão utilizado', `${fmt(pressao)}°`],
        ['Relação', `${fmt(relacao)} : 1`],
        ['Ø primitivo sem-fim', `${fmt(dpSf)} mm`],
        ['Ø externo sem-fim', `${fmt(deSf)} mm`],
        ['Ø fundo sem-fim', `${fmt(dfSf)} mm`],
        ['Ø primitivo coroa', `${fmt(dpCoroa)} mm`],
        ['Ø externo coroa', `${fmt(deCoroa)} mm`],
        ['Ø fundo coroa', `${fmt(dfCoroa)} mm`],
        ['Distância entre centros', `${fmt(centro)} mm`],
        ['Passo axial', `${fmt(passoAxial)} mm`],
        ['Avanço do sem-fim', `${fmt(avanco)} mm`],
        ['RPM entrada', `${fmt(rpmIn)} rpm`],
        ['RPM saída estimado', `${fmt(rpmSaida)} rpm`]
      ].map(([n, v]) => ({ n, v }));
    }

    if (tipo === 'Planetária') {
      relacao = 1 + (z2 / z);
      rpmSaida = relacao ? rpmIn / relacao : 0;

      const zSat = (z2 - z) / 2;
      const dpSolar = m * z;
      const dpCoroa = m * z2;
      const dpSat = m * zSat;

      lista = [
        ['Tipo', 'Planetária simples'],
        ['Dentes solar', z.toFixed(0)],
        ['Dentes coroa interna', z2.toFixed(0)],
        ['Módulo', `${fmt(m)} mm`],
        ['Ângulo de pressão utilizado', `${fmt(pressao)}°`],
        ['Dentes satélite teórico', fmt(zSat)],
        ['Dp solar', `${fmt(dpSolar)} mm`],
        ['Dp coroa interna', `${fmt(dpCoroa)} mm`],
        ['Dp satélite', `${fmt(dpSat)} mm`],
        ['Relação básica', `${fmt(relacao)} : 1`],
        ['RPM entrada', `${fmt(rpmIn)} rpm`],
        ['RPM saída estimado', `${fmt(rpmSaida)} rpm`]
      ].map(([n, v]) => ({ n, v }));
    }

    const voltas = relDiv / z;
    const inteiras = Math.floor(voltas);
    const fracao = voltas - inteiras;
    const frac = simplificar(Math.round(fracao * 100000), 100000);
    const discos = discosPossiveis(fracao);
    const disco = discos[0];

    const divisorItems = [
      { n: 'Divisões pelo número de dentes', v: z.toFixed(0) },
      { n: 'Ângulo por dente', v: `${fmt(anguloDiv)}°` },
      { n: 'Relação do divisor', v: `${fmt(relDiv)} : 1` },
      { n: 'Voltas por dente', v: fmt(voltas) },
      { n: 'Voltas inteiras', v: `${inteiras}` },
      { n: 'Fração restante', v: `${frac.n}/${frac.d}` },
      { n: 'Disco recomendado', v: disco ? t('engrenagens.plateWithHoles', { plate: disco.disco, holes: disco.furos }) : t('engrenagens.noExactPlate') }
    ];
    setDivisor(divisorItems.map((item) => ({ ...item, id: item.n, n: translateLabel(item.n) })));

    const trainItems = [
      { n: 'Relação de transmissão', v: `${fmt(relacao)} : 1` },
      { n: 'Motor / pinhão / sem-fim', v: tipo === 'Sem-fim' ? entradas.toFixed(0) : z.toFixed(0) },
      { n: 'Movida / coroa', v: z2.toFixed(0) },
      { n: 'RPM entrada', v: `${fmt(rpmIn)} rpm` },
      { n: 'RPM saída estimado', v: `${fmt(rpmSaida)} rpm` }
    ];
    setTrem(trainItems.map((item) => ({ ...item, id: item.n, n: translateLabel(item.n) })));

    const expected = (value) => `${t('engrenagens.expected')}: ${value}.`;
    const verificationStep = (index, label, value = '') =>
      `${index}. ${label}${value ? `\n${expected(value)}` : ''}`;

    let verificationSteps = [];

    if (tipo === 'Reta') {
      verificationSteps = [
        verificationStep(1, t('engrenagens.checkNumberTeeth'), `${z.toFixed(0)} ${t('engrenagens.teethUnit')}`),
        verificationStep(2, t('engrenagens.checkModule'), `${fmt(m)} mm`),
        verificationStep(3, t('engrenagens.checkPressureAngle'), `${fmt(pressao)}°`),
        verificationStep(4, t('engrenagens.measureCircularPitch'), `${fmt(passo)} mm`),
        verificationStep(5, t('engrenagens.checkToothThickness'), `${fmt(espessura)} mm`),
        verificationStep(6, t('engrenagens.checkRadialRunout'))
      ];
    }

    if (tipo === 'Helicoidal') {
      verificationSteps = [
        verificationStep(1, t('engrenagens.checkNumberTeeth'), `${z.toFixed(0)} ${t('engrenagens.teethUnit')}`),
        verificationStep(2, t('engrenagens.checkNormalModule'), `${fmt(m)} mm`),
        verificationStep(3, t('engrenagens.checkHelixAngle'), `${fmt(beta)}°`),
        verificationStep(4, t('engrenagens.checkPressureAngle'), `${fmt(pressao)}°`),
        verificationStep(5, t('engrenagens.measureNormalPitch'), `${fmt(passo)} mm`),
        verificationStep(6, t('engrenagens.checkHelixDirection'))
      ];
    }

    if (tipo === 'Cônica') {
      verificationSteps = [
        verificationStep(1, t('engrenagens.checkPinionTeeth'), `${z.toFixed(0)} ${t('engrenagens.teethUnit')}`),
        verificationStep(2, t('engrenagens.checkGearTeeth'), `${z2.toFixed(0)} ${t('engrenagens.teethUnit')}`),
        verificationStep(3, t('engrenagens.checkPinionGearAngles')),
        verificationStep(4, t('engrenagens.checkPressureAngle'), `${fmt(pressao)}°`),
        verificationStep(5, t('engrenagens.checkToothContact')),
        verificationStep(6, t('engrenagens.checkBacklashSeating'))
      ];
    }

    if (tipo === 'Cremalheira') {
      verificationSteps = [
        verificationStep(1, t('engrenagens.measureLinearPitch'), `${fmt(passo)} mm`),
        verificationStep(2, t('engrenagens.checkPressureAngle'), `${fmt(pressao)}°`),
        verificationStep(3, t('engrenagens.measureTotalToothHeight'), `${fmt(altura)} mm`),
        verificationStep(4, t('engrenagens.checkToothThickness'), `${fmt(espessura)} mm`),
        verificationStep(5, t('engrenagens.checkTotalLength'), `${fmt(compRack)} mm`),
        verificationStep(6, t('engrenagens.checkGuideParallelism'))
      ];
    }

    if (tipo === 'Sem-fim') {
      verificationSteps = [
        verificationStep(1, t('engrenagens.checkWormStarts'), `${entradas.toFixed(0)} ${t('engrenagens.startsUnit')}`),
        verificationStep(2, t('engrenagens.measureWormPitchDiameter'), `${fmt(dpSf)} mm`),
        verificationStep(3, t('engrenagens.measureWormOutsideDiameter'), `${fmt(dpSf + 2 * m)} mm`),
        verificationStep(4, t('engrenagens.measureGearPitchDiameter'), `${fmt(m * z2)} mm`),
        verificationStep(5, t('engrenagens.measureGearOutsideDiameter'), `${fmt(m * z2 + 2 * m)} mm`),
        verificationStep(6, t('engrenagens.checkGearTeeth'), `${z2.toFixed(0)} ${t('engrenagens.teethUnit')}`),
        verificationStep(7, t('engrenagens.checkAxialPitch'), `${fmt(passo)} mm`),
        verificationStep(8, t('engrenagens.checkWormLead'), `${fmt(passo * entradas)} mm`),
        verificationStep(9, t('engrenagens.checkCenterDistance'), t('engrenagens.asGeometricResult')),
        verificationStep(10, t('engrenagens.checkContactBacklashLubrication'))
      ];
    }

    if (tipo === 'Planetária') {
      verificationSteps = [
        verificationStep(1, t('engrenagens.checkSunTeeth'), `${z.toFixed(0)} ${t('engrenagens.teethUnit')}`),
        verificationStep(2, t('engrenagens.checkRingTeeth'), `${z2.toFixed(0)} ${t('engrenagens.teethUnit')}`),
        verificationStep(3, t('engrenagens.checkPlanetTeeth'), `${fmt((z2 - z) / 2)} ${t('engrenagens.teethUnit')}`),
        verificationStep(4, t('engrenagens.checkBasicRatio'), `${fmt(relacao)} : 1`),
        verificationStep(5, t('engrenagens.checkPlanetCarrierAssembly')),
        verificationStep(6, t('engrenagens.checkSmoothRotation'))
      ];
    }

    const verificacaoTexto =
      `${t('engrenagens.verificationHeader', { type: t(TYPE_KEYS[tipo]).toUpperCase() })}\n\n` +
      verificationSteps.join('\n\n');

    const terminalTexto =
      `${t('engrenagens.terminalTitle')}\n` +
      `${t('engrenagens.resultType')}: ${t(TYPE_KEYS[tipo])}\n` +
      `${t('engrenagens.moduleLabel')}: ${fmt(m)} mm\n` +
      `${t('engrenagens.pressureAngle')}: ${fmt(pressao)}°\n` +
      (tipo === 'Helicoidal' ? `${t('engrenagens.helixAngleLabel')}: ${fmt(beta)}°\n` : '') +
      `${t('engrenagens.ratioLabel')}: ${fmt(relacao)} : 1\n` +
      `${t('engrenagens.inputRpm')}: ${fmt(rpmIn)} rpm\n` +
      `${t('engrenagens.outputRpm')}: ${fmt(rpmSaida)} rpm\n\n` +
      `${t('engrenagens.divider').toUpperCase()}:\n` +
      `${t('engrenagens.anglePerTooth')}: ${fmt(anguloDiv)}°\n` +
      `${t('engrenagens.movement')}: ${t('engrenagens.turnCount', { turns: inteiras })}` +
      (disco ? ` + ${t('engrenagens.holesOnPlate', { holes: disco.furos, plate: disco.disco })}.` : ` + ${t('engrenagens.fractionNoPlate')}.`);

    setResultados(lista.map((item) => ({
      ...item,
      id: item.n,
      n: translateLabel(item.n),
      v: item.n === 'Tipo' ? t(TYPE_RESULT_KEYS[tipo]) : item.v
    })));
    setVerificacao(verificacaoTexto);
    setTerminal(terminalTexto);
    setGcode(gerarGcode(z, anguloDiv, passoRack));
  }

  useEffect(() => {
    calcular();
  }, [
    tipo,
    controle,
    dentes,
    modulo,
    anguloHelice,
    anguloPressao,
    dentesCoroa,
    entradasSemFim,
    diametroSemFim,
    diametroExternoInformado,
    comprimentoCremalheira,
    relacaoDivisor,
    rpmEntrada,
    campoRetaEditado,
    t
  ]);

  const relatorio =
    `${t('engrenagens.reportTitle')}\n\n` +
    resultados.map((i) => `${i.n}: ${i.v}`).join('\n') +
    `\n\n${t('engrenagens.divider').toUpperCase()}\n` +
    divisor.map((i) => `${i.n}: ${i.v}`).join('\n') +
    `\n\n${t('engrenagens.gearTrain').toUpperCase()}\n` +
    trem.map((i) => `${i.n}: ${i.v}`).join('\n') +
    `\n\n${verificacao}\n\n${gcode}`;

  function renderCampo(label, valor, setValor) {
    return (
      <View style={s.boxInputHalf}>
        <Text style={s.labelInput}>{label}</Text>
        <TextInput
          style={s.input}
          value={valor}
          onChangeText={setValor}
          keyboardType="numeric"
        />
      </View>
    );
  }

  function renderCamposEntrada() {
    if (tipo === 'Reta') {
  
      return (
    <>
      <View style={s.gridInputs}>
  {renderCampo(t('engrenagens.moduleInput'), modulo, setModulo)}

  <View style={s.boxInputHalf}>
    <Text style={s.labelInput}>{t('engrenagens.numberTeethInput')}</Text>
    <TextInput
      style={s.input}
      value={dentes}
      onChangeText={(txt) => {
        setCampoRetaEditado('z');
        setDentes(txt.replace(/[^0-9]/g, ''));
      }}
      keyboardType="numeric"
    />
  </View>
</View>

<View style={s.gridInputs}>
  <View style={s.boxInputHalf}>
    <Text style={s.labelInput}>{t('engrenagens.optionalOutsideDiameter')}</Text>
    <TextInput
      style={s.input}
      value={diametroExternoInformado}
      onChangeText={(txt) => {
        setCampoRetaEditado('die');
        setDiametroExternoInformado(txt);
      }}
      keyboardType="numeric"
    />
  </View>

  {renderCampo(t('engrenagens.pressureAngle'), anguloPressao, setAnguloPressao)}
</View>
    </>
  );
}

    if (tipo === 'Helicoidal') {
      return (
        <>
          <View style={s.gridInputs}>
            {renderCampo(t('engrenagens.pinionTeeth'), dentes, setDentes)}
            {renderCampo(t('engrenagens.gearTeeth'), dentesCoroa, setDentesCoroa)}
          </View>

          <View style={s.gridInputs}>
            {renderCampo(t('engrenagens.normalModuleLabel'), modulo, setModulo)}
            {renderCampo(t('engrenagens.helixAngleLabel'), anguloHelice, setAnguloHelice)}
          </View>

          <View style={s.gridInputs}>
            {renderCampo(t('engrenagens.pressureAngle'), anguloPressao, setAnguloPressao)}
            {renderCampo(t('engrenagens.inputRpm'), rpmEntrada, setRpmEntrada)}
          </View>

          <View style={s.gridInputs}>
            {renderCampo(t('engrenagens.dividerRatio'), relacaoDivisor, setRelacaoDivisor)}
          </View>
        </>
      );
    }

    if (tipo === 'Cônica') {
      return (
        <>
          <View style={s.gridInputs}>
            {renderCampo(t('engrenagens.pinionTeeth'), dentes, setDentes)}
            {renderCampo(t('engrenagens.gearTeeth'), dentesCoroa, setDentesCoroa)}
          </View>

          <View style={s.gridInputs}>
            {renderCampo(t('engrenagens.moduleLabel'), modulo, setModulo)}
            {renderCampo(t('engrenagens.pressureAngle'), anguloPressao, setAnguloPressao)}
          </View>

          <View style={s.gridInputs}>
            {renderCampo(t('engrenagens.inputRpm'), rpmEntrada, setRpmEntrada)}
            {renderCampo(t('engrenagens.dividerRatio'), relacaoDivisor, setRelacaoDivisor)}
          </View>
        </>
      );
    }

    if (tipo === 'Cremalheira') {
      return (
        <>
          <View style={s.gridInputs}>
            {renderCampo(t('engrenagens.pinionTeeth'), dentes, setDentes)}
            {renderCampo(t('engrenagens.moduleLabel'), modulo, setModulo)}
          </View>

          <View style={s.gridInputs}>
            {renderCampo(t('engrenagens.rackLength'), comprimentoCremalheira, setComprimentoCremalheira)}
            {renderCampo(t('engrenagens.pressureAngle'), anguloPressao, setAnguloPressao)}
          </View>

          <View style={s.gridInputs}>
            {renderCampo(t('engrenagens.inputRpm'), rpmEntrada, setRpmEntrada)}
          </View>
        </>
      );
    }

    if (tipo === 'Sem-fim') {
      return (
        <>
          <View style={s.gridInputs}>
            {renderCampo(t('engrenagens.wormStarts'), entradasSemFim, setEntradasSemFim)}
            {renderCampo(t('engrenagens.gearTeeth'), dentesCoroa, setDentesCoroa)}
          </View>

          <View style={s.gridInputs}>
            {renderCampo(t('engrenagens.moduleLabel'), modulo, setModulo)}
            {renderCampo(t('engrenagens.wormPitchDiameter'), diametroSemFim, setDiametroSemFim)}
          </View>

          <View style={s.gridInputs}>
            {renderCampo(t('engrenagens.pressureAngle'), anguloPressao, setAnguloPressao)}
            {renderCampo(t('engrenagens.inputRpm'), rpmEntrada, setRpmEntrada)}
          </View>
        </>
      );
    }

    if (tipo === 'Planetária') {
      return (
        <>
          <View style={s.gridInputs}>
            {renderCampo(t('engrenagens.sunTeeth'), dentes, setDentes)}
            {renderCampo(t('engrenagens.ringTeeth'), dentesCoroa, setDentesCoroa)}
          </View>

          <View style={s.gridInputs}>
            {renderCampo(t('engrenagens.moduleLabel'), modulo, setModulo)}
            {renderCampo(t('engrenagens.pressureAngle'), anguloPressao, setAnguloPressao)}
          </View>

          <View style={s.gridInputs}>
            {renderCampo(t('engrenagens.inputRpm'), rpmEntrada, setRpmEntrada)}
          </View>
        </>
      );
    }

    return null;
  }

  function tabela(lista) {
    return lista.map((item, index) => {
      const destaque = [
  'Número de dentes',
  'Dentes pinhão',
  'Dentes coroa',
  'Dentes solar',
  'Dentes coroa interna',

  'Módulo',
  'Módulo normal',

  'Ângulo de pressão utilizado',
  'Ângulo da hélice',

  'Dp / Diâmetro primitivo',
  'DiE / Diâmetro externo',
  'DiF / Diâmetro de fundo',

  'Dp pinhão',
  'DiE pinhão',
  'DiF pinhão',

  'Dp coroa',
  'DiE coroa',
  'DiF coroa',

  'Dp do pinhão',
  'DiE do pinhão',

  'Comprimento da cremalheira',
  'Passo linear',
  'Curso por volta do pinhão',
  'Velocidade linear',

  'Centro a centro',
  'Distância entre centros',

  'Relação',
  'Relação básica',

  'RPM saída estimado'
].includes(item.id || item.n);

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
          <Text style={[s.txtWhite, { flex: 1, flexWrap: 'wrap' }]}>{item.n}</Text>
          <Text style={[s.txtYellow, { width: 135, textAlign: 'right', flexWrap: 'wrap' }]}>{item.v}</Text>
        </View>
      );
    });
  }

  return (
    <CasillasLayout
      navigation={navigation}
      activeRoute="Engrenagens"
      title={t('engrenagens.title')}
      subtitle={t('engrenagens.subtitle')}
      terminalText={terminal}
      shareText={relatorio}
    >
      <View style={s.card}>
        <Text style={styles.txtHeadTab}>{t('engrenagens.subTabsTitle')}</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {SUBABAS.map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => setSubAba(item)}
              style={[s.btnTipo, subAba === item && s.btnTipoAtivo]}
            >
              <Text style={[s.btnTipoText, subAba === item && s.btnTipoTextAtivo]}>
                {t(SUBABA_KEYS[item])}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={s.card}>
        <Text style={styles.txtHeadTab}>2. {t('engrenagens.typeLabel')}</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {TIPOS.map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => setTipo(item)}
              style={[s.btnTipo, tipo === item && s.btnTipoAtivo]}
            >
              <Text style={[s.btnTipoText, tipo === item && s.btnTipoTextAtivo]}>
                {t(TYPE_KEYS[item])}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {subAba === 'Cálculo' && (
        <>
          <View style={s.card}>
            <Text style={styles.txtHeadTab}>3. {t('engrenagens.inputData')}</Text>
            {renderCamposEntrada()}
          </View>

          <View style={s.card}>
            <Text style={styles.txtHeadTab}>{t('engrenagens.geoResults')}</Text>
            {tabela(resultados)}
          </View>
        </>
      )}

      {subAba === 'Consulta Fórmulas' && (
        <View style={s.card}>
          <Text style={styles.txtHeadTab}>{t('engrenagens.formulaLookupTitle')} - {t(TYPE_KEYS[tipo]).toUpperCase()}</Text>

          {(FORMULAS[tipo] || []).map((item, index) => (
            <View key={index} style={{ paddingVertical: 8, borderBottomWidth: 1, borderColor: '#111' }}>
              <Text style={s.txtWhite}>{translateLabel(item[0])}</Text>
              <Text style={[s.txtYellow, { marginTop: 4 }]}>{item[1]}</Text>
            </View>
          ))}
        </View>
      )}

      {subAba === 'Divisor / Trem' && (
        <>
          <View style={s.card}>
            <Text style={styles.txtHeadTab}>{t('engrenagens.dividerResultTitle')}</Text>
            {tabela(divisor)}
          </View>

          <View style={s.card}>
            <Text style={styles.txtHeadTab}>{t('engrenagens.gearTrainTitle')}</Text>
            {tabela(trem)}
          </View>
        </>
      )}

      {subAba === 'Verificação' && (
        <View style={s.card}>
          <Text style={styles.txtHeadTab}>{t('engrenagens.dimensionalVerificationTitle')}</Text>
          <View style={s.terminal}>
            <Text style={s.txtGcode}>{verificacao}</Text>
          </View>
        </View>
      )}

      <View style={s.card}>
        <Text style={styles.txtHeadTab}>{t('engrenagens.terminalSection')}</Text>
        <View style={s.terminal}>
          <Text style={s.txtGcode}>{terminal}</Text>
        </View>
      </View>

      <View style={s.card}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={styles.txtHeadTab}>{t('engrenagens.gcodeTitle')}</Text>

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
            <Text style={{ color: gcodeAtivo ? '#000' : '#777', fontSize: 10, fontWeight: 'bold' }}>
              {gcodeAtivo ? 'ON' : 'OFF'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={s.txtGray}>{t('engrenagens.machineDescription')}</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {CONTROLES.map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => setControle(item)}
              style={[s.btnTipo, controle === item && s.btnTipoAtivo, { marginTop: 8 }]}
            >
              <Text style={[s.btnTipoText, controle === item && s.btnTipoTextAtivo]}>
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
