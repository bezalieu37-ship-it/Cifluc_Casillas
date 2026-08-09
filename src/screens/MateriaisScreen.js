import React, { useMemo, useState } from 'react';

import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import CasillasLayout, {
  getCasillasStyles
} from '../components/CasillasLayout';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

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
  // ═══════════════════════════════════════════════════════════
  // AÇO CARBONO E LIGA
  // ═══════════════════════════════════════════════════════════
  {
    id: 'sae1010',
    nome: 'Aço SAE 1010',
    grupo: 'Aço carbono baixo carbono',
    dureza: '95–130 HB',
    hss: '30–50',
    md: '100–180',
    avanco: '0,12–0,40 mm/volta',
    ferramenta: 'HSS afiado ou metal duro P10/P20',
    refrigeracao: 'Recomendado',
    aplicacao: 'Peças conformadas, parafusos, rebites, arames',
    obs: 'Material muito mole. Corte rápido, mas cuidado com rebarba e acabamento.'
  },
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
    id: 'sae1060',
    nome: 'Aço SAE 1060',
    grupo: 'Aço carbono alto carbono',
    dureza: '200–270 HB',
    hss: '15–25',
    md: '60–110',
    avanco: '0,08–0,25 mm/volta',
    ferramenta: 'Metal duro P35/K20',
    refrigeracao: 'Recomendado',
    aplicacao: 'Molas, facas, herramientas manuais, discos de corte',
    obs: 'Alta resistência ao desgaste. Use velocidade moderada e avanço controlado.'
  },
  {
    id: 'sae1080',
    nome: 'Aço SAE 1080',
    grupo: 'Aço carbono alto carbono',
    dureza: '220–300 HB',
    hss: '12–22',
    md: '50–100',
    avanco: '0,06–0,22 mm/volta',
    ferramenta: 'Metal duro revestido ou CBN',
    refrigeracao: 'Recomendado',
    aplicacao: 'Lâminas, molas pesadas, ferramentas de corte',
    obs: 'Difícil usinabilidade no estado temperado. Trabalhe recozido quando possível.'
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
    id: 'steel4340',
    nome: 'Aço 4340',
    grupo: 'Aço liga Ni-Cr-Mo',
    dureza: '210–350 HB',
    hss: '12–22',
    md: '50–100',
    avanco: '0,06–0,22 mm/volta',
    ferramenta: 'Metal duro revestido P30/P40',
    refrigeracao: 'Recomendado',
    aplicacao: 'Eixos de aviões, gearboxes, componentes estruturais críticos',
    obs: 'Excelente tenacidade. Evite mudanças bruscas de direção de corte.'
  },
  {
    id: 'steel8620',
    nome: 'Aço 8620',
    grupo: 'Aço liga Ni-Cr case hardening',
    dureza: '140–200 HB (recozido)',
    hss: '22–35',
    md: '80–140',
    avanco: '0,10–0,30 mm/volta',
    ferramenta: 'HSS ou metal duro P20/P30',
    refrigeracao: 'Recomendado',
    aplicacao: 'Engrenagens cementadas, eixos, pinos de alta resistência superficial',
    obs: 'Usinável antes do tratamento superficial. Cementação posterior.'
  },
  {
    id: 'toolSteelD2',
    nome: 'Aço ferramenta D2',
    grupo: 'Aço ferramenta frio',
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
    id: 'toolSteelH13',
    nome: 'Aço ferramenta H13',
    grupo: 'Aço ferramenta quente',
    dureza: '180–230 HB recozido',
    hss: '12–25',
    md: '50–100',
    avanco: '0,08–0,25 mm/volta',
    ferramenta: 'Metal duro P30/P40 ou CBN',
    refrigeracao: 'Recomendado',
    aplicacao: 'Matrizes de injeção, forjamento, extrusão, quente',
    obs: 'Resistente ao choque térmico. Trabalhe recozido para melhor usinabilidade.'
  },
  {
    id: 'toolSteelO1',
    nome: 'Aço ferramenta O1',
    grupo: 'Aço ferramenta óleo endurecido',
    dureza: '190–230 HB recozido',
    hss: '15–25',
    md: '60–110',
    avanco: '0,08–0,25 mm/volta',
    ferramenta: 'HSS afiado ou metal duro P20/P30',
    refrigeracao: 'Recomendado',
    aplicacao: 'Ferramentas de medição, moldes, cutelaria',
    obs: 'Boa usinabilidade no recozimento. Endurece por têmpera em óleo.'
  },

  // ═══════════════════════════════════════════════════════════
  // AÇO INOX
  // ═══════════════════════════════════════════════════════════
  {
    id: 'stainless303',
    nome: 'Inox 303',
    grupo: 'Aço inox austenítico free machining',
    dureza: '150–200 HB',
    hss: '12–25',
    md: '50–100',
    avanco: '0,10–0,28 mm/volta',
    ferramenta: 'Metal duro M15/M25 com aresta positiva',
    refrigeracao: 'Muito recomendado',
    aplicacao: 'Parafusos, buchas, eixos de precisão, peças automotivas',
    obs: 'Versão de usinagem fácil do 304. Enxofre melhora a usinabilidade.'
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
    id: 'stainless316L',
    nome: 'Inox 316L',
    grupo: 'Aço inox austenítico baixo carbono',
    dureza: '150–210 HB',
    hss: '8–18',
    md: '35–80',
    avanco: '0,07–0,20 mm/volta',
    ferramenta: 'Metal duro M15/M25',
    refrigeracao: 'Muito recomendado',
    aplicacao: 'Implantes médicos, equipamentos farmacêuticos, soldagem',
    obs: 'Variante baixo carbono do 316. Melhor resistência à corrosão pós-solda.'
  },
  {
    id: 'stainless174ph',
    nome: 'Inox 17-4 PH',
    grupo: 'Aço inox precipitação endurecido',
    dureza: '280–380 HB (H900)',
    hss: '8–15',
    md: '30–70',
    avanco: '0,05–0,18 mm/volta',
    ferramenta: 'Metal duro M10/M20 ou CBN',
    refrigeracao: 'Muito recomendado',
    aplicacao: 'Aeronáutica, petróleo, componentes de alta resistência',
    obs: 'Alta resistência mecânica. Usine recozido, endureça por precipitação depois.'
  },
  {
    id: 'stainless2205',
    nome: 'Inox 2205 Duplex',
    grupo: 'Aço inox duplex',
    dureza: '250–320 HB',
    hss: '6–14',
    md: '25–60',
    avanco: '0,05–0,15 mm/volta',
    ferramenta: 'Metal duro cerâmico ou CBN',
    refrigeracao: 'Alta pressão recomendada',
    aplicacao: 'Tanques químicos, trocadores de calor, oleodutos',
    obs: 'Duro e abrasivo. Use baixa velocidade de corte e avanço constante.'
  },

  // ═══════════════════════════════════════════════════════════
  // FERRO FUNDIDO
  // ═══════════════════════════════════════════════════════════
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
    id: 'malleableCastIron',
    nome: 'Ferro maleável',
    grupo: 'Ferro fundido',
    dureza: '130–200 HB',
    hss: '20–35',
    md: '80–160',
    avanco: '0,12–0,38 mm/volta',
    ferramenta: 'Metal duro K10/K20',
    refrigeracao: 'Seco ou com ar comprimido',
    aplicacao: 'Conexões hidráulicas, tampas, suportes automotivos',
    obs: 'Melhor ductilidade que o cinzento. Boa usinabilidade com aresta negativa.'
  },
  {
    id: 'compactedGraphite',
    nome: 'Ferro fundido CGI',
    grupo: 'Ferro fundido grafite compactado',
    dureza: '180–260 HB',
    hss: '14–25',
    md: '60–130',
    avanco: '0,10–0,30 mm/volta',
    ferramenta: 'Metal duro K20/P20 revestido',
    refrigeracao: 'Seco ou com ar comprimido',
    aplicacao: 'Bloco de motor diesel, cilindros, peças de alta resistência',
    obs: 'Difícil de usinar que o cinzento. Use aresta reforçada e setup rígido.'
  },

  // ═══════════════════════════════════════════════════════════
  // ALUMÍNIO
  // ═══════════════════════════════════════════════════════════
  {
    id: 'aluminum1100',
    nome: 'Alumínio 1100',
    grupo: 'Alumínio comercial puro',
    dureza: '20–30 HB',
    hss: '120–250',
    md: '350–800',
    avanco: '0,15–0,60 mm/volta',
    ferramenta: 'HSS polido ou metal duro para alumínio',
    refrigeracao: 'Opcional',
    aplicacao: 'Trefilação, condutores elétricos, recipientes químicos',
    obs: 'Material muito mole e dúctil. Cuidado com empastamento e acabamento.'
  },
  {
    id: 'aluminum2024',
    nome: 'Alumínio 2024',
    grupo: 'Liga de alumínio alta resistência',
    dureza: '120–150 HB',
    hss: '70–140',
    md: '200–450',
    avanco: '0,08–0,35 mm/volta',
    ferramenta: 'Metal duro para alumínio',
    refrigeracao: 'Recomendado',
    aplicacao: 'Estruturas aeronáuticas, vigas, skins de aeronaves',
    obs: 'Alta resistência, mas menor usinabilidade que 6061. Evite vibração.'
  },
  {
    id: 'aluminum5052',
    nome: 'Alumínio 5052',
    grupo: 'Liga de alumínio marítimo',
    dureza: '60–80 HB',
    hss: '100–200',
    md: '300–650',
    avanco: '0,12–0,50 mm/volta',
    ferramenta: 'HSS polido ou metal duro para alumínio',
    refrigeracao: 'Recomendado para acabamento',
    aplicacao: 'Chapas navais, tanques de combustível, painéis decorativos',
    obs: 'Boa conformabilidade e resistência à corrosão marinha.'
  },
  {
    id: 'aluminum6061',
    nome: 'Alumínio 6061',
    grupo: 'Liga de alumínio estrutural',
    dureza: '80–100 HB',
    hss: '80–180',
    md: '250–600',
    avanco: '0,10–0,50 mm/volta',
    ferramenta: 'HSS polido ou metal duro para alumínio',
    refrigeracao: 'Recomendado para acabamento',
    aplicacao: 'Estruturas, suportes, peças leves',
    obs: 'Usinabilidade padrão da indústria. Boa referência para novos operadores.'
  },
  {
    id: 'aluminum6063',
    nome: 'Alumínio 6063',
    grupo: 'Liga de alumínio extrusão',
    dureza: '60–85 HB',
    hss: '100–220',
    md: '300–700',
    avanco: '0,12–0,55 mm/volta',
    ferramenta: 'HSS polido ou metal duro',
    refrigeracao: 'Recomendado',
    aplicacao: 'Perfis estruturais, janelas, portas, esquadrias',
    obs: 'Melhor acabamento superficial que 6061. Ideal para perfis extrudados.'
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
    id: 'aluminumA356',
    nome: 'Alumínio A356',
    grupo: 'Liga de alumínio fundido',
    dureza: '70–95 HB',
    hss: '80–160',
    md: '220–500',
    avanco: '0,10–0,45 mm/volta',
    ferramenta: 'HSS ou metal duro para alumínio',
    refrigeracao: 'Recomendado',
    aplicacao: 'Blocos de motor, peças fundidas, carcaças de bombas',
    obs: 'Material fundido. Cuidado com porosidade subsuperficial.'
  },

  // ═══════════════════════════════════════════════════════════
  // COBRE, LATÃO E BRONZE
  // ═══════════════════════════════════════════════════════════
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
    id: 'brass',
    nome: 'Latão Comercial',
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
    id: 'brassC360',
    nome: 'Latão C360 (Free Cutting)',
    grupo: 'Liga cobre-zinco free machining',
    dureza: '65–100 HB',
    hss: '70–140',
    md: '180–350',
    avanco: '0,10–0,40 mm/volta',
    ferramenta: 'HSS ou metal duro',
    refrigeracao: 'Opcional',
    aplicacao: 'Parafusos, terminais elétricos, peças de precisão automática',
    obs: 'Melhor usinabilidade que o latão comum. Aditivo de chumbo melhora cavaco.'
  },
  {
    id: 'bronze660',
    nome: 'Bronze SAE 660',
    grupo: 'Liga de cobre estanho',
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
    id: 'bronzeAluminum',
    nome: 'Bronze de Alumínio (CuAl)',
    grupo: 'Liga de cobre alumínio',
    dureza: '150–250 HB',
    hss: '20–45',
    md: '60–140',
    avanco: '0,06–0,22 mm/volta',
    ferramenta: 'Metal duro K10/P10',
    refrigeracao: 'Recomendado',
    aplicacao: 'Engrenagens, hélices, mancais pesados, válvulas',
    obs: 'Alta resistência e desgaste. Abrasivo — use aresta reforçada.'
  },
  {
    id: 'phosphorBronze',
    nome: 'Bronze de Fósforo (CuSn)',
    grupo: 'Liga de cobre estanho fósforo',
    dureza: '80–200 HB',
    hss: '30–60',
    md: '80–180',
    avanco: '0,06–0,25 mm/volta',
    ferramenta: 'HSS afiado ou metal duro K10',
    refrigeracao: 'Recomendado',
    aplicacao: 'Molas, contactos elétricos, mancais de precisão',
    obs: 'Boa elasticidade e resistência à fadiga. Acabamento superficial importante.'
  },

  // ═══════════════════════════════════════════════════════════
  // POLÍMEROS E PLÁSTICOS TÉCNICOS
  // ═══════════════════════════════════════════════════════════
  {
    id: 'nylonPa6',
    nome: 'Nylon PA6',
    grupo: 'Poliamida técnica',
    dureza: 'Variável (R100–R120)',
    hss: '80–200',
    md: '150–400',
    avanco: '0,10–0,50 mm/volta',
    ferramenta: 'HSS muito afiado',
    refrigeracao: 'Ar ou seco',
    aplicacao: 'Buchas, roldanas, guias, engrenagens',
    obs: 'Evite aquecimento. Deixe sobremetal para estabilização.'
  },
  {
    id: 'nylonPa66',
    nome: 'Nylon PA66',
    grupo: 'Poliamida técnica reforçada',
    dureza: 'Variável (R105–R120)',
    hss: '70–170',
    md: '130–350',
    avanco: '0,08–0,40 mm/volta',
    ferramenta: 'HSS muito afiado ou metal duro',
    refrigeracao: 'Ar ou seco',
    aplicacao: 'Engrenagens estruturais, suportes, componentes automotivos',
    obs: 'Maior resistência mecânica que PA6. Cuidado com fibras de vidro (abrasivo).'
  },
  {
    id: 'pom',
    nome: 'POM / Acetal (Delrin)',
    grupo: 'Polímero técnico',
    dureza: 'R115–R120',
    hss: '100–250',
    md: '180–450',
    avanco: '0,10–0,45 mm/volta',
    ferramenta: 'HSS ou metal duro afiado',
    refrigeracao: 'Ar ou seco',
    aplicacao: 'Engrenagens plásticas, buchas, peças de precisão',
    obs: 'Boa estabilidade dimensional e ótimo acabamento.'
  },
  {
    id: 'ptfe',
    nome: 'PTFE / Teflon',
    grupo: 'Fluoropolímero',
    dureza: 'Baixa (Shore D 50–65)',
    hss: '30–80',
    md: '50–150',
    avanco: '0,15–0,60 mm/volta',
    ferramenta: 'HSS muito afiado ou cerâmica',
    refrigeracao: 'Ar ou seco',
    aplicacao: 'Vedações, anéis de retorno, guias anti-adesão',
    obs: 'Material muito mole e frágil. Use velocidade alta e avanço leve.'
  },
  {
    id: 'uhmw',
    nome: 'UHMW-PE',
    grupo: 'Polietileno ultra alto peso molecular',
    dureza: 'Baixa (Shore D 60–70)',
    hss: '80–180',
    md: '120–300',
    avanco: '0,12–0,60 mm/volta',
    ferramenta: 'HSS muito afiado',
    refrigeracao: 'Ar',
    aplicacao: 'Guias de desgaste, esteiras, raspadores, linhas de produção',
    obs: 'Material flexível e autolubrificante. Use apoio e ferramenta muito afiada.'
  },
  {
    id: 'pei',
    nome: 'PEI / Ultem',
    grupo: 'Polímero de alta temperatura',
    dureza: 'R109–R125',
    hss: '60–140',
    md: '120–280',
    avanco: '0,06–0,30 mm/volta',
    ferramenta: 'HSS ou metal duro afiado',
    refrigeracao: 'Ar comprimido ou seco',
    aplicacao: 'Componentes aeronáuticos, isolantes elétricos, peças médicas',
    obs: 'Resistente a altas temperaturas (170°C contínuo). Usinabilidade moderada.'
  },
  {
    id: 'pvdf',
    nome: 'PVDF / Kynar',
    grupo: 'Fluoropolímero químico',
    dureza: 'Shore D 65–75',
    hss: '40–100',
    md: '80–200',
    avanco: '0,10–0,40 mm/volta',
    ferramenta: 'HSS afiado ou cerâmica',
    refrigeracao: 'Ar ou seco',
    aplicacao: 'Tubulações químicas, válvulas, peças para semicondutores',
    obs: 'Resistente a quase todos os solventes. Corte limpo para evitar contaminação.'
  },
  {
    id: 'peek',
    nome: 'PEEK',
    grupo: 'Polímero de alta performance',
    dureza: 'R120–R130',
    hss: '80–200',
    md: '150–350',
    avanco: '0,06–0,30 mm/volta',
    ferramenta: 'HSS ou metal duro afiado',
    refrigeracao: 'Ar comprimido ou seco',
    aplicacao: 'Implantes médicos, componentes aeroespaciais, vedações de alta pressão',
    obs: 'Polímero mais resistente. Caríssimo — otimize cada passe de corte.'
  },
  {
    id: 'pp',
    nome: 'Polipropileno (PP)',
    grupo: 'Poliolefina commodity',
    dureza: 'Shore D 70–80',
    hss: '100–250',
    md: '200–500',
    avanco: '0,12–0,50 mm/volta',
    ferramenta: 'HSS muito afiado',
    refrigeracao: 'Ar ou seco',
    aplicacao: 'Recipientes, tampas, peças de laboratório, protótipos',
    obs: 'Material leve e quimicamente resistente. Funde facilmente — controle calor.'
  },

  // ═══════════════════════════════════════════════════════════
  // MATERIAIS ESPECIAIS E SUPERLIGAS
  // ═══════════════════════════════════════════════════════════
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
    id: 'titaniumGrade2',
    nome: 'Titânio Grade 2 (puro)',
    grupo: 'Titânio comercialmente puro',
    dureza: '170–220 HB',
    hss: '10–20',
    md: '40–80',
    avanco: '0,08–0,22 mm/volta',
    ferramenta: 'Metal duro ou cerâmica',
    refrigeracao: 'Alta pressão',
    aplicacao: 'Trocaadores de calor, condensadores, equipamentos químicos',
    obs: 'Mais mole que Ti-6Al-4V, mas ainda exige controle térmico rigoroso.'
  },
  {
    id: 'inconel718',
    nome: 'Inconel 718',
    grupo: 'Superliga base níquel',
    dureza: '320–400 HB (solução tratado)',
    hss: '3–8',
    md: '12–35',
    avanco: '0,03–0,12 mm/volta',
    ferramenta: 'Cerâmica, CBN ou metal duro revestido P40',
    refrigeracao: 'Alta pressão obrigatória',
    aplicacao: 'Turbinas a jato, componentes de foguetes, poços de petróleo',
    obs: 'Extremamente difícil de usinar. Trabalho em frio se intensifica rápido.'
  },
  {
    id: 'inconel625',
    nome: 'Inconel 625',
    grupo: 'Superliga base níquel',
    dureza: '250–350 HB',
    hss: '4–10',
    md: '15–40',
    avanco: '0,04–0,14 mm/volta',
    ferramenta: 'Cerâmica ou CBN',
    refrigeracao: 'Alta pressão obrigatória',
    aplicacao: 'Equipamentos marinhos, reactores químicos, soldagem subaquática',
    obs: 'Alta resistência à corrosão e calor. Velocidade de corte baixíssima.'
  },
  {
    id: 'monel400',
    nome: 'Monel 400',
    grupo: 'Liga níquel-cobre',
    dureza: '140–200 HB',
    hss: '8–18',
    md: '30–65',
    avanco: '0,05–0,18 mm/volta',
    ferramenta: 'Metal duro P30/K20 ou cerâmica',
    refrigeracao: 'Alta pressão recomendada',
    aplicacao: 'Equipamentos marinhos, tanques de ácido, válvulas de óleo/gás',
    obs: 'Trabalha em frio rapidamente. Use aresta negativa e baixa velocidade.'
  },
  {
    id: 'hastelloyC276',
    nome: 'Hastelloy C-276',
    grupo: 'Superliga base níquel-molibdênio',
    dureza: '200–280 HB',
    hss: '3–8',
    md: '10–30',
    avanco: '0,03–0,10 mm/volta',
    ferramenta: 'Cerâmica ou CBN',
    refrigeracao: 'Alta pressão obrigatória',
    aplicacao: 'Processamento químico, indústria farmacêutica, poluição ambiental',
    obs: 'Uma das ligas mais difíceis de usinar. Priorize bruning e fresamento em vez de torneamento.'
  },
  {
    id: 'hardenedSteel',
    nome: 'Aço temperado (45–62 HRC)',
    grupo: 'Aço endurecido',
    dureza: '45–62 HRC',
    hss: 'Não recomendado',
    md: '20–80',
    avanco: '0,03–0,15 mm/volta',
    ferramenta: 'CBN, cerâmica ou metal duro adequado',
    refrigeracao: 'Conforme inserto',
    aplicacao: 'Matrizes, eixos tratados, pistas',
    obs: 'Exige máquina rígida, baixa profundidade e controle térmico.'
  },
  {
    id: 'cementedCarbide',
    nome: 'Metal sinterizado (WCCo)',
    grupo: 'Metal duro cimentado',
    dureza: '85–93 HRA',
    hss: 'Não aplicável',
    md: '15–40 (EDM/abrasão)',
    avanco: '0,01–0,05 (desbaste)',
    ferramenta: 'Diamante policristalino (PCD) ou rectificação',
    refrigeracao: 'Água ou emulsão',
    aplicacao: 'Insertos de corte, matrizes, punções, desaguadores',
    obs: 'Só brunir com diamante. Não usainar com metal convencional.'
  }
];

