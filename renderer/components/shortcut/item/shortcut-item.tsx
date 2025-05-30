'use client';
import React, { useRef, useState } from 'react';
import { useMeasure } from 'react-use';
import { ShortcutInterface } from './type';
import { ImageContainer } from '../../image-container';
import { ZoomPopup } from './zoom-popup';

export interface ShortcutItemProps {
    className?: string;
    item: ShortcutInterface;
}

const FONT_SIZE = {
    50: '10px',
    65: '12px',
    80: '16px',
    90: '18px',
    105: '20px',
    120: '22px',
};

function getFontSize(width: number): string {
    if (width < 65) return FONT_SIZE[50];
    if (width < 80) return FONT_SIZE[65];
    if (width < 90) return FONT_SIZE[80];
    if (width < 105) return FONT_SIZE[90];
    if (width < 120) return FONT_SIZE[105];
    return FONT_SIZE[120];
}

/**
 * Component ShortcutItem
 */
export function ShortcutItem(props: ShortcutItemProps): JSX.Element {
    const { className = '', item } = props;
    const [ref, { width }] = useMeasure<HTMLDivElement>();
    const [openGroup, setOpenGroup] = useState<Boolean>(false);
    const [groupPosition, setGroupPosition] = useState<{ x: number; y: number; w: number; h: number }>({
        x: 0,
        y: 0,
        w: 0,
        h: 0,
    });
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
    const wrapperRef = useRef<HTMLDivElement>(null);

    function cancelHold() {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        wrapperRef.current?.classList.add('non-draggable');
    }

    function handleMouseDown(e: React.MouseEvent<HTMLDivElement>) {
        if (!wrapperRef.current) return;
        // Bắt đầu đếm 800ms
        timeoutRef.current = setTimeout(() => {
            wrapperRef.current?.classList.remove('non-draggable');

            // 👉 Gửi lại sự kiện mousedown để react-grid-layout bắt được
            const newMouseEvent = new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
                clientX: e.clientX,
                clientY: e.clientY,
            });
            wrapperRef.current?.dispatchEvent(newMouseEvent);
        }, 800);
    }

    function handleMouseUp() {
        cancelHold();
    }

    function handleMouseLeave() {
        cancelHold();
    }

    function handleDoubleClick() {
        cancelHold();
        console.log('Double click');
        setOpenGroup(true);
        if (wrapperRef.current) {
            const rect = wrapperRef.current.getBoundingClientRect();
            const absoluteX = rect.left + window.scrollX;
            const absoluteY = rect.top + window.scrollY;
            setGroupPosition({
                x: absoluteX,
                y: absoluteY,
                w: rect.width,
                h: rect.height,
            });
        }
    }

    return (
        <>
            <div
                ref={(node) => {
                    ref(node);
                    wrapperRef.current = node;
                }}
                id={'shortcut-item-' + item.id}
                className={`w-full h-full flex py-2 items-center flex-col rounded-md select-none hover:bg-white/15 px-3 dark:hover:bg-black/10 ${className} non-draggable`}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onDoubleClick={handleDoubleClick}
            >
                <div className="flex w-4/5 justify-center aspect-square overflow-hidden items-center">
                    <ImageContainer className="" src={item.icon || '/images/logo.png'} alt={item.title} />
                </div>
                <div
                    className="line-clamp-2 text-center text-white"
                    style={{
                        fontSize: getFontSize(width),
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.4)',
                    }}
                >
                    {item.title}
                </div>
            </div>
            <ZoomPopup
                isOpen={openGroup}
                onClose={() => setOpenGroup(false)}
                x={groupPosition.x}
                y={groupPosition.y}
                width={groupPosition.w}
                height={groupPosition.h}
            >
                a
            </ZoomPopup>
        </>
    );
}
