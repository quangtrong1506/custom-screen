import mitt from 'mitt';

type EventType = {
   'create-shortcut': any;
   'on-create-shortcut': any;
   'play-bg': any;
   [key: string]: unknown;
};

export const eventBus = mitt<EventType>();
