import { app, ipcMain } from 'electron';
import path from 'path';
import * as fs from 'fs';
import { log } from '../dev-log';
import { sendListVideos, sendWebContents } from '../web-contents';
import { readJsonFile, writeJsonFile } from '../file';

export const connectIpcMain = (mainWindow: Electron.BrowserWindow) => {
    log.info('Connect ipcMain');

    // tải video nền
    ipcMain.handle('upload-video', async (_event, { fileName, buffer }) => {
        try {
            const savePath = path.join(app.getPath('userData'), 'videos', fileName);
            fs.mkdirSync(path.dirname(savePath), { recursive: true });
            await fs.promises.writeFile(savePath, Buffer.from(buffer));
            log.info('Đã lưu file:', savePath);
            sendListVideos(mainWindow);
            sendWebContents(mainWindow, 'update-video', { complete: true });
            return { success: true, path: savePath };
        } catch (error) {
            log.error(error);
            throw error;
        }
    });

    // xoá video nền
    ipcMain.handle('delete-video', async (event, { fileName }) => {
        try {
            const savePath = path.join(app.getPath('userData'), 'videos', fileName);
            await fs.promises.unlink(savePath);
            log.info('Đã xóa file:', savePath);
            sendListVideos(mainWindow);
            return { success: true };
        } catch (error) {
            log.error('Lỗi xoá video:', error);
            throw error;
        }
    });

    // lấy danh sách video
    ipcMain.on('get-videos', (event) => {
        sendListVideos(mainWindow);
    });

    // cài nền
    ipcMain.on('get-background', async (event) => {
        try {
            log.info('get-background');
            const settingsPath = path.join(app.getPath('userData'), 'config', 's.bak');
            let data = await readJsonFile(settingsPath);
            if (data?.background) sendWebContents(mainWindow, 'get-background', data?.background);
            else sendWebContents(mainWindow, 'get-background', '/videos/0.mp4');
        } catch (error) {
            log.error(error);
        }
    });

    ipcMain.handle('set-background', async (event, { fileName, type }) => {
        try {
            log.info('set-background', {
                fileName,
                type,
            });
            const settingsPath = path.join(app.getPath('userData'), 'config', 's.bak');
            let data = await readJsonFile(settingsPath);
            if (!data) data = {};
            const backgroundPath =
                type === 'default' ? '/videos/0.mp4' : path.join(app.getPath('userData'), 'videos', fileName);
            data.background = backgroundPath;
            await writeJsonFile(settingsPath, data);
            sendWebContents(mainWindow, 'get-background', backgroundPath);
        } catch (error) {
            log.error(error);
            throw error;
        }
    });

    ipcMain.on('close-main-window', async (event) => {
        mainWindow.hide();
    });
};
