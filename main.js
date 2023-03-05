const {
	app,
	BrowserWindow,
	ipcMain,
	Menu,
	dialog,
	session,
} = require('electron');
const path = require('path');

const createWindow = () => {
	const ses = session.defaultSession;

	const win = new BrowserWindow({
		width: 1000,
		height: 600,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
		},
	});

	const menu = Menu.buildFromTemplate([
		{
			label: app.name,
			submenu: [
				{
					label: 'Increment',
					click: () => win.webContents.send('update-counter', 1),
				},
				{
					label: 'Decrement',
					click: () => win.webContents.send('update-counter', -1),
				},
			],
		},
	]);
	Menu.setApplicationMenu(menu);

	ses.on('will-download', (e, downloadItem, webContents) => {
		webContents.send('downloadStatus', 'downloading');
		const fileName = downloadItem.getFilename();
		const fileSize = downloadItem.getTotalBytes();
		downloadItem.setSavePath(app.getAppPath() + `${fileName}`);

		downloadItem.on('updated', (e, state) => {
			let received = downloadItem.getReceivedBytes();

			if (state === 'progressing' && received) {
				let progress = Math.round((received / fileSize) * 100);
				webContents.executeJavaScript(
					`globalThis.progress.value = ${progress}`
				);

				if (downloadItem.isPaused()) {
					webContents.send('downloadStatus', 'pause');
				} else {
					webContents.send('downloadStatus', 'downloading');
				}
			}
		});

		downloadItem.on('done', (e, state) => {
			if (state === 'cancelled') {
				webContents.executeJavaScript(`globalThis.progress.value = 0`);
				webContents.send('downloadStatus', 'cancel');
			}
		});

		ipcMain.on('pause', () => downloadItem.pause());
		ipcMain.on('resume', () => downloadItem.resume());
		ipcMain.on('cancel', () => downloadItem.cancel());
	});

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
