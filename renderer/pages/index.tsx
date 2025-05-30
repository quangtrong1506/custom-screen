'use client';

import { useEffect, useState } from 'react';
import { ShortcutInterface } from '../components/shortcut/item/type';
import { Demo } from '../components';

const shortcuts: ShortcutInterface[] = [
    { id: '1', title: 'My Computer', icon: '🖥️', url: '/' },
    { id: '2', title: 'Recycle Bin', icon: '🗑️', url: '/' },
    { id: '3', title: 'Docs', icon: '📄', url: '/' },
    { id: '4', title: 'Smile', icon: '😊', url: '/' },
    { id: '5', title: 'OK', icon: '👌', url: '/' },
    { id: '6', title: 'Love', icon: '😘', url: '/' },
    { id: '7', title: 'LOL', icon: '😂', url: '/' },
    { id: '8', title: 'Confused', icon: '😕', url: '/' },
];

const config = {
    itemWidth: 100,
    itemHeight: 120,
    gap: 10,
};
interface ItemInterface {
    id: number;
    top: number;
    left: number;
}
export default function ShortcutGrid(): JSX.Element {
    const [scale, setScale] = useState<number>(1);
    const [items, setItems] = useState<ItemInterface[]>([]);
    const [dragItem, setDragItem] = useState<ItemInterface | null>(null);

    function generateLayout() {
        const cols = Math.floor((window.innerWidth - config.gap * 2) / (config.itemWidth + config.gap));
        const rows = Math.floor((window.innerHeight - config.gap * 2) / (config.itemHeight + config.gap));
        const newItems: ItemInterface[] = [];

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const top = row * (config.itemHeight + config.gap) + config.gap;
                const left = col * (config.itemWidth + config.gap) + config.gap;
                newItems.push({ id: row * cols + col, top, left });
            }
        }

        setItems(newItems);
    }

    console.log(dragItem);

    useEffect(() => {
        const handleResize = () => {
            generateLayout();
        };
        handleResize();
        const handleKeyDown = (e: KeyboardEvent) => {
            const isMac = navigator.platform.toUpperCase().includes('MAC');
            const ctrlKey = isMac ? e.metaKey : e.ctrlKey;

            // Nhận Ctrl + +
            if (ctrlKey && e.key === '.') {
                e.preventDefault();
                setScale((scale) => {
                    const ns = scale + 0.2 < 2 ? scale + 0.2 : scale;
                    handleResize();
                    return ns;
                });
                return;
            }
            if (ctrlKey && e.key === ',') {
                e.preventDefault();
                setScale((scale) => {
                    const ns = scale - 0.2 > 1 ? scale - 0.2 : scale;
                    handleResize();
                    return ns;
                });
                return;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('resize', () => {
            handleResize();
        });
        return () => {
            window.removeEventListener('resize', () => {
                handleResize();
            });
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);
    // if (cols === 0) return null;
    return (
        <div className="w-screen h-screen fixed top-0 bottom-0 right-0 left-0 z-10">
            <Demo />
        </div>
    );
}
