'use client';

import { FC, useRef, useState } from 'react';
import { FaEllipsis } from 'react-icons/fa6';
import { useClickAway } from 'react-use';

export interface ThreeDotMenuProps {
	items: MenuItemInterface[];
}

/** Menu cơ bản */
export const ThreeDotMenu: FC<ThreeDotMenuProps> = ({ items }) => {
	const [open, setOpen] = useState<boolean>(false);
	const [position, setPosition] = useState<number[]>([0, 0]);
	const menuRef = useRef<HTMLButtonElement>(null);
	useClickAway(menuRef, () => {
		setOpen(false);
	});

	return (
		<button
			ref={menuRef}
			onClick={e => {
				setOpen(true);
				setPosition(getMouseCorner(e.clientX, e.clientY));
			}}
			className="relative flex h-8 w-8 items-center justify-center rounded-md hover:bg-black/5"
			title="Cài đặt"
		>
			<FaEllipsis className="fill-black" />
			{open ? (
				<div
					className={`absolute z-50 flex min-w-32 flex-col gap-1 rounded-md border border-black/5 bg-white p-1 shadow-md ${
						position[0] === 1 ? 'top-full' : 'bottom-full'
					} ${position[1] === 1 ? 'left-0' : 'right-0'}`}
				>
					{items?.map(item => (
						<MenuItem key={item.id} {...item} />
					))}
				</div>
			) : null}
		</button>
	);
};

export interface MenuItemInterface {
	id: string;
	title: string;
	onClick?: () => void;
	disabled?: boolean;
}

const MenuItem: FC<MenuItemInterface> = ({ ...props }) => {
	const { title, onClick, disabled } = props;
	return (
		<button className="w-full rounded px-2 py-1 text-left hover:bg-black/5" onClick={onClick} disabled={disabled}>
			{title}
		</button>
	);
};
function getMouseCorner(x: number, y: number): number[] {
	const centerX = window.innerWidth / 2;
	const centerY = window.innerHeight / 2;
	let position = [0, 0];
	if (y < centerY) position[0] = 1;
	else position[0] = 2;
	if (x < centerX) position[1] = 1;
	else position[1] = 2;
	return position;
}
