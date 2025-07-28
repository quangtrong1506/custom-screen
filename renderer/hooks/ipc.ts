// src/hooks/use-ipc-key.ts
import { useEffect, useState } from 'react';

export function useIPCKey<T = unknown>(key: string) {
   const [value, setValue] = useState<T | null>(null);
   useEffect(() => {
      if (!window.ipc?.on) return;
      const unsubscribe = window.ipc.on('main', (data: Record<string, unknown>) => {
         if (!(key in data)) return;
         setValue((prev) => (JSON.stringify(prev) === JSON.stringify(data[key]) ? prev : (data[key] as T)));
      });
      return () => {
         if (typeof unsubscribe === 'function') unsubscribe();
      };
   }, [key]);
   return value;
}

/**
 * Gửi IPC từ renderer sang main với key cụ thể
 * @param key tên khóa
 * @param value giá trị cần gửi
 */
export function sendIPC(key: string, value: unknown): void {
   console.log('ipc', key);
   if (!window.ipc?.send) return;
   window.ipc.send(key, value);
}

export const sendIpcInvike = (key: string, value: unknown) => {
   console.log('ipc-invoke', key);

   if (!window.ipc?.invoke) return;
   return window.ipc.invoke(key, value);
};
