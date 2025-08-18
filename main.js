const {app, ipcMain, BrowserWindow, nativeTheme, dialog} = require("electron");
const path = require("path");
let fs = require('fs');
// noinspection JSUnusedLocalSymbols
let url = require('url')

let appWindow;

const defaultConfig = {
  language: 'en-US',
  supportedLanguages: ['en-US', 'pt-BR', 'zh-Hans','zh-Hant', 'de-DE','es-ES','fr-FR'],
  colorMode: 'dark',
  version: '1.0.2'
}


function initWindow() {
  appWindow = new BrowserWindow({
    simpleFullscreen: true,
    width: 1024,
    height: 720,
    backgroundColor: '#292524',
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
      webSecurity: false
    },
  });
  appWindow.loadURL(
    url.format({
      // pathname: path.join(
      //   __dirname,
      //   "/dist/game-master-tools/browser/index.html"
      // ),
      // protocol: "file",
      // slashes: true,
      pathname: "http://localhost:4200", // para desenvolvimento local
    })
  ).then();

  // appWindow.setMenu(null);
  appWindow.webContents.session.setSpellCheckerEnabled(false);

  appWindow.once("ready-to-show", () => {
    appWindow.show();
  });

  appWindow.on("closed", () => {
    appWindow = null;
  });
}

app.on("ready", initWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.whenReady().then(() => {
  ipcMain.handle('returnFile', returnFile)
  ipcMain.handle('saveFile', saveFile)
  ipcMain.handle('returnAllFiles', returnAllFiles)
  ipcMain.handle('deleteFile', deleteFile)
  ipcMain.handle('onStart', onStart)
  ipcMain.handle('toggleTheme', toggleTheme)
  ipcMain.handle('systemtheme', systemTheme)
  ipcMain.handle('select-image', selectFile)
  ipcMain.handle('readImageAsBase64', readImageAsBase64)
  ipcMain.handle('getDefaultPath', getDefaultPath)

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) initWindow()
  })
})

const defaultPath = app.getPath("appData") + "/GameMasterTools/";

function getDefaultPath() {
  return defaultPath;
}

async function selectFile() {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'webp'] },
    ]
  });

  if (result.canceled || result.filePaths.length === 0) {
    console.error('Nenhum arquivo selecionado ou o usuário cancelou.');
    return null;
  }

  return result.filePaths[0];
}


async function readImageAsBase64(event,data) {
  const path = data['content']
  if (!path || typeof path !== 'string') {
    console.error('Caminho fornecido é inválido:', path);
    throw new Error('Invalid path provided to loadImageAsBase64');
  }

  try {
    const data = fs.readFileSync(path);
    const ext = path.split('.').pop();
    const base64 = data.toString('base64');
    return `data:image/${ext};base64,${base64}`;
  } catch (error) {
    console.error('Erro ao ler arquivo:', error);
    throw new Error('Falha ao ler o arquivo de imagem');
  }
}

async function toggleTheme(event, data) {
  if (data === "dark") {
    nativeTheme.themeSource = "dark";
  } else if (data === "light") {
    nativeTheme.themeSource = "light";
  } else if (data === "system") {
    nativeTheme.themeSource = "system";
  }
}

async function systemTheme() {
  return nativeTheme.shouldUseDarkColors;
}

async function update101to102(){

}
async function onStart() {
  if (!fs.existsSync(path.join(defaultPath, "config/config.json"))) {
    fs.mkdirSync(path.join(defaultPath, "config"), {recursive: true});
    fs.writeFileSync(path.join(defaultPath, "config/config.json"), JSON.stringify(defaultConfig));
    console.log(defaultPath);

    return JSON.stringify(defaultConfig);
  } else {
    await checkSettings();
    return fs.readFileSync(path.join(defaultPath, "config/config.json"), "utf-8");
  }
}

