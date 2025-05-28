import React from 'react';
import { useIPCKey } from '../../hooks';

export function Video() {
    const video = useIPCKey<string>('video');
    console.log(video);

    return (
        <div className="w-full h-full flex items-center justify-center">
            <video id="bg-main" className="h-full w-full object-cover" autoPlay loop muted>
                <source src="/videos/emily-in-the-cyberpunk-city.3840x2160.mp4" type="video/mp4" />
            </video>
        </div>
    );
}
