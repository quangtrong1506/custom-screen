// src/components/video.tsx
import { useEffect, useRef } from 'react';
import { sendIPC, useIPCKey } from '../../hooks';

export function Video() {
    const ipc = useIPCKey<string>('get-background');
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        sendIPC('get-background', null);
    }, []);

    useEffect(() => {
        if (videoRef.current) videoRef.current.load();
    }, [ipc]);

    return (
        <div className="w-full h-full flex items-center justify-center">
            <video id="bg-main" className="h-full w-full object-cover" autoPlay loop muted ref={videoRef}>
                <source src={ipc} type="video/mp4" />
            </video>
        </div>
    );
}
