import { Layout } from 'react-grid-layout';
import { ShortcutInterface } from '../components/shortcut/item/type';

export const IpcKey = {
	/** Đẩy video vào backend */
	uploadVideo: 'UPLOAD_VIDEO',

	/** Xoá video */
	deleteVideo: 'DELETE_VIDEO',

	/** Đẩy thumbnail cho shortcut */
	uploadShortcutMedia: 'UPLOAD_SHORTCUT_MEDIA',

	/** Xoá thumbnail cho shortcut */
	deleteShortcutMedia: 'DELETE_SHORTCUT_MEDIA',

	/** Lấy danh sách video */
	getVideoList: 'GET_VIDEO_LIST',

	/** Lấy video + type nền */
	getBackground: 'GET_BACKGROUND',

	/** Cài nền */
	setBackgroundVideo: 'SET_BACKGROUND_VIDEO',

	/** Lấy danh sách shortcut */
	getShortcuts: 'GET_SHORTCUTS',

	/** set zoom cho shortcut */
	setScaleBackground: 'SET_SCALE_BACKGROUND',

	/** Lưu các shortcut */
	saveShortcuts: 'SAVE_SHORTCUTS',

	/** Mở ứng dụng shortcut */
	openShortcutApp: 'OPEN_SHORTCUT_APP',

	/** Đóng ứng dụng xuống tray */
	closeMainWindow: 'CLOSE_MAIN_WINDOW',

	/** Lấy thông tin ứng dụng */
	getAppInfo: 'GET_APP_INFO',

	/** Kiểm tra cập nhật */
	checkForUpdate: 'CHECK_FOR_UPDATE'
};

export interface IPCResponseInterface {
	/** Đẩy video vào backend */
	uploadVideo: boolean | string;

	/** Xoá video */
	deleteVideo: boolean | string;

	/** Đẩy thumbnail cho shortcut */
	uploadShortcutMedia: boolean | string;

	/** Xoá thumbnail cho shortcut */
	deleteShortcutMedia: boolean | string;

	/** Lấy danh sách video */
	getVideoList: {
		list: {
			id: string;
			name: string;
			location: string;
			thumbnail?: string;
			isDefault?: boolean;
		}[];
		total: number;
	};
	/** Lấy video + type nền */
	getBackground: {
		video: {
			location: string;
			thumbnail?: string;
			isDefault?: boolean;
		};
		type: 'auto' | 'cover' | 'contain';
	};

	/** Cài nền */
	setBackgroundVideo: string | null;

	/** Lấy danh sách shortcut */
	getShortcuts: {
		scale: number;
		items: ShortcutInterface[];
		show: boolean;
		layout: Layout[];
	};

	/** set zoom cho shortcut */
	setScaleBackground: number | boolean;

	/** Lưu các shortcut */
	saveShortcuts: 'SAVE_SHORTCUTS';

	/** Mở ứng dụng shortcut */
	openShortcutApp: string | boolean;

	/** Đóng ứng dụng xuống tray */
	closeMainWindow: boolean;

	/** Lấy thông tin ứng dụng */
	getAppInfo: {
		version: string;
		name: string;
		platform: string;
	};

	/** Kiểm tra cập nhật */
	checkForUpdate: { version: string } | null;
}

export interface IpcBodyInterface {
	/** Đẩy video vào backend */
	uploadVideo: {
		id: string;
		list: {
			id?: string;
			title?: string;
			path?: string;
			buffer?: Buffer<ArrayBuffer>;
		}[];
	};

	/** Xoá video */
	deleteVideo: {
		id?: string;
	};

	/** Đẩy thumbnail cho shortcut */
	uploadShortcutMedia: {
		id: string;
		media: {
			path?: string;
			buffer?: Buffer<ArrayBuffer>;
		};
	};

	/** Xoá thumbnail cho shortcut */
	deleteShortcutMedia: {
		id: string;
	};

	/** Lấy danh sách video */
	getVideoList: null;
	/** Lấy video + type nền */
	getBackground: null;

	/** Cài nền */
	setBackgroundVideo: {
		id: string;
	};

	/** Lấy danh sách shortcut */
	getShortcuts: null;

	/** set zoom cho shortcut */
	setScaleBackground: number;

	/** Lưu các shortcut */
	saveShortcuts: 'SAVE_SHORTCUTS';

	/** Mở ứng dụng shortcut */
	openShortcutApp: {
		path: string;
	};

	/** Đóng ứng dụng xuống tray */
	closeMainWindow: null;

	/** Lấy thông tin ứng dụng */
	getAppInfo: null;

	/** Kiểm tra cập nhật */
	checkForUpdate: null;
}

export type IpcKeyInterface = (typeof IpcKey)[keyof typeof IpcKey];
