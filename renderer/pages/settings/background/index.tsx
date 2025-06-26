'use client';

import Link from 'next/link';
import { UploadVideo, VideoPreview } from '../../../components';
import { sendIPC, useIPCKey } from '../../../hooks';
import { useEffect } from 'react';
import { Routes } from '../../../config';

/**
 * Trang chỉnh sửa cài đặt shortcut
 */
const SettingShortcutPage = () => {
    const listVideos = useIPCKey<{
        list: {
            name: string;
            path: string;
            type: string;
        }[];
        total: number;
    }>('get-videos');
    const videoBgCurrent = useIPCKey<string>('get-background');
    console.log(videoBgCurrent);

    useEffect(() => {
        sendIPC('get-videos', null);
        sendIPC('get-background', null);
    }, []);

    return (
        <div className="relative z-10 w-full flex justify-center bg-gray-50 h-screen">
            <div className="mt-6 lg:w-[800px] h-[500px] p-3 text-black/70">
                <div className="flex gap-2 items-center font-medium text-2xl">
                    <Link href={Routes.Home}>Màn hình chính</Link>
                    <div>{'>'}</div>
                    <Link href={Routes.Settings}>Cài đặt</Link>
                    <div>{'>'}</div>
                    <Link href={Routes.SettingsBackground}>Video nền</Link>
                </div>
                <div className="flex justify-between mt-6"></div>
                <div className="mt-3 grid grid-cols-4 gap-3">
                    <UploadVideo />
                    {listVideos?.list?.map((item) => (
                        <VideoPreview key={item.name} src={item.path} name={item.name} type={item.type} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SettingShortcutPage;
