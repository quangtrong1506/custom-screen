import { Video } from './video';

/**
 * Màn hình nền
 */
export const BgMain = () => {
	return (
		<>
			<div className="fixed left-0 top-0 z-[5] h-screen w-screen overflow-hidden bg-black">
				<Video />
			</div>
		</>
	);
};
