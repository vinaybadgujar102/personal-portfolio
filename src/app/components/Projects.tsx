import React from 'react'
import ProjectCard from './ProjectCard'

const Projects = () => {
    const projects = [
        {
            title: 'Project 1',
            description: 'Project 1 description',
            image: '',
            techStack: ['React', 'Next.js', 'Tailwind CSS']
        }, 
        {
            title: 'Project 2',
            description: 'Project 2 description',
            image: '',
            techStack: ['React', 'Next.js', 'Tailwind CSS']
        }
    ]
  return (
    <div>
        <h1>Projects</h1>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
{projects.map((project) => <ProjectCard key={project.title} {...project} />)}
        </div>
    </div>
  )
}

export default Projects