import { app, BrowserWindow } from 'electron';
import path from 'path';
import { IPCResponseInterface } from '../../types';
import CACHE from '../cache';
import { getListVideos } from '../file';
import { sendWebContents } from './web-contents';

const stringToSlug = (str: string): string => {
	const slug = str
		.toLowerCase()
		.replace(/[^a-z0-9\s-]/g, '')
		.trim()
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-');
	return slug;
};

export const sendListVideos = async (mainWindow: BrowserWindow) => {
	const listVideos = await getListVideos();
	const data = ['7499566401694908.mp4', ...listVideos].map((it, index) => ({
		id: stringToSlug(it),
		name: it,
		location:
			index === 0
				? '/videos/7499566401694908.mp4'
				: path.join(app.getPath('userData'), 'media', 'videos', it).replaceAll('\\', '/'),
		isDefault: index === 0
	})) as IPCResponseInterface['getVideoList']['list'];

	CACHE.videos = data;
	sendWebContents(mainWindow, 'getVideoList', {
		list: data,
		total: listVideos.length
	});
};
