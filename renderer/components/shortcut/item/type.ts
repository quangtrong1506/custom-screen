/**
 * Shortcut màn hình chính
 */
export interface ShortcutInterface {
  id: string;
  title: string;
  icon: string;
  hidden?: boolean;
  url: string;
  disabled?: boolean;
  scale?: 1 | 2 | 3 | 4 | 5 | 6;
}
