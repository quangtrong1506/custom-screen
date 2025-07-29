'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Swal from 'sweetalert2';
import { sendIpcInvike } from '../../../hooks';
import { eventBus } from '../../../libs';
import { ShortcutInterface } from '../../shortcut/item/type';
import { SelectImage } from './select-image';

export function EmitShortcut() {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [data, setData] = useState<ShortcutInterface>();
	useEffect(() => {
		function handleUploaded({ data: paramData }: { data?: ShortcutInterface }) {
			setIsOpen(true);
			setData(paramData);
		}

		eventBus.on('create-shortcut', handleUploaded);
		return () => eventBus.off('create-shortcut', handleUploaded);
	}, []);
	return <>{isOpen && <FormShortcut defaultValue={data} onClose={() => setIsOpen(false)} />}</>;
}

interface FormShortcutProps {
	defaultValue?: ShortcutInterface;
	onClose?: () => void;
}

const FormShortcut = ({ defaultValue, onClose }: FormShortcutProps) => {
	const [title, setTitle] = useState<string>(defaultValue?.title || '');
	const [path, setPath] = useState<string>(defaultValue?.path || '');
	const [icon, setIcon] = useState<File | string>(defaultValue?.icon || '');
	const [openSelectImage, setOpenSelectImage] = useState<boolean>(false);

	const handleCreateShortcut = async () => {
		if (!title || !path) {
			Swal.fire({
				icon: 'warning',
				html: 'Vui lòng nhập đầy đủ thông tin',
				customClass: {
					container: 'z-[999999]'
				}
			});
			return;
		}
		let newIcon = typeof icon === 'string' ? icon : '';
		if (icon && typeof icon !== 'string') {
			const arrayBuffer = await icon.arrayBuffer();
			let buffer = Buffer.from(arrayBuffer);
			let res = await sendIpcInvike('uploadShortcutMedia', {
				id: Math.random().toString().slice(2),
				media: {
					buffer
				}
			});
			if (res.location) {
				newIcon = res.location;
			}
		}

		onClose?.();
		eventBus.emit('on-create-shortcut', {
			data: {
				...defaultValue,
				id: defaultValue?.id || Math.random().toString().slice(2),
				title,
				path,
				icon: newIcon || '/images/logo.png'
			}
		});
	};
	return createPortal(
		<div className="fixed inset-0 left-0 top-0 z-[999999] flex items-center justify-center bg-black/50">
			<div className="h-[360px] w-[500px] rounded-md bg-white p-3">
				<h1 className="mt-3 text-center text-3xl font-semibold">{defaultValue ? 'Sửa' : 'Tạo'} shortcut</h1>
				<div className="mt-6 flex flex-col items-center gap-3 px-8">
					<input
						type="text"
						className="w-full rounded-md border border-black/10 p-2 focus-within:outline-none"
						placeholder="Tên shortcut"
						value={title}
						onChange={e => setTitle(e.target.value)}
					/>
					<input
						type="text"
						className="w-full rounded-md border border-black/10 p-2 focus-within:outline-none"
						placeholder="Đường dẫn"
						value={path}
						onChange={e => setPath((e.target.value || '').trim())}
					/>
					<div className="flex w-full items-center gap-3">
						<div className="h-24 w-24">
							<Image
								className="aspect-square w-full object-cover"
								src={
									(icon instanceof File && URL.createObjectURL(icon)) ||
									(typeof icon === 'string' && icon) ||
									'/images/logo.png'
								}
								alt="Logo image"
								width={256}
								height={256}
							/>
						</div>
						<div className="flex flex-col gap-2">
							<label
								className="flex w-24 cursor-pointer justify-center rounded-md border px-3 py-1 text-sm text-black/70 hover:border-cyan-500 hover:bg-black/5 hover:bg-white hover:text-cyan-500"
								htmlFor="xxx-select-image"
							>
								Tải lên
							</label>
							<div
								onClick={() => {
									setOpenSelectImage(true);
								}}
								className="flex w-24 cursor-pointer justify-center rounded-md border px-3 py-1 text-sm text-black/70 hover:border-cyan-500 hover:bg-black/5 hover:bg-white hover:text-cyan-500"
							>
								Chọn ảnh
							</div>
						</div>
						<input
							className="hidden"
							id="xxx-select-image"
							type="file"
							accept=".png,.jpg,.jpeg"
							onChange={e => setIcon(e.target.files?.[0] || '')}
						/>
					</div>
					<div className="flex gap-3">
						<button className="rounded-md bg-red-400 px-3 py-1 text-white" onClick={onClose}>
							Huỷ
						</button>
						<button className="rounded-md bg-cyan-600 px-3 py-1 text-white" onClick={handleCreateShortcut}>
							{defaultValue ? 'Cập nhật' : 'Tạo'}
						</button>
					</div>
				</div>
			</div>
			<SelectImage
				open={openSelectImage}
				onClose={() => setOpenSelectImage(false)}
				onSelect={url => {
					setIcon(url);
				}}
			/>
		</div>,
		document.body
	);
};
