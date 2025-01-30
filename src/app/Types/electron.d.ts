declare interface Window {
  electronAPI: {
    openExternal: (url: string) => void;
  };
}
