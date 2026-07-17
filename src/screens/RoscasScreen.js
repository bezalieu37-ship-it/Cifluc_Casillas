import React, { useEffect, useState } from 'react';

import {
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert
} from 'react-native';

import CasillasLayout, {
  casillasStyles as styles,
  getCasillasStyles
} from '../components/CasillasLayout';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

const NORMAS_DATABASE = {
  'MÉTRICA ISO GROSSA': [
    { label: 'M3', d: 3.0, p: 0.50 }, { label: 'M3.5', d: 3.5, p: 0.60 },
    { label: 'M4', d: 4.0, p: 0.70 }, { label: 'M4.5', d: 4.5, p: 0.75 },
    { label: 'M5', d: 5.0, p: 0.80 }, { label: 'M6', d: 6.0, p: 1.00 },
    { label: 'M7', d: 7.0, p: 1.00 }, { label: 'M8', d: 8.0, p: 1.25 },
    { label: 'M9', d: 9.0, p: 1.25 }, { label: 'M10', d: 10.0, p: 1.50 },
    { label: 'M11', d: 11.0, p: 1.50 }, { label: 'M12', d: 12.0, p: 1.75 },
    { label: 'M14', d: 14.0, p: 2.00 }, { label: 'M16', d: 16.0, p: 2.00 },
    { label: 'M18', d: 18.0, p: 2.50 }, { label: 'M20', d: 20.0, p: 2.50 },
    { label: 'M22', d: 22.0, p: 2.50 }, { label: 'M24', d: 24.0, p: 3.00 },
    { label: 'M27', d: 27.0, p: 3.00 }, { label: 'M30', d: 30.0, p: 3.50 },
    { label: 'M33', d: 33.0, p: 3.50 }, { label: 'M36', d: 36.0, p: 4.00 },
    { label: 'M39', d: 39.0, p: 4.00 }, { label: 'M42', d: 42.0, p: 4.50 },
    { label: 'M45', d: 45.0, p: 4.50 }, { label: 'M48', d: 48.0, p: 5.00 },
    { label: 'M52', d: 52.0, p: 5.00 }, { label: 'M56', d: 56.0, p: 5.50 },
    { label: 'M60', d: 60.0, p: 5.50 }, { label: 'M64', d: 64.0, p: 6.00 },
    { label: 'M68', d: 68.0, p: 6.00 }
  ],
  'MÉTRICA ISO FINA': [
    { label: 'M3x0.35', d: 3.0, p: 0.35 }, { label: 'M4x0.5', d: 4.0, p: 0.50 },
    { label: 'M5x0.5', d: 5.0, p: 0.50 }, { label: 'M6x0.75', d: 6.0, p: 0.75 },
    { label: 'M8x0.75', d: 8.0, p: 0.75 }, { label: 'M8x1', d: 8.0, p: 1.00 },
    { label: 'M10x0.75', d: 10.0, p: 0.75 }, { label: 'M10x1', d: 10.0, p: 1.00 },
    { label: 'M10x1.25', d: 10.0, p: 1.25 }, { label: 'M12x1', d: 12.0, p: 1.00 },
    { label: 'M12x1.25', d: 12.0, p: 1.25 }, { label: 'M12x1.5', d: 12.0, p: 1.50 },
    { label: 'M14x1', d: 14.0, p: 1.00 }, { label: 'M14x1.25', d: 14.0, p: 1.25 },
    { label: 'M14x1.5', d: 14.0, p: 1.50 }, { label: 'M16x1', d: 16.0, p: 1.00 },
    { label: 'M16x1.5', d: 16.0, p: 1.50 }, { label: 'M18x1.5', d: 18.0, p: 1.50 },
    { label: 'M20x1.5', d: 20.0, p: 1.50 }, { label: 'M22x1.5', d: 22.0, p: 1.50 },
    { label: 'M24x1.5', d: 24.0, p: 1.50 }, { label: 'M24x2', d: 24.0, p: 2.00 },
    { label: 'M27x1.5', d: 27.0, p: 1.50 }, { label: 'M27x2', d: 27.0, p: 2.00 },
    { label: 'M30x1.5', d: 30.0, p: 1.50 }, { label: 'M30x2', d: 30.0, p: 2.00 },
    { label: 'M30x3', d: 30.0, p: 3.00 }, { label: 'M33x2', d: 33.0, p: 2.00 },
    { label: 'M36x2', d: 36.0, p: 2.00 }, { label: 'M36x3', d: 36.0, p: 3.00 },
    { label: 'M39x3', d: 39.0, p: 3.00 }, { label: 'M42x3', d: 42.0, p: 3.00 },
    { label: 'M45x3', d: 45.0, p: 3.00 }, { label: 'M48x3', d: 48.0, p: 3.00 },
    { label: 'M52x3', d: 52.0, p: 3.00 }, { label: 'M56x4', d: 56.0, p: 4.00 },
    { label: 'M60x4', d: 60.0, p: 4.00 }, { label: 'M64x4', d: 64.0, p: 4.00 }
  ],
  'UNC (POLEGADA GROSSA)': [
    { label: 'Nº4-40', d: 2.84, p: 0.635 }, { label: 'Nº5-40', d: 3.18, p: 0.635 },
    { label: 'Nº6-32', d: 3.51, p: 0.794 }, { label: 'Nº8-32', d: 4.17, p: 0.794 },
    { label: 'Nº10-24', d: 4.83, p: 1.058 }, { label: 'Nº12-24', d: 5.49, p: 1.058 },
    { label: '1/4"-20', d: 6.35, p: 1.270 }, { label: '5/16"-18', d: 7.94, p: 1.411 },
    { label: '3/8"-16', d: 9.53, p: 1.587 }, { label: '7/16"-14', d: 11.11, p: 1.814 },
    { label: '1/2"-13', d: 12.70, p: 1.954 }, { label: '9/16"-12', d: 14.29, p: 2.117 },
    { label: '5/8"-11', d: 15.88, p: 2.309 }, { label: '3/4"-10', d: 19.05, p: 2.540 },
    { label: '7/8"-9', d: 22.23, p: 2.822 }, { label: '1"-8', d: 25.40, p: 3.175 },
    { label: '1.1/8"-7', d: 28.58, p: 3.629 }, { label: '1.1/4"-7', d: 31.75, p: 3.629 },
    { label: '1.3/8"-6', d: 34.93, p: 4.233 }, { label: '1.1/2"-6', d: 38.10, p: 4.233 },
    { label: '1.3/4"-5', d: 44.45, p: 5.080 }, { label: '2"-4.1/2', d: 50.80, p: 5.644 },
    { label: '2.1/4"-4.5', d: 57.15, p: 5.644 }, { label: '2.1/2"-4', d: 63.50, p: 6.350 }
  ],
  'UNF (POLEGADA FINA)': [
    { label: 'Nº4-48', d: 2.84, p: 0.529 }, { label: 'Nº5-44', d: 3.18, p: 0.577 },
    { label: 'Nº6-40', d: 3.51, p: 0.635 }, { label: 'Nº8-36', d: 4.17, p: 0.706 },
    { label: 'Nº10-32', d: 4.83, p: 0.794 }, { label: 'Nº12-28', d: 5.49, p: 0.907 },
    { label: '1/4"-28', d: 6.35, p: 0.907 }, { label: '5/16"-24', d: 7.94, p: 1.058 },
    { label: '3/8"-24', d: 9.53, p: 1.058 }, { label: '7/16"-20', d: 11.11, p: 1.270 },
    { label: '1/2"-20', d: 12.70, p: 1.270 }, { label: '9/16"-18', d: 14.29, p: 1.411 },
    { label: '5/8"-18', d: 15.88, p: 1.411 }, { label: '3/4"-16', d: 19.05, p: 1.587 },
    { label: '7/8"-14', d: 22.23, p: 1.814 }, { label: '1"-12', d: 25.40, p: 2.117 },
    { label: '1.1/8"-12', d: 28.58, p: 2.117 }, { label: '1.1/4"-12', d: 31.75, p: 2.117 },
    { label: '1.3/8"-12', d: 34.93, p: 2.117 }, { label: '1.1/2"-12', d: 38.10, p: 2.117 }
  ],
  'WHITWORTH BSW': [
    { label: '1/16"-60', d: 1.58, p: 0.423 }, { label: '3/32"-48', d: 2.38, p: 0.529 },
    { label: '1/8"-40', d: 3.17, p: 0.635 }, { label: '5/32"-32', d: 3.96, p: 0.794 },
    { label: '3/16"-24', d: 4.76, p: 1.058 }, { label: '7/32"-24', d: 5.55, p: 1.058 },
    { label: '1/4"-20', d: 6.35, p: 1.270 }, { label: '5/16"-18', d: 7.94, p: 1.411 },
    { label: '3/8"-16', d: 9.52, p: 1.587 }, { label: '7/16"-14', d: 11.11, p: 1.814 },
    { label: '1/2"-12', d: 12.70, p: 2.117 }, { label: '9/16"-12', d: 14.28, p: 2.117 },
    { label: '5/8"-11', d: 15.87, p: 2.309 }, { label: '11/16"-11', d: 17.46, p: 2.309 },
    { label: '3/4"-10', d: 19.05, p: 2.540 }, { label: '7/8"-9', d: 22.22, p: 2.822 },
    { label: '1"-8', d: 25.40, p: 3.175 }, { label: '1.1/8"-7', d: 28.57, p: 3.629 },
    { label: '1.1/4"-7', d: 31.75, p: 3.629 }, { label: '1.3/8"-6', d: 34.92, p: 4.233 },
    { label: '1.1/2"-6', d: 38.10, p: 4.233 }, { label: '1.5/8"-5', d: 41.27, p: 5.080 },
    { label: '1.3/4"-5', d: 44.45, p: 5.080 }, { label: '1.7/8"-4.1/2', d: 47.62, p: 5.644 },
    { label: '2"-4.1/2', d: 50.80, p: 5.644 }
  ],
  'WHITWORTH BSF': [
    { label: '3/16"-32', d: 4.76, p: 0.794 }, { label: '7/32"-28', d: 5.55, p: 0.907 },
    { label: '1/4"-26', d: 6.35, p: 0.977 }, { label: '5/16"-22', d: 7.94, p: 1.155 },
    { label: '3/8"-20', d: 9.53, p: 1.270 }, { label: '7/16"-18', d: 11.11, p: 1.411 },
    { label: '1/2"-16', d: 12.70, p: 1.587 }, { label: '9/16"-16', d: 14.29, p: 1.587 },
    { label: '5/8"-14', d: 15.88, p: 1.814 }, { label: '11/16"-14', d: 17.46, p: 1.814 },
    { label: '3/4"-12', d: 19.05, p: 2.117 }, { label: '7/8"-11', d: 22.23, p: 2.309 },
    { label: '1"-10', d: 25.40, p: 2.540 }, { label: '1.1/4"-9', d: 31.75, p: 2.822 },
    { label: '1.1/2"-8', d: 38.10, p: 3.175 }
  ],
  'BSP': [
    { label: 'G 1/8"-28', d: 9.73, p: 0.907 }, { label: 'G 1/4"-19', d: 13.16, p: 1.337 },
    { label: 'G 3/8"-19', d: 16.66, p: 1.337 }, { label: 'G 1/2"-14', d: 20.96, p: 1.814 },
    { label: 'G 5/8"-14', d: 22.91, p: 1.814 }, { label: 'G 3/4"-14', d: 26.44, p: 1.814 },
    { label: 'G 7/8"-14', d: 30.20, p: 1.814 }, { label: 'G 1"-11', d: 33.25, p: 2.309 },
    { label: 'G 1.1/8"-11', d: 37.89, p: 2.309 }, { label: 'G 1.1/4"-11', d: 41.91, p: 2.309 },
    { label: 'G 1.1/2"-11', d: 47.80, p: 2.309 }, { label: 'G 1.3/4"-11', d: 53.74, p: 2.309 },
    { label: 'G 2"-11', d: 59.61, p: 2.309 }, { label: 'G 2.1/4"-11', d: 65.71, p: 2.309 },
    { label: 'G 2.1/2"-11', d: 75.18, p: 2.309 }
  ],
  'NPT': [
    { label: 'NPT 1/8"-27', d: 10.24, p: 0.941 }, { label: 'NPT 1/4"-18', d: 13.62, p: 1.411 },
    { label: 'NPT 3/8"-18', d: 17.05, p: 1.411 }, { label: 'NPT 1/2"-14', d: 21.22, p: 1.814 },
    { label: 'NPT 3/4"-14', d: 26.57, p: 1.814 }, { label: 'NPT 1"-11.1/2', d: 33.23, p: 2.209 },
    { label: 'NPT 1.1/4"-11.5', d: 41.98, p: 2.209 }, { label: 'NPT 1.1/2"-11.5', d: 48.05, p: 2.209 },
    { label: 'NPT 2"-11.5', d: 60.09, p: 2.209 }
  ],
  'TRAPEZOIDAL': [
    { label: 'TR10x2', d: 10.0, p: 2.00 }, { label: 'TR12x3', d: 12.0, p: 3.00 },
    { label: 'TR14x3', d: 14.0, p: 3.00 }, { label: 'TR16x4', d: 16.0, p: 4.00 },
    { label: 'TR18x4', d: 18.0, p: 4.00 }, { label: 'TR20x4', d: 20.0, p: 4.00 },
    { label: 'TR22x5', d: 22.0, p: 5.00 }, { label: 'TR24x5', d: 24.0, p: 5.00 },
    { label: 'TR26x5', d: 26.0, p: 5.00 }, { label: 'TR28x5', d: 28.0, p: 5.00 },
    { label: 'TR30x6', d: 30.0, p: 6.00 }, { label: 'TR32x6', d: 32.0, p: 6.00 },
    { label: 'TR36x6', d: 36.0, p: 6.00 }, { label: 'TR40x7', d: 40.0, p: 7.00 },
    { label: 'TR44x7', d: 44.0, p: 7.00 }, { label: 'TR48x8', d: 48.0, p: 8.00 },
    { label: 'TR52x8', d: 52.0, p: 8.00 }, { label: 'TR60x9', d: 60.0, p: 9.00 }
  ],
  'ACME': [
    { label: '1/4"-16', d: 6.35, p: 1.587 }, { label: '5/16"-14', d: 7.94, p: 1.814 },
    { label: '3/8"-12', d: 9.53, p: 2.117 }, { label: '7/16"-12', d: 11.11, p: 2.117 },
    { label: '1/2"-10', d: 12.70, p: 2.540 }, { label: '5/8"-8', d: 15.88, p: 3.175 },
    { label: '3/4"-6', d: 19.05, p: 4.233 }, { label: '7/8"-6', d: 22.23, p: 4.233 },
    { label: '1"-5', d: 25.40, p: 5.080 }, { label: '1.1/8"-5', d: 28.58, p: 5.080 },
    { label: '1.1/4"-5', d: 31.75, p: 5.080 }, { label: '1.3/8"-4', d: 34.93, p: 6.350 },
    { label: '1.1/2"-4', d: 38.10, p: 6.350 }, { label: '1.3/4"-4', d: 44.45, p: 6.350 },
    { label: '2"-4', d: 50.80, p: 6.350 }
  ],
  'QUADRADA': [
    { label: 'Q 10x2', d: 10.0, p: 2.00 }, { label: 'Q 12x3', d: 12.0, p: 3.00 },
    { label: 'Q 16x4', d: 16.0, p: 4.00 }, { label: 'Q 20x4', d: 20.0, p: 4.00 },
    { label: 'Q 24x5', d: 24.0, p: 5.00 }, { label: 'Q 28x5', d: 28.0, p: 5.00 },
    { label: 'Q 32x6', d: 32.0, p: 6.00 }, { label: 'Q 36x6', d: 36.0, p: 6.00 },
    { label: 'Q 40x7', d: 40.0, p: 7.00 }, { label: 'Q 50x8', d: 50.0, p: 8.00 }
  ],
  'REDONDA (DIN 405)': [
    { label: 'Rd 8x1/8', d: 8.0, p: 3.175 }, { label: 'Rd 10x1/8', d: 10.0, p: 3.175 },
    { label: 'Rd 12x1/10', d: 12.0, p: 2.540 }, { label: 'Rd 16x1/8', d: 16.0, p: 3.175 },
    { label: 'Rd 20x1/8', d: 20.0, p: 3.175 }, { label: 'Rd 24x1/8', d: 24.0, p: 3.175 },
    { label: 'Rd 30x1/8', d: 30.0, p: 3.175 }, { label: 'Rd 40x1/6', d: 40.0, p: 4.233 },
    { label: 'Rd 50x1/6', d: 50.0, p: 4.233 }
  ],
  'DENTE DE SERRA': [
    { label: 'S 12x3', d: 12.0, p: 3.00 }, { label: 'S 16x4', d: 16.0, p: 4.00 },
    { label: 'S 20x4', d: 20.0, p: 4.00 }, { label: 'S 24x5', d: 24.0, p: 5.00 },
    { label: 'S 30x6', d: 30.0, p: 6.00 }, { label: 'S 36x6', d: 36.0, p: 6.00 },
    { label: 'S 40x7', d: 40.0, p: 7.00 }, { label: 'S 45x7', d: 45.0, p: 7.00 },
    { label: 'S 50x8', d: 50.0, p: 8.00 }
  ]
};

