import { useState } from 'react';
import { FaUpload } from 'react-icons/fa6';
import { ZoomPopup } from '../../_common';
import { sendIpcInvike } from '../../../hooks';
import { showPromiseToast } from '../../../helpers/toast';

export function UploadVideo() {
    const [open, setOpen] = useState<boolean>(false);
    const [position, setPosition] = useState<[number, number]>([0, 0]);

    function handleDrop(event: React.DragEvent<HTMLDivElement>): void {
        event.preventDefault();
        const file = event.dataTransfer.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('video/')) {
            alert('Vui lòng chọn đúng định dạng video');
            return;
        }
    }

    async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>): Promise<void> {
        const file = event.target.files?.[0];
        if (!file) return;
        const arrayBuffer = await file.arrayBuffer();
        setOpen(false);
        const promise = sendIpcInvike('upload-video', {
            fileName: file.name,
            buffer: Buffer.from(arrayBuffer),
        });
        showPromiseToast(promise, {
            success: 'Đã tải lên video',
            error: 'Lỗi tài lên video',
            loading: 'Đang tải video lên',
        });
    }

    return (
        <>
            <div
                className="aspect-video flex justify-center items-center cursor-pointer hover:bg-black/5 border border-black/10 rounded-lg"
                onClick={(e) => {
                    setOpen(true);
                    setPosition([e.clientX, e.clientY]);
                }}
            >
                <div className="flex gap-2 items-center">
                    <FaUpload /> Upload
                </div>
            </div>
            <ZoomPopup
                height={0}
                isOpen={open}
                onClose={() => setOpen(false)}
                width={0}
                x={position[0]}
                y={position[1]}
            >
                <div className="w-full h-full flex items-center justify-center flex-col gap-2" onDrop={handleDrop}>
                    <div className="flex items-center justify-center rounded-full bg-black/5 w-32 h-32">
                        <FaUpload className="opacity-35" size={42} />
                    </div>
                    <div className="text-sm">Kéo và thả tệp video để tải lên</div>
                    <div>
                        <label
                            className="cursor-pointer inline-block p-2 border border-black/10 rounded-md "
                            htmlFor="select-video"
                        >
                            Chọn video
                        </label>
                        <input
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
