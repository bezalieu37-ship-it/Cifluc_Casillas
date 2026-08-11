import React, { useMemo, useRef, useState, useEffect } from 'react';

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
  'Especial',
  'Outros'
];

const GROUP_KEYS = {
  Todos: 'materiais.groupAll',
  'Aço': 'materiais.groupSteel',
  Inox: 'materiais.groupStainless',
  Ferro: 'materiais.groupIron',
  'Alumínio': 'materiais.groupAluminum',
  'Cobre/Bronze': 'materiais.groupCopperBronze',
  'Polímero': 'materiais.groupPolymer',
  Especial: 'materiais.groupSpecial',
  Outros: 'materiais.groupOthers'
};

const MATERIAIS = [
  // ═══════════════════════════════════════════════════════════
  // AÇO CARBONO E LIGA
  // ═══════════════════════════════════════════════════════════
  { id: 'aco1010', nome: 'Aço 1010', grupo: 'Aço carbono baixo carbono', dureza: '95–130 HB', hss: '30–50', md: '100–180', avanco: '0,12–0,40 mm/volta', ferramenta: 'HSS afiado ou metal duro P10/P20', refrigeracao: 'Recomendado', aplicacao: 'Peças conformadas, parafusos, rebites, arames', obs: 'Material muito mole. Corte rápido, cuidado com rebarba.' },
  { id: 'aco1018', nome: 'Aço 1018', grupo: 'Aço carbono baixo carbono', dureza: '110–149 HB', hss: '28–45', md: '95–170', avanco: '0,10–0,38 mm/volta', ferramenta: 'HSS afiado ou metal duro P20/P25', refrigeracao: 'Recomendado', aplicacao: 'Eixos leves, parafusos, pinos, peças trefiladas', obs: 'Usinabilidade superior ao 1010. Boa soldabilidade.' },
  { id: 'aco1020', nome: 'Aço 1020', grupo: 'Aço carbono baixo carbono', dureza: '120–180 HB', hss: '25–40', md: '90–160', avanco: '0,10–0,35 mm/volta', ferramenta: 'HSS afiado ou metal duro P25/P35', refrigeracao: 'Recomendado', aplicacao: 'Eixos leves, buchas, bases, suportes', obs: 'Boa usinabilidade. Ideal para peças gerais e treinamento.' },
  { id: 'aco1045', nome: 'Aço 1045', grupo: 'Aço médio carbono', dureza: '170–220 HB', hss: '20–35', md: '80–140', avanco: '0,10–0,30 mm/volta', ferramenta: 'Metal duro P25/P35', refrigeracao: 'Recomendado', aplicacao: 'Eixos, pinos, engrenagens simples', obs: 'Maior resistência que 1020. Pode encruar se perder corte.' },
  { id: 'aco1050', nome: 'Aço 1050', grupo: 'Aço médio-alto carbono', dureza: '180–240 HB', hss: '18–30', md: '70–130', avanco: '0,08–0,28 mm/volta', ferramenta: 'Metal duro P30/P40', refrigeracao: 'Recomendado', aplicacao: 'Molas, facas, lâminas, ferramentas manuais', obs: 'Usinabilidade moderada. Use aresta reforçada.' },
  { id: 'aco4140', nome: 'Aço 4140', grupo: 'Aço liga Cr-Mo', dureza: '190–320 HB', hss: '15–28', md: '60–120', avanco: '0,08–0,25 mm/volta', ferramenta: 'Metal duro revestido P25/P35', refrigeracao: 'Recomendado', aplicacao: 'Eixos, moldes, peças de alta resistência', obs: 'Ajuste avanço conforme dureza real.' },
  { id: 'aco4340', nome: 'Aço 4340', grupo: 'Aço liga Ni-Cr-Mo', dureza: '210–350 HB', hss: '12–22', md: '50–100', avanco: '0,06–0,22 mm/volta', ferramenta: 'Metal duro revestido P30/P40', refrigeracao: 'Recomendado', aplicacao: 'Eixos de aviões, gearboxes, componentes estruturais críticos', obs: 'Excelente tenacidade. Evite mudanças bruscas de direção.' },
  { id: 'aco8620', nome: 'Aço 8620', grupo: 'Aço liga Ni-Cr case hardening', dureza: '140–200 HB (recozido)', hss: '22–35', md: '80–140', avanco: '0,10–0,30 mm/volta', ferramenta: 'HSS ou metal duro P20/P30', refrigeracao: 'Recomendado', aplicacao: 'Engrenagens cementadas, eixos, pinos', obs: 'Usinável antes do tratamento superficial. Cementação posterior.' },
  { id: 'aco5160', nome: 'Aço 5160', grupo: 'Aço liga Cr-mola', dureza: '190–280 HB', hss: '15–25', md: '60–110', avanco: '0,08–0,25 mm/volta', ferramenta: 'Metal duro P30/K20', refrigeracao: 'Recomendado', aplicacao: 'Molas de suspensão, laminadores, componentes de impacto', obs: 'Alta resistência à fadiga. Trabalhe recozido quando possível.' },
  { id: 'aco12L14', nome: 'Aço 12L14 (usinagem fácil)', grupo: 'Aço carbono free machining', dureza: '130–180 HB', hss: '35–60', md: '110–200', avanco: '0,12–0,45 mm/volta', ferramenta: 'HSS ou metal duro', refrigeracao: 'Opcional', aplicacao: 'Parafusos, terminais, peças de precisão automática', obs: 'Melhor usinabilidade dos aços ao carbono. Aditivo de chumbo.' },
  { id: 'aco1212', nome: 'Aço 1212', grupo: 'Aço carbono free machining', dureza: '120–170 HB', hss: '35–55', md: '100–190', avanco: '0,12–0,42 mm/volta', ferramenta: 'HSS ou metal duro', refrigeracao: 'Opcional', aplicacao: 'Parafusos, pinos, buchas, peças de torno automático', obs: 'Similar ao 12L14 sem chumbo. Cavaco curto e limpo.' },
  { id: 'acoP20', nome: 'Aço P20 (moldes injeção)', grupo: 'Aço para moldes', dureza: '280–330 HB (pré-endurecido)', hss: '10–18', md: '40–80', avanco: '0,06–0,20 mm/volta', ferramenta: 'Metal duro P30/P40 ou CBN', refrigeracao: 'Recomendado', aplicacao: 'Moldes de injeção de plásticos, matrizes de baixo volume', obs: 'Pré-endurecido e polido. Evite rebarba e marcas de ferramenta.' },
  { id: 'acoDIN12714', nome: 'Aço DIN 1.2714', grupo: 'Aço para matrizes forjamento', dureza: '230–280 HB (recozido)', hss: '8–15', md: '35–70', avanco: '0,05–0,18 mm/volta', ferramenta: 'Metal duro revestido ou CBN', refrigeracao: 'Recomendado', aplicacao: 'Matrizes de forjamento, punções de impacto, extrusão', obs: 'Liga Ni-Cr-Mo-V. Alta tenacidade ao choque.' },

  // ═══════════════════════════════════════════════════════════
  // AÇO INOX
  // ═══════════════════════════════════════════════════════════
  { id: 'inox303', nome: 'Inox 303', grupo: 'Aço inox austenítico free machining', dureza: '150–200 HB', hss: '12–25', md: '50–100', avanco: '0,10–0,28 mm/volta', ferramenta: 'Metal duro M15/M25 com aresta positiva', refrigeracao: 'Muito recomendado', aplicacao: 'Parafusos, buchas, eixos de precisão, peças automotivas', obs: 'Versão de usinagem fácil do 304. Enxofre melhora cavaco.' },
  { id: 'inox304', nome: 'Inox 304', grupo: 'Aço inox austenítico', dureza: '150–200 HB', hss: '10–22', md: '45–95', avanco: '0,08–0,25 mm/volta', ferramenta: 'Metal duro M15/M25 com aresta positiva', refrigeracao: 'Muito recomendado', aplicacao: 'Eixos inox, flanges, indústria alimentícia', obs: 'Material tende a encruar. Evite esfregar sem corte.' },
  { id: 'inox304L', nome: 'Inox 304L', grupo: 'Aço inox austenítico baixo carbono', dureza: '150–200 HB', hss: '9–20', md: '40–90', avanco: '0,08–0,24 mm/volta', ferramenta: 'Metal duro M15/M25', refrigeracao: 'Muito recomendado', aplicacao: 'Soldagem, tanques químicos, indústria alimentícia', obs: 'Baixo carbono evita sensitização pós-solda. Levemente mais mole que 304.' },
  { id: 'inox316', nome: 'Inox 316', grupo: 'Aço inox austenítico', dureza: '150–220 HB', hss: '8–20', md: '35–85', avanco: '0,08–0,22 mm/volta', ferramenta: 'Metal duro M15/M25', refrigeracao: 'Muito recomendado', aplicacao: 'Peças químicas, marítimas, corrosão severa', obs: 'Mais difícil que 304. Controle calor e avanço consistente.' },
  { id: 'inox316L', nome: 'Inox 316L', grupo: 'Aço inox austenítico baixo carbono', dureza: '150–210 HB', hss: '8–18', md: '35–80', avanco: '0,07–0,20 mm/volta', ferramenta: 'Metal duro M15/M25', refrigeracao: 'Muito recomendado', aplicacao: 'Implantes médicos, equipamentos farmacêuticos', obs: 'Variante baixo carbono do 316. Melhor resistência pós-solda.' },
  { id: 'inox410', nome: 'Inox 410', grupo: 'Aço inox martensítico', dureza: '150–200 HB (recozido)', hss: '15–28', md: '55–110', avanco: '0,08–0,25 mm/volta', ferramenta: 'Metal duro M20/M30', refrigeracao: 'Recomendado', aplicacao: 'Válvulas, bombas, componentes de turbinas', obs: 'Endurecível por calor. Melhor usinabilidade no recozido.' },
  { id: 'inox420', nome: 'Inox 420', grupo: 'Aço inox martensítico', dureza: '170–220 HB (recozido)', hss: '14–25', md: '50–100', avanco: '0,08–0,22 mm/volta', ferramenta: 'Metal duro M20/M30', refrigeracao: 'Recomendado', aplicacao: 'Lâminas, facas, instrumentos cirúrgicos, moldes', obs: 'Teor de carbono maior que 410. Dureza até 50 HRC temperado.' },
  { id: 'inox430', nome: 'Inox 430', grupo: 'Aço inox ferrítico', dureza: '140–185 HB', hss: '15–30', md: '60–120', avanco: '0,10–0,28 mm/volta', ferramenta: 'Metal duro M20/M25', refrigeracao: 'Recomendado', aplicacao: 'Eletrodomésticos, painéis decorativos, utensílios', obs: 'Usinabilidade boa. Não endurece por calor. Evite temperaturas >400°C.' },
  { id: 'inox440C', nome: 'Inox 440C', grupo: 'Aço inox martensítico alto carbono', dureza: '230–280 HB (recozido)', hss: '10–18', md: '35–75', avanco: '0,05–0,18 mm/volta', ferramenta: 'Metal duro ou CBN', refrigeracao: 'Muito recomendado', aplicacao: 'Rolamentos, lâminas de alta performance, componentes de precisão', obs: 'Alta dureza (até 60 HRC). Difícil usinagem no estado temperado.' },
  { id: 'inox174ph', nome: 'Inox 17-4 PH', grupo: 'Aço inox precipitação endurecido', dureza: '280–380 HB (H900)', hss: '8–15', md: '30–70', avanco: '0,05–0,18 mm/volta', ferramenta: 'Metal duro M10/M20 ou CBN', refrigeracao: 'Muito recomendado', aplicacao: 'Aeronáutica, petróleo, componentes de alta resistência', obs: 'Alta resistência. Usine recozido, endureça por precipitação depois.' },

  // ═══════════════════════════════════════════════════════════
  // FERRO FUNDIDO
  // ═══════════════════════════════════════════════════════════
  { id: 'ferroCinzento', nome: 'Ferro fundido cinzento (ASTM A48 / DIN GG20-GG25)', grupo: 'Ferro fundido cinzento', dureza: '160–260 HB', hss: '18–30', md: '80–180', avanco: '0,12–0,40 mm/volta', ferramenta: 'Metal duro K10/K20', refrigeracao: 'Geralmente seco', aplicacao: 'Carcaças, bases, blocos de motor, polias, tampas', obs: 'Produz pó abrasivo. Proteja guias e mantenha limpeza da máquina.' },
  { id: 'ferroNodular', nome: 'Ferro fundido nodular (ASTM A536 / DIN GGG40-GGG50)', grupo: 'Ferro fundido nodular', dureza: '170–280 HB', hss: '15–28', md: '70–150', avanco: '0,10–0,35 mm/volta', ferramenta: 'Metal duro K20/K30', refrigeracao: 'Seco ou mínima lubrificação', aplicacao: 'Virabrequins, engrenagens, suportes, mancais pesados', obs: 'Mais resistente e dúctil que o cinzento. Exige aresta robusta.' },
  { id: 'ferroMaleavel', nome: 'Ferro fundido maleável (ASTM A47)', grupo: 'Ferro fundido maleável', dureza: '130–200 HB', hss: '20–35', md: '80–160', avanco: '0,12–0,38 mm/volta', ferramenta: 'Metal duro K10/K20', refrigeracao: 'Seco ou com ar comprimido', aplicacao: 'Conexões hidráulicas, tampas, suportes automotivos, brinquedos industriais', obs: 'Melhor ductilidade que cinzento. Boa usinabilidade com aresta negativa.' },
  { id: 'ferroBranco', nome: 'Ferro fundido branco', grupo: 'Ferro fundido branco', dureza: '350–600 HB', hss: 'Não recomendado', md: '15–40', avanco: '0,03–0,12 mm/volta', ferramenta: 'Metal duro cerâmico ou CBN', refrigeracao: 'Seco com ar comprimido', aplicacao: 'Rolamentos de rolos, chapas de desgaste, moinhos', obs: 'Extremamente duro e frágil. Só brunir ou rectificar.' },
  { id: 'ferroGusa', nome: 'Ferro gusa (bruto de fusão)', grupo: 'Ferro bruto', dureza: '100–180 HB', hss: '18–30', md: '70–150', avanco: '0,10–0,35 mm/volta', ferramenta: 'Metal duro K10/K20', refrigeracao: 'Geralmente seco', aplicacao: 'Lingotes, peças fundidas brutas, base para refino', obs: 'Material bruto com impurezas. Cuidado com arestas e cascas.' },

  // ═══════════════════════════════════════════════════════════
  // ALUMÍNIO
  // ═══════════════════════════════════════════════════════════
  { id: 'aluminum2024', nome: 'Alumínio 2024', grupo: 'Liga de alumínio aeronáutico', dureza: '120–150 HB', hss: '70–140', md: '200–450', avanco: '0,08–0,35 mm/volta', ferramenta: 'Metal duro para alumínio', refrigeracao: 'Recomendado', aplicacao: 'Estruturas aeronáuticas, vigas, skins de aeronaves', obs: 'Alta resistência, menor usinabilidade que 6061. Evite vibração.' },
  { id: 'aluminum3003', nome: 'Alumínio 3003', grupo: 'Liga de alumínio manganeso', dureza: '40–55 HB', hss: '100–220', md: '300–650', avanco: '0,12–0,55 mm/volta', ferramenta: 'HSS polido ou metal duro', refrigeracao: 'Recomendado', aplicacao: 'Tanques, condensadores, trefilação, chapas soldáveis', obs: 'Boa formabilidade e resistência à corrosão. Acabamento superficial fácil.' },
  { id: 'aluminum5052', nome: 'Alumínio 5052', grupo: 'Liga de alumínio marítimo', dureza: '60–80 HB', hss: '100–200', md: '300–650', avanco: '0,12–0,50 mm/volta', ferramenta: 'HSS polido ou metal duro para alumínio', refrigeracao: 'Recomendado para acabamento', aplicacao: 'Chapas navais, tanques de combustível, painéis decorativos', obs: 'Boa conformabilidade e resistência à corrosão marinha.' },
  { id: 'aluminum6061', nome: 'Alumínio 6061', grupo: 'Liga de alumínio estrutural', dureza: '80–100 HB', hss: '80–180', md: '250–600', avanco: '0,10–0,50 mm/volta', ferramenta: 'HSS polido ou metal duro para alumínio', refrigeracao: 'Recomendado para acabamento', aplicacao: 'Estruturas, suportes, peças leves, moldes', obs: 'Usinabilidade padrão da indústria. Boa referência para novos operadores.' },
  { id: 'aluminum6063', nome: 'Alumínio 6063', grupo: 'Liga de alumínio extrusão', dureza: '60–85 HB', hss: '100–220', md: '300–700', avanco: '0,12–0,55 mm/volta', ferramenta: 'HSS polido ou metal duro', refrigeracao: 'Recomendado', aplicacao: 'Perfis estruturais, janelas, portas, esquadrias', obs: 'Melhor acabamento superficial que 6061. Ideal para perfis extrudados.' },
  { id: 'aluminum7075', nome: 'Alumínio 7075', grupo: 'Liga de alumínio ultra alta resistência', dureza: '130–170 HB', hss: '70–150', md: '200–500', avanco: '0,08–0,40 mm/volta', ferramenta: 'Metal duro polido para alumínio', refrigeracao: 'Recomendado', aplicacao: 'Peças aeronáuticas, moldes, componentes de competição', obs: 'Maior resistência da série 7xxx. Exige fixação rígida.' },

  // ═══════════════════════════════════════════════════════════
  // COBRE, LATÃO E BRONZE
  // ═══════════════════════════════════════════════════════════
  { id: 'cobreC11000', nome: 'Cobre C11000 (ETP)', grupo: 'Cobre eletrolítico puro', dureza: '40–80 HB', hss: '25–60', md: '80–180', avanco: '0,05–0,25 mm/volta', ferramenta: 'Aresta afiada e positiva', refrigeracao: 'Recomendado', aplicacao: 'Barramentos, eletrodos, condutores elétricos, fitas', obs: 'Pureza 99,9%. Material dúctil. Cuidado com empastamento.' },
  { id: 'cobreC10100', nome: 'Cobre C10100 (OFHC)', grupo: 'Cobre livre de oxigênio', dureza: '35–75 HB', hss: '28–65', md: '90–200', avanco: '0,05–0,22 mm/volta', ferramenta: 'Aresta muito afiada e positiva', refrigeracao: 'Recomendado', aplicacao: 'Eletrodos de soldagem,组件es de vácuo, componentes eletrônicos de precisão', obs: 'Pureza 99,99%. Eliminação de oxigênio evita fragilidade pós-solda.' },
  { id: 'lataoC36000', nome: 'Latão C36000 (free cutting)', grupo: 'Liga cobre-zinco free machining', dureza: '65–100 HB', hss: '70–140', md: '180–350', avanco: '0,10–0,40 mm/volta', ferramenta: 'HSS ou metal duro', refrigeracao: 'Opcional', aplicacao: 'Parafusos, terminais, conexões, peças de torno automático', obs: 'Melhor usinabilidade dos latões. Aditivo de chumbo melhora cavaco.' },
  { id: 'lataoC46400', nome: 'Latão C46400 (naval)', grupo: 'Liga cobre-zinco naval', dureza: '80–150 HB', hss: '40–80', md: '120–250', avanco: '0,08–0,30 mm/volta', ferramenta: 'HSS afiado ou metal duro', refrigeracao: 'Recomendado', aplicacao: 'Hélices, componentes navais, válvulas, condensadores', obs: 'Alta resistência à corrosão marinha. Melhor que latão comum em ambiente salgado.' },
  { id: 'bronzeC93200', nome: 'Bronze C93200 (SAE 660)', grupo: 'Bronze de estanho para mancal', dureza: '65–95 HB', hss: '35–70', md: '100–220', avanco: '0,08–0,30 mm/volta', ferramenta: 'HSS ou metal duro K10', refrigeracao: 'Opcional', aplicacao: 'Buchas, mancais, guias deslizantes, bronzinas', obs: 'Bom acabamento e resistência ao desgaste. Controle vibração.' },
  { id: 'bronzeC95400', nome: 'Bronze C95400 (de alumínio)', grupo: 'Bronze de alumínio', dureza: '150–250 HB', hss: '20–45', md: '60–140', avanco: '0,06–0,22 mm/volta', ferramenta: 'Metal duro K10/P10', refrigeracao: 'Recomendado', aplicacao: 'Engrenagens, hélices, mancais pesados, válvulas industriais', obs: 'Alta resistência e desgaste. Abrasivo — aresta reforçada obrigatória.' },
  { id: 'bronzeC86300', nome: 'Bronze C86300 (de manganês)', grupo: 'Bronze de manganês', dureza: '170–250 HB', hss: '15–35', md: '50–110', avanco: '0,05–0,18 mm/volta', ferramenta: 'Metal duro P20/K20', refrigeracao: 'Recomendado', aplicacao: 'Engrenagens pesadas, hélices navais, componentes de mineração', obs: 'Alta resistência mecânica e ao desgaste em ambientes pesados.' },
  { id: 'cobreBeC17200', nome: 'Cobre-Berílio C17200', grupo: 'Liga cobre-berílio', dureza: '200–400 HB (AGE)', hss: '15–35', md: '50–120', avanco: '0,05–0,18 mm/volta', ferramenta: 'Metal duro afiado', refrigeracao: 'Muito recomendado', aplicacao: 'Molas de precisão, contactos elétricos, moldes para plásticos', obs: 'Tóxico em pó. Use extração de cavaco. Excelente elasticidade e condutividade.' },

  // ═══════════════════════════════════════════════════════════
  // POLÍMEROS E PLÁSTICOS TÉCNICOS
  // ═══════════════════════════════════════════════════════════
  { id: 'pp', nome: 'Polipropileno (PP)', grupo: 'Poliolefina commodity', dureza: 'Shore D 70–80', hss: '100–250', md: '200–500', avanco: '0,12–0,50 mm/volta', ferramenta: 'HSS muito afiado', refrigeracao: 'Ar ou seco', aplicacao: 'Recipientes, tampas, peças de laboratório, protótipos', obs: 'Material leve e quimicamente resistente. Funde facilmente — controle calor.' },
  { id: 'pe', nome: 'Polietileno (PE)', grupo: 'Poliolefina commodity', dureza: 'Shore D 50–70', hss: '100–300', md: '200–600', avanco: '0,15–0,60 mm/volta', ferramenta: 'HSS muito afiado', refrigeracao: 'Ar ou seco', aplicacao: 'Tanques, tubulações, peças de laboratório, isolantes', obs: 'Material mole e flexível. Deixe sobremetal para encolhimento posterior.' },
  { id: 'pvc', nome: 'PVC rígido', grupo: 'Policloreto de vinila', dureza: 'Shore D 75–85', hss: '80–200', md: '150–350', avanco: '0,10–0,40 mm/volta', ferramenta: 'HSS ou metal duro afiado', refrigeracao: 'Ar ou seco', aplicacao: 'Tubulações, conexões, perfis, isolantes elétricos', obs: 'Material rígido e frágil. Evite vibração e calor excessivo.' },
  { id: 'pet', nome: 'PET', grupo: 'Poliéster termoplástico', dureza: 'Shore D 80–85', hss: '60–150', md: '120–300', avanco: '0,08–0,35 mm/volta', ferramenta: 'HSS ou metal duro afiado', refrigeracao: 'Ar comprimido', aplicacao: 'Engrenagens, componentes elétricos, peças estruturais', obs: 'Boa resistência mecânica e química. Higroscópico — seque antes de usinar.' },
  { id: 'pom', nome: 'POM / Acetal (Delrin)', grupo: 'Polímero técnico', dureza: 'R115–R120', hss: '100–250', md: '180–450', avanco: '0,10–0,45 mm/volta', ferramenta: 'HSS ou metal duro afiado', refrigeracao: 'Ar ou seco', aplicacao: 'Engrenagens plásticas, buchas, peças de precisão, clips', obs: 'Boa estabilidade dimensional e ótimo acabamento superficial.' },
  { id: 'pa6', nome: 'Poliamida PA6 (Nylon 6)', grupo: 'Poliamida técnica', dureza: 'R100–R120', hss: '80–200', md: '150–400', avanco: '0,10–0,50 mm/volta', ferramenta: 'HSS muito afiado', refrigeracao: 'Ar ou seco', aplicacao: 'Buchas, roldanas, guias, engrenagens, encaixes', obs: 'Higroscópico — estabilize antes de usinar. Deixe sobremetal.' },
  { id: 'pa66', nome: 'Poliamida PA66 (Nylon 66)', grupo: 'Poliamida técnica reforçada', dureza: 'R105–R120', hss: '70–170', md: '130–350', avanco: '0,08–0,40 mm/volta', ferramenta: 'HSS muito afiado ou metal duro', refrigeracao: 'Ar ou seco', aplicacao: 'Engrenagens estruturais, suportes, componentes automotivos', obs: 'Maior resistência que PA6. Versões com GF são abrasivas.' },
  { id: 'peek', nome: 'PEEK', grupo: 'Polímero de alta performance', dureza: 'R120–R130', hss: '80–200', md: '150–350', avanco: '0,06–0,30 mm/volta', ferramenta: 'HSS ou metal duro afiado', refrigeracao: 'Ar comprimido ou seco', aplicacao: 'Implantes médicos, componentes aeroespaciais, vedações de alta pressão', obs: 'Polímero mais resistente. Caríssimo — otimize cada passe.' },
  { id: 'ptfe', nome: 'PTFE (Teflon)', grupo: 'Fluoropolímero', dureza: 'Shore D 50–65', hss: '30–80', md: '50–150', avanco: '0,15–0,60 mm/volta', ferramenta: 'HSS muito afiado ou cerâmica', refrigeracao: 'Ar ou seco', aplicacao: 'Vedações, anéis de retorno, guias anti-adesão, bushings', obs: 'Material muito mole e frágil. Velocidade alta e avanço leve.' },
  { id: 'pc', nome: 'Policarbonato (PC)', grupo: 'Poliéster termoplástico', dureza: 'Shore D 80–88', hss: '60–140', md: '120–280', avanco: '0,06–0,30 mm/volta', ferramenta: 'HSS ou metal duro afiado', refrigeracao: 'Ar comprimido', aplicacao: 'Lentes, carenagens, painéis de controle, dispositivos ópticos', obs: 'Alta transparência e resistência ao impacto. Evite estresse pós-usinagem.' },
  { id: 'abs', nome: 'ABS', grupo: 'Copolímero estireno-acrilonitrila', dureza: 'Shore D 80–90', hss: '80–200', md: '150–350', avanco: '0,10–0,45 mm/volta', ferramenta: 'HSS afiado', refrigeracao: 'Ar ou seco', aplicacao: 'Protótipos, peças eletrôlicas, carcaças, brinquedos', obs: 'Material de prototipagem rápido. Fácil de usinar e pintar.' },
  { id: 'pmma', nome: 'PMMA (Acrílico)', grupo: 'Polimetil metacrilato', dureza: 'Shore D 85–90', hss: '40–100', md: '80–200', avanco: '0,05–0,25 mm/volta', ferramenta: 'HSS ou cerâmica afiada', refrigeracao: 'Ar comprimido', aplicacao: 'Lentes, displays, iluminação, vitrines, sinalização', obs: 'Frágil e lascante. Use geometria positiva e avanço constante.' },
  { id: 'pf', nome: 'Resina Fenólica (PF) - Bakelite/Celeron/Micarta', grupo: 'Resina termofígrafo', dureza: 'Rockwell M100–M120', hss: '30–60', md: '50–120', avanco: '0,05–0,20 mm/volta', ferramenta: 'Metal duro ou cerâmica', refrigeracao: 'Ar comprimido', aplicacao: 'Isolantes elétricos, peças estruturais, engrenagens leves, laminados', obs: 'Material frágil e abrasivo. Use máscara — poço irritante para pele e vias respiratórias.' },
  { id: 'ep', nome: 'Resina Epóxi (EP)', grupo: 'Resina termofígrafo', dureza: 'Rockwell M80–M120', hss: '30–70', md: '50–130', avanco: '0,05–0,20 mm/volta', ferramenta: 'Metal duro ou cerâmica', refrigeracao: 'Ar comprimido', aplicacao: 'Moldes, compósitos, chapas de circuito, adesivos estruturais', obs: 'Difícil usinagem. Use ferramenta afiada e velocidade moderada.' },
  { id: 'pu', nome: 'Poliuretano (PU)', grupo: 'Elastômero termoplástico', dureza: 'Shore A 60–Shore D 75', hss: '50–150', md: '100–300', avanco: '0,08–0,35 mm/volta', ferramenta: 'HSS muito afiado', refrigeracao: 'Ar ou seco', aplicacao: 'Rodízios, rolamentos, vedacoes, amortecedores, rodas industriais', obs: 'Material flexível e elástico. Use apoio para evitar deformação durante corte.' },

  // ═══════════════════════════════════════════════════════════
  // MATERIAIS ESPECIAIS E SUPERLIGAS
  // ═══════════════════════════════════════════════════════════
  { id: 'titanioG2', nome: 'Titânio Grade 2 (puro)', grupo: 'Titânio comercialmente puro', dureza: '170–220 HB', hss: '10–20', md: '40–80', avanco: '0,08–0,22 mm/volta', ferramenta: 'Metal duro ou cerâmica', refrigeracao: 'Alta pressão', aplicacao: 'Trocaadores de calor, condensadores, equipamentos químicos', obs: 'Mais mole que Ti-6Al-4V, mas ainda exige controle térmico rigoroso.' },
  { id: 'titanioG5', nome: 'Titânio Grade 5 (Ti-6Al-4V)', grupo: 'Liga de titânio alfa-beta', dureza: '300–360 HB', hss: '5–12', md: '25–60', avanco: '0,05–0,18 mm/volta', ferramenta: 'Metal duro específico para titânio', refrigeracao: 'Alta pressão recomendada', aplicacao: 'Aeronáutica, médico (implantes), alta resistência', obs: 'Baixa condutividade térmica. Evite calor e vibração.' },
  { id: 'inconel600', nome: 'Inconel 600', grupo: 'Superliga base níquel-cromo', dureza: '200–280 HB', hss: '5–12', md: '18–45', avanco: '0,04–0,15 mm/volta', ferramenta: 'Cerâmica, CBN ou metal duro P40', refrigeracao: 'Alta pressão obrigatória', aplicacao: 'Fornos, trocadores de calor, componentes nucleares', obs: 'Trabalha em frio intenso. Use aresta negativa e velocidade baixa.' },
  { id: 'inconel625', nome: 'Inconel 625', grupo: 'Superliga base níquel-molibdênio', dureza: '250–350 HB', hss: '4–10', md: '15–40', avanco: '0,04–0,14 mm/volta', ferramenta: 'Cerâmica ou CBN', refrigeracao: 'Alta pressão obrigatória', aplicacao: 'Equipamentos marinhos, reactores químicos, soldagem subaquática', obs: 'Alta resistência à corrosão e calor. Velocidade de corte baixíssima.' },
  { id: 'inconel718', nome: 'Inconel 718', grupo: 'Superliga base níquel precipitação', dureza: '320–400 HB (solução tratado)', hss: '3–8', md: '12–35', avanco: '0,03–0,12 mm/volta', ferramenta: 'Cerâmica, CBN ou metal duro revestido P40', refrigeracao: 'Alta pressão obrigatória', aplicacao: 'Turbinas a jato, componentes de foguetes, poços de petróleo', obs: 'Extremamente difícil de usinar. Trabalho em frio se intensifica rápido.' },
  { id: 'hastelloyC276', nome: 'Hastelloy C-276', grupo: 'Superliga níquel-molibdênio-cromo', dureza: '200–280 HB', hss: '3–8', md: '10–30', avanco: '0,03–0,10 mm/volta', ferramenta: 'Cerâmica ou CBN', refrigeracao: 'Alta pressão obrigatória', aplicacao: 'Processamento químico, farmacêutico, poluição ambiental', obs: 'Uma das ligas mais difíceis de usinar. Priorize fresamento.' },
  { id: 'hastelloyC22', nome: 'Hastelloy C-22', grupo: 'Superliga níquel-cromo-molibdênio', dureza: '200–270 HB', hss: '4–10', md: '12–35', avanco: '0,04–0,12 mm/volta', ferramenta: 'Cerâmica ou CBN', refrigeracao: 'Alta pressão obrigatória', aplicacao: 'Reatores químicos, equipamentos de processamento, condensadores', obs: 'Melhor resistência à corrosão oxidante que C-276.' },
  { id: 'monel400', nome: 'Monel 400', grupo: 'Liga níquel-cobre', dureza: '140–200 HB', hss: '8–18', md: '30–65', avanco: '0,05–0,18 mm/volta', ferramenta: 'Metal duro P30/K20 ou cerâmica', refrigeracao: 'Alta pressão recomendada', aplicacao: 'Equipamentos marinhos, tanques de ácido, válvulas de óleo/gás', obs: 'Trabalha em frio rapidamente. Use aresta negativa e baixa velocidade.' },
  { id: 'monelK500', nome: 'Monel K-500', grupo: 'Liga níquel-cobre precipitação', dureza: '250–350 HB (AGE)', hss: '5–12', md: '20–45', avanco: '0,04–0,14 mm/volta', ferramenta: 'Metal duro P40 ou cerâmica', refrigeracao: 'Alta pressão obrigatória', aplicacao: 'Eixos de bombas submarinas, hélices, equipamentos de poços', obs: 'Versão endurecida do Monel 400. Mais difícil e abrasivo.' },
  { id: 'incoloy800ht', nome: 'Incoloy 800HT', grupo: 'Superliga níquel-cromo-ferro', dureza: '180–250 HB', hss: '5–12', md: '18–45', avanco: '0,04–0,15 mm/volta', ferramenta: 'Cerâmica ou CBN', refrigeracao: 'Alta pressão', aplicacao: 'Fornos industriais, trocadores de calor, tubulações de vapor', obs: 'Resistente a altas temperaturas (sustentado a 815°C). Trabalha em frio.' },
  { id: 'zirconio', nome: 'Zircônio', grupo: 'Metal reativo', dureza: '150–200 HB', hss: '10–20', md: '30–65', avanco: '0,06–0,20 mm/volta', ferramenta: 'Metal duro ou cerâmica afiada', refrigeracao: 'Alta pressão', aplicacao: 'Reatores nucleares, implantes médicos, equipamentos químicos', obs: 'Pirofórico em pó. Extração de cavaco obrigatoria. Evite contato com água.' },
  { id: 'tantalio', nome: 'Tântalo', grupo: 'Metal reativo', dureza: '200–280 HB', hss: '5–12', md: '15–40', avanco: '0,03–0,12 mm/volta', ferramenta: 'Metal duro ou cerâmica', refrigeracao: 'Alta pressão', aplicacao: 'Capacitores, implantes, equipamentos químicos, trocadores', obs: 'Extremamente denso e resistente à corrosão. Material caríssimo.' },
  { id: 'niobio', nome: 'Nióbio', grupo: 'Metal reativo', dureza: '120–180 HB', hss: '12–25', md: '35–75', avanco: '0,06–0,22 mm/volta', ferramenta: 'Metal duro afiado', refrigeracao: 'Recomendado', aplicacao: 'Supercondutores, motores a jato, equipamentos nucleares', obs: 'Reativo a oxigênio em altas temperaturas. Use proteção inerte.' },

  // ═══════════════════════════════════════════════════════════
  // OUTROS (CERÂMICAS, COMPÓSITOS, MADEIRAS, BORRACHA)
  // ═══════════════════════════════════════════════════════════
  { id: 'alumina', nome: 'Alumina (Al₂O₃)', grupo: 'Cerâmica técnica', dureza: '1500–2000 HV', hss: 'Não aplicável', md: 'Não aplicável', avanco: 'Rectificação', ferramenta: 'Diamante policristalino (PCD) ou rectificação com diamante', refrigeracao: 'Água ou emulsão', aplicacao: 'Isolantes, substratos eletrônicos, componentes refratários, rolamentos', obs: 'Extremamente dura e frágil. Só brunir/rectificar com diamante.' },
  { id: 'zirconia', nome: 'Zircônia (ZrO₂)', grupo: 'Cerâmica técnica', dureza: '1200–1400 HV', hss: 'Não aplicável', md: 'Não aplicável', avanco: 'Rectificação', ferramenta: 'Diamante policristalino (PCD)', refrigeracao: 'Água', aplicacao: 'Próteses dentárias, isolantes térmicos, componentes de alta temperatura', obs: 'Ductilidade superior à alumina para cerâmica. Diamante obrigatório.' },
  { id: 'sic', nome: 'Carboneto de Silício (SiC)', grupo: 'Cerâmica ultra-dura', dureza: '2400–2800 HV', hss: 'Não aplicável', md: 'Não aplicável', avanco: 'Rectificação', ferramenta: 'Diamante policristalino (PCD)', refrigeracao: 'Água', aplicacao: 'Fornos, componentes semicondutores, selos mecânicos, abrasivos', obs: 'Uma das cerâmicas mais duras. Apenas diamante consegue brunir.' },
  { id: 'compCF', nome: 'Compósito de Fibra de Carbono (CFRP)', grupo: 'Compósito avançado', dureza: 'Variável', hss: '40–100', md: '80–200', avanco: '0,05–0,25 mm/volta', ferramenta: 'PCD ou diamante revestido', refrigeracao: 'Ar comprimido ou aspiração', aplicacao: 'Aeronáutica, automotivo, esportes, estruturas leves', obs: 'Abrasive e delamina fácil. Use geometria positiva e velocidade alta.' },
  { id: 'compGF', nome: 'Compósito de Fibra de Vidro (GFRP)', grupo: 'Compósito reforçado', dureza: 'Variável', hss: '30–80', md: '60–150', avanco: '0,05–0,20 mm/volta', ferramenta: 'Diamante ou cerâmica', refrigeracao: 'Água ou aspiração', aplicacao: 'Tubulações, peças elétricas, carenagens, painéis', obs: 'Extremamente abrasivo. Proteja vias respiratórias e extraia poeira.' },
  { id: 'madeira', nome: 'Madeiras (em geral)', grupo: 'Material orgânico', dureza: 'Variável (0,5–8 MPa)', hss: '100–300', md: '200–800', avanco: '0,20–1,00 mm/volta', ferramenta: 'HSS, metal duro ou carbeto de tungstênio', refrigeracao: 'Ar (não use água)', aplicacao: 'Marcenaria, moldes, protótipos, acabamentos, móveis', obs: 'Material heterogêneo. Ajuste conforme dureza e direção das fibras.' },
  { id: 'borracha', nome: 'Borracha natural', grupo: 'Elastômero natural', dureza: 'Shore A 30–80', hss: '30–80', md: '50–150', avanco: '0,10–0,40 mm/volta', ferramenta: 'HSS muito afiado ou lâmina', refrigeracao: 'Ar ou seco', aplicacao: 'Vedação, tambores, rodízios, isolantes vibratórios, modelos', obs: 'Material elástico e deformável. Use fixação rígida e corte rápido.' }
];

