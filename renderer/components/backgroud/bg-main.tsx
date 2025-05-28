import React from 'react';
import { Video } from './video';
import { RightMouseClick } from './right-mouse-click';

/**
 * Màn hình nền
 */
export const BgMain = () => {
    return (
        <>
            <div className="fixed top-0 left-0 w-screen h-screen z-[5] overflow-hidden bg-black">
                <Video />
            </div>
            <RightMouseClick />
        </>
    );
};
