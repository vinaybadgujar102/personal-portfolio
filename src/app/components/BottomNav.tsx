import React from "react";
import Button from "./common/Button";

const BottomNav = () => {
  const navOptions = ["Home", "About", "Work", "Contact"];
  return (
    <div className="flex flex-row justify-between mx-4">
      {navOptions.map((label) => (
        <Button key={label}>{label}</Button>
      ))}
    </div>
  );
};

export default BottomNav;
