// 📁 src/main/ipc/ipc-main-handlers.ts

import { exec } from 'child_process';
import { app, shell } from 'electron';
import fs from 'fs';
import path from 'path';
import { IpcBodyInterface, IpcKey, IPCResponseInterface, SettingInterface, VideoInterface } from '../../../types';
import CACHE from '../../cache';
import { log } from '../../dev-log';
import { readJsonFile, writeJsonFile } from '../../file';
import { sendListVideos, sendWebContents, updateVideoCache } from '../../web-contents';

function delay(ms: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export function handleUploadVideo(mainWindow: Electron.BrowserWindow) {
	return async (
		_event: Electron.IpcMainEvent,
		{ id, list }: { id: string; list: VideoInterface[] }
	): Promise<IPCResponseInterface['uploadVideo']> => {
		let count = 0;
		for (const video of list) {
			const { title = new Date().getTime().toString(), buffer } = video;
			if (!buffer) {
				log.warn(`Video ${title} không có buffer, bỏ qua.`);
				continue;
			}
			const savePath = path.join(app.getPath('userData'), 'media', 'videos', title);
			fs.mkdirSync(path.dirname(savePath), { recursive: true });
			await fs.promises.writeFile(savePath, Buffer.from(buffer));
			count++;
			mainWindow.webContents.send('upload-video-progress', {
				id,
				progress: (count / list.length) * 100,
				total: list.length
			});
			await delay(500);
		}
		await updateVideoCache();
		sendListVideos(mainWindow);
		return true;
	};
}

export function handleDeleteVideo(mainWindow: Electron.BrowserWindow) {
	return async (
		_event: Electron.IpcMainInvokeEvent,
		{ id }: IpcBodyInterface['deleteVideo']
	): Promise<IPCResponseInterface['deleteVideo']> => {
		const videoDeleted = CACHE.videos.find(video => video.id === id);
		const deletePath = path.join(app.getPath('userData'), 'media', 'videos', videoDeleted?.name || '');
		console.log('video:', videoDeleted);
		console.log('s-settings:', CACHE.settings.background);

		try {
			await fs.promises.unlink(deletePath);
			log.info('Đã xóa file:', deletePath);
			await updateVideoCache();
			sendListVideos(mainWindow);
			return true;
		} catch (error: any) {
			const shouldRetry = ['EBUSY', 'EPERM', 'EACCES'].includes(error.code);
			if (shouldRetry) {
				log.warn(`File đang bị khoá, thử lại sau 2 giây: ${deletePath}`);
				await delay(2000);
				try {
					await fs.promises.unlink(deletePath);
					log.info('Xoá lại thành công:', deletePath);
					await updateVideoCache();
					sendListVideos(mainWindow);
					return true;
				} catch (retryError) {
					log.error('Xoá lần 2 vẫn lỗi:', retryError);
					throw retryError;
				}
			}
			log.error('Lỗi xoá video:', error);
			throw error;
		}
	};
}

export async function handleUploadMedia(
	_event: any,
	{ fileName, buffer }: { fileName: string; buffer: ArrayBuffer }
): Promise<IPCResponseInterface['uploadShortcutMedia']> {
	try {
		const savePath = path.join(app.getPath('userData'), 'media', 'shortcuts', fileName);
		fs.mkdirSync(path.dirname(savePath), { recursive: true });
		await fs.promises.writeFile(savePath, Buffer.from(buffer));
		return savePath.replaceAll('\\', '/');
	} catch (error) {
		log.error('Lỗi upload media:', error);
		return false;
	}
}

export async function handleDeleteMedia(
	_event: any,
	{ path: filePath }: { path: string }
): Promise<IPCResponseInterface['deleteShortcutMedia']> {
	try {
		if (!fs.existsSync(filePath)) return false;
		await fs.promises.unlink(filePath);
		return true;
	} catch (error) {
		log.error('Lỗi xoá media:', error);
		return false;
	}
}

export function handleGetVideoList(mainWindow: Electron.BrowserWindow) {
	return () => sendListVideos(mainWindow);
}

export function handleGetBackground(mainWindow: Electron.BrowserWindow) {
	return async () => {
		try {
			sendWebContents(mainWindow, IpcKey.getBackground, CACHE.settings.background);
		} catch (error) {
			log.error(error);
		}
	};
}

export function handleSetBackground(mainWindow: Electron.BrowserWindow) {
	return async (_event: unknown, { id }: IpcBodyInterface['setBackgroundVideo']) => {
		const settingsPath = path.join(app.getPath('userData'), 'config', 's.bak');
		const data = (await readJsonFile<SettingInterface>(settingsPath)) || CACHE.settings;
		const backgroundPath = CACHE.videos.find(video => video.id === id)?.location || '';
		data.background = {
			...data.background,
			video: {
				location: backgroundPath
			}
		};
		CACHE.settings.background.video.location = backgroundPath;
		await writeJsonFile(settingsPath, data);
		sendWebContents(mainWindow, IpcKey.getBackground, backgroundPath);
		return { success: true };
	};
}

export async function handleGetShortcuts() {
	const settingsPath = path.join(app.getPath('userData'), 'config', 's.bak');
	const data = (await readJsonFile<SettingInterface>(settingsPath)) || CACHE.settings;
	return data.shortcuts || CACHE.settings.shortcuts;
}

export function handleSetScaleBackground() {
	return async (_event: any, { scale }: { scale: number }) => {
		const settingsPath = path.join(app.getPath('userData'), 'config', 's.bak');
		const data = (await readJsonFile<SettingInterface>(settingsPath)) || CACHE.settings;
		data.shortcuts = { ...data.shortcuts, scale };
		await writeJsonFile(settingsPath, data);
	};
}

export async function handleSaveShortcuts(_e: any, args: Partial<SettingInterface['shortcuts']>) {
	const settingsPath = path.join(app.getPath('userData'), 'config', 's.bak');
	const data = (await readJsonFile<SettingInterface>(settingsPath)) || CACHE.settings;
	data.shortcuts = { ...data.shortcuts, ...args };
	await writeJsonFile(settingsPath, data);
	return data;
}

export async function handleOpenShortcutApp(_e: any, { path: filePath }: { path: string }) {
	if (filePath.includes('.exe')) exec(filePath, err => err && console.error('❌ exec error:', err));
	else await shell.openPath(filePath);
	return true;
}

export function handleCloseMainWindow(mainWindow: Electron.BrowserWindow) {
	return () => mainWindow.hide();
}

export async function handleGetAppInfo() {
	return {
		name: app.name,
		version: app.getVersion(),
		platform: process.platform
	};
}
