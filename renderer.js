window.addEventListener('DOMContentLoaded', () => {
	const titleBlock = document.querySelector('h1');
	const infoBlock = document.querySelector('.info');
	const titleInput = document.querySelector('#window-title');
	const changeTitleBtn = document.querySelector('.changeBtn');
	const openFileBtn = document.querySelector('.openBtn');
	const filePath = document.querySelector('.filePath');
	const counter = document.querySelector('.counter');

	infoBlock.innerHTML = `
	<h2>This versions:<h2> 
	<p>chrome: ${globalThis.versions.chrome}</p>
	<p>	node: ${globalThis.versions.node}</p>
	<p>Electron: ${globalThis.versions.electron}</p>`;

	const getIpcMessage = async () => {
		const res = await globalThis.versions.ping();
		console.log(res);
	};

	titleBlock.addEventListener('click', getIpcMessage);

	changeTitleBtn.addEventListener('click', () => {
		apiElectron.setTitle(titleInput.value);
	});

	openFileBtn.addEventListener('click', async () => {
		const path = await apiElectron.openFile();
		filePath.textContent = path;
	});

	apiElectron.onUpdateCounter((_event, value) => {
		const oldValue = +counter.innerText;
		const newValue = oldValue + value;
		counter.textContent = newValue;
	});
});
