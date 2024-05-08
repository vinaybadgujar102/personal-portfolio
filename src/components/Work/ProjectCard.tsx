import Image from "next/image";
import React from "react";
import Button from "../common/Button";
import Link from "next/link";

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  liveUrl?: string;
  codeUrl?: string;
}

const ProjectCard = ({ title, description, image, codeUrl, liveUrl }: ProjectCardProps) => {
  return (
    <div className="flex flex-col max-w-sm bg-white border border-gray-200 rounded-lg shadow h-full">
      <Image width={500} height={200} className="rounded-t-lg object-cover" src={image} alt={title} />
      <div className="p-5 flex flex-col flex-grow">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">{title}</h5>
        <p className="mb-3 font-normal text-gray-700 flex-grow" style={{ maxHeight: "6rem", overflow: "auto" }}>
          {description}
        </p>
        <div className="mt-auto">
          <div className="flex gap-2 items-end">
            {liveUrl && (
              <Button className="w-fit" key={`live-${title}`}>
                <Link href={liveUrl} target="_blank" rel="noopener noreferrer">
                  Live
                </Link>
              </Button>
            )}
            {codeUrl && (
              <Button className="w-fit" key={`code-${title}`}>
                <Link href={codeUrl} target="_blank" rel="noopener noreferrer">
                  Code
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
