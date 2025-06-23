import { useRouter } from 'next/navigation';
import { Routes } from '../../../config';

interface RightMenuProps {
    open?: boolean;
    onClose?: () => void;
    position?: [number, number];
}

/**
 * Menu chuột phải màn hình
 */
export function RightMenu({ open, onClose, position }: RightMenuProps) {
    const router = useRouter();

    return (
        <div
            className="fixed z-50 min-w-[180px] bg-white p-1 rounded-md"
            style={{ top: position?.[1], left: position?.[0], display: open ? 'block' : 'none' }}
        >
            <div className="w-full flex-col">
                <div className="py-1 px-3 hover:bg-black/5 cursor-pointer">Tạm dừng</div>
                <div className="py-1 px-3 hover:bg-black/5 cursor-pointer">Ẩn shortcut</div>
                <div
                    className="py-1 px-3 hover:bg-black/5 cursor-pointer"
                    onClick={() => router.push(Routes.SettingsBackground)}
                >
                    Thay đổi màn hình
                </div>
                <div className="py-1 px-3 hover:bg-black/5 cursor-pointer">Thoát</div>
            </div>
        </div>
    );
}
