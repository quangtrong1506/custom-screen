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
        <div className="flex gap-3 rounded-md p-1 px-3 bg-white w-full h-16 border border-black/10">
            <div className="h-full aspect-square flex items-center justify-center">
                <ImageContainer className="w-3/4" src={item.icon} alt="Logo image" />
            </div>
            <div className="flex flex-col flex-1">
                <div className="text-lg font-normal">{item.title}</div>
                <div className="text-xs mt-1 flex gap-2">
                    <span>{item.path}</span>
                </div>
                <div></div>
            </div>
            <div className="h-full flex items-center">
                <ThreeDotMenu
                    items={[
                        {
                            id: 'delete-shortcut',
                            title: 'Xoá shortcut',
                            onClick: () => {
                                onDelete(item.id);
                            },
                        },
                    ]}
                />
            </div>
        </div>
    );
};
