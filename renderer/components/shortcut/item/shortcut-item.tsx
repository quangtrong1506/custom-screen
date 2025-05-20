import React, { forwardRef } from 'react';
import { ShortcutInterface } from './type';
import { ImageContainer } from '../../image-container';

export interface ShortcutItemProps {
  className?: string;
  item: ShortcutInterface;
}

const fontSize = {
  1: '10px',
  2: '12px',
  3: '16px',
  4: '18px',
  5: '20px',
  6: '22px',
};

/**
 * Shortcut Item với hỗ trợ ref
 */
export const ShortcutItem = forwardRef<HTMLDivElement, Readonly<ShortcutItemProps>>(function ShortcutItem(props, ref) {
  const { className = '', item } = props;
  console.log(item.scale);

  const scale = [1, 2, 3, 4, 5, 6].find((s) => item.scale === s) || 1;

  return (
    <div
      ref={ref}
      className={`w-full h-full flex py-2 items-center flex-col rounded-md select-none hover:bg-white/5 px-3 dark:hover:bg-black/5 ${className}`}
    >
      <div className="flex w-3/4 justify-center aspect-square overflow-hidden items-center">
        <ImageContainer src={item.icon} alt={item.title} />
      </div>
      <div
        className="line-clamp-2 text-center"
        style={{
          fontSize: fontSize[scale],
        }}
      >
        {item.title}
      </div>
    </div>
  );
});
