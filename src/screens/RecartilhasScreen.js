import React, { useMemo, useState } from 'react';

import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet
} from 'react-native';

import CasillasLayout, {
  casillasStyles as styles
} from '../components/CasillasLayout';
import { useLanguage } from '../contexts/LanguageContext';

const TIPOS = [
  {
    id: 'reta_ext',
    nameKey: 'recartilhas.typeStraightExternal',
    fatorProf: 0.55,
    fatorAvanco: 0.35,
    fatorDiam: 0.45,
    interno: false,
    angleKey: 'recartilhas.angleZero',
    supportKey: 'recartilhas.supportStraight'
  },
  {
    id: 'cruzada_ext',
    nameKey: 'recartilhas.typeCrossExternal',
    fatorProf: 0.62,
    fatorAvanco: 0.30,
    fatorDiam: 0.55,
    interno: false,
    angleKey: 'recartilhas.angleCross',
    supportKey: 'recartilhas.supportCross'
  },
  {
    id: 'diamantada_ext',
    nameKey: 'recartilhas.typeDiamondExternal',
    fatorProf: 0.65,
    fatorAvanco: 0.28,
    fatorDiam: 0.60,
    interno: false,
    angleKey: 'recartilhas.angleDiamond',
    supportKey: 'recartilhas.supportDiamond'
  },
  {
    id: 'helicoidal_dir',
    nameKey: 'recartilhas.typeRightHelical',
    fatorProf: 0.58,
    fatorAvanco: 0.32,
    fatorDiam: 0.50,
    interno: false,
    angleKey: 'recartilhas.angleRight',
    supportKey: 'recartilhas.supportRight'
  },
  {
    id: 'helicoidal_esq',
    nameKey: 'recartilhas.typeLeftHelical',
    fatorProf: 0.58,
    fatorAvanco: 0.32,
    fatorDiam: 0.50,
    interno: false,
    angleKey: 'recartilhas.angleLeft',
    supportKey: 'recartilhas.supportLeft'
  },
  {
    id: 'corte_ext',
    nameKey: 'recartilhas.typeCutExternal',
    fatorProf: 0.45,
    fatorAvanco: 0.45,
    fatorDiam: 0.25,
    interno: false,
    angleKey: 'recartilhas.angleCut',
    supportKey: 'recartilhas.supportCut'
  },
  {
    id: 'deformacao_ext',
    nameKey: 'recartilhas.typeFormExternal',
    fatorProf: 0.70,
    fatorAvanco: 0.25,
    fatorDiam: 0.65,
    interno: false,
    angleKey: 'recartilhas.angleWheel',
    supportKey: 'recartilhas.supportForm'
  },
  {
    id: 'interna',
    nameKey: 'recartilhas.typeInternal',
    fatorProf: 0.40,
    fatorAvanco: 0.22,
    fatorDiam: -0.35,
    interno: true,
    angleKey: 'recartilhas.angleInternal',
    supportKey: 'recartilhas.supportInternal'
  }
];

const MATERIAIS = [
  {
    id: 'aco',
    nameKey: 'recartilhas.materialCarbonSteel',
    vc: 18,
    carga: 1.00,
    noteKey: 'recartilhas.obsCarbonSteel'
  },
  {
    id: 'inox',
    nameKey: 'recartilhas.materialStainless',
    vc: 10,
    carga: 1.25,
    noteKey: 'recartilhas.obsStainless'
  },
  {
    id: 'aluminio',
    nameKey: 'recartilhas.materialAluminum',
    vc: 45,
    carga: 0.65,
    noteKey: 'recartilhas.obsAluminum'
  },
  {
    id: 'bronze',
    nameKey: 'recartilhas.materialBronzeBrass',
    vc: 30,
    carga: 0.80,
    noteKey: 'recartilhas.obsBronzeBrass'
  },
  {
    id: 'plastico',
    nameKey: 'recartilhas.materialPlastic',
    vc: 35,
    carga: 0.45,
    noteKey: 'recartilhas.obsPlastic'
  }
];

