const path = require('path');
const url = require('url');
const {app, BrowserWindow, ipcMain, desktopCapturer} = require('electron');

let win;

function createWindow() {
    win = new BrowserWindow({
        width: 1200,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'script.js')
        }
    });

    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    win.webContents.openDevTools();

    win.on('closed', () => {
        win = null;
    });
}

app.on('ready', createWindow);


app.on('window-all-closed', () => {
    app.quit();
});

ipcMain.on("stream-start", (e, data) => {
    console.log('stream-start')
    desktopCapturer.getSources({ types: ['window', 'screen'] }).then(async sources => {
        for (const source of sources) {
            console.log(source)
            win.webContents.send('stream-data', 'screen:1:0',)
            return
        }
    })
});

ipcMain.on("stream-stop", (e, data) => {
    console.log('stream-stop')
});