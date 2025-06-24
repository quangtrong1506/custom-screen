import { autoUpdater } from 'electron-updater';
import { app, ipcMain } from 'electron';
import { log } from '../dev-log';
import { sendWebContents } from '../web-contents';
import { showNativeNotification } from './notifications';

autoUpdater.setFeedURL({
    provider: 'github',
    owner: 'quangtrong1506',
    repo: 'custom-screen',
    token: process.env.GH_TOKEN,
    releaseType: 'release',
    publishAutoUpdate: true,
    private: false,
});
autoUpdater.logger = log;
let mw: Electron.BrowserWindow | null = null;
function setupAutoUpdater(mainWindow: Electron.BrowserWindow) {
    mw = mainWindow;
    autoUpdater.autoDownload = true;
    autoUpdater.autoInstallOnAppQuit = true;

    autoUpdater.on('checking-for-update', () => {
        console.log('🧐 Đang kiểm tra cập nhật...');
    });

    autoUpdater.on('update-available', (info) => {
        log.info('🆕 Có bản cập nhật mới:', info);
        sendWebContents(mainWindow, 'update', {
            new: true,
            data: info,
        });
    });

    autoUpdater.on('update-not-available', (info) => {
        console.log('🆕 Có bản cập nhật mới:', info);
    });

    autoUpdater.on('error', (err) => {
        log.error('❌ Lỗi cập nhật:', err);
        sendWebContents(mainWindow, 'update', {
            error: err.message,
            data: err,
        });
    });

    autoUpdater.on('update-downloaded', (info) => {
        log.info('✅ Đã tải xong cập nhật, sẽ cài đặt khi thoát...');
        // autoUpdater.quitAndInstall();
        sendWebContents(mainWindow, 'update', {
            confirm: true,
            data: {
                messenger: `Đã có cập nhật phiên bản mới (${info.version})`,
                info,
            },
        });
        showNativeNotification({
            title: 'Cập nhật',
            body: `Đã có cập nhật phiên bản mới (${info.version})`,
            onClick() {
                log.info('Cài đặt cập nhật');
                mainWindow.destroy();
                app.relaunch();
                app.exit(0);
            },

            actions: [
                {
                    type: 'button',
                    text: 'Cài đặt',
                    onClick: () => {
                        mainWindow.destroy();
                        app.relaunch();
                        app.exit(0);
                    },
                },
            ],
        });
    });

    autoUpdater.checkForUpdates();
    setInterval(() => {
        autoUpdater.checkForUpdates();
    }, 15 * 60 * 1000);
}

ipcMain.on('update', (_e, data) => {
    if (data?.check) autoUpdater.checkForUpdates();
});
ipcMain.on('update', (_e, data) => {
    if (data?.confirm) {
        mw.destroy();
        app.relaunch();
        app.exit(0);
    }
});

export { setupAutoUpdater };
