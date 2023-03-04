const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');

const createWindow = () => {
	const win = new BrowserWindow({
		width: 1000,
		height: 600,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
		},
	});

	ipcMain.handle('ping', () => 'pong');
	win.loadFile('index.html');
	win.webContents.openDevTools();
};

const onSetTitle = (event, title) => {
	const webContents = event.sender;
	const win = BrowserWindow.fromWebContents(webContents);
	win.setTitle(title);
};

const onFileOpen = async () => {
	const { canceled, filePaths } = await dialog.showOpenDialog();
	if (canceled) {
		return;
	} else {
		return filePaths[0];
	}
};

app.whenReady().then(() => {
	ipcMain.on('set-title', onSetTitle);
	ipcMain.handle('dialog:openFile', onFileOpen);

	createWindow();

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit();
});
