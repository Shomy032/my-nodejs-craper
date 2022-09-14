const { app, BrowserWindow, ipcMain } = require('electron')
const { extractParseAndReadBgImgUrlAll } = require("./src/helpers/get-all-heroes-pictures")
const path = require('path')
const { ScraperHelper, FsHelper } = require("./src/helpers/helper");
const helper = new ScraperHelper();
const fsHelper = new FsHelper();

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1000,
        height: 700,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'src/preload/preload.js')
        }
    })

    win.loadFile('index.html')
    win.webContents.openDevTools()

    return win;
}


app.whenReady().then(() => {

    const win = createWindow();
    registerListeners(win)

    // first clean to handle if app crached before , and didnt cleaned
    clenupTpmFsCache()
    createTpmFsCache()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })

    app.on('window-all-closed', () => {
        clenupTpmFsCache()
        if (process.platform !== 'darwin') {
            app.quit()
        }
    })

    // app.on(' before-quit', () => {
    //     clenupTpmFsCache()
    // })


})

// move to env
const tmpDataDirectoryName = "tmp-data";

function createTpmFsCache() {
    fsHelper.makeDirIfNotExist(tmpDataDirectoryName)
    fsHelper.makeDirIfNotExist(`${tmpDataDirectoryName}/extracted-pictures`)
}

function clenupTpmFsCache() {
    fsHelper.forceDeleteDir(tmpDataDirectoryName)
}

function registerListeners(win) {
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
}