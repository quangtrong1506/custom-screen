import { IpcKey } from '../../types';

/** Gửi dữ liệu ra web contents */
function sendWebContents(mainWindow: Electron.BrowserWindow, key: (typeof IpcKey)[keyof typeof IpcKey], data: unknown) {
	mainWindow.webContents.send('main', {
		[key]: data
	});
}

export { sendWebContents };
