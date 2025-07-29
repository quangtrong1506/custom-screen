export interface SettingInterface {
	background: {
		type: 'auto' | 'cover' | 'contain';
		video: {
			location: string;
		};
	};
	shortcuts: {
		items: string[];
		layout: string[];
		scale: number;
		show: boolean;
	};
}
