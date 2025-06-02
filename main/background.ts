import path from 'path';
import 'dotenv/config';
import { app, ipcMain, screen } from 'electron';
import serve from 'electron-serve';
import { autoUpdater } from 'electron-updater';
import { createWindow } from './helpers';

const isProd = process.env.NODE_ENV === 'production';

autoUpdater.setFeedURL('https://api.github.com/repos/quangtrong1506/custom-screen/releases/latest');

// autoUpdater.setFeedURL({
//     provider: 'github',
//     owner: 'quangtrong1506',
//     repo: 'custom-screen',
//     releaseType: 'release',
// });

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
    }
    mainWindow.webContents.openDevTools();

    // autoUpdater.checkForUpdatesAndNotify();
    setInterval(() => {
        mainWindow.webContents.send('main', {
            log: 'checked for updates',
        });
        autoUpdater
            .checkForUpdates()
            .then((e) => {
                mainWindow.webContents.send('main', {
                    log: 'checked for updates @',
                });

                mainWindow.webContents.send('main', {
                    log: {
                        event: e,
                        ver: autoUpdater.currentVersion,
                        info: autoUpdater.updateConfigPath,
                        other: autoUpdater.forceDevUpdateConfig,
                    },
                });
            })
            .catch((e) => {
                mainWindow.webContents.send('main', {
                    log: 'Error checking for updates @',
                });
                mainWindow.webContents.send('main', {
                    log: e,
                });
            });
    }, 10 * 1000);
})();

app.on('window-all-closed', () => {
    app.quit();
});
