import { app, nativeImage, Notification } from 'electron';
import * as path from 'path';
import { log } from '../dev-log';

/**
 * Gửi thông báo kèm nút bấm
 */

type Action = Electron.NotificationAction & {
	onClick?: () => void;
};

interface Options {
	title: string;
	body?: string;
	actions?: Action[];
	onClick?: () => void;
	onClose?: () => void;
}

export function showNativeNotification(options: Options): void {
	const { title, body, actions, onClick, onClose } = options;
	const iconPath = app.isPackaged
		? path.join(process.resourcesPath, 'icon.ico') // production: MY_APP/resources/icon.ico
		: path.join(__dirname, '../resources/icon.ico'); // dev: chạy từ source
	const trayIcon = nativeImage.createFromPath(iconPath);

	const notification = new Notification({
		title: title,
		body: body,
		icon: trayIcon,
		actions: actions?.map(action => ({ type: action.type, text: action.text })) || [],
		closeButtonText: 'Đóng'
	});

	notification.on('action', (_event, index) => {
		log.debug('Người dùng nhập với nút bấm', index);
		actions?.[index].onClick?.();
	});

	notification.on('click', () => {
		log.debug('Người dùng đã click vào thông báo');
		onClick?.();
	});
	notification.on('close', () => {
		log.debug('Người dùng đã click vào close thông báo');
		onClose?.();
	});

	notification.show();
}
