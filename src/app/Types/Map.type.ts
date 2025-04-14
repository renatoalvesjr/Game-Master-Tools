export type Map = {
  mapId: string;
  mapName: string;
  mapCreationDate: string;
  mapUpdateDate: string;
  mapIndex: number;
  mapContent: { x: number; y: number; note: string }[];
}
