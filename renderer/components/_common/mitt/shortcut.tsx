'use client';

import { useEffect, useState } from 'react';
import { eventBus } from '../../../libs';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { sendIpcInvike } from '../../../hooks';
import { ShortcutInterface } from '../../shortcut/item/type';
import { SelectImage } from './select-image';
import Swal from 'sweetalert2';

export function EmitShortcut() {
   const [isOpen, setIsOpen] = useState<boolean>(false);
   const [data, setData] = useState<ShortcutInterface | null>(null);
   useEffect(() => {
      function handleUploaded(data?: ShortcutInterface) {
         setIsOpen(true);
         setData(data || null);
      }

      eventBus.on('create-shortcut', handleUploaded);
      return () => eventBus.off('create-shortcut', handleUploaded);
   }, []);
   return <>{isOpen && <FormShortcut defaultValue={data} onClose={() => setIsOpen(false)} />}</>;
}

interface FormShortcutProps {
   defaultValue?: ShortcutInterface;
   onClose?: () => void;
}

const FormShortcut = ({ defaultValue, onClose }: FormShortcutProps) => {
   const [title, setTitle] = useState<string>(defaultValue?.title || '');
   const [path, setPath] = useState<string>(defaultValue?.path || '');
   const [icon, setIcon] = useState<File | string>(defaultValue?.icon || '');
   const [openSelectImage, setOpenSelectImage] = useState<boolean>(false);

   const handleCreateShortcut = async () => {
      if (!title || !path) {
         Swal.fire({
            icon: 'warning',
            html: 'Vui lòng nhập đầy đủ thông tin',
            customClass: {
               container: 'z-[999999]',
            },
         });
         return;
      }
      let newIcon = icon;
      if (icon && typeof icon !== 'string') {
         const arrayBuffer = await icon.arrayBuffer();
         let buffer = Buffer.from(arrayBuffer);
         let res = (await sendIpcInvike('upload-shortcut-media', {
            fileName: Math.random().toString().slice(2) + '.png',
            buffer,
         })) as { path: string };
         if (res.path) {
            newIcon = res.path;
         }
      }

      onClose?.();
      eventBus.emit('on-create-shortcut', {
         ...defaultValue,
         id: defaultValue?.id || Math.random().toString().slice(2),
         title,
         path,
         icon: newIcon || '/images/logo.png',
      });
   };
   return createPortal(
      <div className="fixed z-[999999] top-0 left-0 inset-0 flex items-center justify-center bg-black/50">
         <div className="w-[500px] h-[360px] bg-white rounded-md p-3">
            <h1 className="text-center font-semibold text-3xl mt-3">{defaultValue ? 'Sửa' : 'Tạo'} shortcut</h1>
            <div className="flex flex-col items-center mt-6 px-8 gap-3">
               <input
                  type="text"
                  className="w-full border border-black/10 p-2 rounded-md focus-within:outline-none"
                  placeholder="Tên shortcut"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
               />
               <input
                  type="text"
                  className="w-full border border-black/10 p-2 rounded-md focus-within:outline-none"
                  placeholder="Đường dẫn"
                  value={path}
                  onChange={(e) => setPath((e.target.value || '').trim())}
               />
               <div className="w-full flex items-center gap-3">
                  <div className="w-24 h-24">
                     <Image
                        className="w-full aspect-square object-cover"
                        src={
                           (icon instanceof File && URL.createObjectURL(icon)) ||
                           (typeof icon === 'string' && icon) ||
                           '/images/logo.png'
                        }
                        alt="Logo image"
                        width={256}
                        height={256}
                     />
                  </div>
                  <div className="flex flex-col gap-2">
                     <label
                        className="cursor-pointer hover:border-cyan-500 hover:text-cyan-500 hover:bg-white border w-24 flex justify-center py-1 px-3 rounded-md text-sm text-black/70 hover:bg-black/5"
                        htmlFor="xxx-select-image"
                     >
                        Tải lên
                     </label>
                     <div
                        onClick={() => {
                           setOpenSelectImage(true);
                        }}
                        className="cursor-pointer hover:border-cyan-500 hover:text-cyan-500 hover:bg-white border w-24 flex justify-center py-1 px-3 rounded-md text-sm text-black/70 hover:bg-black/5"
                     >
                        Chọn ảnh
                     </div>
                  </div>
                  <input
                     className="hidden"
                     id="xxx-select-image"
                     type="file"
                     accept=".png,.jpg,.jpeg"
                     onChange={(e) => setIcon(e.target.files?.[0])}
                  />
               </div>
               <div className="flex gap-3">
                  <button className="bg-red-400 text-white py-1 px-3 rounded-md" onClick={onClose}>
                     Huỷ
                  </button>
                  <button className="bg-cyan-600 text-white py-1 px-3 rounded-md" onClick={handleCreateShortcut}>
                     {defaultValue ? 'Cập nhật' : 'Tạo'}
                  </button>
               </div>
            </div>
         </div>
         <SelectImage
            open={openSelectImage}
            onClose={() => setOpenSelectImage(false)}
            onSelect={(url) => {
               setIcon(url);
            }}
         />
      </div>,
      document.body
   );
};
