window.addEventListener('DOMContentLoaded', () => {
	const infoBlock = document.querySelector('.info');

	infoBlock.innerHTML = `
	<h2>This versions:<h2> 
	<p>chrome: ${globalThis.versions.chrome}</p>
	<p>	node: ${globalThis.versions.node}</p>
	<p>Electron: ${globalThis.versions.electron}</p>`;
});
