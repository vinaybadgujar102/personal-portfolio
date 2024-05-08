"use client";
import React from "react";
import Button from "./common/Button";
import Link from "next/link";
import { NAVOPTIONS } from "../constants/NavOptions";

const BottomNav = () => {
  return (
    <div className="flex flex-row justify-between mx-4">
      {NAVOPTIONS.map((nav) => (
        <Button key={nav.label}>
          <Link href={nav.url}>{nav.label}</Link>
        </Button>
      ))}
    </div>
  );
};

export default BottomNav;
