import React, { useMemo, useState } from 'react';

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

import CasillasLayout, {
  casillasStyles as styles,
  getCasillasStyles
} from '../components/CasillasLayout';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

const C = {
  bg: '#000000',
  card: '#0A0A0A',
  border: '#242424',
  yellow: '#FFD400',
  green: '#00FF7F',
  text: '#D8D8D8',
  muted: '#8C8C8C'
};

const GRUPOS = [
  'Todos',
  'Aço',
  'Inox',
  'Ferro',
  'Alumínio',
  'Cobre/Bronze',
  'Polímero',
  'Especial'
];

const GROUP_KEYS = {
  Todos: 'materiais.groupAll', 'Aço': 'materiais.groupSteel', Inox: 'materiais.groupStainless',
  Ferro: 'materiais.groupIron', 'Alumínio': 'materiais.groupAluminum',
  'Cobre/Bronze': 'materiais.groupCopperBronze', 'Polímero': 'materiais.groupPolymer',
  Especial: 'materiais.groupSpecial'
};

const MATERIAIS = [
  {
    id: 'sae1020',
    nome: 'Aço SAE 1020',
    grupo: 'Aço carbono baixo carbono',
    dureza: '120–180 HB',
    hss: '25–40',
    md: '90–160',
    avanco: '0,10–0,35 mm/volta',
    ferramenta: 'HSS afiado ou metal duro P25/P35',
    refrigeracao: 'Recomendado',
    aplicacao: 'Eixos leves, buchas, bases, suportes',
    obs: 'Boa usinabilidade. Ideal para peças gerais e treinamento.'
  },
  {
    id: 'sae1045',
    nome: 'Aço SAE 1045',
    grupo: 'Aço médio carbono',
    dureza: '170–220 HB',
    hss: '20–35',
    md: '80–140',
    avanco: '0,10–0,30 mm/volta',
    ferramenta: 'Metal duro P25/P35',
    refrigeracao: 'Recomendado',
    aplicacao: 'Eixos, pinos, engrenagens simples',
    obs: 'Maior resistência que 1020. Pode encruar se a ferramenta perder corte.'
  },
  {
    id: 'steel4140',
    nome: 'Aço 4140',
    grupo: 'Aço liga Cr-Mo',
    dureza: '190–320 HB',
    hss: '15–28',
    md: '60–120',
    avanco: '0,08–0,25 mm/volta',
    ferramenta: 'Metal duro revestido P25/P35',
    refrigeracao: 'Recomendado',
    aplicacao: 'Eixos, moldes, peças de alta resistência',
    obs: 'Ajuste avanço e profundidade conforme dureza real.'
  },
  {
    id: 'toolSteelD2',
    nome: 'Aço ferramenta D2',
    grupo: 'Aço ferramenta alto carbono',
    dureza: '220–255 HB recozido',
    hss: '8–18',
    md: '40–85',
    avanco: '0,05–0,18 mm/volta',
    ferramenta: 'Metal duro revestido ou CBN quando temperado',
    refrigeracao: 'Conforme operação',
    aplicacao: 'Matrizes, punções, ferramentas',
    obs: 'Evite vibração. Use setup rígido e passe controlado.'
  },
  {
    id: 'stainless304',
    nome: 'Inox 304',
    grupo: 'Aço inox austenítico',
    dureza: '150–200 HB',
    hss: '10–22',
    md: '45–95',
    avanco: '0,08–0,25 mm/volta',
    ferramenta: 'Metal duro M15/M25 com aresta positiva',
    refrigeracao: 'Muito recomendado',
    aplicacao: 'Eixos inox, flanges, indústria alimentícia',
    obs: 'Material tende a encruar. Evite esfregar ferramenta sem corte.'
  },
  {
    id: 'stainless316',
    nome: 'Inox 316',
    grupo: 'Aço inox austenítico',
    dureza: '150–220 HB',
    hss: '8–20',
    md: '35–85',
    avanco: '0,08–0,22 mm/volta',
    ferramenta: 'Metal duro M15/M25',
    refrigeracao: 'Muito recomendado',
    aplicacao: 'Peças químicas, marítimas, corrosão severa',
    obs: 'Mais difícil que 304. Controle calor e use avanço consistente.'
  },
  {
    id: 'grayCastIron',
    nome: 'Ferro fundido cinzento',
    grupo: 'Ferro fundido',
    dureza: '160–240 HB',
    hss: '18–30',
    md: '80–180',
    avanco: '0,12–0,40 mm/volta',
    ferramenta: 'Metal duro K10/K20',
    refrigeracao: 'Geralmente seco',
    aplicacao: 'Carcaças, bases, polias, tampas',
    obs: 'Produz pó abrasivo. Proteja guias e mantenha boa limpeza da máquina.'
  },
  {
    id: 'ductileCastIron',
    nome: 'Ferro fundido nodular',
    grupo: 'Ferro fundido',
    dureza: '170–260 HB',
    hss: '15–28',
    md: '70–150',
    avanco: '0,10–0,35 mm/volta',
    ferramenta: 'Metal duro K20/K30',
    refrigeracao: 'Seco ou mínima lubrificação',
    aplicacao: 'Engrenagens, suportes, virabrequins',
    obs: 'Mais resistente que o cinzento. Exige aresta robusta.'
  },
  {
    id: 'aluminum6061',
    nome: 'Alumínio 6061',
    grupo: 'Liga de alumínio',
    dureza: '80–100 HB',
    hss: '80–180',
    md: '250–600',
    avanco: '0,10–0,50 mm/volta',
    ferramenta: 'HSS polido ou metal duro para alumínio',
    refrigeracao: 'Recomendado para acabamento',
    aplicacao: 'Estruturas, suportes, peças leves',
    obs: 'Use aresta afiada e evite empastamento.'
  },
  {
    id: 'aluminum7075',
    nome: 'Alumínio 7075',
    grupo: 'Liga de alumínio alta resistência',
    dureza: '130–170 HB',
    hss: '70–150',
    md: '200–500',
    avanco: '0,08–0,40 mm/volta',
    ferramenta: 'Metal duro polido para alumínio',
    refrigeracao: 'Recomendado',
    aplicacao: 'Peças aeronáuticas, moldes, componentes leves',
    obs: 'Boa usinabilidade, mas exige fixação rígida.'
  },
  {
    id: 'bronze660',
    nome: 'Bronze SAE 660',
    grupo: 'Liga de cobre',
    dureza: '65–90 HB',
    hss: '35–70',
    md: '100–220',
    avanco: '0,08–0,30 mm/volta',
    ferramenta: 'HSS ou metal duro K10',
    refrigeracao: 'Opcional',
    aplicacao: 'Buchas, mancais, guias',
    obs: 'Bom acabamento. Controle folgas e vibração.'
  },
  {
    id: 'brass',
    nome: 'Latão',
    grupo: 'Liga cobre-zinco',
    dureza: '60–120 HB',
    hss: '60–120',
    md: '150–300',
    avanco: '0,08–0,35 mm/volta',
    ferramenta: 'HSS ou metal duro com geometria adequada',
    refrigeracao: 'Opcional',
    aplicacao: 'Conexões, buchas, peças decorativas',
    obs: 'Usina fácil. Cuidado com agarramento em furação.'
  },
  {
    id: 'copper',
    nome: 'Cobre eletrolítico',
    grupo: 'Cobre puro',
    dureza: '40–90 HB',
    hss: '25–60',
    md: '80–180',
    avanco: '0,05–0,25 mm/volta',
    ferramenta: 'Aresta muito afiada e positiva',
    refrigeracao: 'Recomendado',
    aplicacao: 'Barramentos, eletrodos, componentes elétricos',
    obs: 'Material dúctil. Pode gerar rebarba e empastamento.'
  },
  {
    id: 'nylonPa6',
    nome: 'Nylon PA6',
    grupo: 'Polímero técnico',
    dureza: 'Variável',
    hss: '80–200',
    md: '150–400',
    avanco: '0,10–0,50 mm/volta',
    ferramenta: 'HSS muito afiado',
    refrigeracao: 'Ar ou seco',
    aplicacao: 'Buchas, roldanas, guias',
    obs: 'Evite aquecimento. Deixe sobremetal para estabilização.'
  },
  {
    id: 'pom',
    nome: 'POM / Acetal',
    grupo: 'Polímero técnico',
    dureza: 'Variável',
    hss: '100–250',
    md: '180–450',
    avanco: '0,10–0,45 mm/volta',
    ferramenta: 'HSS ou metal duro afiado',
    refrigeracao: 'Ar ou seco',
    aplicacao: 'Engrenagens plásticas, buchas, peças de precisão',
    obs: 'Boa estabilidade dimensional e ótimo acabamento.'
  },
  {
    id: 'uhmw',
    nome: 'UHMW',
    grupo: 'Polietileno de ultra alto peso molecular',
    dureza: 'Baixa',
    hss: '80–180',
    md: '120–300',
    avanco: '0,12–0,60 mm/volta',
    ferramenta: 'HSS muito afiado',
    refrigeracao: 'Ar',
    aplicacao: 'Guias de desgaste, esteiras, raspadores',
    obs: 'Material flexível. Use apoio e ferramenta muito afiada.'
  },
  {
    id: 'titanium',
    nome: 'Titânio Ti-6Al-4V',
    grupo: 'Liga de titânio',
    dureza: '300–360 HB',
    hss: '5–12',
    md: '25–60',
    avanco: '0,05–0,18 mm/volta',
    ferramenta: 'Metal duro específico para titânio',
    refrigeracao: 'Alta pressão recomendada',
    aplicacao: 'Aeronáutica, médico, alta resistência',
    obs: 'Baixa condutividade térmica. Evite calor e vibração.'
  },
  {
    id: 'hardenedSteel',
    nome: 'Aço temperado',
    grupo: 'Aço endurecido',
    dureza: '45–62 HRC',
    hss: 'Não recomendado',
    md: '20–80',
    avanco: '0,03–0,15 mm/volta',
    ferramenta: 'CBN, cerâmica ou metal duro adequado',
    refrigeracao: 'Conforme inserto',
    aplicacao: 'Matrizes, eixos tratados, pistas',
    obs: 'Exige máquina rígida, baixa profundidade e controle térmico.'
  }
];

