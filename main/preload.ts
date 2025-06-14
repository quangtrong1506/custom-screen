import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
const handler = {
    send(channel: string, value: unknown) {
        ipcRenderer.send(channel, value);
    },
    on(channel: string, callback: (...args: unknown[]) => void) {
        console.log('channel', channel);

        const subscription = (_event: IpcRendererEvent, ...args: unknown[]) => callback(...args);
        ipcRenderer.on(channel, subscription);
        return () => {
            ipcRenderer.removeListener(channel, subscription);
        };
    },
};

contextBridge.exposeInMainWorld('ipc', handler);

export type IpcHandler = typeof handler;
