/** Gửi dữ liệu ra web contents */
function sendWebContents(mainWindow: Electron.BrowserWindow, key: string, data: unknown) {
	mainWindow.webContents.send('main', {
		[key]: data
	});
}

export { sendWebContents };