export default function MateriaisScreen({ navigation }) {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const s = getCasillasStyles(theme);
  const ls = getLocalStyles(theme);

  const [grupo, setGrupo] = useState('Todos');
  const scrollRef = useRef(null);

  // Scroll to top when filter changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ y: 0, animated: true });
    }
  }, [grupo]);

  function localizeMaterial(item, field) {
    const key = `materiaisDb.${item.id}.${field}`;
    const translated = t(key);
    return translated === key ? item[field] : translated;
  }

  const lista = useMemo(() => {
    if (grupo === 'Todos') return MATERIAIS;

    if (grupo === 'Aço') {
      return MATERIAIS.filter((m) =>
        m.grupo.toLowerCase().includes('aço') ||
        m.grupo.toLowerCase().includes('aco') ||
        m.grupo.toLowerCase().includes('liga') ||
        m.grupo.toLowerCase().includes('mola') ||
        m.grupo.toLowerCase().includes('free machining') ||
        m.grupo.toLowerCase().includes('moldes') ||
        m.grupo.toLowerCase().includes('forjamento') ||
        m.grupo.toLowerCase().includes('endurecid')
      );
    }

    if (grupo === 'Inox') {
      return MATERIAIS.filter((m) => m.grupo.toLowerCase().includes('inox'));
    }

    if (grupo === 'Ferro') {
      return MATERIAIS.filter((m) => m.grupo.toLowerCase().includes('ferro'));
    }

    if (grupo === 'Alumínio') {
      return MATERIAIS.filter((m) => m.grupo.toLowerCase().includes('alumíni') || m.grupo.toLowerCase().includes('alumini'));
    }

    if (grupo === 'Cobre/Bronze') {
      return MATERIAIS.filter((m) =>
        m.grupo.toLowerCase().includes('cobre') ||
        m.grupo.toLowerCase().includes('latão') ||
        m.grupo.toLowerCase().includes('bronze') ||
        m.grupo.toLowerCase().includes('cobr')
      );
    }

    if (grupo === 'Polímero') {
      return MATERIAIS.filter((m) =>
        m.grupo.toLowerCase().includes('poli') ||
        m.grupo.toLowerCase().includes('poliamida') ||
        m.grupo.toLowerCase().includes('pvc') ||
        m.grupo.toLowerCase().includes('acetal') ||
        m.grupo.toLowerCase().includes('fluor') ||
        m.grupo.toLowerCase().includes('resina') ||
        m.grupo.toLowerCase().includes('elastômero') ||
        m.grupo.toLowerCase().includes('acrílico') ||
        m.grupo.toLowerCase().includes('estireno')
      );
    }

    if (grupo === 'Especial') {
      return MATERIAIS.filter((m) =>
        m.grupo.toLowerCase().includes('titânio') ||
        m.grupo.toLowerCase().includes('superliga') ||
        m.grupo.toLowerCase().includes('níquel') ||
        m.grupo.toLowerCase().includes('metal reativo') ||
        m.nome.includes('Inconel') ||
        m.nome.includes('Hastelloy') ||
        m.nome.includes('Monel') ||
        m.nome.includes('Incoloy') ||
        m.nome.includes('Zircônio') ||
        m.nome.includes('Tântalo') ||
        m.nome.includes('Nióbio')
      );
    }

    if (grupo === 'Outros') {
      return MATERIAIS.filter((m) =>
        m.grupo.toLowerCase().includes('cerâmica') ||
        m.grupo.toLowerCase().includes('compósito') ||
        m.grupo.toLowerCase().includes('orgânico') ||
        m.grupo.toLowerCase().includes('madeira') ||
        m.nome.includes('Alumina') ||
        m.nome.includes('Zircônia') ||
        m.nome.includes('SiC') ||
        m.nome.includes('Borracha')
      );
    }

    return MATERIAIS;
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
      contentScrollRef={scrollRef}
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
        <Text style={s.txtGray}>{t('materiais.inputData')} — {lista.length} {t('materiais.displayedCount').toLowerCase()}</Text>
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
