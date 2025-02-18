const {app, ipcMain, BrowserWindow} = require("electron");
const url = require("url");
const path = require("path");

let appWindow;

function initWindow() {
  appWindow = new BrowserWindow({
    simpleFullscreen: true,
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, "preload.js")
    },
  });
  appWindow.loadURL(
    url.format({
      pathname: path.join(
        __dirname,
        "/dist/game-master-tools/browser/index.html"
      ),
      protocol: "file",
      slashes: true,
    })
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
  ipcMain.handle('openFile', openFile)
  ipcMain.handle('saveFile', saveFile)
  ipcMain.handle('listFiles', listFiles)
  ipcMain.handle('updateFile', updateFile)
  ipcMain.handle('createFile', createFile)
  ipcMain.handle('deleteFile', deleteFile)

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) initWindow()
  })
})
let fs = require('fs');

async function listFiles(event, data) {
  const filePath = app.getPath("appData") + "/GameMasterTools/" + data['filePath'];
  return fs.readdirSync(filePath);
}

async function save(filePath, fileName, content) {
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(filePath, {recursive: true});
  }
  fs.writeFileSync(filePath + fileName, content, "utf-8");
}

async function load(filePath, fileName) {
  if (fs.existsSync(filePath + fileName)) {
    const content = fs.readFileSync(filePath + fileName, "utf-8");
    return {filePath, fileName, content};
  }
}

async function saveFile(event, data) {
  const filePath = app.getPath("appData") + "/GameMasterTools/" + data['filePath'];
  const fileName = data['fileName'];
  const content = data['content'];
  return await save(filePath, fileName, content)
}

async function createFile(event, data) {
  const filePath = app.getPath("appData") + "/GameMasterTools/" + data['filePath'];
  const fileName = data['fileName'];
  const content = data['content'];
  if (await save(filePath, fileName, content)) {
    return await load(filePath, fileName)
  }
}


async function openFile(event, data) {
  const filePath = app.getPath('appData') + "/GameMasterTools/" + data['filePath'];
  const fileName = data['fileName'];
  return await load(filePath, fileName);
}

async function updateFile(event, data) {
  const filePath = app.getPath('appData') + "/GameMasterTools/" + data['filePath'];
  const fileName = data['fileName'];
  const content = data['content'];
  await save(filePath, fileName, content);
}

async function deleteFile(event, data) {
  const filePath = app.getPath('appData') + "/GameMasterTools/" + data['filePath'];
  const fileName = data['fileName'];
  if (fs.existsSync(filePath + fileName)) {
    fs.unlinkSync(filePath + fileName);
  }
}
