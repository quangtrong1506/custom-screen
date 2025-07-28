export interface SettingInterface {
	background: {
		type: 'auto' | 'cover' | 'contain';
		src: string;
	};
	shortcuts: {
		items: string[];
		layout: string[];
		scale: number;
		show: boolean;
	};
}