export default function MateriaisScreen({ navigation }) {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const s = getCasillasStyles(theme);
  const ls = getLocalStyles(theme);

  const [grupo, setGrupo] = useState('Todos');

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

    linhas.push(t('materiais.warning'));

    return linhas.join('\n');
  }

  const terminalText = [
    `${t('materiais.filter')}: ${t(GROUP_KEYS[grupo])}`,
    `${t('materiais.displayedCount')}: ${lista.length}`,
    ...lista.slice(0, 5).map((m) => `${m.nome}: Vc HSS ${m.hss}, MD ${m.md}`),
    lista.length > 5 ? `... +${lista.length - 5} ${t('materiais.displayedCount').toLowerCase()}` : '',
    `${t('materiais.warning')}`
  ].filter(Boolean).join('\n');

  return (
    <CasillasLayout
      navigation={navigation}
      activeRoute="Materiais"
      title={t('materiais.title')}
      subtitle={t('materiais.layoutSubtitle')}
      terminalText={terminalText}
      shareText={montarRelatorio()}
    >
      <View style={s.card}>
        <Text style={s.cardTitle}>{t('materiais.filter')}</Text>

        <View style={ls.optionWrap}>
          {GRUPOS.map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                s.btnTipo,
                grupo === item && s.btnTipoAtivo
              ]}
              onPress={() => setGrupo(item)}
            >
              <Text
                style={[
                  s.btnTipoText,
                  grupo === item && s.btnTipoTextAtivo
                ]}
              >
                {t(GROUP_KEYS[item])}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={s.card}>
        <Text style={s.cardTitle}>{t('materiais.title')}</Text>
        <Text style={s.txtGray}>{t('materiais.inputData')} — {t('materiais.material')}</Text>
      </View>

      {lista.map((item) => (
        <View key={item.id} style={s.card}>
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

          <View style={s.separator} />

          <Text style={s.txtGray}>{t('materiais.feed')}</Text>
          <Text style={s.txtWhite}>{item.avanco}</Text>

          <Text style={s.txtGray}>{t('materiais.tool')}</Text>
          <Text style={s.txtWhite}>{localizeMaterial(item, 'ferramenta')}</Text>

          <Text style={s.txtGray}>{t('materiais.cooling')}</Text>
          <Text style={s.txtWhite}>{localizeMaterial(item, 'refrigeracao')}</Text>

          <Text style={s.txtGray}>{t('materiais.application')}</Text>
          <Text style={s.txtWhite}>{localizeMaterial(item, 'aplicacao')}</Text>

          <View style={s.separator} />

          <Text style={s.txtGray}>{t('materiais.notes')}</Text>
          <Text style={s.txtMuted}>{localizeMaterial(item, 'obs')}</Text>
        </View>
      ))}
    </CasillasLayout>
  );
}

function getLocalStyles(theme) {
  return StyleSheet.create({
    optionWrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6
    }
  });
}
