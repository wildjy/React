'use client';
import { ScrollProvidar } from "../../sharedUI/Layout/Providar/ScrollProvidar";
import { ScrollFixed } from "../../sharedUI/Layout/ScrollFixed";

const ScrollPage: React.FC = () => {
  return (
    <ScrollProvidar>
      <div className="h-[1500px]">
        <ScrollFixed h="h-[80px]">
          <div className="flex justify-center items-center w-full bg-gray-100 h-[80px]">header</div>
        </ScrollFixed>

        <div className="p-2">sss</div>
      </div>
    </ScrollProvidar>
  );
}

export default ScrollPage;