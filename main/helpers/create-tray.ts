import { Menu, Tray, BrowserWindow, shell, app, nativeImage } from 'electron';
import path from 'path';
import { log } from './dev-log';

let tray: Tray | null = null;
let isVisible = true;

export function createTray(mainWindow: BrowserWindow): void {
    try {
        const iconPath = app.isPackaged
            ? path.join(process.resourcesPath, 'icon.ico') // production: MY_APP/resources/icon.ico
            : path.join(__dirname, '../resources/icon.ico'); // dev: chạy từ source
        const trayIcon = nativeImage.createFromPath(iconPath);
        if (trayIcon.isEmpty()) {
            log.debug('❌ Không thể load icon tray từ:', iconPath);
            return;
        }

        if (!tray) tray = new Tray(iconPath);

        const contextMenu = Menu.buildFromTemplate([
            {
                label: isVisible ? 'Ẩn cửa sổ' : 'Hiện cửa sổ',
                click: () => {
                    if (isVisible) mainWindow.hide();
                    else {
                        mainWindow.show();
                        mainWindow.maximize();
                    }
                },
            },
            {
                label: 'Cài đặt',
                click: () => {
                    mainWindow.show();
                    mainWindow.webContents.send('navigate-to', '/settings');
                },
            },
            { type: 'separator' },
            {
                label: 'Dev: Mở DevTools',
                click: () => mainWindow.webContents.openDevTools({ mode: 'detach' }),
            },
            {
                label: 'Dev: Xem Log',
                click: () => {
                    const logPath = log.transports.file.getFile().path;
                    shell.openPath(logPath);
                },
            },
            { type: 'separator' },
            {
                label: 'Thoát',
                click: () => mainWindow.destroy(),
            },
        ]);

        tray.setToolTip(app.name);
        tray.setContextMenu(contextMenu);

        tray.on('click', () => {
            if (mainWindow.isVisible()) mainWindow.hide();
            else {
                mainWindow.show();
                mainWindow.maximize();
            }
        });

        mainWindow.on('hide', () => {
            isVisible = false;
            createTray(mainWindow);
        });

        mainWindow.on('show', () => {
            isVisible = true;
            createTray(mainWindow);
        });
    } catch (error) {
        log.error(error);
    }
}
