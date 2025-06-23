import React, { useEffect } from 'react';
import { Video } from './video';
import { useIPCKey } from '../../hooks';

/**
 * Màn hình nền
 */
export const BgMain = () => {
    const log = useIPCKey<string>('log');
    useEffect(() => {
        console.log(log);
    }, [log]);

    return (
        <>
            <div className="fixed top-0 left-0 w-screen h-screen z-[5] overflow-hidden bg-black">
                <Video />
            </div>
        </>
    );
};
