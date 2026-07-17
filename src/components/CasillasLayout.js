import React, { useState, useEffect, useRef } from 'react';

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  Share,
  Modal,
  Image
} from 'react-native';

import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { salvarHistorico } from '../services/historicoService';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

const ABAS = [
  { labelKey: 'modules.roscas.title', rota: 'Roscas' },
  { labelKey: 'modules.engrenagens.title', rota: 'Engrenagens' },
  { labelKey: 'modules.rpmVc.title', rota: 'RpmVc' },
  { labelKey: 'modules.cone.title', rota: 'Cone' },
  { labelKey: 'modules.perfis.title', rota: 'Perfis' },
  { labelKey: 'modules.divisor.title', rota: 'Divisor' },
  { labelKey: 'modules.furacaoPcd.title', rota: 'FuracaoPcd' },
  { labelKey: 'modules.ajustes.title', rota: 'Ajustes' },
  { labelKey: 'modules.trigonometria.title', rota: 'Trigonometria' },
  { labelKey: 'modules.conversoes.title', rota: 'Conversoes' },
  { labelKey: 'modules.materiais.title', rota: 'Materiais' },
  { labelKey: 'modules.recartilhas.title', rota: 'Recartilhas' }
];

const PALAVRAS_DESTAQUE = [
  'Resultado',
  'RESULTADO',
  'Diâmetro',
  'DiE',
  'DiF',
  'Dp',
  'Passo',
  'Ângulo',
  'Relação',
  'RPM',
  'Folga',
  'Interferência',
  'Tolerância',
  'G-Code',
  'Verificação',
  'Inspeção',
  'Centro',
  'Módulo',
  'Avanço',
  'Status',
  'Result', 'Diameter', 'Pitch', 'Angle', 'Ratio', 'Clearance', 'Interference',
  'Tolerance', 'Verification', 'Inspection', 'Center', 'Module', 'Feed',
  'Resultado', 'Diámetro', 'Paso', 'Ángulo', 'Relación', 'Holgura',
  'Tolerancia', 'Verificación', 'Inspección', 'Centro', 'Módulo', 'Avance',
  'Résultat', 'Diamètre', 'Pas', 'Angle', 'Rapport', 'Jeu', 'Serrage',
  'Tolérance', 'Vérification', 'Inspection', 'Centre', 'Module', 'Avance'
];

