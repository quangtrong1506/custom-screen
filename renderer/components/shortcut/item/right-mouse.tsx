import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { useClickAway } from 'react-use';
import { eventBus } from '../../../libs';
import { ShortcutInterface } from './type';
import { sendIpcInvike } from '../../../hooks';
import { showToast } from '../../../helpers';

interface RightMenuProps {
    item?: ShortcutInterface;
    open?: boolean;
    position?: [number, number];
    onClose?: () => void;
    onDelete?: (id?: string) => void;
}

export function RightMenu({ open, onClose, item, onDelete }: RightMenuProps) {
    const rootRef = useRef<HTMLDivElement>(null);
    useClickAway(rootRef, () => onClose?.());
    const handleCreateShortcut = () => {
        onClose?.();
        eventBus.emit('create-shortcut', item);
    };

    const handleOpenShortcut = async () => {
        onClose?.();
        sendIpcInvike('open-shortcut-app', {
            path: item?.path,
        })
            .then(() => {})
            .catch(() => {
                showToast('Không tìm thấy ứng dụng', 'error');
            });
    };
    return (
        <div
            ref={rootRef}
            className="absolute z-50 min-w-[80px] bg-white p-1 rounded-md shadow-md top-1/3 left-2/3"
            style={{ display: open ? 'block' : 'none' }}
        >
            <div className="w-full flex-col">
                <div className="py-1 px-3 hover:bg-black/5 cursor-pointer" onClick={handleOpenShortcut}>
                    Mở
                </div>
                <div className="py-1 px-3 hover:bg-black/5 cursor-pointer" onClick={handleCreateShortcut}>
                    Sửa
                </div>
                <div
                    className="py-1 px-3 hover:bg-black/5 cursor-pointer"
                    onClick={() => {
                        onDelete?.(item?.id);
                    }}
                >
                    Xoá
                </div>
            </div>
        </div>
    );
}
