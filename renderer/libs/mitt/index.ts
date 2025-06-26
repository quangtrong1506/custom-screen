import mitt from 'mitt';

type EventType = {
    'create-shortcut': any;
    'on-create-shortcut': any;
    'play-bg': any;
};

export const eventBus = mitt<EventType>();