const CONTROLES_CNC = [
  {
    id: 'fanuc',
    nome: 'FANUC'
  },
  {
    id: 'siemens',
    nome: 'SIEMENS'
  },
  {
    id: 'mitsubishi',
    nome: 'MITSUBISHI'
  },
  {
    id: 'haas',
    nome: 'HAAS'
  },
  {
    id: 'mach3',
    nome: 'MACH3'
  }
];

export default function RecartilhasScreen({ navigation }) {
  const { t } = useLanguage();
  const [tipoId, setTipoId] = useState('diamantada_ext');
  const [materialId, setMaterialId] = useState('aco');

  const [diametro, setDiametro] = useState('20');
  const [diametroInterno, setDiametroInterno] = useState('30');
  const [passo, setPasso] = useState('1.0');
  const [comprimento, setComprimento] = useState('25');
  const [rpmManual, setRpmManual] = useState('');

  const [gcodeAtivo, setGcodeAtivo] = useState(true);
  const [controleCnc, setControleCnc] = useState('fanuc');

  function n(valor) {
    return parseFloat(String(valor).replace(',', '.')) || 0;
  }

  const tipo = TIPOS.find((item) => item.id === tipoId) || TIPOS[0];
  const material = MATERIAIS.find((item) => item.id === materialId) || MATERIAIS[0];
  const typeName = t(tipo.nameKey);
  const typeAngle = t(tipo.angleKey);
  const typeSupport = t(tipo.supportKey);
  const materialName = t(material.nameKey);
  const materialNote = t(material.noteKey);

  const calc = useMemo(() => {
    const d = n(diametro);
    const di = n(diametroInterno);
    const p = n(passo);
    const l = n(comprimento);
    const rpmInformado = n(rpmManual);

    const diametroBase = tipo.interno ? di : d;

    const profundidade = Math.abs(p * tipo.fatorProf);
    const avanco = Math.max(0.03, p * tipo.fatorAvanco);

    const diametroPreparacao = tipo.interno
      ? diametroBase + Math.abs(p * tipo.fatorDiam)
      : diametroBase - Math.abs(p * tipo.fatorDiam);

    const rpmSugerido = diametroBase > 0
      ? (material.vc * 1000) / (Math.PI * diametroBase)
      : 0;

    const rpmFinal = rpmInformado > 0 ? rpmInformado : rpmSugerido;

    const tempo = avanco * rpmFinal > 0
      ? l / (avanco * rpmFinal)
      : 0;

    const carga = Math.max(1, p * 100 * material.carga);

    const incrementoPasse = 0.10;
const passes = Math.max(1, Math.ceil(profundidade / incrementoPasse));

    return {
  diametroBase,
  profundidade,
  avanco,
  diametroPreparacao,
  rpmSugerido,
  rpmFinal,
  tempo,
  carga,
  passes,
  incrementoPasse
};
  }, [
    diametro,
    diametroInterno,
    passo,
    comprimento,
    rpmManual,
    tipo,
    material
  ]);

  function baseGcodeCabecalho(titulo, s) {
    return [
      `(${titulo})`,
      `(${t('recartilhas.gcodeAuxiliary')})`,
      `(${t('recartilhas.simulateBefore')})`,
      'G21 G18 G40 G80 G99',
      `G97 S${s} M03`,
      'M08'
    ];
  }

  function baseGcodeRodape() {
    return [
      'M09',
      'M05',
      'M30'
    ];
  }

  function obterTipoOperacao() {
    if (tipo.id === 'interna') return t('recartilhas.operationInternal');
    if (tipo.id === 'corte_ext') return t('recartilhas.operationCut');
    if (tipo.id === 'deformacao_ext') return t('recartilhas.operationForm');
    if (tipo.id === 'reta_ext') return t('recartilhas.operationStraight');

    return t('recartilhas.operationCrossDiamond');
  }

function obterNomeControle() {
  const controle = CONTROLES_CNC.find((item) => item.id === controleCnc);
  return controle ? controle.nome : 'FANUC';
}

function montarLinhasMovimento() {
  const d = calc.diametroBase;
  const zInicio = 2;
  const zFim = -Math.abs(n(comprimento));
  const f = calc.avanco.toFixed(3);

  if (tipo.interno) {
    const xSeguro = d - 2;
    const xTrabalho = calc.diametroPreparacao;

    return [
      `(${t('recartilhas.internalOperation')})`,
      `(${t('recartilhas.internalBaseDiameter')}: ${d.toFixed(3)} mm)`,
      `(${t('recartilhas.preparationDiameter')}: X${xTrabalho.toFixed(3)})`,
      `(${t('recartilhas.passDetails', { passes: calc.passes, increment: calc.incrementoPasse.toFixed(2) })})`,
      `G00 X${xSeguro.toFixed(3)} Z${zInicio.toFixed(3)}`,
      `G01 X${xTrabalho.toFixed(3)} F0.080`,
      `G01 Z${zFim.toFixed(3)} F${f}`,
      `G01 X${xSeguro.toFixed(3)} F0.100`,
      'G00 Z5.000'
    ];
  }

  const xSeguro = d + 3;
  const xTrabalho = calc.diametroPreparacao;

  if (tipo.id === 'deformacao_ext') {
    const xPrimeiroPasse = xTrabalho + calc.profundidade * 0.50;

    return [
      `(${t('recartilhas.externalFormOperation')})`,
      `(${t('recartilhas.baseDiameter')}: ${d.toFixed(3)} mm)`,
      `(${t('recartilhas.finalPrepDiameter')}: X${xTrabalho.toFixed(3)})`,
      `(${t('recartilhas.passDetails', { passes: calc.passes, increment: calc.incrementoPasse.toFixed(2) })})`,
      `G00 X${xSeguro.toFixed(3)} Z${zInicio.toFixed(3)}`,
      `(${t('recartilhas.initialApproachPass')})`,
      `G01 X${xPrimeiroPasse.toFixed(3)} F0.100`,
      `G01 Z${zFim.toFixed(3)} F${f}`,
      `G00 X${xSeguro.toFixed(3)}`,
      `G00 Z${zInicio.toFixed(3)}`,
      `(${t('recartilhas.finalFormingPass')})`,
      `G01 X${xTrabalho.toFixed(3)} F0.080`,
      `G01 Z${zFim.toFixed(3)} F${f}`,
      `G00 X${(d + 5).toFixed(3)}`,
      'G00 Z5.000'
    ];
  }

  if (tipo.id === 'corte_ext') {
    return [
      `(${t('recartilhas.externalCutOperation')})`,
      `(${t('recartilhas.baseDiameter')}: ${d.toFixed(3)} mm)`,
      `(${t('recartilhas.preparationDiameter')}: X${xTrabalho.toFixed(3)})`,
      `(${t('recartilhas.passDetails', { passes: calc.passes, increment: calc.incrementoPasse.toFixed(2) })})`,
      `G00 X${xSeguro.toFixed(3)} Z${zInicio.toFixed(3)}`,
      `G01 X${xTrabalho.toFixed(3)} F0.080`,
      `G01 Z${zFim.toFixed(3)} F${f}`,
      `G00 X${(d + 5).toFixed(3)}`,
      'G00 Z5.000'
    ];
  }

  return [
    `(${t('recartilhas.operation')}: ${obterTipoOperacao()})`,
    `(${t('recartilhas.baseDiameter')}: ${d.toFixed(3)} mm)`,
    `(${t('recartilhas.preparationDiameter')}: X${xTrabalho.toFixed(3)})`,
    `(${t('recartilhas.passDetails', { passes: calc.passes, increment: calc.incrementoPasse.toFixed(2) })})`,
    `G00 X${xSeguro.toFixed(3)} Z${zInicio.toFixed(3)}`,
    `G01 X${xTrabalho.toFixed(3)} F0.120`,
    `G01 Z${zFim.toFixed(3)} F${f}`,
    `(${t('recartilhas.optionalRepeat')})`,
    `G00 X${(d + 5).toFixed(3)}`,
    'G00 Z5.000'
  ];
}

function gerarGcodeFanuc() {
  const s = Math.max(50, Math.round(calc.rpmFinal));

  return [
    `(FANUC - ${t('recartilhas.title').toUpperCase()})`,
    '(CiFluc Gemini Casillas)',
    `(${t('recartilhas.typeLabel')}: ${typeName})`,
    `(${t('recartilhas.materialTitle')}: ${materialName})`,
    'G21 G18 G40 G80 G99',
    `G97 S${s} M03`,
    'M08',
    ...montarLinhasMovimento(),
    'M09',
    'M05',
    'M30'
  ].join('\n');
}

function gerarGcodeSiemens() {
  const s = Math.max(50, Math.round(calc.rpmFinal));

  return [
    `; SIEMENS - ${t('recartilhas.title').toUpperCase()}`,
    '; CiFluc Gemini Casillas',
    `; ${t('recartilhas.typeLabel')}: ${typeName}`,
    `; ${t('recartilhas.materialTitle')}: ${materialName}`,
    'G90 G18 G40 G71',
    `S${s} M3`,
    'M8',
    ...montarLinhasMovimento(),
    'M9',
    'M5',
    'M30'
  ].join('\n');
}

function gerarGcodeMitsubishi() {
  const s = Math.max(50, Math.round(calc.rpmFinal));

  return [
    `(MITSUBISHI - ${t('recartilhas.title').toUpperCase()})`,
    '(CiFluc Gemini Casillas)',
    `(${t('recartilhas.typeLabel')}: ${typeName})`,
    `(${t('recartilhas.materialTitle')}: ${materialName})`,
    'G21 G18 G40 G80 G99',
    `G97 S${s} M03`,
    'M08',
    ...montarLinhasMovimento(),
    'M09',
    'M05',
    'M30'
  ].join('\n');
}

function gerarGcodeHaas() {
  const s = Math.max(50, Math.round(calc.rpmFinal));

  return [
    `(HAAS - ${t('recartilhas.title').toUpperCase()})`,
    '(CiFluc Gemini Casillas)',
    `(${t('recartilhas.typeLabel')}: ${typeName})`,
    `(${t('recartilhas.materialTitle')}: ${materialName})`,
    `G20 (${t('recartilhas.removeMetricLine')})`,
    'G21',
    'G18 G40 G80 G99',
    `G97 S${s} M03`,
    'M08',
    ...montarLinhasMovimento(),
    'M09',
    'M05',
    'M30'
  ].join('\n');
}

function gerarGcodeMach3() {
  const s = Math.max(50, Math.round(calc.rpmFinal));

  return [
    `(MACH3 - ${t('recartilhas.title').toUpperCase()})`,
    '(CiFluc Gemini Casillas)',
    `(${t('recartilhas.typeLabel')}: ${typeName})`,
    `(${t('recartilhas.materialTitle')}: ${materialName})`,
    'G21 G18 G40 G80 G90',
    `S${s} M3`,
    'M8',
    ...montarLinhasMovimento(),
    'M9',
    'M5',
    'M30'
  ].join('\n');
}

function montarGcodeSelecionado() {
  if (!gcodeAtivo) {
    return t('recartilhas.offHelp');
  }

  if (controleCnc === 'fanuc') return gerarGcodeFanuc();
  if (controleCnc === 'siemens') return gerarGcodeSiemens();
  if (controleCnc === 'mitsubishi') return gerarGcodeMitsubishi();
  if (controleCnc === 'haas') return gerarGcodeHaas();
  if (controleCnc === 'mach3') return gerarGcodeMach3();

  return gerarGcodeFanuc();
}

  function montarRelatorio() {
    return [
      t('recartilhas.reportTitle'),
      t('recartilhas.reportSubtitle'),
      '',
      `${t('recartilhas.selectedType')}: ${typeName}`,
      `${t('recartilhas.materialTitle')}: ${materialName}`,
      `${t('recartilhas.anglePattern')}: ${typeAngle}`,
      `${t('recartilhas.support')}: ${typeSupport}`,
      '',
      t('recartilhas.inputs'),
      `${t('recartilhas.externalDiameter')}: ${n(diametro).toFixed(3)} mm`,
      `${t('recartilhas.internalDiameter')}: ${n(diametroInterno).toFixed(3)} mm`,
      `${t('recartilhas.pitch')}: ${n(passo).toFixed(3)} mm`,
      `${t('recartilhas.length')}: ${n(comprimento).toFixed(3)} mm`,
      '',
      t('recartilhas.results'),
      `${t('recartilhas.baseDiameter')}: ${calc.diametroBase.toFixed(3)} mm`,
      `${t('recartilhas.preparationDiameter')}: ${calc.diametroPreparacao.toFixed(3)} mm`,
      `${t('recartilhas.approximateDepth')}: ${calc.profundidade.toFixed(3)} mm`,
      `${t('recartilhas.suggestedFeed')}: ${calc.avanco.toFixed(3)} mm/volta`,
      `${t('recartilhas.suggestedRpm')}: ${calc.rpmSugerido.toFixed(0)} rpm`,
      `${t('recartilhas.usedRpm')}: ${calc.rpmFinal.toFixed(0)} rpm`,
      `${t('recartilhas.feedTime')}: ${calc.tempo.toFixed(2)} min`,
      `${t('recartilhas.estimatedLoad')}: ${calc.carga.toFixed(0)}`,
      `${t('recartilhas.suggestedPasses')}: ${calc.passes}`,
      '',
      t('recartilhas.recommendationReport'),
      `${t('recartilhas.materialNote')}: ${materialNote}`,
      '',
      'G-CODE',
      `${t('recartilhas.gcodeStatus')}: ${gcodeAtivo ? 'ON' : 'OFF'}`,
      `${t('recartilhas.cncControl')}: ${obterNomeControle()}`,
      `${t('recartilhas.operation')}: ${obterTipoOperacao()}`,
      '',
      montarGcodeSelecionado(),
      '',
      t('recartilhas.reportWarning')
    ].join('\n');
  }

  const terminalText = [
    `${t('recartilhas.selectedType')}: ${typeName}`,
    `${t('recartilhas.materialTitle')}: ${materialName}`,
    `${t('recartilhas.baseDiameter')}: ${calc.diametroBase.toFixed(3)} mm`,
    `${t('recartilhas.preparationDiameter')}: ${calc.diametroPreparacao.toFixed(3)} mm`,
    `${t('recartilhas.approximateDepth')}: ${calc.profundidade.toFixed(3)} mm`,
    `${t('recartilhas.suggestedFeed')}: ${calc.avanco.toFixed(3)} mm/volta`,
    `${t('recartilhas.suggestedRpm')}: ${calc.rpmSugerido.toFixed(0)} rpm`,
    `G-code: ${gcodeAtivo ? 'ON' : 'OFF'}`,
    `${t('recartilhas.cncControl')}: ${obterNomeControle()}`,
    `${t('recartilhas.operation')}: ${obterTipoOperacao()}`,
    t('recartilhas.passDetails', { passes: calc.passes, increment: calc.incrementoPasse.toFixed(2) }),
    t('recartilhas.terminalStatus')
  ].join('\n');

  function InputCampo(label, value, setter, placeholder) {
    return (
      <>
        <Text style={styles.labelInput}>{label}</Text>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={setter}
          keyboardType="numeric"
          placeholder={placeholder}
          placeholderTextColor="#555555"
        />
      </>
    );
  }

  function Resultado({ label, value, formula }) {
    return (
      <View style={localStyles.resultadoBox}>
        <Text style={localStyles.resultadoLabel}>{label}</Text>
        <Text style={localStyles.resultadoValue}>{value}</Text>
        {!!formula && <Text style={localStyles.formula}>{formula}</Text>}
      </View>
    );
  }

  return (
    <CasillasLayout
      navigation={navigation}
      activeRoute="Recartilhas"
      title={t('recartilhas.title')}
      subtitle={t('recartilhas.layoutSubtitle')}
      terminalText={terminalText}
      shareText={montarRelatorio()}
    >
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t('recartilhas.typeTitle')}</Text>

        <View style={localStyles.optionWrap}>
          {TIPOS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.btnTipo,
                tipoId === item.id && styles.btnTipoAtivo
              ]}
              onPress={() => setTipoId(item.id)}
            >
              <Text
                style={[
                  styles.btnTipoText,
                  tipoId === item.id && styles.btnTipoTextAtivo
                ]}
              >
                {t(item.nameKey)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t('recartilhas.materialTitle')}</Text>

        <View style={localStyles.optionWrap}>
          {MATERIAIS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.btnTipo,
                materialId === item.id && styles.btnTipoAtivo
              ]}
              onPress={() => setMaterialId(item.id)}
            >
              <Text
                style={[
                  styles.btnTipoText,
                  materialId === item.id && styles.btnTipoTextAtivo
                ]}
              >
                {t(item.nameKey)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t('recartilhas.inputData')}</Text>

        {InputCampo(
          t('recartilhas.externalDiameterInput'),
          diametro,
          setDiametro,
          'Ex: 20'
        )}

        {InputCampo(
          t('recartilhas.internalDiameterInput'),
          diametroInterno,
          setDiametroInterno,
          'Ex: 30'
        )}

        {InputCampo(
          t('recartilhas.pitchInput'),
          passo,
          setPasso,
          'Ex: 1.0'
        )}

        {InputCampo(
          t('recartilhas.lengthInput'),
          comprimento,
          setComprimento,
          'Ex: 25'
        )}

        {InputCampo(
          t('recartilhas.manualRpmInput'),
          rpmManual,
          setRpmManual,
          t('recartilhas.emptySuggested')
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t('recartilhas.technicalResults')}</Text>

        <Resultado
          label={t('recartilhas.baseDiameter')}
          value={`${calc.diametroBase.toFixed(3)} mm`}
        />

        <Resultado
          label={t('recartilhas.preparationDiameter')}
          value={`${calc.diametroPreparacao.toFixed(3)} mm`}
          formula={tipo.interno
            ? t('recartilhas.internalPrepFormula')
            : t('recartilhas.externalPrepFormula')}
        />

        <Resultado
          label={t('recartilhas.approximateDepth')}
          value={`${calc.profundidade.toFixed(3)} mm`}
          formula={t('recartilhas.depthFormula')}
        />

        <Resultado
          label={t('recartilhas.suggestedFeed')}
          value={`${calc.avanco.toFixed(3)} mm/volta`}
          formula={t('recartilhas.feedFormula')}
        />

        <Resultado
          label={t('recartilhas.suggestedRpm')}
          value={`${calc.rpmSugerido.toFixed(0)} rpm`}
          formula={t('recartilhas.rpmFormula')}
        />

        <Resultado
          label={t('recartilhas.usedRpm')}
          value={`${calc.rpmFinal.toFixed(0)} rpm`}
        />

        <Resultado
          label={t('recartilhas.estimatedTime')}
          value={`${calc.tempo.toFixed(2)} min`}
          formula={t('recartilhas.timeFormula')}
        />

        <Resultado
          label={t('recartilhas.relativeLoad')}
          value={`${calc.carga.toFixed(0)}`}
          formula={t('recartilhas.loadFormula')}
        />

        <Resultado
          label={t('recartilhas.suggestedPasses')}
          value={`${calc.passes}`}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t('recartilhas.recommendation')}</Text>

        <Text style={styles.txtWhite}>{t('recartilhas.typeLabel')}: {typeName}</Text>
        <Text style={styles.txtWhite}>{t('recartilhas.anglePattern')}: {typeAngle}</Text>
        <Text style={styles.txtWhite}>{t('recartilhas.support')}: {typeSupport}</Text>
        <Text style={styles.txtWhite}>{t('recartilhas.materialTitle')}: {materialName}</Text>
        <Text style={styles.txtMuted}>{t('recartilhas.note')}: {materialNote}</Text>
      </View>

      <View style={styles.card}>
        <View style={localStyles.gcodeHeader}>
          <Text style={styles.cardTitle}>{t('recartilhas.cncControlTitle')}</Text>

          <TouchableOpacity
            style={[
              localStyles.toggleButton,
              gcodeAtivo ? localStyles.toggleOn : localStyles.toggleOff
            ]}
            onPress={() => setGcodeAtivo((valor) => !valor)}
          >
            <Text style={localStyles.toggleText}>
              {gcodeAtivo ? t('recartilhas.gcodeOn') : t('recartilhas.gcodeOff')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={localStyles.optionWrap}>
          {CONTROLES_CNC.map((item) => (
  <TouchableOpacity
    key={item.id}
    style={[
      styles.btnTipo,
      controleCnc === item.id && styles.btnTipoAtivo
    ]}
    onPress={() => setControleCnc(item.id)}
  >
    <Text
      style={[
        styles.btnTipoText,
        controleCnc === item.id && styles.btnTipoTextAtivo
      ]}
    >
      {item.nome}
    </Text>
  </TouchableOpacity>
))}
        </View>

        <View style={[styles.terminal, { marginTop: 10 }]}>
          <Text style={styles.txtGcode}>{montarGcodeSelecionado()}</Text>
        </View>
      </View>

      <View style={localStyles.warn}>
        <Text style={localStyles.warnTitle}>{t('recartilhas.safetyTitle')}</Text>
        <Text style={localStyles.warnText}>{t('recartilhas.safetyText')}</Text>
      </View>
    </CasillasLayout>
  );
}

