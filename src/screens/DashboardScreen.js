import React from 'react';

import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ImageBackground
} from 'react-native';

import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

export default function DashboardScreen({ navigation }) {
  const { t } = useLanguage();
  const { theme } = useTheme();

  const MODULOS = [
    { titulo: t('modules.roscas.title'), subtitulo: t('modules.roscas.desc'), rota: 'Roscas', icone: '🧵' },
    { titulo: t('modules.engrenagens.title'), subtitulo: t('modules.engrenagens.desc'), rota: 'Engrenagens', icone: '⚙️' },
    { titulo: t('modules.rpmVc.title'), subtitulo: t('modules.rpmVc.desc'), rota: 'RpmVc', icone: '🔩' },
    { titulo: t('modules.cone.title'), subtitulo: t('modules.cone.desc'), rota: 'Cone', icone: '📐' },
    { titulo: t('modules.perfis.title'), subtitulo: t('modules.perfis.desc'), rota: 'Perfis', icone: '🔷' },
    { titulo: t('modules.divisor.title'), subtitulo: t('modules.divisor.desc'), rota: 'Divisor', icone: '🧮' },
    { titulo: t('modules.furacaoPcd.title'), subtitulo: t('modules.furacaoPcd.desc'), rota: 'FuracaoPcd', icone: '🎯' },
    { titulo: t('modules.ajustes.title'), subtitulo: t('modules.ajustes.desc'), rota: 'Ajustes', icone: '📏' },
    { titulo: t('modules.trigonometria.title'), subtitulo: t('modules.trigonometria.desc'), rota: 'Trigonometria', icone: '📐' },
    { titulo: t('modules.conversoes.title'), subtitulo: t('modules.conversoes.desc'), rota: 'Conversoes', icone: '🔁' },
    { titulo: t('modules.materiais.title'), subtitulo: t('modules.materiais.desc'), rota: 'Materiais', icone: '🧱' },
    { titulo: t('modules.recartilhas.title'), subtitulo: t('modules.recartilhas.desc'), rota: 'Recartilhas', icone: '🔧' }
  ];

  const SUPORTE = [
    { titulo: t('modules.config.title'), subtitulo: t('modules.config.desc'), rota: 'Config', icone: '⚙️' },
    { titulo: t('modules.manualMod.title'), subtitulo: t('modules.manualMod.desc'), rota: 'Manual', icone: '📘' },
    { titulo: t('modules.sobre.title'), subtitulo: t('modules.sobre.desc'), rota: 'Sobre', icone: 'ℹ️' }
  ];

  function abrirModulo(rota) {
    navigation.navigate(rota);
  }

  const s = styles(theme);

  return (
    <View style={s.container}>
      <StatusBar barStyle={theme.statusBar} backgroundColor={theme.statusBarBg} />

      <ImageBackground
        source={require('../../assets/dashboard-bg.png')}
        style={s.background}
        resizeMode="cover"
      >
        <View style={s.overlay}>
          <View style={s.header}>
            <Text style={s.logo}>CIFLUC</Text>
            <Text style={s.title}>{t('dashboard.title')}</Text>
            <Text style={s.subtitle}>{t('dashboard.subtitle')}</Text>
          </View>

          <ScrollView style={s.content} contentContainerStyle={{ paddingBottom: 35 }} showsVerticalScrollIndicator={false}>
            <View style={s.statusCard}>
              <Text style={s.statusTitle}>{t('dashboard.statusTitle')}</Text>
              <Text style={s.statusText}>{t('dashboard.statusText')}</Text>
            </View>

            <Text style={s.sectionTitle}>{t('dashboard.sectionModules')}</Text>

            <View style={s.grid}>
              {MODULOS.map((item) => (
                <TouchableOpacity key={item.rota} style={s.card} activeOpacity={0.8} onPress={() => abrirModulo(item.rota)}>
                  <View style={s.cardTop}>
                    <Text style={s.icone}>{item.icone}</Text>
                    <Text style={s.cardTitle}>{item.titulo}</Text>
                  </View>
                  <Text style={s.cardText}>{item.subtitulo}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={s.sectionTitle}>{t('dashboard.sectionSupport')}</Text>

            <View style={s.grid}>
              {SUPORTE.map((item) => (
                <TouchableOpacity key={item.rota} style={s.cardSuporte} activeOpacity={0.8} onPress={() => abrirModulo(item.rota)}>
                  <View style={s.cardTop}>
                    <Text style={s.icone}>{item.icone}</Text>
                    <Text style={s.cardTitle}>{item.titulo}</Text>
                  </View>
                  <Text style={s.cardText}>{item.subtitulo}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={s.footerCard}>
              <Text style={s.footerTitle}>CIFLUC</Text>
              <Text style={s.footerText}>{t('sobre.brandSlogan')}</Text>
            </View>
          </ScrollView>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = (theme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg },
  background: { flex: 1 },
  overlay: { flex: 1, backgroundColor: theme.overlay },
  header: {
    paddingTop: 48, paddingHorizontal: 16, paddingBottom: 14,
    borderBottomWidth: 1, borderBottomColor: theme.border,
    backgroundColor: theme.headerOverlay
  },
  logo: { color: theme.yellow, fontSize: 20, fontWeight: '900', letterSpacing: 4, textAlign: 'center' },
  title: { color: theme.text, fontSize: 24, fontWeight: '900', textAlign: 'center', marginTop: 2 },
  subtitle: { color: theme.muted, fontSize: 11, textAlign: 'center', fontWeight: 'bold', marginTop: 4 },
  content: { flex: 1, padding: 10 },
  statusCard: {
    backgroundColor: theme.name === 'light' ? '#E8F5E9' : '#071007',
    borderWidth: 1,
    borderColor: theme.name === 'light' ? '#A5D6A7' : '#184A18',
    borderRadius: 9, padding: 12, marginBottom: 12
  },
  statusTitle: { color: theme.green, fontSize: 13, fontWeight: '900', marginBottom: 5 },
  statusText: { color: theme.name === 'light' ? '#2E7D32' : '#BFECCB', fontSize: 11, lineHeight: 16 },
  sectionTitle: {
    color: theme.yellow, fontSize: 13, fontWeight: '900', marginBottom: 8,
    marginTop: 4, textTransform: 'uppercase'
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: {
    width: '48.5%', backgroundColor: theme.card, borderWidth: 1,
    borderColor: theme.cardBorder, borderRadius: 8, padding: 10, marginBottom: 10, minHeight: 112
  },
  cardSuporte: {
    width: '48.5%', backgroundColor: theme.card, borderWidth: 1,
    borderColor: theme.yellow, borderRadius: 8, padding: 10, marginBottom: 10, minHeight: 95
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 7 },
  icone: { fontSize: 18, marginRight: 6, width: 22, textAlign: 'center' },
  cardTitle: { flex: 1, color: theme.yellow, fontSize: 11, fontWeight: '900', lineHeight: 15 },
  cardText: { color: theme.textSecondary, fontSize: 10.5, lineHeight: 15 },
  footerCard: {
    backgroundColor: theme.name === 'light' ? '#FFF8E1' : '#090700',
    borderWidth: 1, borderColor: theme.yellow, borderRadius: 8,
    padding: 12, marginTop: 4, marginBottom: 12, alignItems: 'center'
  },
  footerTitle: { color: theme.yellow, fontSize: 16, fontWeight: '900', letterSpacing: 3 },
  footerText: { color: theme.name === 'light' ? '#8D6E00' : '#D6C77A', fontSize: 10.5, textAlign: 'center', marginTop: 5 }
});
