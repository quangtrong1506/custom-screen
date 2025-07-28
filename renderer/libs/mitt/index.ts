import mitt from 'mitt';

type EventType = {
	'create-shortcut': unknown;
	'on-create-shortcut': unknown;
	'play-bg': unknown;
	[key: string]: unknown;
};

export const eventBus = mitt<EventType>();
