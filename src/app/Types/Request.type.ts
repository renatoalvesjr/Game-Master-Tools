/**
 * This Request type is used for IPC Renderer communication.
 *  * It defines the structure for data exchanged between the renderer process (Angular)
 * and the main process (Electron) for file operations and other IPC calls.
 * @property {string} [filePath] - The path to the file or directory.
 * @property {string} [fileName] - The name of the file.
 * @property {string} [content] - The content of the file (for saving).

 */
export type Request = {
  filePath?: string;
  fileName?: string;
  content?: string;
}
