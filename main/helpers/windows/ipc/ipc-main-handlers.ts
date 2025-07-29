// 📁 src/main/ipc/ipc-main-handlers.ts

import { exec } from 'child_process';
import { app, shell } from 'electron';
import fs from 'fs';
import path from 'path';
import { IpcBodyInterface, IPCResponseInterface, SettingInterface, VideoInterface } from '../../../types';
import CACHE from '../../cache';
import { log } from '../../dev-log';
import { readJsonFile, writeJsonFile } from '../../file';
import { sendListVideos, sendWebContents } from '../../web-contents';

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

		const settingsPath = path.join(app.getPath('userData'), 'config', 's.bak');
		const data = (await readJsonFile<SettingInterface>(settingsPath)) || CACHE.settings;

		try {
			log.info('Xoá file', deletePath, data.background.video.location);
			if (deletePath.replaceAll('\\', '/') === data.background.video.location) {
				log.info('Trùng video nền, Reset nền về mặc định');
				sendWebContents(mainWindow, 'getBackground', CACHE.settings.background.video.location);
				await writeJsonFile(settingsPath, {
					...data,
					background: {
						...data.background,
						video: { ...data.background.video, location: CACHE.settings.background.video.location }
					}
				});
				await delay(500);
			}
			await fs.promises.unlink(deletePath);
			return true;
		} catch (error: unknown) {
			log.error('Lỗi xoá video:', error);
			throw error;
		} finally {
			sendListVideos(mainWindow);
		}
	};
}

export async function handleUploadMedia(
	_event: unknown,
	{ id, media }: IpcBodyInterface['uploadShortcutMedia']
): Promise<IPCResponseInterface['uploadShortcutMedia']> {
	try {
		if (!media || !media.buffer) {
			log.warn('Không có media để upload');
			return false;
		}
		const savePath = path.join(app.getPath('userData'), 'media', 'shortcuts', id + '.png');
		fs.mkdirSync(path.dirname(savePath), { recursive: true });
		await fs.promises.writeFile(savePath, Buffer.from(media?.buffer));
		return savePath.replaceAll('\\', '/');
	} catch (error) {
		log.error('Lỗi upload media:', error);
		return false;
	}
}

export async function handleDeleteMedia(
	_event: unknown,
	{ location }: IpcBodyInterface['deleteShortcutMedia']
): Promise<IPCResponseInterface['deleteShortcutMedia']> {
	try {
		if (!fs.existsSync(location)) return false;
		await fs.promises.unlink(location);
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
			const settingsPath = path.join(app.getPath('userData'), 'config', 's.bak');
			const data = (await readJsonFile<SettingInterface>(settingsPath)) || CACHE.settings;
			sendWebContents(mainWindow, 'getBackground', data.background);
		} catch (error) {
			log.error(error);
		}
	};
}

export function handleSetBackground(mainWindow: Electron.BrowserWindow) {
	return async (_event: unknown, { id }: IpcBodyInterface['setBackgroundVideo']) => {
		const backgroundPath = CACHE.videos.find(video => video.id === id)?.location || '';

		const settingsPath = path.join(app.getPath('userData'), 'config', 's.bak');
		const data = (await readJsonFile<SettingInterface>(settingsPath)) || CACHE.settings;
		data.background = {
			...data.background,
			video: {
				location: backgroundPath
			}
		};
		await writeJsonFile(settingsPath, data);
		sendWebContents(mainWindow, 'getBackground', data.background);
		return { success: true };
	};
}

export async function handleGetShortcuts() {
	const settingsPath = path.join(app.getPath('userData'), 'config', 's.bak');
	const data = (await readJsonFile<SettingInterface>(settingsPath)) || CACHE.settings;
	return data.shortcuts || CACHE.settings.shortcuts;
}

export function handleSetScaleBackground() {
	return async (_event: unknown, { scale }: { scale: number }) => {
		const settingsPath = path.join(app.getPath('userData'), 'config', 's.bak');
		const data = (await readJsonFile<SettingInterface>(settingsPath)) || CACHE.settings;
		data.shortcuts = { ...data.shortcuts, scale };
		await writeJsonFile(settingsPath, data);
	};
}

export async function handleSaveShortcuts(_e: unknown, args: Partial<SettingInterface['shortcuts']>) {
	const settingsPath = path.join(app.getPath('userData'), 'config', 's.bak');
	const data = (await readJsonFile<SettingInterface>(settingsPath)) || CACHE.settings;
	data.shortcuts = { ...data.shortcuts, ...args };
	await writeJsonFile(settingsPath, data);
	return data;
}

export async function handleOpenShortcutApp(_e: unknown, { path: filePath }: { path: string }) {
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
