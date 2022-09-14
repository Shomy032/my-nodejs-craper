const { app, BrowserWindow, ipcMain } = require('electron')
const { extractParseAndReadBgImgUrlAll } = require("./src/helpers/get-all-heroes-pictures")
const path = require('path')

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1000,
        height: 700,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'src/preload/preload.js')
        }
    })

    // connection test listenr
    ipcMain.on("set-title", async (event, title) => {
        console.log("title", title)
    })

    ipcMain.handle("extractParseAndReadBgImgUrlAll", async (event, { origin, evaluatedSelector, folderName, urlListName }) => {
        console.log('api calss')
        return await extractParseAndReadBgImgUrlAll({ origin, evaluatedSelector, folderName, urlListName })
    })

    win.loadFile('index.html')
    win.webContents.openDevTools()
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') app.quit()
    })

})