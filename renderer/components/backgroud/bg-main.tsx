import { Video } from './video';

/**
 * Màn hình nền
 */
export const BgMain = () => {
   return (
      <>
         <div className=" fixed top-0 left-0 w-screen h-screen z-[5] overflow-hidden bg-black">
            <Video />
         </div>
      </>
   );
};
