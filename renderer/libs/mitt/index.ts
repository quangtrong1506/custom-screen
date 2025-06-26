import mitt from 'mitt';

type EventType = {
    'create-shortcut': any;
    'on-create-shortcut': any;
};

export const eventBus = mitt<EventType>();
