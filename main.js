const {app, ipcMain, BrowserWindow} = require("electron");
const path = require("path");
let fs = require('fs');

let appWindow;

function initWindow() {
  appWindow = new BrowserWindow({
    simpleFullscreen: true,
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js")
    },
  });
  appWindow.loadURL(
    // url.format({
    //   pathname: path.join(
    //     __dirname,
    //     "/dist/game-master-tools/browser/index.html"
    //   ),
    //   protocol: "file",
    //   slashes: true,
    // })
    'http://localhost:4200'
  ).then();

  appWindow.maximize();

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

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) initWindow()
  })
})

const defaultPath = app.getPath("appData") + "/GameMasterTools/";


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
    // Throw an error if the directory does not exist
    throw new Error(`The directory at path '${filePath}' does not exist.`);
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
    return fs.rmSync(fullPath,{recursive: true});
  } catch (err) {
    throw Error('Error deleting file: ' + err);
  }


}
