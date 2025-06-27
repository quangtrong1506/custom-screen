import { useRouter } from 'next/navigation';
import { Routes } from '../../../config';
import { useClickAway } from 'react-use';
import { useEffect, useRef, useState } from 'react';
import { sendIPC, sendIpcInvike } from '../../../hooks';
import { eventBus } from '../../../libs';
import { ShortcutInterface } from '../../shortcut/item/type';

interface RightMenuProps {
    item?: ShortcutInterface;
    open?: boolean;
    onClose?: () => void;
    position?: [number, number];
}

/**
 * Menu chuột phải màn hình
 */
export function RightMenu({ open, onClose, position }: RightMenuProps) {
    const router = useRouter();
    const rootRef = useRef<HTMLDivElement>(null);
    const [showShortcut, setShowShortcut] = useState<boolean>(false);
    const [play, setPlay] = useState<boolean>(true);
    useClickAway(rootRef, () => onClose?.());
    const handleCreateShortcut = () => {
        onClose?.();
        eventBus.emit('create-shortcut', null);
    };

    useEffect(() => {
        sendIpcInvike('get-shortcuts', null)
            ?.then((data: { scale: number; items: any; show: boolean; layout: any }) => {
                console.log(data);
                setShowShortcut(data.show);
            })
            .catch((err) => console.log(err));
    }, []);

    return (
        <div
            ref={rootRef}
            className="fixed z-50 min-w-[180px] bg-white p-1 rounded-md shadow-md"
            style={{ top: position?.[1], left: position?.[0], display: open ? 'block' : 'none' }}
        >
            <div className="w-full flex-col">
                <div
                    className="py-1 px-3 hover:bg-black/5 cursor-pointer"
                    onClick={() => {
                        setPlay(!play);
                        eventBus.emit('play-bg', !play);
                    }}
                >
                    {play ? 'Tạm dừng' : 'Phát'}
                </div>
                <div className="py-1 px-3 hover:bg-black/5 cursor-pointer" onClick={handleCreateShortcut}>
                    Tạo shortcut
                </div>
                <div className="py-1 px-3 hover:bg-black/5 cursor-pointer">
                    {showShortcut ? 'Ẩn' : 'Hiện'} shortcuts
                </div>
                <div
                    className="py-1 px-3 hover:bg-black/5 cursor-pointer"
                    onClick={() => router.push(Routes.SettingsBackground)}
                >
                    Thay đổi màn hình
                </div>
                <div className="py-1 px-3 hover:bg-black/5 cursor-pointer" onClick={() => router.push(Routes.Settings)}>
                    Cài đặt
                </div>
                <div
                    className="py-1 px-3 hover:bg-black/5 cursor-pointer"
                    onClick={() => {
                        sendIPC('close-main-window', null);
                    }}
                >
                    Đóng nền
                </div>
            </div>
        </div>
    );
}
