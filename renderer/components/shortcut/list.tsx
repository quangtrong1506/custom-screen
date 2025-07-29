'use client';

import { useEffect, useRef, useState } from 'react';
import GridLayout, { Layout } from 'react-grid-layout';
import { ShortcutItem } from '.';
import { getNextAvailablePosition } from '../../helpers/grid';
import { sendIPC, sendIpcInvike } from '../../hooks';
import { eventBus } from '../../libs';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { showToast } from '../../helpers';
import { ShortcutInterface } from './item/type';

const ITEM_WIDTH = 100;
const ITEM_HEIGHT = 110;

export function ListShortcut() {
	const [shortcutConfig, setShortcutConfig] = useState<{
		screen: number;
		layout: Layout[];
		items: ShortcutInterface[];
		scale: number;
		cols: number;
		rows: number;
		show: boolean;
	}>({
		screen: 0,
		layout: [],
		items: [],
		scale: 1,
		cols: 0,
		rows: 0,
		show: true
	});

	const gridRef = useRef(null);
	const saveShortcutToLocal = ({
		...args
	}: {
		screen?: number;
		layout?: Layout[];
		items?: ShortcutInterface[];
		scale?: number;
		cols?: number;
		rows?: number;
		show?: boolean;
	}) => {
		sendIpcInvike('saveShortcuts', args)
			.then(data => console.log(data))
			.catch(err => console.log(err));
	};
	// Load layout từ localStorage hoặc mặc định
	useEffect(() => {
		const handleResize = () => setShortcutConfig(prev => ({ ...prev, screen: window.innerWidth }));
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === '=') {
				setShortcutConfig(prev => {
					const newScale = prev.scale + 0.2 > 2 ? 2 : prev.scale + 0.2;
					sendIPC('setScaleBackground', {
						scale: newScale
					});
					return { ...prev, scale: newScale };
				});
			}
			if (e.key === '-') {
				setShortcutConfig(prev => {
					const newScale = prev.scale - 0.2 < 1 ? 1 : prev.scale - 0.2;
					sendIPC('setScaleBackground', {
						scale: newScale
					});
					return { ...prev, scale: newScale };
				});
			}
		};

		const hadleEmitFormShortcut = ({ data }: { data?: ShortcutInterface }) => {
			if (!data) {
				showToast('Không có dữ liệu', 'error');
				return;
			}
			setShortcutConfig(prev => {
				const items = [...prev.items];
				const layouts = [...prev.layout];
				let indexFind = items.findIndex(item => item.id === data.id);
				if (indexFind >= 0) {
					items[indexFind] = data;
				} else {
					const position = getNextAvailablePosition(prev.layout, prev.cols, prev.rows);
					const newItem = {
						i: data.id,
						x: position.x,
						y: position.y,
						w: 1,
						h: 1
					};
					layouts.push(newItem);
					items.push(data);
				}

				saveShortcutToLocal({ items, layout: layouts });
				return { ...prev, layout: layouts, items };
			});
		};

		const getData = async () => {
			sendIpcInvike('getShortcuts', null)
				?.then((data: unknown) => {
					const parsedData = data as {
						scale: number;
						items: ShortcutInterface[];
						show: boolean;
						layout: Layout[];
					};
					setShortcutConfig(prev => ({
						...prev,
						screen: window.innerWidth,
						scale: parsedData.scale,
						show: parsedData.show,
						layout: parsedData.layout,
						items: parsedData.items
					}));
				})
				.catch(err => console.log(err));
		};
		getData();

		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('resize', handleResize);
		eventBus.on('on-create-shortcut', hadleEmitFormShortcut);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('resize', handleResize);
			eventBus.off('on-create-shortcut', hadleEmitFormShortcut);
		};
	}, []);

	useEffect(() => {
		const cols = Math.floor((shortcutConfig.screen - 20) / (ITEM_WIDTH * shortcutConfig.scale));
		const rows = Math.floor((window.innerHeight - 20) / (ITEM_HEIGHT * shortcutConfig.scale));
		setShortcutConfig(prev => ({ ...prev, cols, rows }));
	}, [shortcutConfig.screen, shortcutConfig.scale]);

	// Lưu layout mỗi khi thay đổi
	function handleLayoutChange(newLayout: Layout[]) {
		console.log('handleLayoutChange');

		setShortcutConfig(prev => ({ ...prev, layout: newLayout }));
		saveShortcutToLocal({ layout: newLayout });
	}

	const handleDelete = (id?: string) => {
		if (!id) return;
		const newLayout = shortcutConfig.layout.filter(item => item.i !== id);
		const newItems = shortcutConfig.items.filter(item => item.id !== id);
		setShortcutConfig(prev => ({
			...prev,
			layout: newLayout,
			items: newItems
		}));
		saveShortcutToLocal({ layout: newLayout, items: newItems });
		const oldItem = shortcutConfig.items.find(item => item.id === id);
		sendIpcInvike('deleteShortcutMedia', {
			location: oldItem?.icon || ''
		})
			.then(() => {})
			.catch(e => {
				console.log(e);
				showToast('Lỗi xoá ảnh của shortcut (không quan trọng)', 'error');
			});
	};
	console.log(shortcutConfig);

	if (shortcutConfig.screen === 0 || shortcutConfig.cols < 1 || shortcutConfig.rows < 1 || !shortcutConfig.show)
		return null;

	return (
		<>
			<div className="space-y-[10px] p-[10px]">
				<GridLayout
					className="layout mouse-click-selector"
					cols={shortcutConfig.cols}
					compactType="vertical"
					draggableCancel=".non-draggable"
					innerRef={gridRef}
					isResizable={false}
					layout={shortcutConfig.layout}
					maxRows={shortcutConfig.rows}
					// onLayoutChange={handleLayoutChange}
					rowHeight={ITEM_HEIGHT * shortcutConfig.scale}
					width={shortcutConfig.screen}
					onDragStop={handleLayoutChange}
				>
					{shortcutConfig.layout?.map(item => (
						<div key={item.i}>
							<ShortcutItem item={shortcutConfig.items.find(i => i.id === item.i)} onDelete={handleDelete} />
						</div>
					))}
				</GridLayout>
			</div>
		</>
	);
}
