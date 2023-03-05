const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('versions', {
	node: process.versions.node,
	chrome: process.versions.chrome,
	electron: process.versions.electron,
	ping: () => ipcRenderer.invoke('ping'),
});

contextBridge.exposeInMainWorld('apiElectron', {
	setTitle: (title) => ipcRenderer.send('set-title', title),
	openFile: () => ipcRenderer.invoke('dialog:openFile'),
	onUpdateCounter: (callback) => ipcRenderer.on('update-counter', callback),
});

contextBridge.exposeInMainWorld('downloadFile', {
	onChangeDownloadStatus: (callback) =>
		ipcRenderer.on('downloadStatus', callback),
	onPause: () => ipcRenderer.send('pause'),
	onResume: () => ipcRenderer.send('resume'),
	onCancel: () => ipcRenderer.send('cancel'),
});
