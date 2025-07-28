import { app } from 'electron';
import { mkdir, copyFile as fsCopyFile, readdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import { log } from './dev-log';

export async function copyFile(srcPath: string, destPath: string): Promise<boolean> {
   try {
      await mkdir(path.dirname(destPath), { recursive: true });
      await fsCopyFile(srcPath, destPath);
      return true;
   } catch (err) {
      log.error('Copy file error:', err);
      return false;
   }
}

export const getListVideos = async () => {
   const folderPath = path.join(app.getPath('userData'), 'videos');
   try {
      const files = await readdir(folderPath);
      return files;
   } catch (err) {
      log.error('Lỗi đọc thư mục:', err);
      return [];
   }
};

/**
 * Đọc file JSON, nếu lỗi thì trả về null
 */
export async function readJsonFile<T = any>(filePath: string): Promise<T | null> {
   try {
      const content = await readFile(filePath, 'utf-8');
      return JSON.parse(content) as T;
   } catch (error) {
      log.error('readJsonFile error:', error);
      return null;
   }
}

/**
 * Ghi file JSON, tự động tạo folder nếu chưa có
 */
export async function writeJsonFile(filePath: string, data: any): Promise<boolean> {
   try {
      const dir = path.dirname(filePath);
      await mkdir(dir, { recursive: true });
      await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
      return true;
   } catch (error) {
      console.error('writeJsonFile error:', error);
      return false;
   }
}