const CONTROLES_CNC = ['FANUC', 'SIEMENS', 'MITSUBISHI', 'HAAS', 'MACH3'];

const THREAD_TYPE_KEYS = {
  'MÉTRICA ISO GROSSA': 'roscas.typeMetricCoarse', 'MÉTRICA ISO FINA': 'roscas.typeMetricFine',
  'UNC (POLEGADA GROSSA)': 'roscas.typeUnc', 'UNF (POLEGADA FINA)': 'roscas.typeUnf',
  'WHITWORTH BSW': 'roscas.typeBsw', 'WHITWORTH BSF': 'roscas.typeBsf', BSP: 'roscas.typeBsp',
  NPT: 'roscas.typeNpt', TRAPEZOIDAL: 'roscas.typeTrapezoidal', ACME: 'roscas.typeAcme',
  QUADRADA: 'roscas.typeSquare', 'REDONDA (DIN 405)': 'roscas.typeRound',
  'DENTE DE SERRA': 'roscas.typeButtress'
};

export default function RoscasScreen({ navigation }) {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const s = getCasillasStyles(theme);
  const [tipoRosca, setTipoRosca] = useState('MÉTRICA ISO GROSSA');
  const [bitolaAtiva, setBitolaAtiva] = useState(NORMAS_DATABASE['MÉTRICA ISO GROSSA'][5]);
  const [numEntradas, setNumEntradas] = useState('1');
  const [sentido, setSentido] = useState(() => t('roscas.rightHand'));
  const [classeAjuste, setClasseAjuste] = useState('7H');
  const [unidade, setUnidade] = useState('mm');
  const [passoCustomizado, setPassoCustomizado] = useState('');
  const [abaAberta, setAbaAberta] = useState(false);
  const [geoResultados, setGeoResultados] = useState([]);
  const [usinagemDados, setUsinagemDados] = useState([]);
  const [gcode, setGcode] = useState('');
  const [gcodeAtivo, setGcodeAtivo] = useState(true);
  const [controleCnc, setControleCnc] = useState('FANUC');
  const [d2Calc, setD2Calc] = useState(0);
  const [d3Calc, setD3Calc] = useState(0);
  const [D1Calc, setD1Calc] = useState(0);
  const [DmaiorCalc, setDmaiorCalc] = useState(0);

  const permitePassoCustomizado = [
    'TRAPEZOIDAL', 'ACME', 'QUADRADA', 'REDONDA (DIN 405)'
  ].includes(tipoRosca);

  const calcularTudo = () => {
    if (!bitolaAtiva) return;

    const d = bitolaAtiva.d;
    let p = bitolaAtiva.p;

    if (permitePassoCustomizado && passoCustomizado !== '') {
      const pParsed = parseFloat(passoCustomizado.replace(',', '.'));
      if (!isNaN(pParsed) && pParsed > 0) {
        p = pParsed;
      }
    }

    const n = parseInt(numEntradas) || 1;
    const avanco = p * n;
    const passoNominal = bitolaAtiva.p;

    const configuracaoEspecial =
      passoCustomizado && permitePassoCustomizado &&
      Math.abs(p - passoNominal) > 0.001;

    const roscaGcodeLabel =
      passoCustomizado && permitePassoCustomizado
        ? `${bitolaAtiva.label} ${t('roscas.modifiedLabel')} P${p.toFixed(2)}`
        : bitolaAtiva.label;

    let anguloPerfil = 60;
    let ferramentaRosca = t('roscas.insert60');

    if (tipoRosca === 'TRAPEZOIDAL') { anguloPerfil = 30; ferramentaRosca = t('roscas.insertTr30'); }
    if (tipoRosca === 'ACME') { anguloPerfil = 29; ferramentaRosca = t('roscas.insertAcme29'); }
    if (tipoRosca.includes('BSW') || tipoRosca.includes('BSF') || tipoRosca.includes('WHITWORTH') || tipoRosca.includes('BSP')) {
      anguloPerfil = 55; ferramentaRosca = t('roscas.insert55');
    }
    if (tipoRosca === 'QUADRADA') { anguloPerfil = 0; ferramentaRosca = t('roscas.squareProfile'); }
    if (tipoRosca === 'REDONDA (DIN 405)') { anguloPerfil = 0; ferramentaRosca = t('roscas.roundProfile'); }
    if (tipoRosca === 'DENTE DE SERRA') { anguloPerfil = 45; ferramentaRosca = t('roscas.profile45'); }

    let h_total, h1, folga_c, f_crista, d2_calc, D1_calc;

    if (tipoRosca === 'MÉTRICA ISO GROSSA' || tipoRosca === 'MÉTRICA ISO FINA') {
      h_total = 0.5413 * p; h1 = 0.5 * p; folga_c = h_total - h1;
      f_crista = 0.1083 * p; d2_calc = d - 0.6495 * p; D1_calc = d - 1.0825 * p;
    } else if (tipoRosca.includes('UNC') || tipoRosca.includes('UNF')) {
      h_total = 0.5413 * p; h1 = 0.5 * p; folga_c = h_total - h1;
      f_crista = 0.1083 * p; d2_calc = d - 0.6495 * p; D1_calc = d - 1.0825 * p;
    } else if (tipoRosca.includes('BSW') || tipoRosca.includes('BSF') || tipoRosca.includes('WHITWORTH')) {
      h_total = 0.6403 * p; h1 = 0.5 * p; folga_c = h_total - h1;
      f_crista = 0.1373 * p; d2_calc = d - 0.6403 * p; D1_calc = d - 1.2806 * p;
    } else if (tipoRosca.includes('BSP')) {
      h_total = 0.6403 * p; h1 = 0.5 * p; folga_c = h_total - h1;
      f_crista = 0.1373 * p; d2_calc = d - 0.6403 * p; D1_calc = d - 1.2806 * p;
    } else if (tipoRosca === 'NPT') {
      h_total = 0.5413 * p; h1 = 0.5 * p; folga_c = h_total - h1;
      f_crista = 0.1083 * p; d2_calc = d - 0.6495 * p; D1_calc = d - 1.0825 * p;
    } else if (tipoRosca === 'TRAPEZOIDAL') {
      h_total = p > 2 ? 0.5 * p + 0.5 : 0.5 * p + 0.25; h1 = 0.5 * p; folga_c = h_total - h1;
      f_crista = 0.366 * p; d2_calc = d - 0.5 * p; D1_calc = d - p;
    } else if (tipoRosca === 'ACME') {
      h_total = 0.5 * p + 0.25; h1 = 0.5 * p; folga_c = h_total - h1;
      f_crista = 0.3707 * p; d2_calc = d - 0.5 * p; D1_calc = d - p;
    } else if (tipoRosca === 'QUADRADA') {
      h_total = 0.5 * p; h1 = 0.5 * p; folga_c = 0;
      f_crista = 0.5 * p; d2_calc = d - 0.5 * p; D1_calc = d - p;
    } else if (tipoRosca === 'REDONDA (DIN 405)') {
      h_total = 0.325 * p; h1 = 0.325 * p; folga_c = 0;
      f_crista = 0.375 * p; d2_calc = d - 0.325 * p; D1_calc = d - 0.650 * p;
    } else if (tipoRosca === 'DENTE DE SERRA') {
      h_total = 0.5 * p; h1 = 0.5 * p; folga_c = 0;
      f_crista = 0.5 * p; d2_calc = d - 0.5 * p; D1_calc = d - p;
    } else {
      h_total = 0.5413 * p; h1 = 0.5 * p; folga_c = h_total - h1;
      f_crista = 0.1083 * p; d2_calc = d - 0.6495 * p; D1_calc = d - 1.0825 * p;
    }

    const d3_parafuso = d - 2 * h_total;
    const d2_efetivo = d2_calc;
    const D_maior_porca = d;
    const D1_menor_porca = D1_calc;

    setD2Calc(d2_efetivo);
    setD3Calc(d3_parafuso);
    setD1Calc(D1_menor_porca);
    setDmaiorCalc(D_maior_porca);
    const ang_helice = Math.atan(avanco / (Math.PI * d2_efetivo)) * (180 / Math.PI);

    setGeoResultados([
      { n: `${t('roscas.pitch')}`, v: `${p.toFixed(2)} mm ${configuracaoEspecial ? t('roscas.modified') : ''}` },
      { n: `${t('roscas.profileAngle')}`, v: `${anguloPerfil.toFixed(2)}°` },
      { n: `${t('roscas.totalHeight')}`, v: `${h_total.toFixed(2)} mm` },
      { n: `${t('roscas.threadHeight')}`, v: `${h1.toFixed(2)} mm` },
      { n: `${t('roscas.rootClearance')}`, v: `${folga_c.toFixed(2)} mm` },
      { n: `${t('roscas.crestWidth')}`, v: `${f_crista.toFixed(2)} mm` },
      { n: `${t('roscas.minorDiaBolt')}`, v: `${d3_parafuso.toFixed(2)} mm` },
      { n: `${t('roscas.pitchDia')}`, v: `${d2_efetivo.toFixed(2)} mm` },
      { n: `${t('roscas.majorDiaNut')}`, v: `${D_maior_porca.toFixed(2)} mm` },
      { n: `${t('roscas.minorDiaNut')}`, v: `${D1_menor_porca.toFixed(2)} mm` },
      { n: `${t('roscas.helixAngle')}`, v: `${ang_helice.toFixed(2)}°` },
    ]);

    let passesSugeridos = '';
    let estrategiaPasses = '';

    if (h_total <= 0.8) { passesSugeridos = t('roscas.range', { min: 4, max: 6 }); estrategiaPasses = '0.20 / 0.15 / 0.10 / 0.08 / 0.05'; }
    else if (h_total <= 1.5) { passesSugeridos = t('roscas.range', { min: 6, max: 10 }); estrategiaPasses = '0.35 / 0.30 / 0.25 / 0.20 / 0.15'; }
    else if (h_total <= 2.0) { passesSugeridos = t('roscas.range', { min: 10, max: 15 }); estrategiaPasses = '0.40 / 0.35 / 0.30 / 0.25 / 0.20'; }
    else if (h_total <= 3.0) { passesSugeridos = t('roscas.range', { min: 15, max: 25 }); estrategiaPasses = '0.50 / 0.45 / 0.40 / 0.35 / 0.30'; }
    else if (h_total <= 5.0) { passesSugeridos = t('roscas.range', { min: 25, max: 40 }); estrategiaPasses = '0.50 / 0.45 / 0.40 / 0.35 / 0.30'; }
    else { passesSugeridos = t('roscas.range', { min: 30, max: 50 }); estrategiaPasses = '0.60 / 0.55 / 0.50 / 0.45 / 0.40'; }

    setUsinagemDados([
      { n: `${t('roscas.syncFeed')}`, v: `${avanco.toFixed(2)} mm/ver` },
      { n: `${t('roscas.passesSuggested')}`, v: passesSugeridos },
      { n: `${t('roscas.firstPass')}`, v: '0.35 mm' },
      { n: `${t('roscas.lastPass')}`, v: '0.05 mm' },
      { n: `${t('roscas.allowance')}`, v: '0.10 mm' },
      { n: `${t('roscas.totalDepth')}`, v: `${h_total.toFixed(2)} mm` },
      { n: `${t('roscas.toolType')}`, v: ferramentaRosca }
    ]);

    const rpmGcode = 380;
    const zFinal = -30.000;
    const zInicial = 2.000;
    const xInicial = d + 2;
    const xFinal = d3_parafuso;
    const profundidadeMil = Math.round(h_total * 1000);
    const avancoGcode = avanco;
    const anguloGcode = Math.round(anguloPerfil);

    let codigo = '';

    if (controleCnc === 'FANUC') {
      codigo =
`%
O0101 (FANUC - ${t('roscas.gcodeThread')} ${bitolaAtiva.label})
( ${t('roscas.gcodeStandard')}: ${t(THREAD_TYPE_KEYS[tipoRosca])} )
${configuracaoEspecial ? `( ${t('roscas.gcodeSpecialConfig')} )` : ''}
${configuracaoEspecial ? `( ${t('roscas.gcodeNominalPitch')} = ${passoNominal.toFixed(3)} )` : ''}
${configuracaoEspecial ? `( ${t('roscas.gcodeProgrammedPitch')} = ${p.toFixed(3)} )` : ''}
G21 G40 G90 G99
G97 S${Math.round(rpmGcode)} M03
G00 X${xInicial.toFixed(3)} Z${zInicial.toFixed(3)}
G76 P0200${anguloGcode} Q100 R0.050
G76 X${xFinal.toFixed(3)} Z${zFinal.toFixed(3)} P${profundidadeMil} Q254 F${avancoGcode.toFixed(3)}
G00 X${xInicial.toFixed(3)}
M05
M30
%`;
    }

    if (controleCnc === 'HAAS') {
      codigo =
`%
O0101 (HAAS - ${t('roscas.gcodeThread')} ${bitolaAtiva.label})
( ${t('roscas.gcodeStandard')}: ${t(THREAD_TYPE_KEYS[tipoRosca])} )
${configuracaoEspecial ? `( ${t('roscas.gcodeSpecialConfig')} )` : ''}
${configuracaoEspecial ? `( ${t('roscas.gcodeNominalPitch')} = ${passoNominal.toFixed(3)} )` : ''}
${configuracaoEspecial ? `( ${t('roscas.gcodeProgrammedPitch')} = ${p.toFixed(3)} )` : ''}
G21 G40 G90 G99
G97 S${Math.round(rpmGcode)} M03
G00 X${xInicial.toFixed(3)} Z${zInicial.toFixed(3)}
G76 X${xFinal.toFixed(3)} Z${zFinal.toFixed(3)} K${h_total.toFixed(3)} D0.300 F${avancoGcode.toFixed(3)}
G00 X${xInicial.toFixed(3)}
M05
M30
%`;
    }

    if (controleCnc === 'MITSUBISHI') {
      codigo =
`%
O0101 (MITSUBISHI - ${t('roscas.gcodeThread')} ${bitolaAtiva.label})
( ${t('roscas.gcodeStandard')}: ${t(THREAD_TYPE_KEYS[tipoRosca])} )
${configuracaoEspecial ? `( ${t('roscas.gcodeSpecialConfig')} )` : ''}
${configuracaoEspecial ? `( ${t('roscas.gcodeNominalPitch')} = ${passoNominal.toFixed(3)} )` : ''}
${configuracaoEspecial ? `( ${t('roscas.gcodeProgrammedPitch')} = ${p.toFixed(3)} )` : ''}
G21 G40 G90 G99
G97 S${Math.round(rpmGcode)} M03
G00 X${xInicial.toFixed(3)} Z${zInicial.toFixed(3)}
G76 P0200${anguloGcode} Q100 R0.050
G76 X${xFinal.toFixed(3)} Z${zFinal.toFixed(3)} P${profundidadeMil} Q254 F${avancoGcode.toFixed(3)}
G00 X${xInicial.toFixed(3)}
M05
M30
%`;
    }

    if (controleCnc === 'SIEMENS') {
      codigo =
`; SIEMENS - ${t('roscas.gcodeThread')} (${roscaGcodeLabel})
; ${t('roscas.gcodeStandard')}: ${t(THREAD_TYPE_KEYS[tipoRosca])}
${configuracaoEspecial ? `; ${t('roscas.gcodeSpecialConfig')}` : ''}
${configuracaoEspecial ? `; ${t('roscas.gcodeNominalPitch')} = ${passoNominal.toFixed(3)}` : ''}
${configuracaoEspecial ? `; ${t('roscas.gcodeProgrammedPitch')} = ${p.toFixed(3)}` : ''}
G21 G90 G95
S${Math.round(rpmGcode)} M3
G0 X${xInicial.toFixed(3)} Z${zInicial.toFixed(3)}
; ${t('roscas.gcodeCycle97')}
; ${t('roscas.gcodeInitialDiameter')}: X${xInicial.toFixed(3)}
; ${t('roscas.gcodeFinalDiameter')}: X${xFinal.toFixed(3)}
; ${t('roscas.gcodeFinalZ')}: ${zFinal.toFixed(3)}
; ${t('roscas.gcodePitch')}: ${avancoGcode.toFixed(3)} mm/volta
; ${t('roscas.gcodeDepth')}: ${h_total.toFixed(2)} mm
; ${t('roscas.gcodeProfileAngle')}: ${anguloPerfil.toFixed(2)}°
; ${t('roscas.gcodePasses')}: ${passesSugeridos}
M5
M30`;
    }

    if (controleCnc === 'MACH3') {
      codigo =
`(MACH3 - ${t('roscas.gcodeThread')} ${roscaGcodeLabel})
( ${t('roscas.gcodeStandard')}: ${t(THREAD_TYPE_KEYS[tipoRosca])} )
${configuracaoEspecial ? `( ${t('roscas.gcodeSpecialConfig')} )` : ''}
${configuracaoEspecial ? `( ${t('roscas.gcodeNominalPitch')} = ${passoNominal.toFixed(3)} )` : ''}
${configuracaoEspecial ? `( ${t('roscas.gcodeProgrammedPitch')} = ${p.toFixed(3)} )` : ''}
G21 G90 G95
S${Math.round(rpmGcode)} M03
G00 X${xInicial.toFixed(3)} Z${zInicial.toFixed(3)}
( ${t('roscas.gcodeMach3G32')} )
( ${t('roscas.gcodeCheckSpindleSync')} )
G32 X${xFinal.toFixed(3)} Z${zFinal.toFixed(3)} F${avancoGcode.toFixed(3)}
G00 X${xInicial.toFixed(3)}
G00 Z${zInicial.toFixed(3)}
M05
M30`;
    }

    setGcode(codigo);
  };

  useEffect(() => {
    if (NORMAS_DATABASE[tipoRosca] && NORMAS_DATABASE[tipoRosca].length > 0) {
      setBitolaAtiva(NORMAS_DATABASE[tipoRosca][0]);
    }
    setPassoCustomizado('');
    setAbaAberta(false);
  }, [tipoRosca]);

  useEffect(() => {
    calcularTudo();
  }, [
    tipoRosca, bitolaAtiva, numEntradas, sentido,
    classeAjuste, unidade, passoCustomizado, controleCnc, t
  ]);

  const obterPassoAtivo = () => {
    if (permitePassoCustomizado && passoCustomizado !== '') {
      const parsed = parseFloat(passoCustomizado.replace(',', '.'));
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
    return bitolaAtiva?.p || 0;
  };

  const passoAtivoTabela = obterPassoAtivo();

  const terminalText =
    `${t('roscas.terminalTitle')}\n` +
    `${t('roscas.thread')}: ${bitolaAtiva?.label}\n` +
    `${t('roscas.standard')}: ${t(THREAD_TYPE_KEYS[tipoRosca])}\n` +
    `${t('roscas.pitch')}: ${passoAtivoTabela.toFixed(2)} mm\n` +
    `${t('roscas.entries')}: ${numEntradas}\n` +
    `${t('roscas.feed')}: ${(passoAtivoTabela * parseInt(numEntradas || 1)).toFixed(2)} mm/volta\n` +
    `${t('roscas.classLabel')}: ${classeAjuste}\n` +
    `${t('roscas.status')}: ${t('roscas.readyForManufacturing')}`;

  const relatorio =
    `${t('roscas.reportTitle')}\n\n` +
    `${t('roscas.standard')}: ${t(THREAD_TYPE_KEYS[tipoRosca])}\n` +
    `${t('roscas.size')}: ${bitolaAtiva?.label}\n` +
    `${t('roscas.nominalDiameter')}: ${(bitolaAtiva?.d || 0).toFixed(2)} mm\n` +
    `${t('roscas.pitch')}: ${passoAtivoTabela.toFixed(2)} mm\n` +
    `${t('roscas.entries')}: ${numEntradas}\n` +
    `${t('roscas.feed')}: ${(passoAtivoTabela * parseInt(numEntradas || 1)).toFixed(2)} mm/volta\n` +
    `${t('roscas.direction')}: ${sentido}\n` +
    `${t('roscas.classLabel')}: ${classeAjuste}\n\n` +
    `${t('roscas.geometricResultsReport')}\n` +
    `--------------------------------\n` +
    geoResultados.map((item) => `${item.n}: ${item.v}`).join('\n') +
    `\n\n${t('roscas.machiningDataReport')}\n` +
    `--------------------------------\n` +
    usinagemDados.map((item) => `${item.n}: ${item.v}`).join('\n') +
    `\n\nG-CODE\n` +
    `--------------------------------\n` +
    `${gcode}`;

  return (
    <CasillasLayout
      navigation={navigation}
      activeRoute="Roscas"
      title={t('roscas.title')}
      subtitle={t('roscas.subtitle')}
      terminalText={terminalText}
      shareText={relatorio}
    >
      {/* 1. TIPO DE ROSCA */}
      <View style={s.card}>
        <Text style={s.cardTitle}>1. {t('roscas.typeLabel')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 4 }}>
          {Object.keys(NORMAS_DATABASE).map((threadType) => (
            <TouchableOpacity key={threadType} style={[s.btnTipo, tipoRosca === threadType && s.btnTipoAtivo]} onPress={() => setTipoRosca(threadType)}>
              <Text style={[s.btnTipoText, tipoRosca === threadType && s.btnTipoTextAtivo]}>{t(THREAD_TYPE_KEYS[threadType])}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 2. DADOS DE ENTRADA */}
      <View style={s.card}>
        <Text style={s.cardTitle}>2. {t('roscas.inputData')}</Text>
        <Text style={s.labelInput}>{t('roscas.nominalD')}</Text>
        <TouchableOpacity style={s.dropdownHeader} onPress={() => setAbaAberta(!abaAberta)}>
          <Text style={{ color: theme.yellow, fontWeight: 'bold' }}>
            {bitolaAtiva ? `${bitolaAtiva.label} (Ø ${bitolaAtiva.d}mm × P ${bitolaAtiva.p}mm)` : t('roscas.select')}
          </Text>
          <Text style={{ color: theme.yellow }}>{abaAberta ? '▲' : '▼'}</Text>
        </TouchableOpacity>

        {abaAberta && NORMAS_DATABASE[tipoRosca] && (
          <View style={s.dropdownContainer}>
            <ScrollView nestedScrollEnabled style={{ maxHeight: 180 }}>
              {NORMAS_DATABASE[tipoRosca].map((item, idx) => (
                <TouchableOpacity key={idx} style={s.dropdownItem} onPress={() => { setBitolaAtiva(item); setAbaAberta(false); }}>
                  <Text style={{ color: theme.text, fontSize: 13 }}>{item.label} (Ø {item.d} mm / P {item.p} mm)</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {permitePassoCustomizado && (
          <View style={{ marginTop: 8, backgroundColor: theme.yellowDim, padding: 8, borderRadius: 4, borderWidth: 1, borderColor: theme.yellow }}>
            <Text style={[s.labelInput, { color: theme.yellow, fontWeight: 'bold' }]}>{t('roscas.customPitch')}</Text>
            <TextInput
              style={[s.input, { borderColor: theme.yellow, color: theme.yellow }]}
              placeholder={`${t('roscas.original')}: ${bitolaAtiva?.p} mm`}
              placeholderTextColor={theme.mutedLight}
              value={passoCustomizado}
              onChangeText={setPassoCustomizado}
              keyboardType="numeric"
            />
          </View>
        )}

        <View style={s.gridInputs}>
          <View style={s.boxInputHalf}>
            <Text style={s.labelInput}>{t('roscas.entries')}</Text>
            <TextInput style={s.input} value={numEntradas} onChangeText={setNumEntradas} keyboardType="numeric" />
          </View>
          <View style={s.boxInputHalf}>
            <Text style={s.labelInput}>{t('roscas.direction')}</Text>
            <TextInput style={s.input} value={sentido} onChangeText={setSentido} />
          </View>
        </View>

        <View style={s.gridInputs}>
          <View style={s.boxInputHalf}>
            <Text style={s.labelInput}>{t('roscas.fitClass')}</Text>
            <TextInput style={s.input} value={classeAjuste} onChangeText={setClasseAjuste} />
          </View>
          <View style={s.boxInputHalf}>
            <Text style={s.labelInput}>{t('roscas.unit')}</Text>
            <TextInput style={s.input} value={unidade} onChangeText={setUnidade} />
          </View>
        </View>
      </View>

      {/* 3. RESULTADOS GEOMÉTRICOS */}
      <View style={s.card}>
        <Text style={s.cardTitle}>3. {t('roscas.geoResults')}</Text>
        {geoResultados.map((item, idx) => (
          <View key={idx} style={s.linhaTabela}>
            <Text style={s.txtWhite}>{item.n}</Text>
            <Text style={s.txtYellow}>{item.v}</Text>
          </View>
        ))}
      </View>

      {/* 4. VERIFICAÇÃO DIMENSIONAL */}
      <View style={s.card}>
        <Text style={s.cardTitle}>4. {t('roscas.verification')}</Text>
        <View style={s.linhaTabela}>
          <Text style={s.txtWhite}>{t('roscas.majorDia')}</Text>
          <Text style={s.txtYellow}>{bitolaAtiva?.d.toFixed(2)} mm</Text>
        </View>
        <View style={s.linhaTabela}>
          <Text style={s.txtWhite}>{t('roscas.mediumDia')}</Text>
          <Text style={s.txtYellow}>{d2Calc.toFixed(2)} mm</Text>
        </View>
        <View style={s.linhaTabela}>
          <Text style={s.txtWhite}>{t('roscas.minorDia')}</Text>
          <Text style={s.txtYellow}>{d3Calc.toFixed(2)} mm</Text>
        </View>
        <View style={s.linhaTabela}>
          <Text style={s.txtWhite}>{t('roscas.instruments')}</Text>
          <Text style={s.txtYellow}>{t('roscas.instrumentVal')}</Text>
        </View>
        <View style={s.linhaTabela}>
          <Text style={s.txtWhite}>{t('roscas.pitchCheck')}</Text>
          <Text style={s.txtYellow}>{t('roscas.pitchCheckVal')}</Text>
        </View>
      </View>

      {/* 5. DADOS DE USINAGEM CNC */}
      <View style={s.card}>
        <Text style={s.cardTitle}>5. {t('roscas.machining')}</Text>
        {usinagemDados.map((item, idx) => (
          <View key={idx} style={s.linhaTabela}>
            <Text style={s.txtWhite}>{item.n}</Text>
            <Text style={{ color: theme.text, fontSize: 12, fontWeight: 'bold' }}>{item.v}</Text>
          </View>
        ))}
      </View>

      {/* 6. GERADOR DE G-CODE */}
      <View style={s.card}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={s.cardTitle}>6. {t('roscas.gcodeTitle')}</Text>
          <Switch value={gcodeAtivo} onValueChange={setGcodeAtivo} thumbColor={theme.yellow} />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 4, marginTop: 8, marginBottom: 8 }}>
          {CONTROLES_CNC.map((item) => (
            <TouchableOpacity
              key={item}
              style={[s.btnTipo, controleCnc === item && s.btnTipoAtivo]}
              onPress={() => setControleCnc(item)}
            >
              <Text style={[s.btnTipoText, controleCnc === item && s.btnTipoTextAtivo]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {gcodeAtivo && (
          <View style={s.terminal}>
            <Text style={s.txtGcode}>{gcode}</Text>
          </View>
        )}
      </View>

      {/* 7. TABELA PADRÃO */}
      <View style={s.card}>
        <Text style={s.cardTitle}>7. {t('roscas.stdTable')}</Text>
        <View style={[s.linhaTabela, { backgroundColor: theme.bgSecondary, paddingHorizontal: 4 }]}>
          <Text style={styles.txtHeadTab}>{t('roscas.thread')}</Text>
          <Text style={styles.txtHeadTab}>{t('roscas.pitch')}</Text>
          <Text style={styles.txtHeadTab}>d (mm)</Text>
          <Text style={styles.txtHeadTab}>d2 (mm)</Text>
          <Text style={styles.txtHeadTab}>D1 (mm)</Text>
        </View>
        <View style={[s.linhaTabela, { borderColor: theme.yellow, borderWidth: 1, paddingHorizontal: 4, backgroundColor: theme.yellowDim }]}>
          <Text style={s.txtYellow}>{bitolaAtiva?.label}</Text>
          <Text style={s.txtYellow}>{passoAtivoTabela.toFixed(2)}</Text>
          <Text style={s.txtYellow}>{bitolaAtiva?.d}</Text>
          <Text style={s.txtYellow}>{d2Calc.toFixed(2)}</Text>
          <Text style={s.txtYellow}>{D1Calc.toFixed(2)}</Text>
        </View>
      </View>
    </CasillasLayout>
  );
}
