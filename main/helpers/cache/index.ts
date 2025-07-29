import { IPCResponseInterface, SettingInterface } from '../../types';

interface CacheInterface {
	videos: IPCResponseInterface['getVideoList']['list'];
	settings: SettingInterface;
}
const CACHE: CacheInterface = {
	videos: [],
	settings: {
		background: {
			type: 'auto',
			video: {
				location: '/videos/7499566401694908.mp4'
			}
		},
		shortcuts: {
			items: [],
			layout: [],
			scale: 1,
			show: true
		}
	}
};

export default CACHE;
