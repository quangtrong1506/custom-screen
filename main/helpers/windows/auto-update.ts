import { ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import { IpcKey } from '../../types';
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
	private: false
});
// autoUpdater.logger = log;
function setupAutoUpdater(mainWindow: Electron.BrowserWindow, callbackDownload?: () => void) {
	autoUpdater.autoDownload = true;
	autoUpdater.autoInstallOnAppQuit = true;
	autoUpdater.autoRunAppAfterInstall = true;

	autoUpdater.on('checking-for-update', () => {
		// console.log('🧐 Đang kiểm tra cập nhật...');
	});

	autoUpdater.on('update-available', info => {
		log.info('🆕 Có bản cập nhật mới:', info.version);
		sendWebContents(mainWindow, 'checkForUpdate', {
			new: true,
			data: info
		});
	});

	autoUpdater.on('error', err => {
		log.error('❌ Lỗi cập nhật:', err);
		sendWebContents(mainWindow, 'checkForUpdate', {
			error: err.message,
			data: err
		});
	});

	autoUpdater.on('update-downloaded', info => {
		callbackDownload?.();
		log.info('✅ Đã tải xong cập nhật, sẽ cài đặt khi thoát...');
		sendWebContents(mainWindow, 'checkForUpdate', {
			confirm: true,
			data: {
				messenger: `Đã có cập nhật phiên bản mới (${info.version})`,
				info
			}
		});
		showNativeNotification({
			title: `Cập nhật phiên bản(${info.version})`,
			body: `Đã có cập nhật phiên bản mới (${info.version}) tự động thoát để cập nhật`
		});
		setTimeout(() => {
			autoUpdater.quitAndInstall();
		}, 1000);
	});

	autoUpdater.checkForUpdates();
	setInterval(
		() => {
			autoUpdater.checkForUpdates();
		},
		15 * 60 * 1000
	);
}

ipcMain.handle(IpcKey.checkForUpdate, async (_e, _data) => {
	const a = await autoUpdater.checkForUpdates();
	return a;
});

export { setupAutoUpdater };
