import Image from "next/image";
import React from "react";

const LandingContainer = () => {
  return (
    <div className="bg-white flex flex-col container max-w-[750px]">
      <div className="flex flex-row justify-between">
        <div className="basis-2/3">
          <div>Vinay Badgujar</div>
          <div>
            Hey there! I'm a Full Stack Developer who loves to build cool web
            apps. Check out my work and let's create something awesome together!
          </div>
        </div>
        <Image src="" alt="" className="w-[150px] h-[150px] rounded-full bg-slate-500" />
      </div>
      <div>
        Nav bar
      </div>
    </div>
  );
};

export default LandingContainer;
