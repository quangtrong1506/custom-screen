import { app } from 'electron';
import path from 'path';
import { SettingInterface } from '../types';
import CACHE from './cache';
import { readJsonFile } from './file';
import { updateVideoCache } from './web-contents';

export const initApp = async () => {
	const settingsPath = path.join(app.getPath('userData'), 'config', 's.bak');
	const data = await readJsonFile<SettingInterface>(settingsPath);
	if (data) {
		CACHE.settings = data;
	}
	updateVideoCache();
};
