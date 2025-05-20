'use client';

import React, { useEffect, useState } from 'react';
import RGL, { WidthProvider, Layout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { ShortcutItem } from '../components';

const ReactGridLayout = WidthProvider(RGL);

interface ShortcutInterface {
    id: string;
    title: string;
    icon: string;
}

const shortcuts: ShortcutInterface[] = [
    { id: '1', title: 'My Computer', icon: '🖥️' },
    { id: '2', title: 'Recycle Bin', icon: '🗑️' },
    { id: '3', title: 'Docs', icon: '📄' },
    { id: '4', title: 'Smile', icon: '😊' },
    { id: '5', title: 'OK', icon: '👌' },
    { id: '6', title: 'Love', icon: '😘' },
    { id: '7', title: 'LOL', icon: '😂' },
    { id: '8', title: 'Confused', icon: '😕' },
];

const rowWidth = 120;
const rowHeight = 140;
const itemWidth = 1;
const itemHeight = 1;

export default function ShortcutGrid(): JSX.Element {
    const [layout, setLayout] = useState<Layout[]>([]);
    const [cols, setCols] = useState<number>(0);
    const [rows, setRows] = useState<number>(0);
    const [scale, setScale] = useState<number>(1);
    function handleDrag(newLayout: Layout[]) {
        const correctedLayout = newLayout.map((item) => {
            if (item.y + item.h > rows) {
                const newX = item.x + 1;
                return { ...item, x: newX, y: 0 };
            }
            return item;
        });
        setLayout(correctedLayout);
    }

    function generateLayout(rs: number): Layout[] {
        const layout: Layout[] = [];
        let x = 0,
            y = 0;
        for (const shortcut of shortcuts) {
            layout.push({
                i: shortcut.id,
                x,
                y,
                w: itemWidth,
                h: itemHeight,
            });

            y++;
            if (y >= rs) {
                y = 0;
                x++;
            }
        }
        // console.log(layout);

        return layout;
    }

    useEffect(() => {
        const handleResize = (pScale = 1) => {
            const rs = Math.floor(window.innerHeight / (rowHeight * pScale));
            setCols(Math.floor(window.innerWidth / (rowWidth * pScale)));
            setRows(rs);
            console.log(rs, pScale);

            setLayout(generateLayout(rs));
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

    useEffect(() => {
        console.log(scale);
    }, [scale]);
    if (cols === 0) return null;
    return (
        <div className="w-screen h-screen bg-blue-600 overflow-hidden">
            <ReactGridLayout
                className="layout"
                layout={layout}
                cols={cols}
                rowHeight={rowHeight * scale}
                width={cols * rowWidth}
                isResizable={false}
                maxRows={rows}
                onLayoutChange={handleDrag}
            >
                {shortcuts.map((item) => (
                    <div key={item.id}>
                        <ShortcutItem
                            item={{
                                id: item.id,
                                title: item.title,
                                icon: '/images/logo.png',
                                url: '/',
                            }}
                        />
                    </div>
                ))}
            </ReactGridLayout>
        </div>
    );
}
