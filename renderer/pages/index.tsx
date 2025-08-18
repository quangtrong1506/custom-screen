'use client';

import { useEffect, useState } from 'react';
import { BgMain, ListShortcut, RightMenu } from '../components';

export default function ShortcutGrid(): JSX.Element {
	const [rightMenu, setRightMenu] = useState({
		open: false,
		position: { x: 0, y: 0 }
	});

	useEffect(() => {
		const mouseLeave = () => {
			setRightMenu({ open: false, position: { x: 0, y: 0 } });
		};
		const contextMenu = (e: MouseEvent) => {
			e.preventDefault();
			setRightMenu({ open: true, position: { x: e.clientX, y: e.clientY } });
		};

		document.body.addEventListener('contextmenu', contextMenu);
		document.body.addEventListener('mouseleave', mouseLeave);

		return () => {
			document.body.removeEventListener('contextmenu', contextMenu);
			document.body.removeEventListener('mouseleave', mouseLeave);
		};
	}, []);

	return (
		<>
			<div className="mouse-click-selector fixed bottom-0 left-0 right-0 top-0 z-10 h-screen w-screen">
				<ListShortcut />
			</div>
			<BgMain />
			<RightMenu
				open={rightMenu.open}
				onClose={() => setRightMenu({ open: false, position: { x: 0, y: 0 } })}
				position={[rightMenu.position.x, rightMenu.position.y]}
			/>
		</>
	);
}
