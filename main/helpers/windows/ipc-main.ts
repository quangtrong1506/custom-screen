import { app, ipcMain, shell } from 'electron';
import path from 'path';
import * as fs from 'fs';
import { log } from '../dev-log';
import { sendListVideos, sendWebContents } from '../web-contents';
import { readJsonFile, writeJsonFile } from '../file';
import { execFile, execFileSync } from 'child_process';

const initShortcutData = {
    items: [],
    layout: [],
    scale: 1,
    show: true,
};

export const connectIpcMain = (mainWindow: Electron.BrowserWindow) => {
    log.info('Connect ipcMain');

    // tải video nền
    ipcMain.handle('upload-video', async (_event, { fileName, buffer }) => {
        try {
            const savePath = path.join(app.getPath('userData'), 'videos', fileName);
            fs.mkdirSync(path.dirname(savePath), { recursive: true });
            await fs.promises.writeFile(savePath, Buffer.from(buffer));
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
        const savePath = path.join(app.getPath('userData'), 'videos', fileName);

        try {
            await fs.promises.unlink(savePath);
            log.info('Đã xóa file:', savePath);
            sendListVideos(mainWindow);
            return { success: true };
        } catch (error: any) {
            const code = error.code;

            // Các lỗi thường gặp do file bị chiếm quyền
            const shouldRetry = ['EBUSY', 'EPERM', 'EACCES'].includes(code);

            if (shouldRetry) {
                log.warn(`File đang bị khoá, thử lại sau 2 giây: ${savePath}`);
                await new Promise((r) => setTimeout(r, 2000));

                try {
                    await fs.promises.unlink(savePath);
                    log.info('Xoá lại thành công:', savePath);
                    sendListVideos(mainWindow);
                    return { success: true };
                } catch (retryError) {
                    log.error('Xoá lần 2 vẫn lỗi:', retryError);
                    throw retryError;
                }
            }

            log.error('Lỗi xoá video:', error);
            throw error;
        }
    });

    // tải media nền
    ipcMain.handle('upload-shortcut-media', async (_event, { fileName, buffer }) => {
        try {
            const savePath = path.join(app.getPath('userData'), 's-media', fileName);
            fs.mkdirSync(path.dirname(savePath), { recursive: true });
            await fs.promises.writeFile(savePath, Buffer.from(buffer));
            return { success: true, path: savePath.replaceAll('\\', '/') };
        } catch (error) {
            log.error(error);
            throw error;
        }
    });

    // xoá media nền
    ipcMain.handle('delete-shortcut-media', async (event, { path: filePath }) => {
        try {
            if (!fs.existsSync(filePath)) return;
            await fs.promises.unlink(filePath);
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
            const settingsPath = path.join(app.getPath('userData'), 'config', 's.bak');
            let data = await readJsonFile(settingsPath);
            if (!data) data = {};
            const backgroundPath =
                type === 'default'
                    ? '/videos/0.mp4'
                    : path.join(app.getPath('userData'), 'videos', fileName).replaceAll('\\', '/');
            data.background = backgroundPath;
            await writeJsonFile(settingsPath, data);
            sendWebContents(mainWindow, 'get-background', backgroundPath);
            return { success: true };
        } catch (error) {
            log.error(error);
            throw error;
        }
    });

    // cài nền
    ipcMain.handle('get-shortcuts', async () => {
        try {
            const settingsPath = path.join(app.getPath('userData'), 'config', 's.bak');
            const data = await readJsonFile(settingsPath);

            const payload = data?.shortcuts || initShortcutData;

            return payload;
        } catch (error) {
            log.error('❌ Lỗi khi xử lý get-shortcuts:', error);
            throw error;
        }
    });

    ipcMain.on('set-scale-background', async (event, { scale }) => {
        try {
            const settingsPath = path.join(app.getPath('userData'), 'config', 's.bak');
            let data = (await readJsonFile(settingsPath)) || {};

            if (!data.shortcuts) {
                data.shortcuts = initShortcutData;
            }

            data.shortcuts = {
                ...data.shortcuts,
                scale,
            };
            await writeJsonFile(settingsPath, data);
        } catch (error) {
            log.error(error);
            throw error;
        }
    });

    ipcMain.handle('save-shortcuts', async (e, { ...args }) => {
        try {
            const settingsPath = path.join(app.getPath('userData'), 'config', 's.bak');
            let data = (await readJsonFile(settingsPath)) || {};
            if (!data.shortcuts) {
                data.shortcuts = initShortcutData;
            }

            data.shortcuts = {
                ...data.shortcuts,
                ...args,
            };
            await writeJsonFile(settingsPath, data);
            return data;
        } catch (error) {
            log.error('❌ Lỗi khi xử lý get-shortcuts:', error);
            throw error;
        }
    });

    ipcMain.handle('open-shortcut-app', async (e, { path: shortcutPath }) => {
        try {
            if ((shortcutPath as string).includes('.exe')) execFile(shortcutPath);
            else {
                shell.openPath(shortcutPath);
            }
            return true;
        } catch (error) {
            log.error('❌ Open app error:', error);
            throw error;
        }
    });

    ipcMain.on('close-main-window', async (event) => {
        mainWindow.hide();
    });

    ipcMain.handle('get-app-info', async () => {
        return {
            name: app.name,
            version: app.getVersion(),
            platform: process.platform,
        };
    });
};
