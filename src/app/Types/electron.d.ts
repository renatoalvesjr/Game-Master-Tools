declare type Window  = {
  electronAPI: {
    /**
     * Returns the contents of a file with the given path and name.
     *
     * This function reads the content of a single file and returns it as a Promise.
     * The path to the file should be in the `filePath` property of the `request` object.
     *
     * @param {{filePath: string}} request The path to the file.
     * @returns {Promise<string>} A Promise that resolves with the contents of the file.
     */
    returnFile(request: {filePath: string}): Promise<string>;

    /**
     * Returns the contents of all files in the directory.
     *
     * This function reads the contents of all files in a given directory and
     * returns them as an array of strings. If the directory does not
     * exist, it throws an error.
     *
     * @param {{filePath: string, fileName: string}} request The path to the directory.
     * @returns {Promise<string[]>} A Promise that resolves with an array of file contents.
     * @throws {Error} If the directory does not exist.
     */
    returnAllFiles(request: {filePath: string, fileName: string}): Promise<string[]>;

    /**
     * Recursively deletes a file or directory at the given path.
     *
     * @param {{filePath: string, fileName: string}} request The path to the file or directory to be deleted.
     * @returns {Promise<void>} A Promise that resolves when the file or directory is deleted.
     */
    deleteFile(request: {filePath: string, fileName: string}): Promise<void>;

    /**
     * Saves a file to the given path.
     *
     * @param {{filePath: string, fileName: string, content: string}} request The path to the file, the name of the file, and the content of the file.
     * @returns {Promise<void>} A Promise that resolves when the file is saved.
     */
    saveFile(request: {filePath: string, fileName: string, content: string}): Promise<void>;

    /**
     * Deletes a file at the given path.
     *
     * @param {{filePath: string, fileName: string}} request The path to the file and the name of the file.
     * @returns {Promise<void>} A Promise that resolves when the file is deleted.
     */
    deleteFile(request: {filePath: string, fileName: string}): Promise<void>;

    selectImage: () => Promise<string|null>;
    readImageAsBase64: (request: {content: string}) => string;

    changeLanguage(newConfig: Config): void;
    toggleTheme(themeColor: "system" | "light" | "dark"): void;
  };
}
