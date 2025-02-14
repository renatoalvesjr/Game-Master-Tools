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

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) initWindow()
  })
})
let fs = require('fs');

async function save(filePath, fileName, content) {
  console.log('filepath: ' + filePath)
  console.log('filename: ' + fileName)
  console.log('content: ' + content)
  const path = app.getPath("appData") + "/GameMasterTools/" + filePath;
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, {recursive: true});
  }
  fs.writeFileSync(path + fileName, content, "utf-8");
}

async function saveFile(event, data) {
  console.log(data)
  await save(data['filePath'], data['fileName'], data['content'])
}

async function openFile() {
  const {canceled, filePaths} = await require('electron').dialog.showOpenDialog({
    properties: ['openFile']
  });
  if (!canceled && filePaths.length > 0) {
    return filePaths[0];
  }
}
