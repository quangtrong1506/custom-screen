// src/components/video.tsx
import { useEffect, useRef } from 'react';
import { sendIPC, useIPCKey } from '../../hooks';
import { eventBus } from '../../libs';
import { IPCResponseInterface } from '../../shared';

export function Video() {
	const ipcResponse = useIPCKey<IPCResponseInterface['getBackground']>('getBackground');
	const ipcActive = useIPCKey<IPCResponseInterface['checkActiveWindow']>('checkActiveWindow');
	const videoRef = useRef<HTMLVideoElement>(null);
	const menuPauseRef = useRef<boolean>(true);
	const isPlayRef = useRef<boolean>(false);
	const isLeaveRef = useRef<boolean>(false);
	const leaveTimeRef = useRef<number>(0);
	const handlePlay = (check: boolean) => {
		isPlayRef.current = check;
		if (videoRef.current) {
			if (check) {
				videoRef.current.play();
			} else {
				videoRef.current.pause();
			}
		}
	};
	useEffect(() => {
		sendIPC('getBackground', null);
		setInterval(() => {
			if (
				(isLeaveRef.current && isPlayRef.current && Date.now() - leaveTimeRef.current > 60000) ||
				menuPauseRef.current
			) {
				handlePlay(false);
				return;
			}
			if (!isLeaveRef.current && !isPlayRef.current && !menuPauseRef.current) {
				handlePlay(true);
				return;
			}
		}, 100);

		const handleMouseMove = (_e: MouseEvent) => {
			isLeaveRef.current = false;
		};

		const handleMouseLeave = (_e: MouseEvent) => {
			isLeaveRef.current = true;
			leaveTimeRef.current = Date.now();
		};

		const handleIPC = (bool: boolean) => {
			menuPauseRef.current = bool;
			if (bool) {
				handlePlay(false);
			}
		};

		document.body.addEventListener('mouseleave', handleMouseLeave);
		document.body.addEventListener('mousemove', handleMouseMove);
		eventBus.on('play-bg', handleIPC);
		return () => {
			document.body.removeEventListener('mouseleave', handleMouseLeave);
			document.body.removeEventListener('mousemove', handleMouseMove);
			eventBus.off('play-bg', handleIPC);
		};
	}, []);

	useEffect(() => {
		if (videoRef.current) {
			videoRef.current.load();
			videoRef.current.play();
		}
	}, [ipcResponse]);

	useEffect(() => {
		if (ipcActive === null) return;
		handlePlay(ipcActive.active);
	}, [ipcActive]);
	return (
		<div className="flex h-full w-full items-center justify-center">
			<video
				id="bg-main"
				className={`h-full w-full ${ipcResponse?.type === 'auto' ? 'object-cover object-center' : ''}${
					ipcResponse?.type === 'cover' ? 'object-cover' : ''
				}${ipcResponse?.type === 'contain' ? 'object-contain' : ''}`}
				autoPlay
				loop
				muted
				ref={videoRef}
			>
				<source src={ipcResponse?.video.location} type="video/mp4" />
			</video>
		</div>
	);
}
