'use client';

import { useEffect, useState } from 'react';
import { ShortcutInterface } from '../components/shortcut/item/type';

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

export default function ShortcutGrid(): JSX.Element {
    const [scale, setScale] = useState<number>(1);
    const [layout, setLayout] = useState<number[]>([]);
    function handleDrag() {}

    function generateLayout() {}

    useEffect(() => {
        const handleResize = (pScale = 1) => {};
        handleResize();
        const handleKeyDown = (e: KeyboardEvent) => {
            const isMac = navigator.platform.toUpperCase().includes('MAC');
            const ctrlKey = isMac ? e.metaKey : e.ctrlKey;

            // Nhận Ctrl + +
            if (ctrlKey && e.key === '.') {
                e.preventDefault();
                setScale((scale) => {
                    const ns = scale + 0.2 < 2 ? scale + 0.2 : scale;
                    handleResize(ns);
                    return ns;
                });
                return;
            }
            if (ctrlKey && e.key === ',') {
                e.preventDefault();
                setScale((scale) => {
                    const ns = scale - 0.2 > 1 ? scale - 0.2 : scale;
                    handleResize(ns);
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
    return <div className="w-screen h-screen fixed top-0 bottom-0 right-0 left-0 z-10"></div>;
}
