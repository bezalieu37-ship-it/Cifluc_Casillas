import React, { useState } from 'react';

import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Modal,
  Share,
  Alert,
  Linking
} from 'react-native';

import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

export default function SobreScreen({ navigation }) {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [modal, setModal] = useState(false);
  const moduleKeys = [
    'moduleThreads', 'moduleGears', 'moduleRpm', 'moduleCones',
    'moduleProfiles', 'moduleDivider', 'moduleDrilling', 'moduleFits',
    'moduleTrig', 'moduleConversions', 'moduleMaterials', 'moduleKnurling'
  ];

  function montarTexto() {
    return [
      t('sobre.reportTitle'),
      'CiFluc Gemini Casillas • Matrix 1.0',
      '',
      t('sobre.identity'),
      `${t('sobre.name')}: CiFluc Gemini Casillas`,
      `${t('sobre.visualVersion')}: Matrix 1.0`,
      `${t('sobre.platform')}: Android`,
      `${t('sobre.package')}: com.cifluc.casillas`,
      '',
      t('sobre.meaningTitle'),
      `C = ${t('sobre.creation')}`,
      `I = ${t('sobre.intelligence')}`,
      `F = ${t('sobre.future')}`,
      `L = ${t('sobre.legacy')}`,
      `U = ${t('sobre.universal')}`,
      `C = ${t('sobre.construction')}`,
      '',
      t('sobre.purposeReport'),
      t('sobre.purposeText'),
      '',
      t('sobre.modulesReport'),
      ...moduleKeys.map((key, index) => `${index + 1}. ${t(`sobre.${key}`)}`),
      '',
      t('sobre.technicalWarningReport'),
      t('sobre.technicalWarningText'),
      '',
      t('sobre.privacyReport'),
      t('sobre.privacyText'),
      '',
      t('sobre.responsibilityReport'),
      t('sobre.responsibilityText'),
      '',
      t('sobre.rightsReport'),
      t('sobre.rightsText')
    ].join('\n');
  }

  async function compartilhar() {
    try {
      await Share.share({ message: montarTexto() });
    } catch (error) {
      Alert.alert(t('common.error'), t('sobre.shareError'));
    }
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

  function Linha({ label, value }) {
    return (
      <View style={s.linha}>
        <Text style={s.label}>{label}</Text>
        <Text style={s.text}>{value}</Text>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <StatusBar barStyle={theme.statusBar} backgroundColor={theme.statusBarBg} />

      <View style={s.header}>
        <Text style={s.title}>{t('sobre.title')}</Text>
        <Text style={s.sub}>{t('sobre.subtitle')}</Text>
      </View>

      <ScrollView style={s.content} contentContainerStyle={{ paddingBottom: 115 }} showsVerticalScrollIndicator={false}>
        <View style={s.brandCard}>
          <Text style={s.brand}>CIFLUC</Text>
          <Text style={s.brandSub}>Gemini Casillas</Text>
          <Text style={s.brandText}>{t('sobre.brandSlogan')}</Text>
        </View>

        <Card titulo={t('sobre.appIdentity')}>
          <Linha label={t('sobre.name')} value="CiFluc Gemini Casillas" />
          <Linha label={t('common.version')} value="Matrix 1.0" />
          <Linha label={t('sobre.platform')} value="Android" />
          <Linha label={t('sobre.package')} value="com.cifluc.casillas" />
          <Linha label={t('sobre.category')} value={t('sobre.categoryValue')} />
        </Card>

        <Card titulo={t('sobre.purpose')}>
          <Text style={s.paragraph}>{t('sobre.purposeText')}</Text>
        </Card>

        <Card titulo={t('sobre.modules')}>
          {moduleKeys.map((key, index) => (
            <Text key={key} style={s.topic}>{index + 1}. {t(`sobre.${key}`)}</Text>
          ))}
        </Card>

        <Card titulo={t('sobre.technicalWarning')}>
          <Text style={s.warning}>{t('sobre.technicalWarningText')}</Text>
        </Card>

        <Card titulo={t('sobre.privacy')}>
          <Text style={s.paragraph}>{t('sobre.privacyText')}</Text>
          <TouchableOpacity
            onPress={() => Linking.openURL('https://bezalieu37-ship-it.github.io/Cifluc_Casillas/')}
            style={{ marginTop: 8 }}
          >
            <Text style={{ color: theme.yellow, fontSize: 12, fontWeight: 'bold', textDecorationLine: 'underline' }}>
              {t('sobre.privacyLink')}
            </Text>
          </TouchableOpacity>
        </Card>

        <Card titulo={t('sobre.responsibility')}>
          <Text style={s.paragraph}>{t('sobre.responsibilityText')}</Text>
        </Card>

        <Card titulo={t('sobre.rights')}>
          <Text style={s.paragraph}>{t('sobre.rightsText')}</Text>
        </Card>
      </ScrollView>

      <View style={s.bottom}>
        <TouchableOpacity style={s.bottomButton} onPress={() => navigation.navigate('Dashboard')}>
          <Text style={s.bottomText}>{t('common.home')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.bottomButton} onPress={() => setModal(true)}>
          <Text style={s.bottomText}>{t('layout.viewAll')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.bottomButton} onPress={compartilhar}>
          <Text style={s.bottomText}>{t('layout.shareBtn')}</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modal} animationType="slide" transparent>
        <View style={s.modalFundo}>
          <View style={s.modalBox}>
            <Text style={s.modalTitle}>{t('sobre.title')}</Text>
            <ScrollView>
              <Text style={s.modalText}>{montarTexto()}</Text>
            </ScrollView>
            <TouchableOpacity style={s.modalButton} onPress={() => setModal(false)}>
              <Text style={s.modalButtonText}>{t('common.close')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = (theme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg },
  header: { paddingTop: 48, paddingHorizontal: 14, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: theme.border },
  title: { color: theme.yellow, fontSize: 21, fontWeight: '900', textAlign: 'center' },
  sub: { color: theme.muted, fontSize: 11, textAlign: 'center', marginTop: 4, fontWeight: 'bold' },
  content: { flex: 1, padding: 10 },
  brandCard: {
    backgroundColor: theme.name === 'light' ? '#FFF8E1' : '#090700',
    borderWidth: 1, borderColor: theme.yellow, borderRadius: 10, padding: 16, marginBottom: 10, alignItems: 'center'
  },
  brand: { color: theme.yellow, fontSize: 28, fontWeight: '900', letterSpacing: 4 },
  brandSub: { color: theme.text, fontSize: 15, fontWeight: '900', marginTop: 3 },
  brandText: { color: theme.name === 'light' ? '#8D6E00' : '#D6C77A', fontSize: 11, textAlign: 'center', marginTop: 8, lineHeight: 16 },
  card: { backgroundColor: theme.card, borderWidth: 1, borderColor: theme.cardBorder, borderRadius: 8, padding: 12, marginBottom: 10 },
  cardTitle: { color: theme.yellow, fontSize: 14, fontWeight: '900', marginBottom: 10 },
  linha: { borderBottomWidth: 1, borderBottomColor: theme.divider, paddingBottom: 7, marginBottom: 7 },
  label: { color: theme.muted, fontSize: 10, fontWeight: 'bold', marginBottom: 2 },
  text: { color: theme.textSecondary, fontSize: 12, lineHeight: 17 },
  paragraph: { color: theme.textSecondary, fontSize: 12, lineHeight: 18 },
  topic: { color: theme.textSecondary, fontSize: 12, lineHeight: 20 },
  warning: { color: theme.name === 'light' ? '#8D6E00' : '#D6C77A', fontSize: 12, lineHeight: 18 },
  bottom: {
    position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: theme.bottomBarBg,
    borderTopWidth: 1, borderTopColor: theme.borderLight, paddingHorizontal: 8, paddingTop: 8, paddingBottom: 10, flexDirection: 'row', gap: 6
  },
  bottomButton: { flex: 1, backgroundColor: theme.inputBg, borderWidth: 1, borderColor: theme.inputBorder, borderRadius: 6, paddingVertical: 10, alignItems: 'center' },
  bottomText: { color: theme.yellow, fontSize: 11, fontWeight: 'bold' },
  modalFundo: { flex: 1, backgroundColor: theme.modalBg, justifyContent: 'center', padding: 14 },
  modalBox: { maxHeight: '86%', backgroundColor: theme.modalContent, borderWidth: 1, borderColor: theme.cardBorder, borderRadius: 10, padding: 14 },
  modalTitle: { color: theme.yellow, fontSize: 16, fontWeight: '900', marginBottom: 10, textAlign: 'center' },
  modalText: { color: theme.textSecondary, fontSize: 12, lineHeight: 18 },
  modalButton: { backgroundColor: theme.inputBg, borderWidth: 1, borderColor: theme.yellow, borderRadius: 7, paddingVertical: 10, marginTop: 12, alignItems: 'center' },
  modalButtonText: { color: theme.yellow, fontWeight: '900' }
});
