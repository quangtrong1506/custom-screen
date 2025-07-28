export enum IpcKey {
	/** Đẩy video vào backend */
	uploadVideo = 'UPLOAD_VIDEO',

	/** Xoá video */
	deleteVideo = 'DELETE_VIDEO',

	/** Đẩy thumbnail cho shortcut */
	uploadShortcutMedia = 'UPLOAD_SHORTCUT_MEDIA',

	/** Xoá thumbnail cho shortcut */
	deleteShortcutMedia = 'DELETE_SHORTCUT_MEDIA',

	/** Lấy danh sách video */
	getVideoList = 'GET_VIDEO_LIST',

	/** Lấy video + type nền */
	getBackground = 'GET_BACKGROUND',

	/** Cài nền */
	setBackground = 'SET_BACKGROUND',

	/** Lấy danh sách shortcut */
	getShortcuts = 'GET_SHORTCUTS',

	/** set zoom cho shortcut */
	setScaleBackground = 'SET_SCALE_BACKGROUND',

	/** Lưu các shortcut */
	saveShortcuts = 'SAVE_SHORTCUTS',

	/** Mở ứng dụng shortcut */
	openShortcutApp = 'OPEN_SHORTCUT_APP',

	/** Đóng ứng dụng xuống tray */
	closeMainWindow = 'CLOSE_MAIN_WINDOW',

	/** Lấy thông tin ứng dụng */
	getAppInfo = 'GET_APP_INFO',

	/** Kiểm tra cập nhật */
	checkForUpdate = 'CHECK_FOR_UPDATE'
}
