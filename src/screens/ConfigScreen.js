import React, { useState, useEffect, useCallback } from 'react';

import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
  Share,
  Modal,
  ActivityIndicator,
  Switch
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  listarHistorico,
  limparHistorico,
  exportarHistoricoTexto
} from '../services/historicoService';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { LANGUAGES } from '../i18n';

const STORAGE_CONFIG_KEY = '@CIFLUC_CASILLAS_CONFIG';

const DEFAULT_CONFIG = {
  controladorPadrao: 'FANUC',
  casasDecimais: 3,
  notificacoes: true,
  somenteMM: true
};

const CONTROLADORES = ['FANUC', 'SIEMENS', 'MITSUBISHI', 'HAAS', 'MACH3'];

const THEMES = [
  { key: 'dark', icon: '🌙' },
  { key: 'light', icon: '☀️' },
  { key: 'system', icon: '📱' }
];

export default function ConfigScreen({ navigation }) {
  const { t, langCode, changeLanguage } = useLanguage();
  const { theme, mode, changeTheme } = useTheme();
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [qtdeHistorico, setQtdeHistorico] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [modalHistorico, setModalHistorico] = useState(false);
  const [modalExportar, setModalExportar] = useState(false);
  const [modalControle, setModalControle] = useState(false);
  const [textoExportar, setTextoExportar] = useState('');

  const carregarDados = useCallback(async () => {
    try {
      const [configSalva, historico] = await Promise.all([
        AsyncStorage.getItem(STORAGE_CONFIG_KEY),
        listarHistorico()
      ]);

      if (configSalva) {
        setConfig({ ...DEFAULT_CONFIG, ...JSON.parse(configSalva) });
      }

      setQtdeHistorico(historico.length);
    } catch (error) {
      console.log('Erro ao carregar dados:', error);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  async function salvarConfig(novaConfig) {
    try {
      setConfig(novaConfig);
      await AsyncStorage.setItem(STORAGE_CONFIG_KEY, JSON.stringify(novaConfig));
    } catch (error) {
      Alert.alert(t('common.error'), t('config.errorSave'));
    }
  }

  function alterarControlador() {
    setModalControle(true);
  }

  async function selecionarControlador(ctrl) {
    setModalControle(false);
    await salvarConfig({ ...config, controladorPadrao: ctrl });
  }

  function alterarCasasDecimais() {
    Alert.alert(
      t('config.precisionTitle').replace('🔢 ', ''),
      t('config.precisionAlert'),
      [
        { text: t('config.precision2'), onPress: () => salvarConfig({ ...config, casasDecimais: 2 }) },
        { text: t('config.precision3'), onPress: () => salvarConfig({ ...config, casasDecimais: 3 }) },
        { text: t('config.precision4'), onPress: () => salvarConfig({ ...config, casasDecimais: 4 }) },
        { text: t('common.cancel'), style: 'cancel' }
      ]
    );
  }

  function toggleNotificacoes() {
    salvarConfig({ ...config, notificacoes: !config.notificacoes });
  }

  function toggleSomenteMM() {
    salvarConfig({ ...config, somenteMM: !config.somenteMM });
  }

  async function verHistorico() {
    try {
      const lista = await listarHistorico();
      setQtdeHistorico(lista.length);
      setModalHistorico(true);
    } catch (error) {
      Alert.alert(t('common.error'), t('config.errorLoadHistory'));
    }
  }

  async function confirmarLimparHistorico() {
    Alert.alert(
      t('config.historyClearTitle'),
      t('config.historyClearConfirm', { count: qtdeHistorico }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('config.historyClearAll'),
          style: 'destructive',
          onPress: async () => {
            await limparHistorico();
            setQtdeHistorico(0);
            setModalHistorico(false);
            Alert.alert(t('common.success'), t('config.historyCleared'));
          }
        }
      ]
    );
  }

  async function exportarHistorico() {
    try {
      const texto = await exportarHistoricoTexto();
      setTextoExportar(texto);
      setModalExportar(true);
    } catch (error) {
      Alert.alert(t('common.error'), t('config.errorExportHistory'));
    }
  }

  async function compartilharExportacao() {
    try {
      await Share.share({ message: textoExportar });
    } catch (error) {
      Alert.alert(t('common.error'), t('config.errorShare'));
    }
  }

  async function exportarConfiguracoes() {
    try {
      const dados = {
        historico: await listarHistorico(),
        configuracoes: config,
        data: new Date().toLocaleDateString(langCode),
        hora: new Date().toLocaleTimeString(langCode)
      };

      const texto =
        'CIFLUC GEMINI CASILLAS\n' +
        `${t('config.fullExportTitle')}\n\n` +
        `${t('config.date')}: ${dados.data} ${dados.hora}\n\n` +
        `${t('config.settingsReport')}:\n` +
        JSON.stringify(dados.configuracoes, null, 2) +
        `\n\n${t('config.historyReport')} (${dados.historico.length} ${t('config.records')}):\n` +
        dados.historico.map((item, i) =>
          `#${i + 1} [${item.data}] ${item.modulo} - ${item.titulo}`
        ).join('\n');

      await Share.share({ message: texto });
    } catch (error) {
      Alert.alert(t('common.error'), t('config.errorExport'));
    }
  }

  function resetarConfiguracoes() {
    Alert.alert(
      t('config.restoreTitleAlert'),
      t('config.restoreConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('config.restoreReset'),
          style: 'destructive',
          onPress: () => {
            salvarConfig(DEFAULT_CONFIG);
            Alert.alert(t('common.success'), t('config.restoreDone'));
          }
        }
      ]
    );
  }

  const s = styles(theme);

  function Card({ titulo, children }) {
    return (
      <View style={s.card}>
        <Text style={s.cardTitle}>{titulo}</Text>
        {children}
      </View>
    );
  }

  function LinhaConfig({ label, value, onPress }) {
    return (
      <TouchableOpacity style={s.linhaConfig} onPress={onPress} activeOpacity={0.6}>
        <Text style={s.configLabel}>{label}</Text>
        <View style={s.configRight}>
          <Text style={s.configValue}>{value}</Text>
          <Text style={s.configArrow}>›</Text>
        </View>
      </TouchableOpacity>
    );
  }

  if (carregando) {
    return (
      <View style={[s.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <StatusBar barStyle={theme.statusBar} backgroundColor={theme.statusBarBg} />
        <ActivityIndicator size="large" color={theme.yellow} />
        <Text style={[s.configValue, { marginTop: 12 }]}>{t('common.loading')}</Text>
      </View>
    );
  }

  const themeLabel = { dark: t('config.themeDark'), light: t('config.themeLight'), system: t('config.themeSystem') };
  const langLabel = LANGUAGES.find((l) => l.code === langCode);

  return (
    <View style={s.container}>
      <StatusBar barStyle={theme.statusBar} backgroundColor={theme.statusBarBg} />

      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <Text style={s.backBtnText}>{t('common.back')}</Text>
        </TouchableOpacity>
        <Text style={s.title}>{t('config.title')}</Text>
        <Text style={s.sub}>{t('config.subtitle')}</Text>
      </View>

      <ScrollView style={s.content} contentContainerStyle={{ paddingBottom: 115 }} showsVerticalScrollIndicator={false}>

        <Card titulo={t('config.langTitle')}>
          <Text style={s.descCard}>{t('config.langDesc')}</Text>
          <View style={s.optionGrid}>
            {LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[s.optionBtn, langCode === lang.code && s.optionBtnActive]}
                onPress={() => changeLanguage(lang.code)}
              >
                <Text style={s.optionFlag}>{lang.flag}</Text>
                <Text style={[s.optionLabel, langCode === lang.code && s.optionLabelActive]}>
                  {lang.label}
                </Text>
                {langCode === lang.code && <Text style={s.checkmark}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <Card titulo={t('config.themeTitle')}>
          <Text style={s.descCard}>{t('config.themeDesc')}</Text>
          <View style={s.optionGrid}>
            {THEMES.map((th) => (
              <TouchableOpacity
                key={th.key}
                style={[s.optionBtn, mode === th.key && s.optionBtnActive]}
                onPress={() => changeTheme(th.key)}
              >
                <Text style={s.optionFlag}>{th.icon}</Text>
                <Text style={[s.optionLabel, mode === th.key && s.optionLabelActive]}>
                  {themeLabel[th.key]}
                </Text>
                {mode === th.key && <Text style={s.checkmark}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <Card titulo={t('config.cncTitle')}>
          <Text style={s.descCard}>{t('config.cncDesc')}</Text>
          <TouchableOpacity style={s.selectBtn} onPress={alterarControlador}>
            <Text style={s.selectBtnText}>{config.controladorPadrao}</Text>
            <Text style={s.configArrow}>{t('common.settings')} ›</Text>
          </TouchableOpacity>
        </Card>

        <Card titulo={t('config.precisionTitle')}>
          <Text style={s.descCard}>{t('config.precisionDesc')}</Text>
          <TouchableOpacity style={s.selectBtn} onPress={alterarCasasDecimais}>
            <Text style={s.selectBtnText}>{config.casasDecimais} casas</Text>
            <Text style={s.configArrow}>{t('common.settings')} ›</Text>
          </TouchableOpacity>
        </Card>

        <Card titulo={t('config.preferencesTitle')}>
          <View style={s.switchRow}>
            <View style={s.switchInfo}>
              <Text style={s.switchLabel}>{t('config.notifications')}</Text>
              <Text style={s.switchDesc}>{t('config.notificationsDesc')}</Text>
            </View>
            <Switch
              value={config.notificacoes}
              onValueChange={toggleNotificacoes}
              trackColor={{ false: theme.switchTrack, true: theme.switchTrackActive }}
              thumbColor={config.notificacoes ? theme.yellow : theme.mutedLight}
            />
          </View>

          <View style={s.switchRow}>
            <View style={s.switchInfo}>
              <Text style={s.switchLabel}>{t('config.unitMm')}</Text>
              <Text style={s.switchDesc}>{t('config.unitMmDesc')}</Text>
            </View>
            <Switch
              value={config.somenteMM}
              onValueChange={toggleSomenteMM}
              trackColor={{ false: theme.switchTrack, true: theme.switchTrackActive }}
              thumbColor={config.somenteMM ? theme.yellow : theme.mutedLight}
            />
          </View>
        </Card>

        <Card titulo={t('config.historyTitle')}>
          <Text style={s.descCard}>
            {qtdeHistorico > 0
              ? t('config.historySaved', { count: qtdeHistorico })
              : t('config.historyEmpty')}
          </Text>
          <View style={s.btnRow}>
            <TouchableOpacity style={s.btnAcao} onPress={verHistorico}>
              <Text style={s.btnAcaoText}>{t('config.historyView')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.btnAcao, s.btnAcaoRed]} onPress={confirmarLimparHistorico} disabled={qtdeHistorico === 0}>
              <Text style={[s.btnAcaoText, { color: theme.red }]}>{t('config.historyClear')}</Text>
            </TouchableOpacity>
          </View>
        </Card>

        <Card titulo={t('config.backupTitle')}>
          <Text style={s.descCard}>{t('config.backupDesc')}</Text>
          <View style={s.btnRow}>
            <TouchableOpacity style={s.btnAcao} onPress={exportarHistorico}>
              <Text style={s.btnAcaoText}>{t('config.backupHistory')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.btnAcao} onPress={exportarConfiguracoes}>
              <Text style={s.btnAcaoText}>{t('config.backupAll')}</Text>
            </TouchableOpacity>
          </View>
        </Card>

        <Card titulo={t('config.restoreTitle')}>
          <Text style={s.descCard}>{t('config.restoreDesc')}</Text>
          <TouchableOpacity style={[s.btnAcao, s.btnAcaoRed]} onPress={resetarConfiguracoes}>
            <Text style={[s.btnAcaoText, { color: theme.red }]}>{t('config.restoreBtn')}</Text>
          </TouchableOpacity>
        </Card>

        <Card titulo={t('config.aboutTitle')}>
          <LinhaConfig label={t('common.version')} value="Matrix 1.0" onPress={() => navigation.navigate('Sobre')} />
          <LinhaConfig label={t('common.manual')} value={t('common.guideComplete')} onPress={() => navigation.navigate('Manual')} />
        </Card>

      </ScrollView>

      <View style={s.bottom}>
        <TouchableOpacity style={s.bottomButton} onPress={() => navigation.navigate('Dashboard')}>
          <Text style={s.bottomText}>{t('common.home')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.bottomButton} onPress={() => navigation.navigate('Sobre')}>
          <Text style={s.bottomText}>{t('common.about')}</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalHistorico} animationType="slide" transparent>
        <View style={s.modalFundo}>
          <View style={s.modalBox}>
            <TouchableOpacity style={s.backBtn} onPress={() => setModalHistorico(false)}>
              <Text style={s.backBtnText}>{t('common.back')}</Text>
            </TouchableOpacity>
            <Text style={s.modalTitle}>{t('config.historyTitleModal')}</Text>
            <HistoricoContent aoLimpar={() => { setQtdeHistorico(0); setModalHistorico(false); }} theme={theme} t={t} />
            <TouchableOpacity style={[s.btnAcao, { marginTop: 12 }]} onPress={() => setModalHistorico(false)}>
              <Text style={s.btnAcaoText}>{t('common.close')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={modalExportar} animationType="slide" transparent>
        <View style={s.modalFundo}>
          <View style={s.modalBox}>
            <Text style={s.modalTitle}>{t('config.backupExportTitle')}</Text>
            <ScrollView style={s.modalScroll}>
              <Text style={s.modalText}>{textoExportar}</Text>
            </ScrollView>
            <View style={s.btnRow}>
              <TouchableOpacity style={s.btnAcao} onPress={compartilharExportacao}>
                <Text style={s.btnAcaoText}>{t('config.backupExportShare')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.btnAcao, { backgroundColor: theme.inputBg }]} onPress={() => setModalExportar(false)}>
                <Text style={s.btnAcaoText}>{t('common.close')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={modalControle} animationType="slide" transparent>
        <View style={s.modalFundo}>
          <View style={s.modalBox}>
            <Text style={s.modalTitle}>{t('config.cncSelect')}</Text>
            <Text style={[s.descCard, { marginBottom: 12 }]}>{t('config.cncSelectDesc')}</Text>
            {CONTROLADORES.map((ctrl) => (
              <TouchableOpacity
                key={ctrl}
                style={[s.selectBtn, config.controladorPadrao === ctrl && { borderColor: theme.yellow, borderWidth: 2 }]}
                onPress={() => selecionarControlador(ctrl)}
              >
                <Text style={[s.selectBtnText, config.controladorPadrao === ctrl && { color: theme.yellow }]}>{ctrl}</Text>
                {config.controladorPadrao === ctrl && <Text style={s.checkmark}>✓</Text>}
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={[s.btnAcao, { marginTop: 12, backgroundColor: theme.inputBg }]} onPress={() => setModalControle(false)}>
              <Text style={s.btnAcaoText}>{t('common.cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}

function HistoricoContent({ aoLimpar, theme, t }) {
  const [lista, setLista] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    listarHistorico().then((dados) => {
      setLista(dados);
      setCarregando(false);
    });
  }, []);

  const s = styles(theme);

  if (carregando) {
    return <ActivityIndicator size="small" color={theme.yellow} style={{ marginVertical: 20 }} />;
  }

  if (lista.length === 0) {
    return (
      <Text style={[s.descCard, { textAlign: 'center', marginVertical: 20 }]}>
        {t('common.noData')}
      </Text>
    );
  }

  return (
    <ScrollView style={s.historicoScroll}>
      {lista.map((item, index) => (
        <View key={item.id || index} style={s.historicoItem}>
          <View style={s.historicoHeader}>
            <Text style={s.historicoModulo}>{item.modulo}</Text>
            <Text style={s.historicoData}>{item.data}</Text>
          </View>
          <Text style={s.historicoTitulo}>{item.titulo}</Text>
          {item.resumo ? (
            <Text style={s.historicoResumo} numberOfLines={2}>{item.resumo}</Text>
          ) : null}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = (theme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg },
  header: { paddingTop: 48, paddingHorizontal: 14, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: theme.border },
  backBtn: { alignSelf: 'flex-start', paddingVertical: 4, paddingHorizontal: 8, marginBottom: 4 },
  backBtnText: { color: theme.yellow, fontSize: 12, fontWeight: 'bold' },
  title: { color: theme.yellow, fontSize: 21, fontWeight: '900', textAlign: 'center' },
  sub: { color: theme.muted, fontSize: 11, textAlign: 'center', marginTop: 4, fontWeight: 'bold' },
  content: { flex: 1, padding: 10 },
  card: { backgroundColor: theme.card, borderWidth: 1, borderColor: theme.cardBorder, borderRadius: 8, padding: 12, marginBottom: 10 },
  cardTitle: { color: theme.yellow, fontSize: 14, fontWeight: '900', marginBottom: 8 },
  descCard: { color: theme.muted, fontSize: 11, lineHeight: 16, marginBottom: 10 },
  optionGrid: { gap: 6 },
  optionBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.inputBg, borderWidth: 1, borderColor: theme.inputBorder, borderRadius: 6, paddingVertical: 10, paddingHorizontal: 12, gap: 10 },
  optionBtnActive: { borderColor: theme.yellow, borderWidth: 2 },
  optionFlag: { fontSize: 20 },
  optionLabel: { flex: 1, color: theme.textSecondary, fontSize: 13, fontWeight: 'bold' },
  optionLabelActive: { color: theme.yellow },
  selectBtn: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: theme.inputBg, borderWidth: 1, borderColor: theme.inputBorder, borderRadius: 6, paddingVertical: 10, paddingHorizontal: 12 },
  selectBtnText: { color: theme.textSecondary, fontSize: 13, fontWeight: 'bold' },
  configArrow: { color: theme.muted, fontSize: 14, fontWeight: 'bold' },
  checkmark: { color: theme.yellow, fontSize: 16, fontWeight: '900' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: theme.divider },
  switchInfo: { flex: 1, marginRight: 12 },
  switchLabel: { color: theme.textSecondary, fontSize: 12, fontWeight: 'bold' },
  switchDesc: { color: theme.muted, fontSize: 10, marginTop: 2 },
  btnRow: { flexDirection: 'row', gap: 8 },
  btnAcao: { flex: 1, backgroundColor: theme.inputBg, borderWidth: 1, borderColor: theme.inputBorder, borderRadius: 6, paddingVertical: 10, alignItems: 'center' },
  btnAcaoRed: { borderColor: theme.btnDangerBorder },
  btnAcaoText: { color: theme.yellow, fontSize: 11, fontWeight: 'bold' },
  linhaConfig: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: theme.divider },
  configLabel: { color: theme.textSecondary, fontSize: 12, fontWeight: 'bold' },
  configRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  configValue: { color: theme.muted, fontSize: 12 },
  bottom: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: theme.bottomBarBg, borderTopWidth: 1, borderTopColor: theme.borderLight, paddingHorizontal: 8, paddingTop: 8, paddingBottom: 10, flexDirection: 'row', gap: 6 },
  bottomButton: { flex: 1, backgroundColor: theme.inputBg, borderWidth: 1, borderColor: theme.inputBorder, borderRadius: 6, paddingVertical: 10, alignItems: 'center' },
  bottomText: { color: theme.yellow, fontSize: 11, fontWeight: 'bold' },
  modalFundo: { flex: 1, backgroundColor: theme.modalBg, justifyContent: 'center', padding: 14 },
  modalBox: { maxHeight: '86%', backgroundColor: theme.modalContent, borderWidth: 1, borderColor: theme.cardBorder, borderRadius: 10, padding: 14 },
  modalTitle: { color: theme.yellow, fontSize: 16, fontWeight: '900', marginBottom: 10, textAlign: 'center' },
  modalScroll: { maxHeight: 350, backgroundColor: theme.terminalBg, borderWidth: 1, borderColor: theme.terminalBorder, borderRadius: 6, padding: 10 },
  modalText: { color: theme.textSecondary, fontSize: 11, lineHeight: 16, fontFamily: 'monospace' },
  historicoScroll: { maxHeight: 320 },
  historicoItem: { backgroundColor: theme.inputBg, borderWidth: 1, borderColor: theme.inputBorder, borderRadius: 6, padding: 10, marginBottom: 8 },
  historicoHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  historicoModulo: { color: theme.yellow, fontSize: 11, fontWeight: 'bold' },
  historicoData: { color: theme.muted, fontSize: 10 },
  historicoTitulo: { color: theme.textSecondary, fontSize: 12, fontWeight: 'bold' },
  historicoResumo: { color: theme.muted, fontSize: 10, marginTop: 4, lineHeight: 14 }
});
