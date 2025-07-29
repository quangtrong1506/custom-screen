'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { FaPause, FaPlay } from 'react-icons/fa6';
import Swal from 'sweetalert2';
import { Routes } from '../../../config';
import { showPromiseToast } from '../../../helpers';
import { sendIPC, sendIpcInvike, useIPCKey } from '../../../hooks';
import { ZoomPopup } from '../../_common';

interface VideoPreviewProps {
	id: string;
	location?: string;
	name?: string;
	isDefault?: boolean;
}

/** Video preview để set nền */

export const VideoPreview: React.FC<VideoPreviewProps> = ({ id, isDefault, location, name }) => {
	const router = useRouter();
	const [open, setOpen] = useState<boolean>(false);
	const [position, setPosition] = useState<[number, number]>([0, 0]);
	const [play, setPlay] = useState<boolean>(false);
	const videoRef = useRef<HTMLVideoElement>(null);
	const videoBgCurrent = useIPCKey<string>('getBackground') || '';

	useEffect(() => {
		sendIPC('getBackground', null);
	}, []);

	function handleSetBackground() {
		sendIpcInvike('setBackgroundVideo', { id }).then(() => {
			Swal.fire({
				title: 'Đã đặt video nền',
				icon: 'success',
				confirmButtonText: 'Xem video khác',
				cancelButtonText: 'Quay lại màn hình chính',
				showCancelButton: true,
				showConfirmButton: true,
				customClass: {
					cancelButton: 'bg-red-500 text-white',
					confirmButton: 'bg-cyan-500 text-white'
				}
			})
				.then(result => {
					if (result.isDismissed) router.push(Routes.Home);
				})
				.catch(e => {
					console.log(e);
					Swal.fire({
						title: 'Lỗi',
						text: 'Không thể đặt video nền\n' + e.message,
						icon: 'error',
						confirmButtonText: 'OK'
					});
				})
				.finally(() => {
					setOpen(false);
				});
		});
	}

	function handleDelete() {
		setOpen(false);

		setTimeout(() => {
			if (videoBgCurrent === location) {
				sendIpcInvike('setBackgroundVideo', { id });
			}

			const promise = sendIpcInvike('deleteVideo', {
				id
			});
			showPromiseToast(promise, {
				success: 'Đã xóa video nền',
				error: 'Lỗi xóa video nền',
				loading: 'Đang xóa video nền'
			});
		}, 200);
	}

	return (
		<>
			<div className="aspect-video flex items-center justify-center bg-black relative cursor-pointer overflow-hidden rounded-lg">
				<video
					onClick={e => {
						setOpen(true);
						setPosition([e.clientX, e.clientY]);
						setTimeout(() => {
							videoRef.current?.play();
						}, 300);
					}}
					className="object-contain w-full h-full"
					src={location}
				></video>
			</div>

			<ZoomPopup
				height={150}
				isOpen={open}
				onClose={() => setOpen(false)}
				width={200}
				x={position[0]}
				y={position[1]}
			>
				<div className="relative h-full w-full">
					<video
						className="h-full w-full"
						controls={false}
						muted
						autoPlay
						ref={videoRef}
						src={location}
						onClick={e => e.stopPropagation()}
						onPlay={() => setPlay(true)}
						onPause={() => setPlay(false)}
						onEnded={() => setPlay(false)}
					/>
					<button
						className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
						onClick={() => {
							if (videoRef.current) {
								videoRef.current.paused ? videoRef.current.play() : videoRef.current.pause();
							}
						}}
					>
						{!play ? <FaPlay fill="#fff" size={48} /> : <FaPause fill="#fff" size={48} />}
					</button>
					<div className="absolute -bottom-1 left-0 right-0 flex gap-4 bg-black/60 px-3 py-3">
						{/* <div
                     className="text-white text-sm cursor-pointer"
                     onClick={() => {
                        if (videoRef.current) {
                           videoRef.current.paused ? videoRef.current.play() : videoRef.current.pause();
                        }
                     }}
                  >
                     {play ? 'Tạm dừng' : 'Phát'}
                  </div> */}
						<div className="cursor-pointer text-sm text-white" onClick={handleSetBackground}>
							Đặt làm video nền
						</div>
						{!isDefault && (
							<div className="cursor-pointer text-sm text-white" onClick={handleDelete}>
								Xóa
							</div>
						)}
					</div>
				</div>
			</ZoomPopup>
		</>
	);
};
