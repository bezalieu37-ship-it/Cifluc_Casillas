import { formatarGcode } from '../utils/formatters';

function gerarFanuc(lines) {
  return lines.join('\n');
}

function gerarSiemens(lines) {
  return lines.join('\n');
}

function gerarMitsubishi(lines) {
  return lines.join('\n');
}

function gerarHaas(lines) {
  return lines.join('\n');
}

function gerarMach3(lines) {
  return lines.join('\n');
}

export function gerarGcode(tipo, dados, controle) {
  const lines = [];
  
  lines.push(`; CIFLUC CASILLAS - ${tipo}`);
  lines.push(`; Controle: ${controle}`);
  lines.push(`; Data: ${new Date().toLocaleDateString('pt-BR')}`);
  lines.push('');
  
  if (controle === 'FANUC') {
    lines.push('G21 ; Milímetros');
    lines.push('G90 ; Absoluto');
    lines.push('G99 ; Avanço por volta');
  } else if (controle === 'SIEMENS') {
    lines.push('G90 ; Absoluto');
    lines.push('G710 ; Milímetros');
  } else if (controle === 'MITSUBISHI') {
    lines.push('G21 ; Milímetros');
    lines.push('G90 ; Absoluto');
  } else if (controle === 'HAAS') {
    lines.push('G20 ; Polegadas');
    lines.push('G90 ; Absoluto');
  } else if (controle === 'MACH3') {
    lines.push('G21 ; Milímetros');
    lines.push('G90 ; Absoluto');
  }
  
  lines.push('');
  
  if (dados.rpm) {
    lines.push(`S${formatarGcode(dados.rpm)} M03 ; RPM e rotação`);
  }
  
  if (dados.x !== undefined && dados.y !== undefined) {
    lines.push(`G00 X${formatarGcode(dados.x)} Y${formatarGcode(dados.y)} ; Posicionamento`);
  }
  
  if (dados.z !== undefined) {
    lines.push(`G00 Z${formatarGcode(dados.z)} ; Z de aproximação`);
  }
  
  if (dados.zFinal !== undefined && dados.avanco !== undefined) {
    lines.push(`G01 Z${formatarGcode(dados.zFinal)} F${formatarGcode(dados.avanco)} ; Corte`);
  }
  
  if (dados.x2 !== undefined) {
    lines.push(`G01 X${formatarGcode(dados.x2)} ; avanço em X`);
  }
  
  if (controle === 'FANUC') {
    lines.push('G00 Z2.000 ; Retração');
    lines.push('M05 ; Parar motor');
    lines.push('M30 ; Fim do programa');
  } else if (controle === 'SIEMENS') {
    lines.push('G00 Z2.000 ; Retração');
    lines.push('M05 ; Parar motor');
    lines.push('M30 ; Fim do programa');
  } else if (controle === 'MITSUBISHI') {
    lines.push('G00 Z2.000 ; Retração');
    lines.push('M05 ; Parar motor');
    lines.push('M30 ; Fim do programa');
  } else if (controle === 'HAAS') {
    lines.push('G00 Z0.080 ; Retração');
    lines.push('M05 ; Parar motor');
    lines.push('M30 ; Fim do programa');
  } else if (controle === 'MACH3') {
    lines.push('G00 Z2.000 ; Retração');
    lines.push('M05 ; Parar motor');
    lines.push('M30 ; Fim do programa');
  }
  
  return lines.join('\n');
}

