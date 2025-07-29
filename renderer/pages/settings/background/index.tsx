'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { UploadVideo, VideoPreview } from '../../../components';
import { Routes } from '../../../config';
import { sendIPC, useIPCKey } from '../../../hooks';
import { IPCResponseInterface } from '../../../shared';

/**
 * Trang chỉnh sửa cài đặt shortcut
 */
const SettingShortcutPage = () => {
	const listVideos = useIPCKey<IPCResponseInterface['getVideoList']>('getVideoList');
	console.log(listVideos);

	useEffect(() => {
		sendIPC('getVideoList', null);
		sendIPC('getBackground', null);
	}, []);

	return (
		<div className="relative z-10 flex h-screen w-full justify-center bg-gray-50">
			<div className="mt-6 h-[500px] p-3 text-black/70 lg:w-[800px]">
				<div className="flex items-center gap-2 text-2xl font-medium">
					<Link href={Routes.Home}>Màn hình chính</Link>
					<div>{'>'}</div>
					<Link href={Routes.Settings}>Cài đặt</Link>
					<div>{'>'}</div>
					<Link href={Routes.SettingsBackground}>Video nền</Link>
				</div>
				<div className="mt-6 flex justify-between"></div>
				<div className="mt-3 grid grid-cols-4 gap-3">
					<UploadVideo />
					{listVideos?.list?.map(item => (
						<VideoPreview
							id={item.id}
							key={item.name}
							location={item.location}
							name={item.name}
							isDefault={item.isDefault}
						/>
					))}
				</div>
			</div>
		</div>
	);
};

export default SettingShortcutPage;
