'use client';

import Link from 'next/link';
import { UploadVideo, VideoPreview } from '../../../components';
import { sendIPC, useIPCKey } from '../../../hooks';
import { useEffect } from 'react';
import { Routes } from '../../../config';

/**
 * Trang chỉnh sửa cài đặt shortcut
 */
const SettingShortcutPage = () => {
	const listVideos = useIPCKey<{
		list: {
			name: string;
			path: string;
			type: string;
		}[];
		total: number;
	}>('get-videos');
	const videoBgCurrent = useIPCKey<string>('get-background');
	console.log(videoBgCurrent);

	useEffect(() => {
		sendIPC('get-videos', null);
		sendIPC('get-background', null);
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
						<VideoPreview key={item.name} src={item.path} name={item.name} type={item.type} />
					))}
				</div>
			</div>
		</div>
	);
};

export default SettingShortcutPage;
