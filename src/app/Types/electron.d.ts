declare interface Window {
  electronAPI: {
    openFile: () => Promise<string>;
  };
}
