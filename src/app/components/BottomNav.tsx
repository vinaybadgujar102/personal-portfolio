import React from "react";

const BottomNav = () => {
  const navOptions = ["Home", "About", "Work", "Contact"];
  return (
    <div className="flex flex-row justify-between mx-4">
      {navOptions.map((label) => (
        <NavButton key={label} label={label} />
      ))}
    </div>
  );
};

const NavButton = ({ label, key }: { label: string; key: string }) => {
  return (
    <button className="border-2 font-medium py-2 px-4 rounded-3xl w-28 hover:bg-slate-100 hover:border-0">
      {label}
    </button>
  );
};

export default BottomNav;
