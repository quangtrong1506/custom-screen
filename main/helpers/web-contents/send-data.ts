import path from 'path';
import { getListVideos } from '../file';
import { app, BrowserWindow } from 'electron';
import { sendWebContents } from './web-contents';

export const sendListVideos = async (mainWindow: BrowserWindow) => {
	const listVideos = await getListVideos();
	sendWebContents(mainWindow, 'get-videos', {
		list: ['0.mp4', ...listVideos].map((it, index) => ({
			name: it,
			path: index === 0 ? '/videos/0.mp4' : path.join(app.getPath('userData'), 'videos', it).replaceAll('\\', '/'),
			type: index === 0 ? 'default' : 'upload'
		})),
		total: listVideos.length
	});
};
