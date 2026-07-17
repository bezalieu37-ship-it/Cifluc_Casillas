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

const ABAS = [
  { id: 'Medidas', labelKey: 'conversoes.tabMeasures' },
  { id: 'Usinagem', labelKey: 'conversoes.tabMachining' },
  { id: 'Roscas', labelKey: 'conversoes.tabThreads' },
  { id: 'Força/Pressão', labelKey: 'conversoes.tabForcePressure' },
  { id: 'Temperatura', labelKey: 'conversoes.tabTemperature' },
  { id: 'Massa/Volume', labelKey: 'conversoes.tabMassVolume' }
];

export default function ConversoesScreen({ navigation }) {
  const { t } = useLanguage();
  const [aba, setAba] = useState('Medidas');
  const activeTabLabel = t(ABAS.find((item) => item.id === aba)?.labelKey || 'conversoes.tabMeasures');

  const [mm, setMm] = useState('25.4');
  const [polegada, setPolegada] = useState('1');

  const [metro, setMetro] = useState('1');
  const [mmMetro, setMmMetro] = useState('1000');

  const [graus, setGraus] = useState('180');
  const [radianos, setRadianos] = useState('3.1416');

  const [diametro, setDiametro] = useState('20');
  const [vc, setVc] = useState('100');
  const [rpm, setRpm] = useState('1592');

  const [fz, setFz] = useState('0.08');
  const [dentes, setDentes] = useState('4');
  const [rpmAvanco, setRpmAvanco] = useState('1000');

  const [tpi, setTpi] = useState('20');
  const [passo, setPasso] = useState('1.27');

  const [kgf, setKgf] = useState('100');
  const [newton, setNewton] = useState('980.665');

  const [bar, setBar] = useState('1');
  const [psi, setPsi] = useState('14.5038');

  const [celsius, setCelsius] = useState('25');
  const [fahrenheit, setFahrenheit] = useState('77');

  const [massa, setMassa] = useState('7.85');
  const [volume, setVolume] = useState('1');
  const [densidade, setDensidade] = useState('7.85');

  function n(valor) {
    return parseFloat(String(valor).replace(',', '.')) || 0;
  }

  function fmt(valor, casas = 4) {
    if (!Number.isFinite(valor)) return '0';
    return Number(valor).toFixed(casas);
  }

  const calc = useMemo(() => {
    const mmVal = n(mm);
    const polVal = n(polegada);

    const metroVal = n(metro);
    const mmMetroVal = n(mmMetro);

    const grausVal = n(graus);
    const radVal = n(radianos);

    const d = n(diametro);
    const vcVal = n(vc);
    const rpmVal = n(rpm);

    const fzVal = n(fz);
    const dentesVal = n(dentes);
    const rpmAvancoVal = n(rpmAvanco);

    const tpiVal = n(tpi);
    const passoVal = n(passo);

    const kgfVal = n(kgf);
    const newtonVal = n(newton);

    const barVal = n(bar);
    const psiVal = n(psi);

    const celsiusVal = n(celsius);
    const fahrenheitVal = n(fahrenheit);

    const massaVal = n(massa);
    const volumeVal = n(volume);
    const densidadeVal = n(densidade);

    const mmParaPolegada = mmVal / 25.4;
    const polegadaParaMm = polVal * 25.4;

    const metroParaMm = metroVal * 1000;
    const mmParaMetro = mmMetroVal / 1000;

    const grausParaRad = grausVal * Math.PI / 180;
    const radParaGraus = radVal * 180 / Math.PI;

    const rpmCalculado = d > 0
      ? (vcVal * 1000) / (Math.PI * d)
      : 0;

    const vcCalculado = d > 0
      ? (Math.PI * d * rpmVal) / 1000
      : 0;

    const avancoMesa = fzVal * dentesVal * rpmAvancoVal;

    const passoPorTpi = tpiVal > 0 ? 25.4 / tpiVal : 0;
    const tpiPorPasso = passoVal > 0 ? 25.4 / passoVal : 0;

    const kgfParaN = kgfVal * 9.80665;
    const nParaKgf = newtonVal / 9.80665;

    const barParaPsi = barVal * 14.5038;
    const psiParaBar = psiVal / 14.5038;

    const cParaF = (celsiusVal * 9 / 5) + 32;
    const fParaC = (fahrenheitVal - 32) * 5 / 9;

    const massaPorVolume = volumeVal * densidadeVal;
    const volumePorMassa = densidadeVal > 0 ? massaVal / densidadeVal : 0;

    return {
      mmParaPolegada,
      polegadaParaMm,
      metroParaMm,
      mmParaMetro,
      grausParaRad,
      radParaGraus,
      rpmCalculado,
      vcCalculado,
      avancoMesa,
      passoPorTpi,
      tpiPorPasso,
      kgfParaN,
      nParaKgf,
      barParaPsi,
      psiParaBar,
      cParaF,
      fParaC,
      massaPorVolume,
      volumePorMassa
    };
  }, [
    mm,
    polegada,
    metro,
    mmMetro,
    graus,
    radianos,
    diametro,
    vc,
    rpm,
    fz,
    dentes,
    rpmAvanco,
    tpi,
    passo,
    kgf,
    newton,
    bar,
    psi,
    celsius,
    fahrenheit,
    massa,
    volume,
    densidade
  ]);

  function montarRelatorio() {
    return [
      t('conversoes.reportTitle'),
      t('conversoes.reportSubtitle'),
      '',
      `${t('conversoes.activeTab')}: ${activeTabLabel}`,
      '',
      t('conversoes.measures'),
      `${t('conversoes.mmInformed')}: ${n(mm).toFixed(4)} mm`,
      `${t('conversoes.mmToInchReport')}: ${fmt(calc.mmParaPolegada, 6)} in`,
      `${t('conversoes.inchInformed')}: ${n(polegada).toFixed(4)} in`,
      `${t('conversoes.inchToMmReport')}: ${fmt(calc.polegadaParaMm, 4)} mm`,
      `${t('conversoes.meterInformed')}: ${n(metro).toFixed(4)} m`,
      `${t('conversoes.meterToMmReport')}: ${fmt(calc.metroParaMm, 4)} mm`,
      `${t('conversoes.mmInformedForMeter')}: ${n(mmMetro).toFixed(4)} mm`,
      `${t('conversoes.mmToMeterReport')}: ${fmt(calc.mmParaMetro, 6)} m`,
      '',
      t('conversoes.angles'),
      `${t('conversoes.degreesInformed')}: ${n(graus).toFixed(4)}°`,
      `${t('conversoes.degreesToRadiansReport')}: ${fmt(calc.grausParaRad, 6)} rad`,
      `${t('conversoes.radiansInformed')}: ${n(radianos).toFixed(6)} rad`,
      `${t('conversoes.radiansToDegreesReport')}: ${fmt(calc.radParaGraus, 4)}°`,
      '',
      t('conversoes.machining'),
      `${t('conversoes.diameterReport')}: ${n(diametro).toFixed(3)} mm`,
      `${t('conversoes.vcReport')}: ${n(vc).toFixed(3)} m/min`,
      `${t('conversoes.rpmCalculatedReport')}: ${calc.rpmCalculado.toFixed(0)} rpm`,
      `${t('conversoes.rpmInformedReport')}: ${n(rpm).toFixed(0)} rpm`,
      `${t('conversoes.vcCalculatedReport')}: ${fmt(calc.vcCalculado, 3)} m/min`,
      `${t('conversoes.fzReport')}: ${n(fz).toFixed(4)} ${t('conversoes.mmPerToothUnit')}`,
      `${t('conversoes.teethReport')}: ${n(dentes).toFixed(0)}`,
      `${t('conversoes.rpmFeedReport')}: ${n(rpmAvanco).toFixed(0)} rpm`,
      `${t('conversoes.tableFeedReport')}: ${fmt(calc.avancoMesa, 3)} mm/min`,
      '',
      t('conversoes.threads'),
      `${t('conversoes.tpiInformedReport')}: ${n(tpi).toFixed(3)}`,
      `${t('conversoes.tpiToPitchReport')}: ${fmt(calc.passoPorTpi, 4)} mm`,
      `${t('conversoes.pitchInformedReport')}: ${n(passo).toFixed(4)} mm`,
      `${t('conversoes.pitchToTpiReport')}: ${fmt(calc.tpiPorPasso, 4)}`,
      '',
      t('conversoes.forcePressure'),
      `${t('conversoes.kgfInformedReport')}: ${n(kgf).toFixed(4)} kgf`,
      `${t('conversoes.kgfToNReport')}: ${fmt(calc.kgfParaN, 4)} N`,
      `${t('conversoes.nInformedReport')}: ${n(newton).toFixed(4)} N`,
      `${t('conversoes.nToKgfReport')}: ${fmt(calc.nParaKgf, 4)} kgf`,
      `${t('conversoes.barInformedReport')}: ${n(bar).toFixed(4)} bar`,
      `${t('conversoes.barToPsiReport')}: ${fmt(calc.barParaPsi, 4)} psi`,
      `${t('conversoes.psiInformedReport')}: ${n(psi).toFixed(4)} psi`,
      `${t('conversoes.psiToBarReport')}: ${fmt(calc.psiParaBar, 4)} bar`,
      '',
      t('conversoes.temperatureReport'),
      `${t('conversoes.celsiusInformedReport')}: ${n(celsius).toFixed(3)} °C`,
      `${t('conversoes.celsiusToFahrenheitReport')}: ${fmt(calc.cParaF, 3)} °F`,
      `${t('conversoes.fahrenheitInformedReport')}: ${n(fahrenheit).toFixed(3)} °F`,
      `${t('conversoes.fahrenheitToCelsiusReport')}: ${fmt(calc.fParaC, 3)} °C`,
      '',
      t('conversoes.massVolumeReport'),
      `${t('conversoes.massReport')}: ${n(massa).toFixed(4)}`,
      `${t('conversoes.volumeReport')}: ${n(volume).toFixed(4)}`,
      `${t('conversoes.densityReport')}: ${n(densidade).toFixed(4)}`,
      `${t('conversoes.volumeDensityMassReport')}: ${fmt(calc.massaPorVolume, 4)}`,
      `${t('conversoes.massDensityVolumeReport')}: ${fmt(calc.volumePorMassa, 4)}`,
      '',
      t('conversoes.disclaimer')
    ].join('\n');
  }

  const terminalText = [
    `${t('conversoes.activeTab')}: ${activeTabLabel}`,
    `${t('conversoes.mmToInchReport')}: ${fmt(calc.mmParaPolegada, 6)} in`,
    `${t('conversoes.inchToMmReport')}: ${fmt(calc.polegadaParaMm, 4)} mm`,
    `${t('conversoes.rpmCalculatedReport')}: ${calc.rpmCalculado.toFixed(0)} rpm`,
    `${t('conversoes.vcCalculatedReport')}: ${fmt(calc.vcCalculado, 3)} m/min`,
    `${t('conversoes.tpiToPitchReport')}: ${fmt(calc.passoPorTpi, 4)} mm`,
    `${t('conversoes.barToPsiReport')}: ${fmt(calc.barParaPsi, 4)} psi`,
    t('conversoes.terminalStatus')
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

  function renderMedidas() {
    return (
      <>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('conversoes.mmInch')}</Text>

          {InputCampo(t('conversoes.valueInMm'), mm, setMm, 'Ex: 25.4')}

          <Resultado
            label={t('conversoes.mmToInch')}
            value={`${fmt(calc.mmParaPolegada, 6)} in`}
            formula={t('conversoes.inchFormula')}
          />

          {InputCampo(t('conversoes.valueInInches'), polegada, setPolegada, 'Ex: 1')}

          <Resultado
            label={t('conversoes.inchToMm')}
            value={`${fmt(calc.polegadaParaMm, 4)} mm`}
            formula={t('conversoes.mmFormula')}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('conversoes.meterMm')}</Text>

          {InputCampo(t('conversoes.valueInMeters'), metro, setMetro, 'Ex: 1')}

          <Resultado
            label={t('conversoes.meterToMm')}
            value={`${fmt(calc.metroParaMm, 4)} mm`}
            formula={t('conversoes.meterFormula')}
          />

          {InputCampo(t('conversoes.valueInMm'), mmMetro, setMmMetro, 'Ex: 1000')}

          <Resultado
            label={t('conversoes.mmToMeter')}
            value={`${fmt(calc.mmParaMetro, 6)} m`}
            formula={t('conversoes.mmMeterFormula')}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('conversoes.degreesRadians')}</Text>

          {InputCampo(t('conversoes.valueInDegrees'), graus, setGraus, 'Ex: 180')}

          <Resultado
            label={t('conversoes.degreesToRadians')}
            value={`${fmt(calc.grausParaRad, 6)} rad`}
            formula={t('conversoes.degreesFormula')}
          />

          {InputCampo(t('conversoes.valueInRadians'), radianos, setRadianos, 'Ex: 3.1416')}

          <Resultado
            label={t('conversoes.radiansToDegrees')}
            value={`${fmt(calc.radParaGraus, 4)}°`}
            formula={t('conversoes.radiansFormula')}
          />
        </View>
      </>
    );
  }

  function renderUsinagem() {
    return (
      <>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('conversoes.rpmCuttingSpeed')}</Text>

          {InputCampo(t('conversoes.toolDiameter'), diametro, setDiametro, 'Ex: 20')}

          {InputCampo(t('conversoes.cuttingSpeedVc'), vc, setVc, 'Ex: 100')}

          <Resultado
            label={t('conversoes.calculatedRpm')}
            value={`${calc.rpmCalculado.toFixed(0)} rpm`}
            formula={t('conversoes.rpmFormula')}
          />

          {InputCampo(t('conversoes.informedRpm'), rpm, setRpm, 'Ex: 1592')}

          <Resultado
            label={t('conversoes.calculatedVc')}
            value={`${fmt(calc.vcCalculado, 3)} m/min`}
            formula={t('conversoes.vcFormula')}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('conversoes.tableFeed')}</Text>

          {InputCampo(t('conversoes.feedPerTooth'), fz, setFz, 'Ex: 0.08')}

          {InputCampo(t('conversoes.numTeeth'), dentes, setDentes, 'Ex: 4')}

          {InputCampo(t('conversoes.feedRpm'), rpmAvanco, setRpmAvanco, 'Ex: 1000')}

          <Resultado
            label={t('conversoes.tableFeed')}
            value={`${fmt(calc.avancoMesa, 3)} mm/min`}
            formula={t('conversoes.feedFormula')}
          />
        </View>
      </>
    );
  }

  function renderRoscas() {
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t('conversoes.tpiPitch')}</Text>

        {InputCampo(t('conversoes.tpiLabel'), tpi, setTpi, 'Ex: 20')}

        <Resultado
          label={t('conversoes.tpiToPitch')}
          value={`${fmt(calc.passoPorTpi, 4)} mm`}
          formula={t('conversoes.pitchFormula')}
        />

        {InputCampo(t('conversoes.pitchMm'), passo, setPasso, 'Ex: 1.27')}

        <Resultado
          label={t('conversoes.pitchToTpi')}
          value={`${fmt(calc.tpiPorPasso, 4)} TPI`}
          formula={t('conversoes.tpiFormula')}
        />
      </View>
    );
  }

  function renderForcaPressao() {
    return (
      <>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('conversoes.force')}</Text>

          {InputCampo(t('conversoes.kgfLabel'), kgf, setKgf, 'Ex: 100')}

          <Resultado
            label={t('conversoes.kgfToN')}
            value={`${fmt(calc.kgfParaN, 4)} N`}
            formula={t('conversoes.kgfFormula')}
          />

          {InputCampo(t('conversoes.newtonLabel'), newton, setNewton, 'Ex: 980.665')}

          <Resultado
            label={t('conversoes.nToKgf')}
            value={`${fmt(calc.nParaKgf, 4)} kgf`}
            formula={t('conversoes.kgfFormula2')}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('conversoes.pressure')}</Text>

          {InputCampo('bar', bar, setBar, 'Ex: 1')}

          <Resultado
            label={t('conversoes.barToPsi')}
            value={`${fmt(calc.barParaPsi, 4)} psi`}
            formula={t('conversoes.barFormula')}
          />

          {InputCampo('psi', psi, setPsi, 'Ex: 14.5038')}

          <Resultado
            label={t('conversoes.psiToBar')}
            value={`${fmt(calc.psiParaBar, 4)} bar`}
            formula={t('conversoes.psiFormula')}
          />
        </View>
      </>
    );
  }

  function renderTemperatura() {
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t('conversoes.temperature')}</Text>

        {InputCampo(t('conversoes.celsiusLabel'), celsius, setCelsius, 'Ex: 25')}

        <Resultado
          label={t('conversoes.celsiusToFahrenheit')}
          value={`${fmt(calc.cParaF, 3)} °F`}
          formula={t('conversoes.celsiusFormula')}
        />

        {InputCampo(t('conversoes.fahrenheitLabel'), fahrenheit, setFahrenheit, 'Ex: 77')}

        <Resultado
          label={t('conversoes.fahrenheitToCelsius')}
          value={`${fmt(calc.fParaC, 3)} °C`}
          formula={t('conversoes.fahrenheitFormula')}
        />
      </View>
    );
  }

  function renderMassaVolume() {
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t('conversoes.massVolumeDensity')}</Text>

        {InputCampo(t('conversoes.massLabel'), massa, setMassa, 'Ex: 7.85')}

        {InputCampo(t('conversoes.volumeLabel'), volume, setVolume, 'Ex: 1')}

        {InputCampo(t('conversoes.densityLabel'), densidade, setDensidade, 'Ex: 7.85')}

        <Resultado
          label={t('conversoes.volumeDensity')}
          value={`${fmt(calc.massaPorVolume, 4)}`}
          formula={t('conversoes.massFormula')}
        />

        <Resultado
          label={t('conversoes.massDensity')}
          value={`${fmt(calc.volumePorMassa, 4)}`}
          formula={t('conversoes.volumeFormula')}
        />
      </View>
    );
  }

  function renderConteudo() {
    if (aba === 'Medidas') return renderMedidas();
    if (aba === 'Usinagem') return renderUsinagem();
    if (aba === 'Roscas') return renderRoscas();
    if (aba === 'Força/Pressão') return renderForcaPressao();
    if (aba === 'Temperatura') return renderTemperatura();
    if (aba === 'Massa/Volume') return renderMassaVolume();

    return renderMedidas();
  }

  return (
    <CasillasLayout
      navigation={navigation}
      activeRoute="Conversoes"
      title={t('conversoes.title')}
      subtitle={t('conversoes.layoutSubtitle')}
      terminalText={terminalText}
      shareText={montarRelatorio()}
    >
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t('conversoes.conversionCategories')}</Text>

        <View style={localStyles.optionWrap}>
          {ABAS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.btnTipo,
                aba === item.id && styles.btnTipoAtivo
              ]}
              onPress={() => setAba(item.id)}
            >
              <Text
                style={[
                  styles.btnTipoText,
                  aba === item.id && styles.btnTipoTextAtivo
                ]}
              >
                {t(item.labelKey)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {renderConteudo()}

      <View style={localStyles.warn}>
        <Text style={localStyles.warnTitle}>{t('conversoes.technicalWarning')}</Text>
        <Text style={localStyles.warnText}>{t('conversoes.warningText')}</Text>
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
