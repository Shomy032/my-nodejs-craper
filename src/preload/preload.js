const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    setTitle: (title) => ipcRenderer.send('set-title', title),
    extractParseAndReadBgImgUrlAll: (payload) => ipcRenderer.invoke('extractParseAndReadBgImgUrlAll', payload)
})