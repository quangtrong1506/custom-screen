import mitt from 'mitt';
import { WorkInterface } from '../../components/_common/progress/item';
import { ShortcutInterface } from '../../components/shortcut/item/type';

type EventType = {
	'create-shortcut': { data?: ShortcutInterface };
	'on-create-shortcut': { data?: ShortcutInterface };
	'play-bg': boolean;
	'upload-video': {
		data: WorkInterface['data'];
		id: string;
		description?: string;
	};
	'upload-video-progress': { id: string; progress: number };
};

export const eventBus = mitt<EventType>();
