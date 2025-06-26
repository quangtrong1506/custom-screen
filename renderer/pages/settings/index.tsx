import Link from 'next/link';
import React from 'react';
import { Routes } from '../../config';

export default function SettingPage() {
    return (
        <div className="relative z-10 w-full h-full flex justify-center bg-gray-50">
            <div className="lg:w-[800px] h-full p-3 text-black/70">
                <div className="flex gap-2 items-center font-medium text-2xl">
                    <Link href={Routes.Home}>Màn hình chính</Link>
                    <div>{'>'}</div>
                    <Link href={Routes.Settings}>Cài đặt</Link>
                </div>
                <div className="mt-6">
                    <div className="w-full flex flex-col gap-2">
                        <Link
                            className="w-full px-3 py-2 border border-black/10 rounded-md"
                            href={Routes.SettingsShortcuts}
                        >
                            Shortcuts
                        </Link>
                        <Link
                            className="w-full px-3 py-2 border border-black/10 rounded-md"
                            href={Routes.SettingsBackground}
                        >
                            Video nền
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
