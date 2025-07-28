import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Layout } from 'react-grid-layout';
import { SettingShortcutItem } from '../../../components/settings';
import { ShortcutInterface } from '../../../components/shortcut/item/type';
import { Routes } from '../../../config';
import { showToast } from '../../../helpers';
import { sendIpcInvike } from '../../../hooks';

/**
 * Trang chỉnh sửa cài đặt shortcut
 */
const SettingShortcutPage = () => {
	const [config, setConfig] = useState<{
		scale: number;
		items: ShortcutInterface[];
		show: boolean;
		layout: unknown;
	}>({ scale: 1, items: [], show: true, layout: [] });

	useEffect(() => {
		sendIpcInvike('get-shortcuts', {})
			.then((data: unknown) => {
				console.log(data);
				if (!data) return;
				const dataParse = data as {
					scale: number;
					items: ShortcutInterface[];
					show: boolean;
					layout: Layout[];
				};
				setConfig({
					scale: dataParse.scale,
					items: dataParse.items,
					show: dataParse.show,
					layout: dataParse.layout
				});
			})
			.catch(err => console.log(err));

		return () => {};
	}, []);

	const handleDelete = (id?: string) => {
		if (!id) return;
		const newLayout = config.layout.filter(item => item.i !== id);
		const newItems = config.items.filter(item => item.id !== id);
		setConfig(prev => ({ ...prev, layout: newLayout, items: newItems }));
		sendIpcInvike('save-shortcuts', { layout: newLayout, items: newItems })
			.then(data => console.log(data))
			.catch(err => console.log(err));
		const shortcutItem = config.items.find(item => item.id === id);
		sendIpcInvike('delete-shortcut-media', shortcutItem && shortcutItem.icon ? { path: shortcutItem.icon } : {})
			.then(() => {})
			.catch(e => {
				console.log(e);
				showToast('Lỗi xoá ảnh của shortcut (không quan trọng)', 'error');
			});
	};

	return (
		<div className="relative z-10 flex h-full w-full justify-center bg-gray-50">
			<div></div>
			<div className="h-full p-3 text-black/70 lg:w-[800px]">
				<div className="flex items-center gap-2 text-2xl font-medium">
					<Link href={Routes.Home}>Màn hình chính</Link>
					<div>{'>'}</div>
					<Link href={Routes.Settings}>Cài đặt</Link>
					<div>{'>'}</div>
					<Link href={Routes.SettingsShortcuts}>Shortcuts</Link>
				</div>
				<div className="mt-6 flex justify-between">
					<div className="w-[400px]">
						<input
							type="text"
							className="w-full rounded-md border border-black/10 p-1 focus-within:outline-none"
							placeholder="Tìm kiếm"
						/>
					</div>
					<div>
						<select className="w-[180px] rounded-md border border-black/10 p-1 focus-within:outline-none">
							<option value="-1">Mặc định</option>
							<option value="1">A-Z</option>
							<option value="2">Z-A</option>
							<option value="3">Vừa cập nhật</option>
							<option value="4">Đang hiển thị</option>
							<option value="5">Đã ẩn</option>
						</select>
					</div>
				</div>
				<div className="mt-3 flex flex-wrap gap-3">
					{config.items?.map(item => {
						return <SettingShortcutItem key={item.id} item={item} onDelete={handleDelete} />;
					})}
					{config.items?.length === 0 && (
						<div className="w-full py-16">
							<div className="flex w-full justify-center gap-2">
								<span>Không tìm thấy shortcut</span>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default SettingShortcutPage;
