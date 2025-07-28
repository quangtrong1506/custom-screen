import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Routes } from '../../config';
import { sendIpcInvike } from '../../hooks';
import { showToast } from '../../helpers';

export default function SettingPage() {
   const [appInfo, setAppInfo] = useState({
      version: '0.0.0',
      name: '',
      platform: '',
   });
   useEffect(() => {
      sendIpcInvike('get-app-info', null)
         .then((data) => {
            if (!data) return;
            setAppInfo(data as any);
         })
         .catch((err) => console.log(err));
   }, []);
   return (
      <div className="relative z-10 w-full h-full flex justify-center bg-gray-50">
         <div className="lg:w-[800px] h-full p-3 text-black/70">
            <div className="flex gap-2 items-center font-medium text-2xl">
               <Link href={Routes.Home}>Màn hình chính</Link>
               <div>{'>'}</div>
               <Link href={Routes.Settings}>Cài đặt</Link>
            </div>
            <div className="mt-6">
               <div className="w-full flex flex-col gap-2">
                  <Link className="w-full px-3 py-2 border border-black/10 rounded-md" href={Routes.SettingsShortcuts}>
                     Shortcuts
                  </Link>
                  <Link className="w-full px-3 py-2 border border-black/10 rounded-md" href={Routes.SettingsBackground}>
                     Video nền
                  </Link>
                  <span className="w-full px-3 py-2 border border-black/10 rounded-md">
                     Version: {appInfo.version} {appInfo.platform ? `(${appInfo.platform})` : ''}
                     <button
                        className="px-3 py-1 text-blue-500"
                        onClick={() => {
                           sendIpcInvike('check-for-update', null)
                              .then((data) => {
                                 console.log(data);
                                 if (data && (data as any)?.updateInfo?.version !== appInfo.version)
                                    showToast(
                                       `Đã có phiên bản mới (${
                                          (data as any)?.updateInfo?.version
                                       }) Hệ thống sẽ tự động cập nhật`,
                                       'success'
                                    );
                                 else showToast('Không có bản cập nhật', 'info');
                              })
                              .catch((err) => console.log(err));
                        }}
                     >
                        Check update
                     </button>
                  </span>
               </div>
            </div>
         </div>
      </div>
   );
}
