export type MapCanvas = {
  mapId: string;
  mapName: string;
  mapCreationDate: string;
  mapUpdateDate: string;
  mapIndex: number;
  mapContent?: MapContent;
  active: boolean;
}

export type MapContent = {
  base64: string;
  bounds: [[number,number],[number,number]];
  pins: MapPin[]
}

export type MapPin = {
  id: string;
  x: number;
  y: number;
  url?: string;
  type: 'enemy' | 'npc' | 'treasure' | 'trap' | 'custom';
  label?: string;
  hasNote: boolean;
  note?: string;
}
