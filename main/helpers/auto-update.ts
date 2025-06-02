import { autoUpdater } from 'electron-updater';
import log from 'electron-log';

autoUpdater.logger = log;
log.transports.file.level = 'info';

function setupAutoUpdater(mainWindow: Electron.BrowserWindow) {
    autoUpdater.autoDownload = true;

    autoUpdater.on('checking-for-update', () => {
        log.info('🧐 Đang kiểm tra cập nhật...');
        mainWindow.webContents.send('update', 'checking');
    });

    autoUpdater.on('update-available', (info) => {
        log.info('🆕 Có bản cập nhật mới:', info);
        mainWindow.webContents.send('update', 'available');
    });

    autoUpdater.on('update-not-available', (info) => {
        log.info('🙅‍♂️ Không có bản cập nhật mới:', info);
        mainWindow.webContents.send('update', 'none');
    });

    autoUpdater.on('error', (err) => {
        log.error('❌ Lỗi cập nhật:', err);
        mainWindow.webContents.send('update', 'error');
    });

    autoUpdater.on('update-downloaded', () => {
        log.info('✅ Đã tải xong cập nhật, sẽ cài đặt khi thoát...');
        autoUpdater.quitAndInstall();
    });

    autoUpdater.checkForUpdates();
    setInterval(() => {
        autoUpdater.checkForUpdates();
    }, 5 * 60 * 1000);
}

export { setupAutoUpdater };
