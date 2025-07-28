import { useRef } from 'react';
import { useClickAway } from 'react-use';
import { showToast } from '../../../helpers';
import { sendIpcInvike } from '../../../hooks';
import { eventBus } from '../../../libs';
import { ShortcutInterface } from './type';

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
			path: item?.path
		})
			.then(() => {})
			.catch(() => {
				showToast('Không tìm thấy ứng dụng', 'error');
			});
	};
	return (
		<div
			ref={rootRef}
			className="absolute left-2/3 top-1/3 z-[99999] min-w-[80px] rounded-md bg-white p-1 shadow-md"
			style={{ display: open ? 'block' : 'none' }}
		>
			<div className="w-full flex-col">
				<div className="cursor-pointer px-3 py-1 hover:bg-black/5" onClick={handleOpenShortcut}>
					Mở
				</div>
				<div className="cursor-pointer px-3 py-1 hover:bg-black/5" onClick={handleCreateShortcut}>
					Sửa
				</div>
				<div
					className="cursor-pointer px-3 py-1 hover:bg-black/5"
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
