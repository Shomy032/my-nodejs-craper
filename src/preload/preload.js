const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    setTitle: (title) => ipcRenderer.send('set-title', title),
    extractParseAndReadBgImgUrlAll: (payload) => ipcRenderer.invoke('extractParseAndReadBgImgUrlAll', payload),
    getAllVideoUrlsFromPage: (payload) => ipcRenderer.invoke('getAllVideoUrlsFromPage', payload),

})

contextBridge.exposeInMainWorld("ipcRenderer", {

    on(channel, listener) {
        ipcRenderer.on(channel, (evt, message) => {
            listener(evt, message);
        });
    },
    removeListener(channel, listener) {
        ipcRenderer.removeListener(channel, (evt, message) => {
            listener(evt, message);
        });
    },
    invoke(channel, data) {
        return ipcRenderer.invoke(channel, data);
    }

});