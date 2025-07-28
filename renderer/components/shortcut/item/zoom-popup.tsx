'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface ZoomPopupInterface {
	x: number;
	y: number;
	width: number;
	height: number;
	isOpen: Boolean;
	onClose: () => void;
	children: React.ReactNode;
}

export function ZoomPopup({ x, y, width, height, isOpen, onClose, children }: ZoomPopupInterface) {
	const [mounted, setMounted] = useState(false);
	const [visible, setVisible] = useState(false);
	const [target, setTarget] = useState({ x: 0, y: 0, w: 0, h: 0 });

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (isOpen) {
			const screenW = window.innerWidth;
			const screenH = window.innerHeight;
			const w = screenW * 0.5;
			const h = screenH * 0.6;
			const cx = screenW / 2 - w / 2;
			const cy = screenH / 2 - h / 2;

			setTarget({ x: cx, y: cy, w, h });
			setVisible(true);
		}
	}, [isOpen]);

	if (!mounted) return null;

	return createPortal(
		<AnimatePresence>
			{visible && (
				<div className="fixed inset-0 z-[999]" onClick={onClose}>
					<motion.div
						initial={{ x, y, width, height, opacity: 0 }}
						animate={{
							x: isOpen ? target.x : x,
							y: isOpen ? target.y : y,
							width: isOpen ? target.w : width,
							height: isOpen ? target.h : height,
							opacity: isOpen ? 1 : 0
						}}
						transition={{ duration: 0.4, ease: 'easeInOut' }}
						exit={{ x, y, width, height, opacity: 0 }}
						onClick={e => e.stopPropagation()}
						onAnimationComplete={() => {
							if (!isOpen) setVisible(false);
						}}
						className="absolute overflow-hidden rounded-xl bg-white shadow-lg"
					>
						{children}
					</motion.div>
				</div>
			)}
		</AnimatePresence>,
		document.body
	);
}
