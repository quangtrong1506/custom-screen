'use client';

import { useEffect, useRef, useState } from 'react';
import { ZoomPopup } from '../../_common';
import { FaPause, FaPlay } from 'react-icons/fa6';
import { sendIPC, sendIpcInvike, useIPCKey } from '../../../hooks';
import { showPromiseToast } from '../../../helpers';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { Routes } from '../../../config';

interface VideoPreviewProps {
   src?: string;
   name?: string;
   type?: string;
}

/** Video preview để set nền */

export const VideoPreview: React.FC<VideoPreviewProps> = ({ src, name, type }) => {
   const router = useRouter();
   const [open, setOpen] = useState<boolean>(false);
   const [position, setPosition] = useState<[number, number]>([0, 0]);
   const [play, setPlay] = useState<boolean>(false);
   const videoRef = useRef<HTMLVideoElement>(null);
   const videoBgCurrent = useIPCKey<string>('get-background');

   useEffect(() => {
      sendIPC('get-background', null);
   }, []);

   function handleSetBackground() {
      sendIpcInvike('set-background', {
         fileName: name,
         path: src,
         type,
      }).then(() => {
         Swal.fire({
            title: 'Đã đặt video nền',
            icon: 'success',
            confirmButtonText: 'Xem video khác',
            cancelButtonText: 'Quay lại màn hình chính',
            showCancelButton: true,
            showConfirmButton: true,
            customClass: {
               cancelButton: 'bg-red-500 text-white',
               confirmButton: 'bg-cyan-500 text-white',
            },
         })
            .then((result) => {
               if (result.isDismissed) router.push(Routes.Home);
            })
            .catch((e) => {
               console.log(e);
               Swal.fire({
                  title: 'Lỗi',
                  text: 'Không thể đặt video nền\n' + e.message,
                  icon: 'error',
                  confirmButtonText: 'OK',
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
         if (videoBgCurrent === src) {
            sendIpcInvike('set-background', { type: 'default' });
         }

         const promise = sendIpcInvike('delete-video', {
            fileName: name,
            path: src,
            type,
         });
         showPromiseToast(promise, {
            success: 'Đã xóa video nền',
            error: 'Lỗi xóa video nền',
            loading: 'Đang xóa video nền',
         });
      }, 200);
   }

   return (
      <>
         <video
            onClick={(e) => {
               setOpen(true);
               setPosition([e.clientX, e.clientY]);
               setTimeout(() => {
                  videoRef.current?.play();
               }, 300);
            }}
            className="rounded-lg"
            src={src}
         ></video>

         <ZoomPopup
            height={150}
            isOpen={open}
            onClose={() => setOpen(false)}
            width={200}
            x={position[0]}
            y={position[1]}
         >
            <div className="relative w-full h-full">
               <video
                  className="w-full h-full"
                  controls={false}
                  muted
                  autoPlay
                  ref={videoRef}
                  src={src}
                  onClick={(e) => e.stopPropagation()}
                  onPlay={() => setPlay(true)}
                  onPause={() => setPlay(false)}
                  onEnded={() => setPlay(false)}
               />
               <button
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  onClick={() => {
                     if (videoRef.current) {
                        videoRef.current.paused ? videoRef.current.play() : videoRef.current.pause();
                     }
                  }}
               >
                  {!play ? <FaPlay fill="#fff" size={48} /> : <FaPause fill="#fff" size={48} />}
               </button>
               <div className="flex absolute -bottom-1 left-0 right-0 bg-black/60 py-3 px-3 gap-4">
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
                  <div className="text-white text-sm cursor-pointer" onClick={handleSetBackground}>
                     Đặt làm video nền
                  </div>
                  {type === 'upload' && (
                     <div className="text-white text-sm cursor-pointer" onClick={handleDelete}>
                        Xóa
                     </div>
                  )}
               </div>
            </div>
         </ZoomPopup>
      </>
   );
};
