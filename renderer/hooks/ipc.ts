// src/hooks/use-ipc-key.ts
import { useEffect, useState } from 'react';
import { IpcBodyInterface, IpcKey, IPCResponseInterface } from '../shared/respon-ipc';

export function useIPCKey<K>(key: (typeof IpcKey)[keyof typeof IpcKey]): K | null {
	const [value, setValue] = useState<K | null>(null);

	useEffect(() => {
		if (!window.ipc?.on) return;

		const unsubscribe = window.ipc.on('main', (data: Record<string, unknown>) => {
			if (!(key in data)) return;

			setValue(prev => (JSON.stringify(prev) === JSON.stringify(data[key]) ? prev : (data[key] as K)));
		});

		return () => {
			if (typeof unsubscribe === 'function') unsubscribe();
		};
	}, [key]);

	return value;
}

/**
 * Gửi IPC từ renderer sang main
 */
export function sendIPC<K extends keyof typeof IpcKey>(key: K, value: IpcBodyInterface[K] | null): void {
	if (!window.ipc?.send) return;
	window.ipc.send(IpcKey[key], value);
}

/**
 * Gửi IPC invoke từ renderer sang main và nhận dữ liệu trả về
 */
export function sendIpcInvike<K extends keyof typeof IpcKey>(
	key: K,
	value: IpcBodyInterface[K]
): Promise<IPCResponseInterface[K]> {
	if (!window.ipc?.invoke) throw new Error('IPC invoke not available');
	return window.ipc.invoke(IpcKey[key], value);
}
