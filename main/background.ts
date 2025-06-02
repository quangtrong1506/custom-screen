import path from 'path';
import 'dotenv/config';
import { app, screen } from 'electron';
import serve from 'electron-serve';
import { createTray, createWindow, setupAutoUpdater } from './helpers';

const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
    serve({ directory: 'app' });
} else {
    app.setPath('userData', `${app.getPath('userData')} (development)`);
}

(async () => {
    await app.whenReady();
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;
    const mainWindow = createWindow('main', {
        width,
        height,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
        maximizable: true,
        frame: false,
    });
    mainWindow.setMenu(null);
    mainWindow.maximize();

    if (isProd) {
        await mainWindow.loadURL('app://./');
    } else {
        const port = process.argv[2];
        await mainWindow.loadURL(`http://localhost:${port}/`);
        console.log('token', process.env.GH_TOKEN);
        mainWindow.webContents.openDevTools();
    }
    // Call
    createTray(mainWindow);
    setupAutoUpdater(mainWindow);
})();

app.on('window-all-closed', () => {
    app.quit();
});
