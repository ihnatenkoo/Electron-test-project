window.addEventListener('DOMContentLoaded', () => {
	const infoBlock = document.querySelector('.info');
	const titleInput = document.querySelector('#window-title');
	const changeTitleBtn = document.querySelector('.changeBtn');
	const openFileBtn = document.querySelector('.openBtn');
	const filePath = document.querySelector('.filePath');
	const counter = document.querySelector('.counter');
	const progress = document.querySelector('.progress');
	const downloadPauseBtn = document.querySelector('#download-pause');
	const downloadResumeBtn = document.querySelector('#download-resume');
	const downloadCancelBtn = document.querySelector('#download-cancel');

	//SHOW VERSIONS
	infoBlock.innerHTML = `
	<div>This versions:<div> 
	<span>chrome: ${globalThis.versions.chrome}</span>
	<span>	node: ${globalThis.versions.node}</span>
	<span>Electron: ${globalThis.versions.electron}</span>`;

	//CHANGE TITLE
	changeTitleBtn.addEventListener('click', () => {
		apiElectron.setTitle(titleInput.value);
	});

	//OPEN FILE
	openFileBtn.addEventListener('click', async () => {
		const path = await apiElectron.openFile();
		filePath.textContent = path;
	});

	// COUNTER AND MENU
	apiElectron.onUpdateCounter((_event, value) => {
		const oldValue = +counter.innerText;
		const newValue = oldValue + value;
		counter.textContent = newValue;
	});

	// DOWNLOAD FILE
	downloadFile.onChangeDownloadStatus((_event, value) => {
		if (value === 'downloading') {
			downloadPauseBtn.disabled = false;
			downloadCancelBtn.disabled = false;
			downloadResumeBtn.disabled = true;
		}
		if (value === 'pause') {
			downloadPauseBtn.disabled = true;
			downloadResumeBtn.disabled = false;
		}
		if (value === 'cancel') {
			downloadPauseBtn.disabled = true;
			downloadCancelBtn.disabled = true;
			downloadResumeBtn.disabled = true;
		}
	});

	downloadPauseBtn.addEventListener('click', async () => {
		globalThis.downloadFile.onPause();
	});
	downloadResumeBtn.addEventListener('click', async () => {
		globalThis.downloadFile.onResume();
	});
	downloadCancelBtn.addEventListener('click', async () => {
		globalThis.downloadFile.onCancel();
	});
});
