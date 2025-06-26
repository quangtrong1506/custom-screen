import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

type Callback<T = any> = (...args: T[]) => void;

const handler = {
    send(channel: string, value?: unknown) {
        ipcRenderer.send(channel, value);
    },

    on<T = unknown>(channel: string, callback: Callback<T>) {
        const subscription = (_event: IpcRendererEvent, ...args: T[]) => callback(...args);
        ipcRenderer.on(channel, subscription);
        return () => ipcRenderer.removeListener(channel, subscription);
    },

    invoke<T = unknown>(channel: string, data?: unknown): Promise<T> {
        return ipcRenderer.invoke(channel, data);
    },
    off(channel: string, callback: Callback) {
        ipcRenderer.off(channel, callback);
    },
};

contextBridge.exposeInMainWorld('ipc', handler);

export type IpcHandler = typeof handler;
