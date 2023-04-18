const { app, BrowserWindow } = require("electron");
require('@electron/remote/main').initialize()


function createWindow() {
  // Create the browser window.
    let win = new BrowserWindow({
        width: 1280,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
        },
    });

    require("@electron/remote/main").enable(win.webContents)

    win.loadURL( "http://localhost:3000");
//   win.loadURL(
//     isDev
//       ? "http://localhost:3000"
//       : `file://${path.join(__dirname, "../build/index.html")}`
//   );
    // win.webContents.openDevTools()
}

app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
