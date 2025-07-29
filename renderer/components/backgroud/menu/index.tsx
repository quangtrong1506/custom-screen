import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Layout } from 'react-grid-layout';
import { useClickAway } from 'react-use';
import { Routes } from '../../../config';
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
		eventBus.emit('create-shortcut', {});
	};

	useEffect(() => {
		sendIpcInvike('getShortcuts', null)
			.then((data: unknown) => {
				console.log(data);
				const dataParse = data as {
					scale: number;
					items: unknown;
					show: boolean;
					layout: Layout[];
				};
				setShowShortcut(dataParse.show);
			})
			.catch(err => console.log(err));
	}, []);

	return (
		<div
			ref={rootRef}
			className="fixed z-50 min-w-[180px] rounded-md bg-white p-1 shadow-md"
			style={{
				top: position?.[1],
				left: position?.[0],
				display: open ? 'block' : 'none'
			}}
		>
			<div className="w-full flex-col">
				<div
					className="cursor-pointer px-3 py-1 hover:bg-black/5"
					onClick={() => {
						setPlay(!play);
						eventBus.emit('play-bg', !play);
					}}
				>
					{play ? 'Tạm dừng' : 'Phát'}
				</div>
				<div className="cursor-pointer px-3 py-1 hover:bg-black/5" onClick={handleCreateShortcut}>
					Tạo shortcut
				</div>
				<div className="cursor-pointer px-3 py-1 hover:bg-black/5">{showShortcut ? 'Ẩn' : 'Hiện'} shortcuts</div>
				<div
					className="cursor-pointer px-3 py-1 hover:bg-black/5"
					onClick={() => router.push(Routes.SettingsBackground)}
				>
					Thay đổi màn hình
				</div>
				<div className="cursor-pointer px-3 py-1 hover:bg-black/5" onClick={() => router.push(Routes.Settings)}>
					Cài đặt
				</div>
				<div
					className="cursor-pointer px-3 py-1 hover:bg-black/5"
					onClick={() => {
						sendIPC('closeMainWindow', null);
					}}
				>
					Đóng nền
				</div>
			</div>
		</div>
	);
}
