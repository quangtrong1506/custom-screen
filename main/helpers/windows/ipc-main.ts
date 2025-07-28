import { app, ipcMain, shell } from 'electron';
import path from 'path';
import * as fs from 'fs';
import { log } from '../dev-log';
import { sendListVideos, sendWebContents } from '../web-contents';
import { readJsonFile, writeJsonFile } from '../file';
import { exec } from 'child_process';
import { VideoInterface, SettingInterface, IpcKey } from '../../types';

const initSettings: SettingInterface = {
   background: {
      type: 'auto',
      src: '/videos/0.mp4',
   },
   shortcuts: {
      items: [],
      layout: [],
      scale: 1,
      show: true,
   },
};
function delay(ms: number): Promise<void> {
   return new Promise((resolve) => setTimeout(resolve, ms));
}
export const connectIpcMain = (mainWindow: Electron.BrowserWindow) => {
   log.info('Connect ipcMain');
   // tải video nền
   ipcMain.on(
      IpcKey.uploadVideo,
      async (
         _event,
         {
            id,
            list,
         }: {
            id: string;
            list: VideoInterface[];
         }
      ) => {
         try {
            let count = 0;
            for (const video of list) {
               const { title, buffer } = video;
               const savePath = path.join(app.getPath('userData'), 'videos', title);
               fs.mkdirSync(path.dirname(savePath), { recursive: true });
               await fs.promises.writeFile(savePath, Buffer.from(buffer));
               count++;
               mainWindow.webContents.send('upload-video-progress', {
                  id,
                  progress: (count / list.length) * 100,
                  total: list.length,
               });
               delay(500);
            }
         } catch (error) {
            log.error(error);
            throw error;
         }
      }
   );

   // xoá video nền
   ipcMain.handle(IpcKey.deleteVideo, async (event, { fileName }) => {
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
   ipcMain.handle(IpcKey.uploadShortcutMedia, async (_event, { fileName, buffer }) => {
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
   ipcMain.handle(IpcKey.deleteShortcutMedia, async (event, { path: filePath }) => {
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
   ipcMain.on(IpcKey.getVideoList, (event) => {
      sendListVideos(mainWindow);
   });

   // cài nền
   ipcMain.on(IpcKey.getBackground, async (event) => {
      try {
         const settingsPath = path.join(app.getPath('userData'), 'config', 's.bak');
         let data = (await readJsonFile(settingsPath)) || initSettings;
         if (data?.background) sendWebContents(mainWindow, IpcKey.getBackground, data?.background);
         else sendWebContents(mainWindow, IpcKey.getBackground, initSettings.background);
      } catch (error) {
         log.error(error);
      }
   });

   ipcMain.handle(IpcKey.setBackground, async (event, { fileName, type }) => {
      try {
         const settingsPath = path.join(app.getPath('userData'), 'config', 's.bak');
         let data = (await readJsonFile(settingsPath)) || initSettings;
         const backgroundPath =
            type === 'default'
               ? '/videos/0.mp4'
               : path.join(app.getPath('userData'), 'videos', fileName).replaceAll('\\', '/');
         data.background = {
            type,
            src: backgroundPath,
         };
         await writeJsonFile(settingsPath, data);
         sendWebContents(mainWindow, IpcKey.getBackground, backgroundPath);
         return { success: true };
      } catch (error) {
         log.error(error);
         throw error;
      }
   });

   // cài nền
   ipcMain.handle(IpcKey.getShortcuts, async () => {
      try {
         const settingsPath = path.join(app.getPath('userData'), 'config', 's.bak');
         const data = await readJsonFile(settingsPath);

         const payload = data?.shortcuts || initSettings.shortcuts;

         return payload;
      } catch (error) {
         log.error('❌ Lỗi khi xử lý get-shortcuts:', error);
         throw error;
      }
   });

   ipcMain.on(IpcKey.setScaleBackground, async (_event, { scale }) => {
      try {
         const settingsPath = path.join(app.getPath('userData'), 'config', 's.bak');
         let data = (await readJsonFile(settingsPath)) || initSettings;
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

   ipcMain.handle(IpcKey.saveShortcuts, async (e, { ...args }) => {
      try {
         const settingsPath = path.join(app.getPath('userData'), 'config', 's.bak');
         let data = (await readJsonFile(settingsPath)) || initSettings;
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

   ipcMain.handle(IpcKey.openShortcutApp, async (_e, { path }: { path: string }) => {
      try {
         if (path.includes('.exe')) {
            exec(path, (error) => {
               if (error) console.error('❌ exec error:', error);
            });
         } else {
            shell.openPath(path); // vẫn dùng cho .lnk, file, folder...
         }

         return true;
      } catch (error) {
         log.error('❌ Open app error:', error);
         throw error;
      }
   });

   ipcMain.on(IpcKey.closeMainWindow, async (event) => {
      mainWindow.hide();
   });

   ipcMain.handle(IpcKey.getAppInfo, async () => {
      return {
         name: app.name,
         version: app.getVersion(),
         platform: process.platform,
      };
   });
};
