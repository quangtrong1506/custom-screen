import { ImageContainer } from '../../image-container';
import { ThreeDotMenu } from '../../_common';
import { ShortcutInterface } from '../../shortcut/item/type';

interface SettingShortcutItemProps {
	item: ShortcutInterface;
	onDelete?: (id?: string) => void;
}

/**
 * Shortcut Item ở cài đặt
 */
export const SettingShortcutItem = ({ item, onDelete }: SettingShortcutItemProps) => {
	return (
		<div className="flex h-16 w-full gap-3 rounded-md border border-black/10 bg-white p-1 px-3">
			<div className="flex aspect-square h-full items-center justify-center">
				<ImageContainer className="w-3/4" src={item.icon} alt="Logo image" />
			</div>
			<div className="flex flex-1 flex-col">
				<div className="text-lg font-normal">{item.title}</div>
				<div className="mt-1 flex gap-2 text-xs">
					<span>{item.path}</span>
				</div>
				<div></div>
			</div>
			<div className="flex h-full items-center">
				<ThreeDotMenu
					items={[
						{
							id: 'delete-shortcut',
							title: 'Xoá shortcut',
							onClick: () => {
								onDelete(item.id);
							}
						}
					]}
				/>
			</div>
		</div>
	);
};
