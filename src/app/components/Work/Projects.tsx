import React from "react";
import ProjectCard from "./ProjectCard";
import { PROJECTS } from "@/app/constants/Projects";

const Projects = () => {
  return (
    <div>
      <h1 className="text-5xl font-bold text-center pb-4">Projects</h1>
      <h3 className="text-lg font-light text-center pb-8">
        Explore my creations, from a pair programming app to a Netflix clone, all built with modern tech stack!
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PROJECTS.map((project) => (
          <ProjectCard key={project.title} {...project} />
        ))}
      </div>
    </div>
  );
};

export default Projects;
