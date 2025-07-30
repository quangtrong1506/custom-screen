import { app, powerMonitor } from 'electron';
import path from 'path';
import { SettingInterface } from '../types';
import { log } from './dev-log';
import { readJsonFile, writeJsonFile } from './file';
import { sendWebContents } from './web-contents';

export const initApp = async (mainWindow: Electron.BrowserWindow) => {
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

	powerMonitor.on('lock-screen', () => {
		sendWebContents(mainWindow, 'checkActiveWindow', {
			active: false
		});
	});

	powerMonitor.on('unlock-screen', () => {
		sendWebContents(mainWindow, 'checkActiveWindow', {
			active: false
		});
	});
};
