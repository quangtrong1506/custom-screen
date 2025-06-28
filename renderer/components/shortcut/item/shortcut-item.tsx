'use client';
import React, { useRef, useState } from 'react';
import { useMeasure } from 'react-use';
import { ShortcutInterface } from './type';
import { ImageContainer } from '../../image-container';
import { sendIPC, sendIpcInvike } from '../../../hooks';
import { RightMenu } from './right-mouse';
import { showToast } from '../../../helpers';

export interface ShortcutItemProps {
    className?: string;
    item: ShortcutInterface;
    onClick?: (id?: string) => void;
    onDelete?: (id?: string) => void;
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
    const [open, setOpen] = useState<boolean>(false);

    const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
    const wrapperRef = useRef<HTMLDivElement>(null);
    const isDraggingRef = useRef<boolean>(false);

    function cancelHold() {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = undefined;
        isDraggingRef.current = false;
        wrapperRef.current?.classList.add('non-draggable');
    }

    function handleMouseDown(e: React.MouseEvent<HTMLDivElement>) {
        if (!wrapperRef.current || timeoutRef.current || isDraggingRef.current) return;
        timeoutRef.current = setTimeout(() => {
            timeoutRef.current = undefined;
            isDraggingRef.current = true;
            wrapperRef.current?.classList.remove('non-draggable');
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
        sendIpcInvike('open-shortcut-app', {
            path: item?.path,
        })
            .then(() => {})
            .catch(() => {
                showToast('Không tìm thấy ứng dụng', 'error');
            });
    }

    if (!item) return <></>;
    return (
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
            onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setOpen(true);
            }}
        >
            <div className="flex w-4/5 justify-center aspect-square overflow-hidden items-center">
                <ImageContainer className="" src={item.icon || '/images/logo.png'} alt={item.title} />
            </div>
            <div
                className="line-clamp-2 text-center text-white mt-1"
                style={{
                    fontSize: getFontSize(width),
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.4)',
                }}
                title={item.title}
            >
                {item.title}
            </div>
            <RightMenu open={open} onClose={() => setOpen(false)} item={item} onDelete={props.onDelete} />
        </div>
    );
}
