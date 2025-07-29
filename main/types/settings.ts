export interface SettingInterface {
	background: {
		type: 'auto' | 'cover' | 'contain';
		video: {
			location: string;
			thumbnail?: string;
			isDefault?: boolean;
		};
	};
	shortcuts: {
		items: string[];
		layout: string[];
		scale: number;
		show: boolean;
	};
}
