'use client';

import { use, useEffect, useState } from 'react';
import GridLayout, { Layout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { ShortcutItem } from './shortcut';

interface ItemInterface {
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
}

const defaultLayout: Layout[] = Array.from({ length: 6 }).map((_, i) => ({
    i: `item-${i}`,
    x: i % 8,
    y: Math.floor(i / 4),
    w: 1,
    h: 1,
}));

const STORAGE_KEY = 'grid-layout-v1';
const ITEM_WIDTH = 100;
const ITEM_HEIGHT = 120;

export function Demo() {
    const [screenWidth, setScreenWidth] = useState(0);
    const [layout, setLayout] = useState<Layout[]>([]);
    const [scale, setScale] = useState<number>(1);
    const [cols, setCols] = useState<number>(0);
    const [rows, setRows] = useState<number>(0);

    // Load layout từ localStorage hoặc mặc định
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) setLayout(JSON.parse(saved));
        else setLayout(defaultLayout);

        const handleResize = () => setScreenWidth(window.innerWidth);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        setCols(Math.floor((screenWidth - 20) / (ITEM_WIDTH * scale)));
        setRows(Math.floor((window.innerHeight - 20) / (ITEM_HEIGHT * scale)));
    }, [screenWidth, scale]);

    // Lưu layout mỗi khi thay đổi
    function handleLayoutChange(newLayout: Layout[]) {
        setLayout(newLayout);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newLayout));
    }

    if (screenWidth === 0 || cols < 1 || rows < 1) return null;
    console.log(screenWidth, cols, rows, scale);
    return (
        <div className="p-[10px] space-y-[10px]">
            <GridLayout
                className="layout"
                layout={layout}
                onLayoutChange={handleLayoutChange}
                cols={cols}
                rowHeight={ITEM_HEIGHT * scale}
                width={screenWidth}
                maxRows={rows}
                compactType="vertical"
                isResizable={false}
                draggableCancel=".non-draggable"
            >
                {layout.map((item) => (
                    <div key={item.i} className="">
                        <ShortcutItem
                            item={{
                                icon: '/images/s-1.png',
                                title: 'OK',
                                url: '/',
                                id: item.i,
                            }}
                        />
                    </div>
                ))}
            </GridLayout>
        </div>
    );
}