const localStyles = StyleSheet.create({
  optionWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6
  },

  resultadoBox: {
    backgroundColor: '#060606',
    borderWidth: 1,
    borderColor: '#1A1A1A',
    borderRadius: 6,
    padding: 9,
    marginBottom: 7
  },

  resultadoLabel: {
    color: '#888888',
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 3
  },

  resultadoValue: {
    color: '#00FF7F',
    fontSize: 14,
    fontWeight: '900'
  },

  formula: {
    color: '#888888',
    fontSize: 10,
    marginTop: 3,
    lineHeight: 15
  },

  gcodeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 8
  },

  toggleButton: {
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderWidth: 1
  },

  toggleOn: {
    backgroundColor: '#071007',
    borderColor: '#00FF7F'
  },

  toggleOff: {
    backgroundColor: '#160000',
    borderColor: '#FF4D4D'
  },

  toggleText: {
    color: '#FFD400',
    fontSize: 10,
    fontWeight: '900'
  },

  warn: {
    backgroundColor: '#120F00',
    borderWidth: 1,
    borderColor: '#4D4100',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10
  },

  warnTitle: {
    color: '#FFD400',
    fontSize: 12,
    fontWeight: '900',
    marginBottom: 4
  },

  warnText: {
    color: '#D6C77A',
    fontSize: 11,
    lineHeight: 16
  }
});
