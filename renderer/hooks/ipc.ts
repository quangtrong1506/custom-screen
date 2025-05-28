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
