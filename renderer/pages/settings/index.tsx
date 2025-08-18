import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Routes } from '../../config';
import { showToast } from '../../helpers';
import { sendIpcInvike } from '../../hooks';

export default function SettingPage() {
	const [appInfo, setAppInfo] = useState({
		version: '0.0.0',
		name: '',
		platform: ''
	});
	useEffect(() => {
		sendIpcInvike('getAppInfo', null)
			.then(data => {
				if (!data) return;
				setAppInfo(data as { version: string; name: string; platform: string });
			})
			.catch(err => console.log(err));
	}, []);
	return (
		<div className="relative z-10 flex h-full w-full justify-center bg-gray-50">
			<div className="h-full p-3 text-black/70 lg:w-[800px]">
				<div className="flex items-center gap-2 text-2xl font-medium">
					<Link href={Routes.Home}>Màn hình chính</Link>
					<div>{'>'}</div>
					<Link href={Routes.Settings}>Cài đặt</Link>
				</div>
				<div className="mt-6">
					<div className="flex w-full flex-col gap-2">
						<Link className="w-full rounded-md border border-black/10 px-3 py-2" href={Routes.SettingsShortcuts}>
							Shortcuts
						</Link>
						<Link className="w-full rounded-md border border-black/10 px-3 py-2" href={Routes.SettingsBackground}>
							Video nền
						</Link>
						<span className="w-full rounded-md border border-black/10 px-3 py-2">
							Version: {appInfo.version} {appInfo.platform ? `(${appInfo.platform})` : ''}
							<button
								className="px-3 py-1 text-blue-500"
								onClick={() => {
									sendIpcInvike('checkForUpdate', null)
										.then(data => {
											if (data) {
												if (data.version !== appInfo.version)
													showToast(
														`Đã có phiên bản mới (${data.version || 'DEV'}) Hệ thống sẽ tự động cập nhật`,
														'success'
													);
												else showToast('Không có bản cập nhật mới', 'info');
											} else showToast('Không có bản cập nhật', 'info');
										})
										.catch(err => console.log(err));
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
