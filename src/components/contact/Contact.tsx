import { PERSONALDETAILS } from "@/constants/PersonalDetails";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaGithub, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

const Contact = () => {
  return (
    <div className="container w-fit">
      <div className="flex flex-col items-center mb-4">
        <Image
          className="w-24 h-24 mb-5 rounded-full shadow-lg"
          src={PERSONALDETAILS.photo}
          alt={`Photo of the author ${PERSONALDETAILS.name}`}
          width={128}
          height={128}
        />
        <h5 className="mb-1 text-2xl font-medium text-gray-900">{PERSONALDETAILS.name}</h5>
        <span className=" text-gray-500">{PERSONALDETAILS.designation}</span>
      </div>
      <div className="flex flex-col mb-5 text-center">
        <p className="mb-1">{PERSONALDETAILS.address}</p>
        <p>{PERSONALDETAILS.email}</p>
      </div>
      <div className="flex gap-4 justify-center">
        <Link href={PERSONALDETAILS.socials.github} target="_blank">
          <FaGithub size={30} />
        </Link>
        <Link href={PERSONALDETAILS.socials.twitter} target="_blank">
          <FaTwitter size={30} />
        </Link>
        <Link href={PERSONALDETAILS.socials.instagram} target="_blank">
          <FaInstagram size={30} />
        </Link>
        <Link href={PERSONALDETAILS.socials.linkedin} target="_blank">
          <FaLinkedin size={30} />
        </Link>
      </div>
    </div>
  );
};

export default Contact;