export default function CasillasLayout({
  navigation,
  activeRoute,
  title,
  subtitle,
  children,
  terminalText,
  shareText
}) {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [modalVisivel, setModalVisivel] = useState(false);
  const terminalAnterior = useRef('');

  useEffect(() => {
    if (terminalText && terminalText !== terminalAnterior.current && terminalText !== t('layout.terminalReady')) {
      terminalAnterior.current = terminalText;
      salvarHistorico({
        modulo: title || t('layout.fallbackModule'),
        titulo: t('layout.calculationIn', { module: title || t('layout.fallbackModule') }),
        resumo: (shareText || '').substring(0, 200),
        dados: [],
        terminal: terminalText,
        relatorio: shareText || ''
      }).catch(() => {});
    }
  }, [terminalText, title, shareText, t]);

  function montarRelatorioTexto() {
    const conteudoPrincipal = shareText || '';
    const conteudoTerminal = terminalText || '';

    return (
      `CIFLUC GEMINI CASILLAS\n` +
      `${t('layout.edition')}\n\n` +
      `${t('layout.module')}: ${title}\n` +
      `========================================\n\n` +
      `${conteudoPrincipal}\n\n` +
      `${t('layout.execution')}\n` +
      `----------------------------------------\n` +
      `${conteudoTerminal}\n\n` +
      `========================================\n` +
      t('layout.generatedReport')
    );
  }

  function montarHTMLPDF() {
  const texto = montarRelatorioTexto();

  const logoUri = Image.resolveAssetSource(
  require('../../assets/icon.png')
).uri;

  const linhas = texto
    .split('\n')
    .filter((linha) => linha.trim() !== '')
    .map((linha) => {
      const destaque = PALAVRAS_DESTAQUE.some((p) =>
        linha.toLowerCase().includes(p.toLowerCase())
      );

      const ehTitulo =
        linha.includes('CIFLUC GEMINI CASILLAS') ||
        linha.includes(t('layout.edition')) ||
        linha.includes(`${t('layout.module')}:`) ||
        linha.includes(t('layout.execution')) ||
        linha.includes(t('layout.completeReport')) ||
        linha.includes('G-CODE') ||
        linha.includes('VERIFICAÇÃO') ||
        linha.includes('INSPEÇÃO') ||
        linha.includes('VERIFICATION') ||
        linha.includes('INSPECTION') ||
        linha.includes('VERIFICACIÓN') ||
        linha.includes('INSPECCIÓN') ||
        linha.includes('VÉRIFICATION');

      return `
        <div class="${ehTitulo ? 'linha tituloSecao' : destaque ? 'linha destaque' : 'linha'}">
          ${linha.trim()}
        </div>
      `;
    })
    .join('');

  return `
    <html>
      <head>
        <meta charset="utf-8" />

        <style>
          @page {
            margin: 16px;
          }

          body {
            color: #111;
            font-family: Arial, Helvetica, sans-serif;
            padding: 0;
            margin: 0;
            background: #ffffff;
          }

          .documento {
            border: 2px solid #111;
            padding: 12px;
          }

          .topo {
            display: flex;
            flex-direction: row;
            align-items: center;
            border-bottom: 4px solid #FFD400;
            padding-bottom: 8px;
            margin-bottom: 8px;
          }

          .logoBox {
            width: 58px;
            height: 58px;
            border: 1px solid #111;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 12px;
            background: #000;
          }

          .logo {
            width: 52px;
            height: 52px;
            object-fit: contain;
          }

          .tituloBox {
            flex: 1;
          }

          .tituloPrincipal {
            font-size: 22px;
            font-weight: 900;
            color: #111;
            letter-spacing: 0.5px;
            margin-bottom: 2px;
          }

          .subtitulo {
            font-size: 10px;
            color: #333;
            font-weight: bold;
            text-transform: uppercase;
          }

          .metaGrid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4px;
            margin-bottom: 8px;
            background: #f4f4f4;
            border: 1px solid #ccc;
            padding: 6px;
          }

          .metaItem {
            font-size: 10px;
            line-height: 13px;
          }

          .metaLabel {
            font-weight: bold;
            color: #000;
          }

          .blocoConteudo {
            border: 1px solid #d0d0d0;
          }

          .linha {
            font-size: 10.5px;
            line-height: 13px;
            padding: 2px 5px;
            border-bottom: 1px solid #e5e5e5;
            white-space: pre-wrap;
          }

          .destaque {
            background: #FFF7CC;
            font-weight: bold;
            border-left: 4px solid #FFD400;
          }

          .tituloSecao {
            background: #111;
            color: #FFD400;
            font-weight: 900;
            font-size: 11px;
            padding: 4px 6px;
            border-bottom: 1px solid #000;
            text-transform: uppercase;
          }

          .assinatura {
            margin-top: 10px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
          }

          .campoAssinatura {
            border-top: 1px solid #111;
            padding-top: 4px;
            font-size: 9px;
            color: #333;
            text-align: center;
          }

          .rodape {
            margin-top: 10px;
            font-size: 8.5px;
            color: #555;
            border-top: 1px solid #ccc;
            padding-top: 5px;
            text-align: center;
          }
        </style>
      </head>

      <body>
        <div class="documento">
          <div class="topo">
            <div class="logoBox">
              <img class="logo" src="${logoUri}" />
            </div>

            <div class="tituloBox">
              <div class="tituloPrincipal">CIFLUC GEMINI CASILLAS</div>
              <div class="subtitulo">
                ${t('layout.industrialReport')}
              </div>
            </div>
          </div>

          <div class="metaGrid">
            <div class="metaItem">
              <span class="metaLabel">${t('layout.terminalModule')}:</span> ${title}
            </div>

            <div class="metaItem">
              <span class="metaLabel">${t('layout.system')}:</span> CiFluc Gemini Casillas
            </div>

            <div class="metaItem">
              <span class="metaLabel">${t('layout.document')}:</span> ${t('layout.calculationReport')}
            </div>

            <div class="metaItem">
              <span class="metaLabel">${t('common.version')}:</span> Matrix 1.0
            </div>
          </div>

          <div class="blocoConteudo">
            ${linhas}
          </div>

          <div class="assinatura">
            <div class="campoAssinatura">
              ${t('layout.responsible')}
            </div>

            <div class="campoAssinatura">
              ${t('layout.verificationInspection')}
            </div>
          </div>

          <div class="rodape">
            ${t('layout.generatedDocument')}
            ${t('layout.brandValues')}
          </div>
        </div>
      </body>
    </html>
  `;
}

  async function handleCompartilhar() {
    try {
      await Share.share({
        message: montarRelatorioTexto()
      });
    } catch (error) {
      Alert.alert(t('common.error'), t('layout.shareError'));
    }
  }

  function handleVisualizar() {
    setModalVisivel(true);
  }

  async function handlePDF() {
    try {
      const html = montarHTMLPDF();

      const arquivo = await Print.printToFileAsync({
        html,
        base64: false
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(arquivo.uri);
      } else {
        Alert.alert(t('layout.pdfGenerated'), arquivo.uri);
      }
    } catch (error) {
      Alert.alert(t('common.error'), t('layout.pdfError'));
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <StatusBar barStyle={theme.statusBar} backgroundColor={theme.statusBarBg} />

      <View style={{ paddingTop: 45, paddingBottom: 8, paddingHorizontal: 16, backgroundColor: theme.headerBg, borderBottomWidth: 1, borderBottomColor: theme.border }}>
        <Text style={{ color: theme.yellow, fontSize: 16, fontWeight: '900' }}>
          CIFLUC GEMINI CASILLAS
        </Text>

        <Text style={{ color: theme.muted, fontSize: 10, fontWeight: 'bold' }}>
          {subtitle || t('layout.edition')}
        </Text>
      </View>

      <View style={{ backgroundColor: theme.navBg, borderBottomWidth: 1, borderColor: theme.border }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {ABAS.map((tab) => (
            <TouchableOpacity
              key={tab.rota}
              style={[
                { paddingHorizontal: 14, paddingVertical: 10 },
                activeRoute === tab.rota && { borderBottomWidth: 2, borderColor: theme.yellow }
              ]}
              onPress={() => {
                if (activeRoute !== tab.rota) {
                  navigation.navigate(tab.rota);
                }
              }}
            >
              <Text
                style={[
                  { color: theme.navText, fontWeight: 'bold', fontSize: 12 },
                  activeRoute === tab.rota && { color: theme.navTextActive }
                ]}
              >
                {t(tab.labelKey)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={{ flex: 1, paddingHorizontal: 8, paddingTop: 8 }}
        contentContainerStyle={{ paddingBottom: 125 }}
        showsVerticalScrollIndicator={false}
      >
        {children}

        <View style={{ backgroundColor: theme.terminalBg, borderRadius: 6, padding: 10, marginBottom: 10, borderWidth: 1, borderColor: theme.terminalBorder }}>
          <Text style={{ color: '#00FF00', fontSize: 10, fontWeight: 'bold', marginBottom: 8, textTransform: 'uppercase' }}>
            {t('layout.terminal')}
          </Text>

          <Text style={{ color: '#00FF00', fontFamily: 'monospace', fontSize: 11, marginTop: 4 }}>
            {t('layout.terminalHeader')}
          </Text>

          <Text style={{ color: '#00FF00', fontFamily: 'monospace', fontSize: 11, marginTop: 4 }}>
            {t('layout.terminalModule')}: {title}
          </Text>

          <Text style={{ color: '#00FF00', fontFamily: 'monospace', fontSize: 11, marginTop: 4 }}>
            {terminalText || t('layout.terminalReady')}
          </Text>
        </View>
      </ScrollView>

      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', backgroundColor: theme.bottomBarBg, borderTopWidth: 1, borderTopColor: theme.borderLight, paddingHorizontal: 5, paddingTop: 6, paddingBottom: 8 }}>
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: theme.inputBg, borderWidth: 1, borderColor: theme.inputBorder, borderRadius: 6, paddingVertical: 8, marginHorizontal: 3, alignItems: 'center', justifyContent: 'center' }}
          onPress={() => navigation.navigate('Dashboard')}
        >
          <Text style={{ color: theme.yellow, fontSize: 10, fontWeight: 'bold', textAlign: 'center' }}>{t('common.home')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ flex: 1, backgroundColor: theme.inputBg, borderWidth: 1, borderColor: theme.inputBorder, borderRadius: 6, paddingVertical: 8, marginHorizontal: 3, alignItems: 'center', justifyContent: 'center' }}
          onPress={handleVisualizar}
        >
          <Text style={{ color: theme.yellow, fontSize: 10, fontWeight: 'bold', textAlign: 'center' }}>{t('layout.viewAll')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ flex: 1, backgroundColor: theme.inputBg, borderWidth: 1, borderColor: theme.inputBorder, borderRadius: 6, paddingVertical: 8, marginHorizontal: 3, alignItems: 'center', justifyContent: 'center' }}
          onPress={handleCompartilhar}
        >
          <Text style={{ color: theme.yellow, fontSize: 10, fontWeight: 'bold', textAlign: 'center' }}>{t('layout.shareBtn')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ flex: 1, backgroundColor: theme.inputBg, borderWidth: 1, borderColor: theme.inputBorder, borderRadius: 6, paddingVertical: 8, marginHorizontal: 3, alignItems: 'center', justifyContent: 'center' }}
          onPress={handlePDF}
        >
          <Text style={{ color: theme.yellow, fontSize: 10, fontWeight: 'bold', textAlign: 'center' }}>{t('layout.pdfButton')}</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisivel} animationType="slide">
        <View style={{ flex: 1, backgroundColor: theme.bg, paddingTop: 45, paddingHorizontal: 12 }}>
          <Text style={{ color: theme.yellow, fontSize: 16, fontWeight: '900', marginBottom: 10 }}>
            {t('layout.completeReport')}
          </Text>

          <ScrollView
            style={{ flex: 1, backgroundColor: theme.terminalBg, borderWidth: 1, borderColor: theme.terminalBorder, borderRadius: 6, padding: 10 }}
            contentContainerStyle={{ paddingBottom: 110 }}
          >
            <Text style={{ color: '#00FF00', fontFamily: 'monospace', fontSize: 11, lineHeight: 17 }}>
              {montarRelatorioTexto()}
            </Text>
          </ScrollView>

          <View style={{ backgroundColor: theme.bg, paddingTop: 8, paddingBottom: 12 }}>
            <TouchableOpacity
              style={{ backgroundColor: theme.yellow, padding: 12, borderRadius: 4, alignItems: 'center', marginVertical: 12 }}
              onPress={() => setModalVisivel(false)}
            >
              <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 12 }}>{t('common.close')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export const casillasStyles = StyleSheet.create({
  card: {
    backgroundColor: '#0A0A0A',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#161616'
  },

  cardTitle: {
    color: '#FFD400',
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 8,
    textTransform: 'uppercase'
  },

  gridInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8
  },

  boxInputHalf: {
    width: '48%'
  },

  labelInput: {
    color: '#777',
    fontSize: 10,
    marginBottom: 2
  },

  input: {
    backgroundColor: '#111',
    color: '#FFF',
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#222',
    fontSize: 12
  },

  inputDisplay: {
    backgroundColor: '#141202',
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#3a3200',
    minHeight: 38,
    justifyContent: 'center',
    alignItems: 'center'
  },

  linhaTabela: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: '#111',
    gap: 8
  },

  txtWhite: {
    color: '#FFF',
    fontSize: 12
  },

  txtGray: {
    color: '#888',
    fontSize: 12
  },

  txtYellow: {
    color: '#FFD400',
    fontWeight: 'bold',
    fontSize: 12
  },

  txtMuted: {
    color: '#888',
    fontSize: 12
  },

  terminal: {
    backgroundColor: '#020202',
    padding: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#111',
    marginTop: 4
  },

  txtGcode: {
    color: '#00FF00',
    fontFamily: 'monospace',
    fontSize: 11
  },

  btnTipo: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#111',
    marginRight: 4,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#222'
  },

  btnTipoAtivo: {
    backgroundColor: '#FFD400',
    borderColor: '#FFD400'
  },

  btnTipoText: {
    color: '#666',
    fontSize: 10,
    fontWeight: 'bold'
  },

  btnTipoTextAtivo: {
    color: '#000'
  }
});

