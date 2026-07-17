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
  Alert
} from 'react-native';

import { useLanguage } from '../contexts/LanguageContext';

const C = {
  bg: '#000000',
  card: '#0A0A0A',
  border: '#242424',
  yellow: '#FFD400',
  green: '#00FF7F',
  text: '#D8D8D8',
  muted: '#8C8C8C'
};

const SECTION_SPECS = [
  ['manual.quick1Title', 'manual.section1_1Body'],
  ['manual.quick2Title', 'manual.section2_3Body'],
  ['manual.quick3Title', 'manual.quick3Body'],
  ['manual.quick4Title', 'manual.quick4Body'],
  ['manual.quick5Title', 'manual.quick5Body'],
  ['manual.quick6Title', 'manual.section3_1Body'],
  ['manual.quick7Title', 'manual.section4Body'],
  ['manual.quick8Title', 'manual.section5Body'],
  ['manual.quick9Title', 'manual.section6Body'],
  ['manual.quick10Title', 'manual.section7Body'],
  ['manual.quick11Title', 'manual.section8Body'],
  ['manual.quick12Title', 'manual.section9Body'],
  ['manual.quick13Title', 'manual.section10Body'],
  ['manual.quick14Title', 'manual.section11Body'],
  ['manual.quick15Title', 'manual.section12Body'],
  ['manual.quick16Title', 'manual.section13Body'],
  ['manual.quick17Title', 'manual.section14Body'],
  ['manual.quick18Title', 'manual.section17Body'],
  ['manual.quick19Title', 'manual.section18Body'],
  ['manual.quick20Title', 'manual.section17Body']
];

export default function ManualScreen({ navigation }) {
  const { t } = useLanguage();
  const [modal, setModal] = useState(false);

  const sections = SECTION_SPECS.map(([titleKey, bodyKey]) => ({
    titulo: t(titleKey),
    texto: t(bodyKey)
  }));

  function montarManualCompleto() {
    const linhas = [
      t('manual.manualTextHeader'),
      t('manual.manualTextSubtitle'),
      '',
      t('manual.manualTextIntro'),
      ''
    ];

    sections.forEach((secao) => {
      linhas.push(secao.titulo);
      linhas.push(secao.texto);
      linhas.push('');
    });

    linhas.push(
      t('manual.finalWarning'),
      t('manual.finalWarningText')
    );

    return linhas.join('\n');
  }

  async function compartilhar() {
    try {
      await Share.share({ message: montarManualCompleto() });
    } catch (error) {
      Alert.alert(t('common.error'), t('manual.errorShare'));
    }
  }

  function Card({ titulo, texto }) {
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{titulo}</Text>
        <Text style={styles.text}>{texto}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <View style={styles.header}>
        <Text style={styles.title}>{t('manual.title')}</Text>
        <Text style={styles.sub}>{t('manual.manualTextSubtitle')}</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 115 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.introCard}>
          <Text style={styles.introTitle}>{t('manual.quickGuideTitle')}</Text>
          <Text style={styles.introText}>{t('manual.introText')}</Text>
        </View>

        {sections.map((secao) => (
          <Card
            key={secao.titulo}
            titulo={secao.titulo}
            texto={secao.texto}
          />
        ))}

        <View style={styles.warn}>
          <Text style={styles.warnTitle}>{t('manual.warnTitle')}</Text>
          <Text style={styles.warnText}>{t('manual.warnText')}</Text>
        </View>
      </ScrollView>

      <View style={styles.bottom}>
        <TouchableOpacity
          style={styles.bottomButton}
          onPress={() => navigation.navigate('Dashboard')}
        >
          <Text style={styles.bottomText}>{t('common.home')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomButton}
          onPress={() => setModal(true)}
        >
          <Text style={styles.bottomText}>{t('layout.viewAll')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomButton}
          onPress={compartilhar}
        >
          <Text style={styles.bottomText}>{t('layout.shareBtn')}</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modal} animationType="slide" transparent>
        <View style={styles.modalFundo}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>{t('manual.fullManual')}</Text>

            <ScrollView>
              <Text style={styles.modalText}>{montarManualCompleto()}</Text>
            </ScrollView>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModal(false)}
            >
              <Text style={styles.modalButtonText}>{t('common.close')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg
  },

  header: {
    paddingTop: 48,
    paddingHorizontal: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.border
  },

  title: {
    color: C.yellow,
    fontSize: 21,
    fontWeight: '900',
    textAlign: 'center'
  },

  sub: {
    color: C.muted,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4,
    fontWeight: 'bold'
  },

  content: {
    flex: 1,
    padding: 10
  },

  introCard: {
    backgroundColor: '#071007',
    borderWidth: 1,
    borderColor: '#184A18',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10
  },

  introTitle: {
    color: C.green,
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 6
  },

  introText: {
    color: '#BFECCB',
    fontSize: 12,
    lineHeight: 18
  },

  card: {
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10
  },

  cardTitle: {
    color: C.yellow,
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 7
  },

  text: {
    color: C.text,
    fontSize: 12,
    lineHeight: 18
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
    color: C.yellow,
    fontSize: 13,
    fontWeight: '900',
    marginBottom: 5
  },

  warnText: {
    color: '#D6C77A',
    fontSize: 12,
    lineHeight: 18
  },

  bottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: C.bg,
    borderTopWidth: 1,
    borderTopColor: '#333333',
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 10,
    flexDirection: 'row',
    gap: 6
  },

  bottomButton: {
    flex: 1,
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: 'center'
  },

  bottomText: {
    color: C.yellow,
    fontSize: 11,
    fontWeight: 'bold'
  },

  modalFundo: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.88)',
    justifyContent: 'center',
    padding: 14
  },

  modalBox: {
    maxHeight: '86%',
    backgroundColor: '#080808',
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 10,
    padding: 14
  },

  modalTitle: {
    color: C.yellow,
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 10,
    textAlign: 'center'
  },

  modalText: {
    color: C.text,
    fontSize: 12,
    lineHeight: 18
  },

  modalButton: {
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: C.yellow,
    borderRadius: 7,
    paddingVertical: 10,
    marginTop: 12,
    alignItems: 'center'
  },

  modalButtonText: {
    color: C.yellow,
    fontWeight: '900'
  }
});
