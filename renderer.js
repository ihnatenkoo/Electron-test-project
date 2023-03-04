window.addEventListener('DOMContentLoaded', () => {
	const titleBlock = document.querySelector('h1');
	const infoBlock = document.querySelector('.info');

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
});
