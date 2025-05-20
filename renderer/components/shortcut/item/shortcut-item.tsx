import React, { forwardRef } from 'react';
import { ShortcutInterface } from './type';
import { ImageContainer } from '../../image-container';

export interface ShortcutItemProps {
    className?: string;
    item: ShortcutInterface;
}

/**
 * Shortcut Item với hỗ trợ ref
 */
export const ShortcutItem = forwardRef<HTMLDivElement, Readonly<ShortcutItemProps>>(function ShortcutItem(props, ref) {
    const { className = '', item } = props;
    const scale = [1, 2, 3, 4, 5].find((s) => item.scale === s) || 1;

    return (
        <div
            ref={ref}
            className={`w-full h-full rounded-xl select-none hover:bg-white/5 px-3 dark:hover:bg-black/5 ${className}`}
        >
            <div className="flex justify-center aspect-square overflow-hidden items-center">
                <ImageContainer src={item.icon} alt={item.title} />
            </div>
            <div className="line-clamp-2 text-center">{item.title}</div>
        </div>
    );
});
