import { ipcMain } from 'electron';
import { IpcKey } from '../../../types';
import { log } from '../../dev-log';
import {
	handleCloseMainWindow,
	handleDeleteMedia,
	handleDeleteVideo,
	handleGetAppInfo,
	handleGetBackground,
	handleGetShortcuts,
	handleGetVideoList,
	handleOpenShortcutApp,
	handleSaveShortcuts,
	handleSetBackground,
	handleSetScaleBackground,
	handleUploadMedia,
	handleUploadVideo
} from './ipc-main-handlers';

export function connectIpcMain(mainWindow: Electron.BrowserWindow) {
	log.info('Connecting IPC main handlers...');
	// Upload Video
	ipcMain.on(IpcKey.uploadVideo, handleUploadVideo(mainWindow));
	ipcMain.on(IpcKey.getVideoList, handleGetVideoList(mainWindow));
	ipcMain.on(IpcKey.setScaleBackground, handleSetScaleBackground());
	ipcMain.on(IpcKey.closeMainWindow, handleCloseMainWindow(mainWindow));
	ipcMain.on(IpcKey.getBackground, handleGetBackground(mainWindow));

	// handle
	ipcMain.handle(IpcKey.deleteVideo, handleDeleteVideo(mainWindow));
	ipcMain.handle(IpcKey.uploadShortcutMedia, handleUploadMedia);
	ipcMain.handle(IpcKey.deleteShortcutMedia, handleDeleteMedia);
	ipcMain.handle(IpcKey.setBackgroundVideo, handleSetBackground(mainWindow));
	ipcMain.handle(IpcKey.getShortcuts, handleGetShortcuts);
	ipcMain.handle(IpcKey.saveShortcuts, handleSaveShortcuts);
	ipcMain.handle(IpcKey.openShortcutApp, handleOpenShortcutApp);
	ipcMain.handle(IpcKey.getAppInfo, handleGetAppInfo);
}
