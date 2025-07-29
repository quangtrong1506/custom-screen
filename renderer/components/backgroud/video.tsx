// src/components/video.tsx
import { useEffect, useRef } from 'react';
import { sendIPC, useIPCKey } from '../../hooks';
import { eventBus } from '../../libs';
import { IpcKey, IPCResponseInterface } from '../../shared';

export function Video() {
	const ipcResponse = useIPCKey<IPCResponseInterface['getBackground']>(IpcKey.getBackground);
	const videoRef = useRef<HTMLVideoElement>(null);
	useEffect(() => {
		sendIPC('getBackground', null);
		const handlePlay = (check: boolean) => {
			if (videoRef.current) {
				if (check) {
					videoRef.current.play();
				} else {
					videoRef.current.pause();
				}
			}
		};
		eventBus.on('play-bg', handlePlay);
		return () => {
			eventBus.off('play-bg', handlePlay);
		};
	}, []);

	useEffect(() => {
		if (videoRef.current) videoRef.current.load();
	}, [ipcResponse]);

	return (
		<div className="flex h-full w-full items-center justify-center">
			<video
				id="bg-main"
				className={`h-full w-full object-cover ${ipcResponse?.type === 'auto' ? 'object-center' : ''}${
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
