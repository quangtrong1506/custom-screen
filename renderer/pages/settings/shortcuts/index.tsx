import Link from 'next/link';
import React from 'react';
import { SettingShortcutItem } from '../../../components/settings';

/**
 * Trang chỉnh sửa cài đặt shortcut
 */
const SettingShortcutPage = () => {
    return (
        <div className="w-full flex justify-between bg-gray-50">
            <div></div>
            <div className="lg:w-[800px] h-[500px] p-3 text-black/70">
                <div className="flex gap-2 items-center font-medium text-2xl">
                    <Link href="/settings">Cài đặt</Link>
                    <div>{'>'}</div>
                    <Link href="/settings/shortcuts">Shortcuts</Link>
                </div>
                <div className="flex justify-between mt-6">
                    <div className="w-[400px]">
                        <input
                            type="text"
                            className="w-full border border-black/10 p-1 rounded-md focus-within:outline-none"
                            placeholder="Tìm kiếm"
                        />
                    </div>
                    <div>
                        <select className="w-[180px] border border-black/10 p-1 rounded-md focus-within:outline-none">
                            <option value="-1">Mặc định</option>
                            <option value="1">A-Z</option>
                            <option value="2">Z-A</option>
                            <option value="3">Vừa cập nhật</option>
                            <option value="4">Đang hiển thị</option>
                            <option value="5">Đã ẩn</option>
                        </select>
                    </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-3">
                    <SettingShortcutItem />
                    <SettingShortcutItem />
                </div>
            </div>
            <div></div>
        </div>
    );
};

export default SettingShortcutPage;
