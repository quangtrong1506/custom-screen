'use client';

import { useEffect, useRef, useState } from 'react';
import { ZoomPopup } from '../../_common';
import { FaPause, FaPlay } from 'react-icons/fa6';
import { sendIPC, sendIpcInvike, useIPCKey } from '../../../hooks';
import { showPromiseToast } from '../../../helpers';

interface VideoPreviewProps {
    src?: string;
    name?: string;
    type?: string;
}

/** Video preview để set nền */

export const VideoPreview: React.FC<VideoPreviewProps> = ({ src, name, type }) => {
    const [open, setOpen] = useState<boolean>(false);
    const [position, setPosition] = useState<[number, number]>([0, 0]);
    const [play, setPlay] = useState<boolean>(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const videoBgCurrent = useIPCKey<string>('get-background');

    useEffect(() => {
        setInterval(() => {
            if (videoRef.current) {
                if (videoRef.current.ended) {
                    setPlay(false);
                }
            }
        }, 500);
        sendIPC('get-background', null);
    }, []);

    function handleSetBackground() {
        const promise = sendIpcInvike('set-background', {
            fileName: name,
            path: src,
            type,
        });
        showPromiseToast(promise, {
            success: 'Đổi video nền thành công',
            error: 'Lỗi đổi video nền',
            loading: 'Loading...',
        });
    }

    function handleDelete() {
        setOpen(false);

        if (videoBgCurrent === src) {
            sendIpcInvike('set-background', {
                type: 'default',
            });
        }

        const promise = sendIpcInvike('delete-video', {
            fileName: name,
            path: src,
            type,
        });
        showPromiseToast(promise, {
            success: 'Đã xóa video nền',
            error: 'Lỗi xóa video nền',
            loading: 'Đang xóa video nền',
        });
    }
    return (
        <>
            <video
                onClick={(e) => {
                    setOpen(true);
                    setPosition([e.clientX, e.clientY]);
                    setTimeout(() => {
                        videoRef.current.play();
                    }, 300);
                }}
                className="rounded-lg"
                src={src}
            ></video>
            <ZoomPopup
                height={150}
                isOpen={open}
                onClose={() => setOpen(false)}
                width={200}
                x={position[0]}
                y={position[1]}
            >
                <div className="relative w-full h-full">
                    <video
                        className="w-full h-full"
                        controls={false}
                        muted
                        ref={videoRef}
                        src={src}
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    ></video>
                    <button
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                        onClick={() => {
                            setPlay(!play);
                            if (videoRef.current) {
                                videoRef.current.paused ? videoRef.current.play() : videoRef.current.pause();
                            }
                        }}
                    >
                        {!play ? <FaPlay fill="#fff" size={48} /> : <FaPause fill="#fff" size={48} />}
                    </button>
                    <div className="flex absolute -bottom-1 left-0 right-0 bg-black/60 py-3 px-3 gap-4">
                        <div
                            className="text-white text-sm cursor-pointer"
                            onClick={() => {
                                setPlay(!play);
                                if (videoRef.current) {
                                    videoRef.current.paused ? videoRef.current.play() : videoRef.current.pause();
                                }
                            }}
                        >
                            {play ? 'Tạm dừng' : 'Phát'}
                        </div>
                        <div className="text-white text-sm cursor-pointer" onClick={handleSetBackground}>
                            Đặt làm video nền
                        </div>
                        {type === 'upload' && (
                            <div className="text-white text-sm cursor-pointer" onClick={handleDelete}>
                                Xóa
                            </div>
                        )}
                    </div>
                </div>
            </ZoomPopup>
        </>
    );
};
