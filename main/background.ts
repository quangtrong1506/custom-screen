import path from 'path';
import { app, screen } from 'electron';
import serve from 'electron-serve';
import { connectIpcMain, createTray, createWindow, setupAutoUpdater } from './helpers';
import 'dotenv/config';
import { log } from './helpers';

const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
    serve({ directory: 'app' });
} else {
    app.setPath('userData', `D:\\Apps\\${app.name}(development)`);
    // app.setPath('userData', `${app.getPath('userData')} (development)`);
}

app.setName('Live wallpaper for Windows');
(async () => {
    if (!app.requestSingleInstanceLock()) app.quit();
    else
        app.on('second-instance', () => {
            if (mainWindow) {
                if (mainWindow.isMinimized()) mainWindow.restore();
                mainWindow.show();
                mainWindow.focus();
            }
        });

    await app.whenReady();
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;
    const mainWindow = createWindow('main', {
        width,
        height,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            webSecurity: false,
        },
        maximizable: true,
        frame: false,
    });

    mainWindow.setMenu(null);
    mainWindow.maximize();
    if (process.platform === 'win32') app.setAppUserModelId(app.name);

    if (isProd) {
        await mainWindow.loadURL('app://./');
        app.setLoginItemSettings({
            openAtLogin: true,
            path: app.getPath('exe'),
        });
    } else {
        const port = process.argv[2];
        await mainWindow.loadURL(`http://localhost:${port}/`);
        mainWindow.webContents.openDevTools();
    }
    // Event
    mainWindow.addListener('close', (e) => {
        e.preventDefault();
        mainWindow.hide();
    });
    mainWindow.setSkipTaskbar(true);
    // Call
    createTray(mainWindow);
    setupAutoUpdater(mainWindow);
    connectIpcMain(mainWindow);
})();

app.on('window-all-closed', () => {
    app.quit();
});

process.on('uncaughtException', function (err) {
    log.error(err, 'error');
});
