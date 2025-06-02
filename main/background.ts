import path from 'path';
import 'dotenv/config';
import { app, ipcMain, screen } from 'electron';
import serve from 'electron-serve';
import { autoUpdater } from 'electron-updater';
import { createWindow, setupAutoUpdater } from './helpers';

const isProd = process.env.NODE_ENV === 'production';

autoUpdater.setFeedURL({
    provider: 'github',
    owner: 'quangtrong1506',
    repo: 'custom-screen',
    token: process.env.GH_TOKEN,
    releaseType: 'release',
    publishAutoUpdate: true,
    private: false,
});

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
        setupAutoUpdater(mainWindow);
    } else {
        const port = process.argv[2];
        await mainWindow.loadURL(`http://localhost:${port}/`);
        console.log('token', process.env.GH_TOKEN);
    }
    mainWindow.webContents.openDevTools();
})();

app.on('window-all-closed', () => {
    app.quit();
});
