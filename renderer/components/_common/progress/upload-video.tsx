'use client';

import { useEffect, useState } from 'react';
import { UploadWorkItem, WorkInterface } from './item';
import { eventBus } from '../../../libs';
import { sendIPC } from '../../../hooks';

export function UploadImages() {
   const [works, setWorks] = useState<WorkInterface[]>([]);

   // Xử lý nhận task upload mới từ EventBus
   useEffect(() => {
      const handleEmit = ({ data, id }: { data: WorkInterface['data']; id: string }) => {
         console.log('data', data, id);

         setWorks((prev) => {
            const hasUploading = prev.some((w) => w.status === 'uploading');
            return [
               ...prev,
               {
                  id,
                  status: hasUploading ? 'pending' : 'uploading',
                  progress: 0,
                  description: 'Upload video',
                  data,
               },
            ];
         });

         // Gọi startUpload nếu không có task nào đang upload
         if (!works.some((w) => w.status === 'uploading')) {
            startUpload(id, data);
         }
      };

      eventBus.on('upload-video', handleEmit);
      return () => eventBus.off('upload-video', handleEmit);
   }, [works]);

   // Tự động chạy task kế tiếp khi không còn task upload nào
   useEffect(() => {
      const isUploading = works.some((w) => w.status === 'uploading');
      const next = works.find((w) => w.status === 'pending');

      if (!isUploading && next) {
         startUpload(next.id, next.data);
      }
   }, [works]);

   function startUpload(id: string, data: WorkInterface['data']) {
      setWorks((prev) => prev.map((it) => (it.id === id ? { ...it, status: 'uploading', progress: 0 } : it)));

      const arrr = Array.from(data);
      const list: Buffer<ArrayBuffer>[] = [];
      arrr.forEach((it) => {
         const buffer = Buffer.from(it);
         list.push(buffer);
      });
      sendIPC('upload-video', {
         id,
         list: data,
      });

      // saveImages({
      //    images: data.map((it) => ({
      //       file: it.file!,
      //       name: it.description || 'Image-Anime-' + new Date().getTime(),
      //    })),
      //    onProcess: (current, total, currentData) => {
      //       fetch('/api/images', {
      //          method: 'POST',
      //          body: JSON.stringify({
      //             location: currentData?.display_url,
      //             description: data[current - 1]?.description,
      //             category: data[current - 1]?.category,
      //             albums: data[current - 1]?.albums,
      //          }),
      //       })
      //          .then((res) => res.json())
      //          .then((res) => {
      //             if (res.status === 200) {
      //                setWorks((prev) =>
      //                   prev.map((it) =>
      //                      it.id === id
      //                         ? {
      //                              ...it,
      //                              progress: (current / total) * 100,
      //                              status: current === total ? 'success' : 'uploading',
      //                           }
      //                         : it
      //                   )
      //                );

      //                // Xóa sau 3s nếu xong hết
      //                if (current === total) {
      //                   setTimeout(() => {
      //                      setWorks((prev) => prev.filter((it) => it.id !== id));
      //                   }, 3000);
      //                }
      //             }
      //          })
      //          .catch((err) => {
      //             console.error(err);
      //             setWorks((prev) => prev.map((it) => (it.id === id ? { ...it, status: 'error', progress: 0 } : it)));
      //          });
      //    },
      // });
   }

   function hideWork(id: string) {
      setWorks((prev) => prev.map((it) => (it.id === id ? { ...it, hiden: true } : it)));
   }

   return (
      <div className="fixed bottom-6 right-4 z-50 flex w-[400px] flex-col gap-1">
         {works.map(
            (item) => !item.hiden && <UploadWorkItem key={item.id} item={item} onHide={() => hideWork(item.id)} />
         )}
      </div>
   );
}
