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

    ipcMain.on("set-title", async (event, title) => {
        // console.log("title", title)
    })

    ipcMain.handle("extractParseAndReadBgImgUrlAll", async (event, { origin, evaluatedSelector, folderName, urlListName }) => {
        try {
            return await extractParseAndReadBgImgUrlAll({ origin, evaluatedSelector, folderName, urlListName })
        } catch (err) {
            win.webContents.send('job-failed', err.originalMessage)
        }
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