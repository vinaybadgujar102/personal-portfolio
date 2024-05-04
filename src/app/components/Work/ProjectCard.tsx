import Image from "next/image";
import React from "react";
import Button from "../common/Button";
import Link from "next/link";

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  liveUrl?: string;
  codeUrl: string;
}

const ProjectCard = ({ title, description, image, codeUrl, liveUrl }: ProjectCardProps) => {
  return (
    <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow">
      <Image style={{ objectFit: "cover" }} width={500} height={200} className="rounded-t-lg" src={image} alt={title} />
      <div className="p-5">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">{title}</h5>
        <p className="mb-3 font-normal text-gray-700 ">{description}</p>
        <div className="flex gap-2">
          <Button className="w-fit" key={title}>
            <Link target="_blank" href={liveUrl ? liveUrl : "#"}>
              Live
            </Link>
          </Button>
          <Button className="w-fit" key={title}>
            <Link target="_blank" href={codeUrl}>
              Code
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