export default function MateriaisScreen({ navigation }) {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const s = getCasillasStyles(theme);

  const [grupo, setGrupo] = useState('Todos');
  const [modal, setModal] = useState(false);

  function localizeMaterial(item, field) {
    const key = `materiaisDb.${item.id}.${field}`;
    const translated = t(key);
    return translated === key ? item[field] : translated;
  }

  const lista = useMemo(() => {
    if (grupo === 'Todos') return MATERIAIS;

    if (grupo === 'Aço') {
      return MATERIAIS.filter((m) => m.grupo.includes('Aço') && !m.grupo.includes('inox'));
    }

    if (grupo === 'Inox') {
      return MATERIAIS.filter((m) => m.grupo.includes('inox'));
    }

    if (grupo === 'Ferro') {
      return MATERIAIS.filter((m) => m.grupo.includes('Ferro'));
    }

    if (grupo === 'Alumínio') {
      return MATERIAIS.filter((m) => m.grupo.includes('alumínio'));
    }

    if (grupo === 'Cobre/Bronze') {
      return MATERIAIS.filter((m) => m.grupo.includes('cobre') || m.grupo.includes('Cobre'));
    }

    if (grupo === 'Polímero') {
      return MATERIAIS.filter((m) => m.grupo.includes('Polímero') || m.grupo.includes('Polietileno'));
    }

    return MATERIAIS.filter(
      (m) =>
        m.nome.includes('Titânio') ||
        m.nome.includes('temperado') ||
        m.grupo.includes('titânio') ||
        m.grupo.includes('endurecido')
    );
  }, [grupo]);

  function montarRelatorio() {
    const linhas = [
      t('materiais.reportTitle'),
      'CiFluc Gemini Casillas • Matrix 1.0',
      '',
      `${t('materiais.filter')}: ${t(GROUP_KEYS[grupo])}`,
      `${t('materiais.displayedCount')}: ${lista.length}`,
      ''
    ];

    lista.forEach((m, index) => {
      linhas.push(
        `${index + 1}. ${localizeMaterial(m, 'nome')}`,
        `${t('materiais.group')}: ${localizeMaterial(m, 'grupo')}`,
        `${t('materiais.approxHardness')}: ${m.dureza}`,
        `Vc HSS: ${m.hss} m/min`,
        `${t('materiais.vcCarbide')}: ${m.md} m/min`,
        `${t('materiais.feed')}: ${m.avanco}`,
        `${t('materiais.tool')}: ${localizeMaterial(m, 'ferramenta')}`,
        `${t('materiais.cooling')}: ${localizeMaterial(m, 'refrigeracao')}`,
        `${t('materiais.application')}: ${localizeMaterial(m, 'aplicacao')}`,
        `${t('materiais.notes')}: ${localizeMaterial(m, 'obs')}`,
        ''
      );
    });

    linhas.push(
      t('materiais.warning')
    );

    return linhas.join('\n');
  }

  async function compartilhar() {
    try {
      await Share.share({ message: montarRelatorio() });
    } catch (error) {
      Alert.alert(t('common.error'), t('common.error'));
    }
  }

  function MaterialCard({ item }) {
    return (
      <View style={s.card}>
        <Text style={s.cardTitle}>{localizeMaterial(item, 'nome')}</Text>

        <View style={s.gridInputs}>
          <View style={s.boxInputHalf}>
            <Text style={s.txtGray}>{t('materiais.categoryCol')}</Text>
            <Text style={s.txtWhite}>{localizeMaterial(item, 'grupo')}</Text>
          </View>

          <View style={s.boxInputHalf}>
            <Text style={s.txtGray}>{t('materiais.hardnessCol')}</Text>
            <Text style={s.txtWhite}>{item.dureza}</Text>
          </View>
        </View>

        <View style={s.gridInputs}>
          <View style={s.boxInputHalf}>
            <Text style={s.txtGray}>Vc HSS</Text>
            <Text style={s.txtYellow}>{item.hss} m/min</Text>
          </View>

          <View style={s.boxInputHalf}>
            <Text style={s.txtGray}>{t('materiais.vcCarbide')}</Text>
            <Text style={s.txtYellow}>{item.md} m/min</Text>
          </View>
        </View>

        <Text style={s.txtGray}>{t('materiais.feed')}</Text>
        <Text style={s.txtWhite}>{item.avanco}</Text>

        <Text style={s.txtGray}>{t('materiais.tool')}</Text>
        <Text style={s.txtWhite}>{localizeMaterial(item, 'ferramenta')}</Text>

        <Text style={s.txtGray}>{t('materiais.cooling')}</Text>
        <Text style={s.txtWhite}>{localizeMaterial(item, 'refrigeracao')}</Text>

        <Text style={s.txtGray}>{t('materiais.application')}</Text>
        <Text style={s.txtWhite}>{localizeMaterial(item, 'aplicacao')}</Text>

        <Text style={s.txtGray}>{t('materiais.notes')}</Text>
        <Text style={s.txtMuted}>{localizeMaterial(item, 'obs')}</Text>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <View style={s.header}>
        <Text style={s.title}>11. {t('materiais.title')}</Text>
        <Text style={s.sub}>
          {t('materiais.layoutSubtitle')}
        </Text>
      </View>

      <View style={s.tabs}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {GRUPOS.map((item) => (
            <TouchableOpacity
              key={item}
              style={[s.tab, grupo === item && s.tabAtiva]}
              onPress={() => setGrupo(item)}
            >
              <Text style={[s.tabText, grupo === item && s.tabTextAtiva]}>
                {t(GROUP_KEYS[item])}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={s.content}
        contentContainerStyle={{ paddingBottom: 112 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.txtHeadTab}>
          <Text style={s.txtYellow}>{t('materiais.inputData')}</Text>
          <Text style={s.txtWhite}>
            {t('materiais.material')}
          </Text>
        </View>

        {lista.map((item) => (
          <MaterialCard key={item.nome} item={item} />
        ))}
      </ScrollView>

      <View style={s.bottom}>
        <TouchableOpacity
          style={s.bottomButton}
          onPress={() => navigation.navigate('Dashboard')}
        >
          <Text style={s.bottomText}>{t('common.home')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.bottomButton}
          onPress={() => setModal(true)}
        >
          <Text style={s.bottomText}>{t('layout.viewAll')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.bottomButton}
          onPress={compartilhar}
        >
          <Text style={s.bottomText}>{t('layout.shareBtn')}</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modal} animationType="slide" transparent>
        <View style={s.modalFundo}>
          <View style={s.modalBox}>
            <Text style={s.modalTitle}>{t('materiais.title')}</Text>

            <ScrollView>
              <Text style={s.modalText}>{montarRelatorio()}</Text>
            </ScrollView>

            <TouchableOpacity
              style={s.modalButton}
              onPress={() => setModal(false)}
            >
              <Text style={s.modalButtonText}>{t('common.close')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
