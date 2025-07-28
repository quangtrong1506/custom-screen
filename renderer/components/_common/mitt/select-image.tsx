'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AutoImage } from '../image';

interface SelectImageProps {
	open: boolean;
	onClose: () => void;
	onSelect?: (path: string) => void;
}

export const SelectImage = ({ open, onClose, onSelect }: SelectImageProps) => {
	const [cats, setCats] = useState([]);
	const [images, setImages] = useState([]);
	const [imageloading, setImageLoading] = useState(false);
	const [catLoading, setCatLoading] = useState(true);
	const [filter, setFilter] = useState({
		category: '',
		q: '',
		page: 1
	});
	useEffect(() => {
		fetch('https://mnt-image-for-wallpaper.vercel.app/api/categories')
			.then(res => res.json())
			.then(res => {
				if (!res.data) return;
				setCats(res.data);
			})
			.catch(err => console.log(err))
			.finally(() => setCatLoading(false));
	}, []);

	useEffect(() => {
		setImageLoading(true);
		const params = new URLSearchParams({
			...filter,
			page: filter.page.toString()
		});
		console.log(params.toString());

		fetch('https://mnt-image-for-wallpaper.vercel.app/api/images?' + params.toString())
			.then(res => res.json())
			.then(res => {
				console.log(res);

				setImages(res.data?.list);
			})
			.catch(err => console.log(err))
			.finally(() => setImageLoading(false));
	}, [filter]);

	if (!open) return null;
	return createPortal(
		<div
			onClick={onClose}
			className="fixed inset-0 left-0 top-0 z-[999999] flex items-center justify-center bg-black/60"
		>
			<div onClick={e => e.stopPropagation()} className="relative flex h-[80dvh] w-[80dvw] rounded-lg bg-white p-6">
				<div className="relative h-full w-[240px] overflow-y-auto border-r border-black/5">
					<div className="sticky top-0">
						<input
							value={filter.q}
							onChange={e => setFilter({ ...filter, q: e.target.value })}
							placeholder="Search"
							className="w-full rounded-md border border-cyan-500 px-2 py-1 focus-visible:outline-none"
						/>
					</div>
					<div className="mt-1 flex flex-col">
						{catLoading && <div>Loading...</div>}
						{!catLoading && (
							<div
								className="rounded-md px-2 py-1 hover:bg-black/5"
								onClick={() => setFilter({ ...filter, category: '' })}
							>
								All
							</div>
						)}

						{!catLoading &&
							cats?.map(cat => (
								<div
									className="cursor-pointer p-2 hover:bg-black/10"
									key={cat._id}
									onClick={() => setFilter({ ...filter, category: cat._id })}
								>
									{cat.name}
								</div>
							))}
					</div>
				</div>
				<div className="h-full flex-1 overflow-y-auto p-3">
					<div className="grid grid-cols-6 gap-2">
						{imageloading && <div className="">Loading...</div>}
						{!imageloading &&
							images?.map(image => (
								<div
									className="relative flex aspect-square cursor-pointer items-center justify-center overflow-hidden rounded-md"
									key={image._id}
									onClick={() => {
										onSelect?.(image.location);
										onClose?.();
									}}
								>
									<AutoImage src={image.location} />
								</div>
							))}
					</div>
				</div>
			</div>
		</div>,
		document.body
	);
};
