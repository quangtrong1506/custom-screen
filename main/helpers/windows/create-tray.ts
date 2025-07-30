import { app, BrowserWindow, Menu, nativeImage, shell, Tray } from 'electron';
import path from 'path';
import { IPCResponseInterface } from '../../types';
import { log } from '../dev-log';
import { sendWebContents } from '../web-contents';

let tray: Tray | null = null;

export function createTray(mainWindow: BrowserWindow): void {
	try {
		if (tray) return; // ✅ chỉ tạo 1 lần

		const iconPath = app.isPackaged
			? path.join(process.resourcesPath, 'icon.ico')
			: path.join(__dirname, '../resources/icon.ico');

		const trayIcon = nativeImage.createFromPath(iconPath);
		if (trayIcon.isEmpty()) {
			log.debug('❌ Không thể load icon tray từ:', iconPath);
			return;
		}

		tray = new Tray(trayIcon);
		tray.setToolTip(app.name);

		tray.on('click', () => {
			if (mainWindow.isVisible()) mainWindow.hide();
			else {
				mainWindow.show();
				mainWindow.maximize();
			}
		});

		mainWindow.on('show', () => {
			updateTrayMenu(mainWindow);
			sendWebContents(mainWindow, 'checkActiveWindow', {
				active: true
			} as IPCResponseInterface['checkActiveWindow']);
		});
		mainWindow.on('hide', () => {
			updateTrayMenu(mainWindow);
			sendWebContents(mainWindow, 'checkActiveWindow', {
				active: false
			});
		});

		updateTrayMenu(mainWindow); // ✅ init lần đầu
	} catch (error) {
		log.error(error);
	}
}

/**
 * Cập nhật lại text trong tray menu theo trạng thái của window
 */
function updateTrayMenu(mainWindow: BrowserWindow): void {
	if (!tray) return;

	const contextMenu = Menu.buildFromTemplate([
		{
			label: mainWindow.isVisible() ? 'Ẩn cửa sổ' : 'Hiện cửa sổ',
			click: () => {
				if (mainWindow.isVisible()) mainWindow.hide();
				else {
					mainWindow.show();
					mainWindow.maximize();
				}
				updateTrayMenu(mainWindow); // cập nhật lại label
			}
		},
		{
			label: 'Cài đặt',
			click: () => {
				mainWindow.show();
				mainWindow.webContents.send('navigate-to', '/settings');
			}
		},
		{ type: 'separator' },
		{
			label: 'Dev: Mở DevTools',
			click: () => mainWindow.webContents.openDevTools({ mode: 'detach' })
		},
		{
			label: 'Dev: Xem Log',
			click: () => {
				const logPath = log.transports.file.getFile().path;
				shell.openPath(logPath);
			}
		},
		{ type: 'separator' },
		{
			label: 'Thoát',
			click: () => mainWindow.destroy()
		}
	]);

	tray.setContextMenu(contextMenu);
}
