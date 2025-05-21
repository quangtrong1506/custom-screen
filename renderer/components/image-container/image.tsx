'use client';

import Image from 'next/image';
import React, { useState } from 'react';

/**
 * Props cho component ImageContainer
 * @property src - Đường dẫn ảnh cần hiển thị
 * @property alt - Văn bản thay thế ảnh
 */
export interface ImageContainerProps {
  readonly src: string;
  readonly alt?: string;
  readonly className?: string;
}

/**
 * Hiển thị ảnh bên trong khung vuông mà không bị cắt.
 * Tự động điều chỉnh width/height theo tỷ lệ ảnh:
 * - Ảnh ngang: width 100%
 * - Ảnh dọc: height 100%
 * - Ảnh vuông: width 100%
 */
export function ImageContainer({ src, alt = '', className = '' }: ImageContainerProps): JSX.Element {
  const [isHorizontal, setIsHorizontal] = useState<boolean | null>(null);
  const [isSquare, setIsSquare] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  /**
   * Xử lý sau khi ảnh load để xác định tỷ lệ ảnh
   */
  function handleLoad(e: React.SyntheticEvent<HTMLImageElement, Event>): void {
    setLoading(false);
    const { naturalWidth, naturalHeight } = e.currentTarget;
    if (naturalWidth === naturalHeight) setIsSquare(true);
    else setIsHorizontal(naturalWidth > naturalHeight);
  }

  return (
    <div className={`w-full aspect-square overflow-hidden flex items-center justify-center ${className}`}>
      <Image
        src={src}
        alt={alt}
        onLoad={handleLoad}
        className={`${loading ? 'opacity-0' : 'opacity-100'} ${
          isSquare || isHorizontal === null ? 'w-full h-auto' : isHorizontal ? 'w-full h-auto' : 'h-full w-auto'
        }`}
        width={250}
        height={250}
      />
    </div>
  );
}