async function checkSettings() {
  if (fs.existsSync(path.join(defaultPath, "config/config.json"))) {
    let conflict = false;
    const configFile = fs.readFileSync(path.join(defaultPath, "config/config.json"), "utf-8");
    const config = JSON.parse(configFile);

    if (config.supportedLanguages !== defaultConfig.supportedLanguages || !config.supportedLanguages) {
      config.supportedLanguages = defaultConfig.supportedLanguages;
      conflict = true;
    }

    if (!config.colorMode || config.colorMode !== 'dark' || config.colorMode !== 'light' || config.colorMode !== 'system') {
      config.colorMode = defaultConfig.colorMode;
      conflict = true;
    }

    if (!config.language || !defaultConfig.supportedLanguages.includes(config.language)) {
      config.language = defaultConfig.language;
      conflict = true;
    }

    if (conflict) {
      await fs.promises.writeFile(path.join(defaultPath, "config/config.json"), JSON.stringify(config));
    }
  }
}


/**
 * Returns the contents of a file with the given path and name.
 * @param {string} data.filePath The path to the file.
 * @param {string} data.fileName The name of the file.
 * @returns {Promise<string|Buffer>} A Promise that resolves with the contents of the file.
 */
async function returnFile(event, data) {
  const filePath = path.join(defaultPath, data['filePath']);

  if (fs.existsSync(path.join(filePath))) {
    return fs.readFileSync(path.join(filePath), "utf-8");
  }
}

/**
 * Reads the contents of a directory at the given path.
 * @param {string} path The path to the directory.
 * @returns {Promise<string[]>} A Promise that resolves with an array of file names.
 * @throws {Error} If the path is not a valid directory.
 */
async function getFiles(path) {
  if (fs.existsSync(path) && fs.lstatSync(path).isDirectory()) {
    // Read the contents of the directory
    return await fs.promises.readdir(path);
  } else {
    throw new Error(`The given path '${path}' is not a valid directory.`);
  }
}

/**
 * Returns the content of all files in the 'Campaigns' directory.
 *
 * This function reads the contents of all files in the 'Campaigns' directory and
 * returns them as an array of strings. If the 'Campaigns' directory does not
 * exist, it throws an error.
 *
 * @param {Event} event The event that triggered this function.
 * @param {Object} data An object containing the filePath and fileName for the request.
 * @param {string} data.filePath The directory path where the files should be read from.
 * @param {string} data.fileName The name of the file to be read.
 * @returns {Promise<string[]>} A Promise that resolves with an array of file contents.
 * @throws {Error} If the 'Campaigns' directory does not exist.
 */
async function returnAllFiles(event, data) {
  const filePath = path.join(defaultPath, data['filePath']);
  const fileName = data['fileName'];
  // Check if the 'Campaigns' directory exists
  if (fs.existsSync(filePath)) {
    // Get an array of file names in the directory
    const fileNames = await getFiles(filePath);
    // Read the content of each file and return it as an array
    return Promise.all(
      fileNames.map(name =>
        fs.promises.readFile(path.join(filePath, name + fileName), 'utf-8')
      )
    );
  } else {
    return []
    // Throw an error if the directory does not exist
  }
}

/**
 * Saves a file to the given path.
 *
 * @param {Event} event The event that triggered this function.
 * @param {Object} data An object containing the filePath, fileName, and content of the file to be saved.
 * @param {string} data.filePath The directory path where the file should be saved.
 * @param {string} data.fileName The name of the file to be saved.
 * @param {string} data.content The content of the file to be saved.
 * @returns {Promise<void>} A Promise that resolves when the file is saved.
 */
async function saveFile(event, data) {
  const filePath = path.join(defaultPath, data['filePath']);
  const fileName = data['fileName'];
  const content = data['content'];

  // Check if the directory exists, create it if it does not
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(filePath, {recursive: true, mode: 0o777});
  }

  // Save the file
  return fs.writeFileSync(path.join(filePath, fileName), content);
}

/**
 * Recursively deletes a file or directory at the given path.
 *
 * @param {Event} event The event that triggered this function.
 * @param {Object} data An object containing the filePath and fileName of the file or directory to be deleted.
 * @param {string} data.filePath The directory path where the file or directory should be deleted from.
 * @param {string} data.fileName The name of the file or directory to be deleted.
 * @returns {Promise<void>} A Promise that resolves when the file or directory is deleted.
 */
async function deleteFile(event, data) {
  const filePath = path.join(defaultPath, data['filePath']);
  const fileName = data['fileName'];
  const fullPath = path.join(filePath, fileName);

  // Recursively delete the file or directory
  try {
    return fs.rmSync(fullPath, {recursive: true});
  } catch (err) {
    throw Error('Error deleting file: ' + err);
  }


}
