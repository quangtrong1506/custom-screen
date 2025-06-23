import Link from 'next/link';
import React from 'react';
import { UploadVideo, VideoDemo } from '../../../components/settings';

/**
 * Trang chỉnh sửa cài đặt shortcut
 */
const SettingShortcutPage = () => {
    return (
        <div className="relative z-10 w-full flex justify-between bg-gray-50 h-screen">
            <div></div>
            <div className="lg:w-[800px] h-[500px] p-3 text-black/70">
                <div className="flex gap-2 items-center font-medium text-2xl">
                    <Link href={'/settings'}>Cài đặt</Link>
                    <div>{'>'}</div>
                    <Link href={'/settings/background'}>Video nền</Link>
                </div>
                <div className="flex justify-between mt-6"></div>
                <div className="mt-3 grid grid-cols-4 gap-3">
                    <UploadVideo />
                    <VideoDemo />
                </div>
            </div>
            <div></div>
        </div>
    );
};

export default SettingShortcutPage;
