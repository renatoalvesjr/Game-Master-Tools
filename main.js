const { app, shell, ipcMain, BrowserWindow } = require("electron");
const url = require("url");
const path = require("path");

let appWindow;

function initWindow() {
  appWindow = new BrowserWindow({
    simpleFullscreen: true,
    width: 1280,
    height: 720,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
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
  );

  appWindow.maximize();

  appWindow.once("ready-to-show", () => {
    appWindow.show();
  });

  appWindow.on("closed", () => {
    appWindow = null;
  });
}

ipcMain.on("open-external-link", (_event, url) => {
  shell.openExternal(url);
});

app.on("ready", initWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (appWindow === null) {
    initWindow();
  }
});
