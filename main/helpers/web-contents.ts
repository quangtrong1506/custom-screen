type KEY = 'log';

/** Gửi dữ liệu ra web contents */
function sendWebContents(mainWindow: Electron.BrowserWindow, key: KEY, data: any) {
    mainWindow.webContents.send('main', {
        [key]: data,
    });
}

export { sendWebContents };
