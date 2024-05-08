import Contact from "@/components/contact/Contact";
import { PERSONALDETAILS } from "@/constants/PersonalDetails";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa6";

const page = () => {
  return (
    <main className="flex min-h-screen items-center justify-between bg-[]">
      <Contact />
    </main>
  );
};

export default page;
