import React from "react";
import ProjectCard from "./ProjectCard";

const Projects = () => {
  const projects = [
    {
      title: "Duo Dev",
      description: " A pair-programmer finder ",
      image:
        "https://images.unsplash.com/photo-1714745455353-f47a2e2b5647?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      techStack: ["React", "Next.js", "Tailwind CSS"],
      liveUrl: "https://duo-dev-production.up.railway.app/",
      codeUrl: "https://github.com/vinaybadgujar102/duo-dev",
    },
    {
      title: "Project 2",
      description: "Project 2 description",
      image:
        "https://images.unsplash.com/photo-1714745455353-f47a2e2b5647?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      techStack: ["React", "Next.js", "Tailwind CSS"],
      codeUrl: "https://github.com/vinaybadgujar102/duo-dev",
    },
  ];
  return (
    <div>
      <h1>Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <ProjectCard key={project.title} {...project} />
        ))}
      </div>
    </div>
  );
};

export default Projects;
