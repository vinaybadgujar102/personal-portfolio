import Image from "next/image";
import React from "react";
import BottomNav from "./BottomNav";

const LandingContainer = () => {
  return (
    <div className="bg-white flex flex-col container max-w-[750px]">
      <div className="flex flex-row justify-between">
        <div className="basis-2/3">
          <h1 className="text-3xl font-bold mb-4">Vinay Badgujar</h1>
          <div>
            <span className="flex items-center text-sm font-light text-gray-400 me-3 mb-4">
              <span className="flex w-2.5 h-2.5 bg-teal-500 rounded-full me-1.5 flex-shrink-0"></span>
              Available for small to middle sized projects
            </span>
          </div>
          <p className="text-md font-semibold mb-8 leading-7">
            Hey there! I'm a Full Stack Developer who loves to build cool web apps. Check out my work and let's create
            something awesome together!
          </p>
        </div>
        <Image src="" alt="" className="w-[150px] h-[150px] rounded-full bg-slate-500 mb-8" />
      </div>
      <div>
        <BottomNav />
      </div>
    </div>
  );
};

export default LandingContainer;
