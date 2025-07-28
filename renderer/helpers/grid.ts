import { Layout } from 'react-grid-layout';

export function getNextAvailablePosition(layout: Layout[], cols: number, rows: number): { x: number; y: number } {
	for (let y = 0; y < rows; y++) {
		for (let x = 0; x < cols; x++) {
			const isTaken = layout.some(item => {
				const endX = item.x + item.w;
				const endY = item.y + item.h;
				return x >= item.x && x < endX && y >= item.y && y < endY;
			});
			if (!isTaken) return { x, y };
		}
	}
	// nếu full hết thì đẩy xuống dòng mới
	return { x: 0, y: layout.reduce((maxY, item) => Math.max(maxY, item.y + item.h), 0) };
}
