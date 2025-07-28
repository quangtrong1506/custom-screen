import { useState } from 'react';
import { FaUpload } from 'react-icons/fa6';
import { ZoomPopup } from '../../_common';
import Swal from 'sweetalert2';
import { eventBus } from '../../../libs';

export function UploadVideo() {
	const [open, setOpen] = useState<boolean>(false);
	const [position, setPosition] = useState<[number, number]>([0, 0]);

	function handleDrop(event: React.DragEvent<HTMLDivElement>): void {
		event.preventDefault();
		const files = event.dataTransfer.files;
		setOpen(false);
		sendEvent(files);
	}

	async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>): Promise<void> {
		const files = event.target.files;
		setOpen(false);
		sendEvent(files);
	}
	async function sendEvent(files?: FileList) {
		if (!files) return;
		if (!files || files.length === 0) {
			Swal.fire('Vui lòng chọn đúng định dạng video');
			return;
		}
		const id = Math.random().toString(36).slice(2, 9);

		eventBus.emit('upload-video', {
			id,
			data: files,
			description: 'Upload video'
		});
	}

	return (
		<>
			<div
				className="flex aspect-video cursor-pointer items-center justify-center rounded-lg border border-black/10 hover:bg-black/5"
				onClick={e => {
					setOpen(true);
					setPosition([e.clientX, e.clientY]);
				}}
			>
				<div className="flex items-center gap-2">
					<FaUpload /> Upload
				</div>
			</div>
			<ZoomPopup height={0} isOpen={open} onClose={() => setOpen(false)} width={0} x={position[0]} y={position[1]}>
				<div className="flex h-full w-full flex-col items-center justify-center gap-2" onDrop={handleDrop}>
					<div className="flex h-32 w-32 items-center justify-center rounded-full bg-black/5">
						<FaUpload className="opacity-35" size={42} />
					</div>
					<div className="text-sm">Kéo và thả tệp video để tải lên</div>
					<div>
						<label
							className="inline-block cursor-pointer rounded-md border border-black/10 p-2 "
							htmlFor="select-video"
						>
							Chọn video
						</label>
						<input
							multiple
							accept="video/*"
							className="hidden"
							id="select-video"
							onChange={handleFileChange}
							type="file"
						/>
					</div>
				</div>
			</ZoomPopup>
		</>
	);
}
