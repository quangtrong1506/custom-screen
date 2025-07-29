import { app } from 'electron';
import path from 'path';
import { SettingInterface } from '../types';
import { log } from './dev-log';
import { readJsonFile, writeJsonFile } from './file';

export const initApp = async () => {
	const settingsPath = path.join(app.getPath('userData'), 'config', 's.bak');
	const data = await readJsonFile<SettingInterface>(settingsPath);
	if (data) {
		if (typeof data.background === 'string') {
			log.log('Settings file is in old format, converting...');
			data.background = {
				type: 'auto',
				video: {
					location: data.background
				}
			};
			await writeJsonFile(settingsPath, data);
		}
	}
};
