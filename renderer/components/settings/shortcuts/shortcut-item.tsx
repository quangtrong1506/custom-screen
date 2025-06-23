import React from 'react';
import { ImageContainer } from '../../image-container';
import { ThreeDotMenu } from '../../_common';

/**
 * Shortcut Item ở cài đặt
 */
export const SettingShortcutItem = () => {
    return (
        <div className="flex gap-3 rounded-md p-1 px-3 bg-white w-full h-16 border border-black/10">
            <div className="h-full aspect-square flex items-center justify-center">
                <ImageContainer className="w-3/4" src="/images/logo.png" alt="Logo image" />
            </div>
            <div className="flex flex-col flex-1">
                <div className="text-lg font-normal">Tên dứng dụng của tôi</div>
                <div className="text-xs mt-1 flex gap-2">
                    <span>Web</span>
                    <span className=" text-black">|</span>
                    <span>20/01/2023</span>
                </div>
                <div></div>
            </div>
            <div className="h-full flex items-center">
                <ThreeDotMenu items={[]} />
            </div>
        </div>
    );
};
