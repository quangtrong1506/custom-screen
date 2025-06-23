'use client';

import { useState } from 'react';
import { ZoomPopup } from '../../_common';

export function VideoDemo() {
    const [open, setOpen] = useState<boolean>(false);
    const [position, setPosition] = useState<[number, number]>([0, 0]);
    return (
        <>
            <video
                onClick={(e) => {
                    setOpen(true);
                    setPosition([e.clientX, e.clientY]);
                }}
                className="rounded-lg"
                src="/videos/emily-in-the-cyberpunk-city.3840x2160.mp4"
            ></video>
            <ZoomPopup
                height={0}
                isOpen={open}
                onClose={() => setOpen(false)}
                width={0}
                x={position[0]}
                y={position[1]}
            >
                <video
                    className="w-full h-full object-cover"
                    src="/videos/emily-in-the-cyberpunk-city.3840x2160.mp4"
                    controls
                ></video>
                <div className="flex flex-col justify-between absolute top-0 right-0 bg-black/60 p-1 px-3 gap-2">
                    <div className="text-white text-sm cursor-pointer">Đặt làm video nền</div>
                    <div className="text-white text-sm cursor-pointer">Xoá</div>
                </div>
            </ZoomPopup>
        </>
    );
}
