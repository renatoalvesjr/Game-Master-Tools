import { Injectable } from '@angular/core';

// noinspection SpellCheckingInspection
@Injectable({
  providedIn: 'platform'
})
export class UtilsService {
  pageColors: string[] = [
    '#F3F6F8',  // Cinza muito claro
    '#F5F5DC',  // Bege
    '#FFF599',  // Amarelo claro
    '#F8E231',  // Amarelo médio
    '#FFD700',  // Dourado
    '#EEC591',  // Marrom areia (pêssego)
    '#FFC080',  // Laranja claro
    '#FFA07A',  // Salmão
    '#FF9800',  // Laranja
    '#DAA520',  // Ouro (marrom dourado)
    '#C2B280',  // Marrom claro (amarelado)
    '#A9D700',  // Verde-amarelado
    '#B2FFFC',  // Azul claro (turquesa)
    '#66D9EF',  // Azul celeste
    '#64B5F6',  // Azul médio
    '#2196F3',  // Azul
    '#8BC34A',  // Verde claro
    '#4CAF50',  // Verde
    '#009688',  // Verde-azulado
    '#E91E63',  // Rosa choque
    '#9C27B0',  // Roxo
    '#A0522D',  // Marrom avermelhado (sienna)
    '#795548',  // Marrom escuro
    '#3E8E41',  // Verde escuro
    '#607D8B',  // Azul acinzentado
    '#778899',  // Cinza azulado
    '#455A64',  // Azul escuro acinzentado
    '#9E9E9E',  // Cinza médio
    '#808080',  // Cinza escuro
    '#82828f',  // Azul acinzentado escuro
  ]

  constructor() {
  }
  getTimeNow(): string {
    return new Date().toISOString();
  }
  getUUID(): string{

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}
