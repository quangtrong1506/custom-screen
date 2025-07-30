'use client';

import Image from 'next/image';

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
	return (
		<div className={`flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg ${className}`}>
			<Image
				src={src}
				alt={alt}
				className={`h-full w-full object-cover object-center`}
				width={250}
				height={250}
				priority
			/>
		</div>
	);
}
