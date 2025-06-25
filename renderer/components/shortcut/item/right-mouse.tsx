import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { useClickAway } from 'react-use';
import { eventBus } from '../../../libs';
import { ShortcutInterface } from './type';

interface RightMenuProps {
    item?: ShortcutInterface;
    open?: boolean;
    onClose?: () => void;
    position?: [number, number];
}

export function RightMenu({ open, onClose, position, item }: RightMenuProps) {
    const rootRef = useRef<HTMLDivElement>(null);
    useClickAway(rootRef, () => onClose?.());
    const handleCreateShortcut = () => {
        onClose?.();
        eventBus.emit('create-shortcut', item);
    };
    return (
        <div
            ref={rootRef}
            className="absolute z-50 min-w-[80px] bg-white p-1 rounded-md shadow-md bottom-0 left-full"
            style={{ display: open ? 'block' : 'none' }}
        >
            <div className="w-full flex-col">
                <div className="py-1 px-3 hover:bg-black/5 cursor-pointer" onClick={handleCreateShortcut}>
                    Sửa
                </div>
                <div className="py-1 px-3 hover:bg-black/5 cursor-pointer">Xoá</div>
            </div>
        </div>
    );
}