export function getCasillasStyles(theme) {
  return StyleSheet.create({
    card: {
      backgroundColor: theme.card,
      borderRadius: 6,
      padding: 10,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: theme.cardBorder
    },
    cardTitle: {
      color: theme.yellow,
      fontSize: 10,
      fontWeight: 'bold',
      marginBottom: 8,
      textTransform: 'uppercase'
    },
    gridInputs: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 8
    },
    boxInputHalf: {
      width: '48%'
    },
    labelInput: {
      color: theme.muted,
      fontSize: 10,
      marginBottom: 2
    },
    input: {
      backgroundColor: theme.inputBg,
      color: theme.text,
      padding: 8,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: theme.inputBorder,
      fontSize: 12
    },
    inputDisplay: {
      backgroundColor: theme.yellowDim,
      padding: 8,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: theme.yellow,
      minHeight: 38,
      justifyContent: 'center',
      alignItems: 'center'
    },
    linhaTabela: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 6,
      borderBottomWidth: 1,
      borderColor: theme.divider,
      gap: 8
    },
    txtWhite: {
      color: theme.textSecondary,
      fontSize: 12
    },
    txtGray: {
      color: theme.muted,
      fontSize: 12
    },
    txtYellow: {
      color: theme.yellow,
      fontWeight: 'bold',
      fontSize: 12
    },
    txtMuted: {
      color: theme.muted,
      fontSize: 12
    },
    terminal: {
      backgroundColor: theme.terminalBg,
      padding: 10,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: theme.terminalBorder,
      marginTop: 4
    },
    txtGcode: {
      color: '#00FF00',
      fontFamily: 'monospace',
      fontSize: 11
    },
    btnTipo: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      backgroundColor: theme.inputBg,
      marginRight: 4,
      borderRadius: 3,
      borderWidth: 1,
      borderColor: theme.inputBorder
    },
    btnTipoAtivo: {
      backgroundColor: theme.yellow,
      borderColor: theme.yellow
    },
    btnTipoText: {
      color: theme.muted,
      fontSize: 10,
      fontWeight: 'bold'
    },
    btnTipoTextAtivo: {
      color: theme.bg === '#000000' ? '#000' : '#FFF'
    },
    dropdownHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.inputBg,
      padding: 8,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: theme.inputBorder
    },
    dropdownContainer: {
      backgroundColor: theme.inputBg,
      borderWidth: 1,
      borderColor: theme.inputBorder,
      borderRadius: 4,
      marginTop: 4
    },
    dropdownItem: {
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.divider
    },
    grid2: {
      flexDirection: 'row',
      gap: 8,
      marginTop: 8
    },
    col2: {
      flex: 1
    },
    sectionTitle: {
      color: theme.yellow,
      fontSize: 11,
      fontWeight: 'bold',
      marginTop: 10,
      marginBottom: 4
    },
    btnCalcular: {
      backgroundColor: theme.yellow,
      paddingVertical: 10,
      borderRadius: 4,
      alignItems: 'center',
      marginTop: 10
    },
    btnCalcularText: {
      color: theme.bg === '#000000' ? '#000' : '#FFF',
      fontWeight: 'bold',
      fontSize: 12
    },
    separator: {
      height: 1,
      backgroundColor: theme.divider,
      marginVertical: 8
    }
  });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  },

  header: {
    paddingTop: 45,
    paddingBottom: 8,
    paddingHorizontal: 16,
    backgroundColor: '#000'
  },

  headerTitle: {
    color: '#FFD400',
    fontSize: 16,
    fontWeight: '900'
  },

  headerSubtitle: {
    color: '#666',
    fontSize: 10,
    fontWeight: 'bold'
  },

  navBar: {
    backgroundColor: '#050505',
    borderBottomWidth: 1,
    borderColor: '#111'
  },

  navTab: {
    paddingHorizontal: 14,
    paddingVertical: 10
  },

  navTabAtiva: {
    borderBottomWidth: 2,
    borderColor: '#FFD400'
  },

  navText: {
    color: '#444',
    fontWeight: 'bold',
    fontSize: 12
  },

  navTextAtivo: {
    color: '#FFD400'
  },

  content: {
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 8
  },

  contentContainer: {
    paddingBottom: 125
  },

  card: {
    backgroundColor: '#0A0A0A',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#161616'
  },

  cardTitle: {
    color: '#FFD400',
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 8,
    textTransform: 'uppercase'
  },

  terminalCard: {
    backgroundColor: '#050505',
    borderColor: '#222'
  },

  txtConsole: {
    color: '#00FF00',
    fontFamily: 'monospace',
    fontSize: 11,
    marginTop: 4
  },

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#000',
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingHorizontal: 5,
    paddingTop: 6,
    paddingBottom: 8
  },

  bottomButton: {
    flex: 1,
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 6,
    paddingVertical: 8,
    marginHorizontal: 3,
    alignItems: 'center',
    justifyContent: 'center'
  },

  bottomButtonText: {
    color: '#FFD400',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center'
  },

  modalContainer: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 45,
    paddingHorizontal: 12
  },

  modalTitle: {
    color: '#FFD400',
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 10
  },

  modalContent: {
    flex: 1,
    backgroundColor: '#050505',
    borderWidth: 1,
    borderColor: '#222',
    borderRadius: 6,
    padding: 10
  },

  modalText: {
    color: '#00FF00',
    fontFamily: 'monospace',
    fontSize: 11,
    lineHeight: 17
  },

  modalFooter: {
    backgroundColor: '#000',
    paddingTop: 8,
    paddingBottom: 12
  },

  modalButton: {
    backgroundColor: '#FFD400',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginVertical: 12
  },

  modalButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 12
  }
});
