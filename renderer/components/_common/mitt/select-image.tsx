'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AutoImage } from '../image';

interface SelectImageProps {
   open: boolean;
   onClose: () => void;
   onSelect?: (path: string) => void;
}

export const SelectImage = ({ open, onClose, onSelect }: SelectImageProps) => {
   const [cats, setCats] = useState([]);
   const [images, setImages] = useState([]);
   const [imageloading, setImageLoading] = useState(false);
   const [catLoading, setCatLoading] = useState(true);
   const [filter, setFilter] = useState({
      category: '',
      q: '',
      page: 1,
   });
   useEffect(() => {
      fetch('https://mnt-image-for-wallpaper.vercel.app/api/categories')
         .then((res) => res.json())
         .then((res) => {
            if (!res.data) return;
            setCats(res.data);
         })
         .catch((err) => console.log(err))
         .finally(() => setCatLoading(false));
   }, []);

   useEffect(() => {
      setImageLoading(true);
      const params = new URLSearchParams({ ...filter, page: filter.page.toString() });
      console.log(params.toString());

      fetch('https://mnt-image-for-wallpaper.vercel.app/api/images?' + params.toString())
         .then((res) => res.json())
         .then((res) => {
            console.log(res);

            setImages(res.data?.list);
         })
         .catch((err) => console.log(err))
         .finally(() => setImageLoading(false));
   }, [filter]);

   if (!open) return null;
   return createPortal(
      <div
         onClick={onClose}
         className="fixed inset-0 top-0 left-0 z-[999999] flex items-center justify-center bg-black/60"
      >
         <div
            onClick={(e) => e.stopPropagation()}
            className="p-6 relative w-[80dvw] h-[80dvh] rounded-lg bg-white flex"
         >
            <div className="w-[240px] h-full overflow-y-auto relative border-r border-black/5">
               <div className="sticky top-0">
                  <input
                     value={filter.q}
                     onChange={(e) => setFilter({ ...filter, q: e.target.value })}
                     placeholder="Search"
                     className="w-full border-cyan-500 border focus-visible:outline-none py-1 px-2 rounded-md"
                  />
               </div>
               <div className="flex-col flex mt-1">
                  {catLoading && <div>Loading...</div>}
                  {!catLoading && (
                     <div
                        className="px-2 py-1 hover:bg-black/5 rounded-md"
                        onClick={() => setFilter({ ...filter, category: '' })}
                     >
                        All
                     </div>
                  )}

                  {!catLoading &&
                     cats?.map((cat) => (
                        <div
                           className="p-2 hover:bg-black/10 cursor-pointer"
                           key={cat._id}
                           onClick={() => setFilter({ ...filter, category: cat._id })}
                        >
                           {cat.name}
                        </div>
                     ))}
               </div>
            </div>
            <div className="flex-1 overflow-y-auto h-full p-3">
               <div className="grid grid-cols-6 gap-2">
                  {imageloading && <div className="">Loading...</div>}
                  {!imageloading &&
                     images?.map((image) => (
                        <div
                           className="relative aspect-square rounded-md overflow-hidden flex items-center justify-center cursor-pointer"
                           key={image._id}
                           onClick={() => {
                              onSelect?.(image.location);
                              onClose?.();
                           }}
                        >
                           <AutoImage src={image.location} />
                        </div>
                     ))}
               </div>
            </div>
         </div>
      </div>,
      document.body
   );
};
