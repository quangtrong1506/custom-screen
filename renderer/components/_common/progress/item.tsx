import { CircleProgress } from './circle-progress';

export interface WorkInterface {
   id: string;
   description?: string;
   status: 'pending' | 'success' | 'error' | 'uploading';
   progress: number;
   hiden?: boolean;
   data: FileList;
}
interface UploadWorkItemProps {
   item: WorkInterface;
   onHide: () => void;
}

export function UploadWorkItem({ item, onHide }: UploadWorkItemProps) {
   return (
      <div className="flex h-20 w-[400px] gap-2 rounded-md border border-black/30 bg-white p-4 shadow-sm">
         <div className="flex flex-1 items-center gap-6">
            <div className="text-3xl">
               <CircleProgress percentage={item.progress} size={40} strokeWidth={5} />
            </div>
            <div className="flex flex-col gap-2">
               <div className="text-3xl leading-4 text-cyan-600">
                  {item.status === 'pending' && 'Đang chờ công việc trước'}
                  {item.status === 'success' && 'Tải ảnh thành công'}
                  {item.status === 'uploading' && 'Đang tải ảnh...'}
                  {item.status === 'error' && 'Lỗi tải ảnh'}
               </div>
               <div className="text-sm leading-4 text-gray-700">{item.description}</div>
            </div>
         </div>
         <div className="flex flex-col items-center justify-center">
            <div className="cursor-pointer text-cyan-600 hover:underline">Chi tiết</div>
            <div className="cursor-pointer text-red-600 hover:underline" onClick={onHide}>
               Ẩn
            </div>
         </div>
      </div>
   );
}