export function gerarGcodeRosca(dados, controle) {
  const lines = [];
  
  lines.push(`; CIFLUC CASILLAS - ROSCA ${dados.norma}`);
  lines.push(`; Controle: ${controle}`);
  lines.push(`; Data: ${new Date().toLocaleDateString('pt-BR')}`);
  lines.push('');
  
  if (controle === 'FANUC') {
    lines.push('G21 ; Milímetros');
    lines.push('G90 ; Absoluto');
    lines.push('G99 ; Avanço por volta');
    lines.push('');
    lines.push(`S${formatarGcode(dados.rpm)} M03 ; RPM`);
    lines.push(`G00 X${formatarGcode(dados.xInicial)} Z${formatarGcode(dados.zInicial)} ; Posicionamento`);
    lines.push(`G76 P010060 Q${formatarGcode(dados.qMinimo)} R${formatarGcode(dados.rSobremetal)} ; Rosca`);
    lines.push(`G76 X${formatarGcode(dados.xFinal)} Z${formatarGcode(dados.zFinal)} P${formatarGcode(dados.pPassada)} Q${formatarGcode(dados.qPassada)} F${formatarGcode(dados.passo)} ; Parâmetros`);
    lines.push('G00 Z2.000 ; Retração');
    lines.push('M05 ; Parar motor');
    lines.push('M30 ; Fim do programa');
  } else if (controle === 'SIEMENS') {
    lines.push('G90 ; Absoluto');
    lines.push('G710 ; Milímetros');
    lines.push('');
    lines.push(`S${formatarGcode(dados.rpm)} M03 ; RPM`);
    lines.push(`G00 X${formatarGcode(dados.xInicial)} Z${formatarGcode(dados.zInicial)} ; Posicionamento`);
    lines.push(`CYCLE97(${formatarGcode(dados.passo)},${formatarGcode(dados.zInicial)},${formatarGcode(dados.zFinal)},${formatarGcode(dados.xInicial)},${formatarGcode(dados.xFinal)},${formatarGcode(dados.rpm)},0.5,0.5,0.125,0,0,0,0,0,0,0,0) ; Rosca`);
    lines.push('G00 Z2.000 ; Retração');
    lines.push('M05 ; Parar motor');
    lines.push('M30 ; Fim do programa');
  } else if (controle === 'MITSUBISHI') {
    lines.push('G21 ; Milímetros');
    lines.push('G90 ; Absoluto');
    lines.push('');
    lines.push(`S${formatarGcode(dados.rpm)} M03 ; RPM`);
    lines.push(`G00 X${formatarGcode(dados.xInicial)} Z${formatarGcode(dados.zInicial)} ; Posicionamento`);
    lines.push(`G72 P01 Q02 W${formatarGcode(dados.passo)} ; Rosca`);
    lines.push('G00 Z2.000 ; Retração');
    lines.push('M05 ; Parar motor');
    lines.push('M30 ; Fim do programa');
  } else if (controle === 'HAAS') {
    lines.push('G20 ; Polegadas');
    lines.push('G90 ; Absoluto');
    lines.push('');
    lines.push(`S${formatarGcode(dados.rpm)} M03 ; RPM`);
    lines.push(`G00 X${formatarGcode(dados.xInicial / 25.4)} Z${formatarGcode(dados.zInicial / 25.4)} ; Posicionamento`);
    lines.push(`G76 P010060 Q${formatarGcode(dados.qMinimo / 25.4)} R${formatarGcode(dados.rSobremetal / 25.4)} ; Rosca`);
    lines.push(`G76 X${formatarGcode(dados.xFinal / 25.4)} Z${formatarGcode(dados.zFinal / 25.4)} P${formatarGcode(dados.pPassada / 25.4)} Q${formatarGcode(dados.qPassada / 25.4)} F${formatarGcode(dados.passo / 25.4)} ; Parâmetros`);
    lines.push('G00 Z0.080 ; Retração');
    lines.push('M05 ; Parar motor');
    lines.push('M30 ; Fim do programa');
  } else if (controle === 'MACH3') {
    lines.push('G21 ; Milímetros');
    lines.push('G90 ; Absoluto');
    lines.push('');
    lines.push(`S${formatarGcode(dados.rpm)} M03 ; RPM`);
    lines.push(`G00 X${formatarGcode(dados.xInicial)} Z${formatarGcode(dados.zInicial)} ; Posicionamento`);
    lines.push(`G32 X${formatarGcode(dados.xFinal)} Z${formatarGcode(dados.zFinal)} F${formatarGcode(dados.passo)} ; Rosca`);
    lines.push('G00 Z2.000 ; Retração');
    lines.push('M05 ; Parar motor');
    lines.push('M30 ; Fim do programa');
  }
  
  return lines.join('\n');
}