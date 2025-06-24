'use client';

import { useEffect, useRef, useState } from 'react';
import GridLayout, { Layout } from 'react-grid-layout';
import { ShortcutItem } from './shortcut';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

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
const ITEM_HEIGHT = 110;

export function Demo() {
    const [shortcutConfig, setShortcutConfig] = useState<{
        screen: number;
        layout: Layout[];
        scale: number;
        cols: number;
        rows: number;
    }>({
        screen: 0,
        layout: [],
        scale: 1,
        cols: 0,
        rows: 0,
    });

    const gridRef = useRef(null);

    // Load layout từ localStorage hoặc mặc định
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) setShortcutConfig((prev) => ({ ...prev, layout: JSON.parse(saved) }));
        else setShortcutConfig((prev) => ({ ...prev, layout: defaultLayout }));

        const handleResize = () => setShortcutConfig((prev) => ({ ...prev, screen: window.innerWidth }));
        handleResize();
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === '=')
                setShortcutConfig((prev) => ({ ...prev, scale: prev.scale + 0.2 > 2 ? 2 : prev.scale + 0.2 }));
            if (e.key === '-')
                setShortcutConfig((prev) => ({ ...prev, scale: prev.scale - 0.2 < 1 ? 1 : prev.scale - 0.2 }));
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const cols = Math.floor((shortcutConfig.screen - 20) / (ITEM_WIDTH * shortcutConfig.scale));
        const rows = Math.floor((window.innerHeight - 20) / (ITEM_HEIGHT * shortcutConfig.scale));
        setShortcutConfig((prev) => ({ ...prev, cols, rows }));
    }, [shortcutConfig.screen, shortcutConfig.scale]);

    // Lưu layout mỗi khi thay đổi
    function handleLayoutChange(newLayout: Layout[]) {
        setShortcutConfig((prev) => ({ ...prev, layout: newLayout }));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newLayout));
    }

    if (shortcutConfig.screen === 0 || shortcutConfig.cols < 1 || shortcutConfig.rows < 1) return null;

    return (
        <>
            <div className="p-[10px] space-y-[10px]">
                <GridLayout
                    className="layout mouse-click-selector"
                    cols={shortcutConfig.cols}
                    compactType="vertical"
                    draggableCancel=".non-draggable"
                    innerRef={gridRef}
                    isResizable={false}
                    layout={shortcutConfig.layout}
                    maxRows={shortcutConfig.rows}
                    onLayoutChange={handleLayoutChange}
                    rowHeight={ITEM_HEIGHT * shortcutConfig.scale}
                    width={shortcutConfig.screen}
                >
                    {shortcutConfig.layout?.map((item) => (
                        <div key={item.i}>
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
        </>
    );
}
