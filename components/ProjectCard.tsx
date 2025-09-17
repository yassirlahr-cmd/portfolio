import React from 'react';
import type { Project } from '../types';
import { PlayIcon } from './icons';

interface ProjectCardProps {
    project: Project;
    onSelectProject: (project: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelectProject }) => {
    return (
        <button
            onClick={() => onSelectProject(project)}
            className="w-full h-80 text-left glass-pane overflow-hidden transition-all duration-300 group hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-transparent relative"
            aria-label={`View details for ${project.title}`}
        >
            {/* Background Image */}
            <img className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src={project.imageUrl} alt={project.title} />
            
            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            
            {/* Hover State: Play Icon */}
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <PlayIcon className="w-16 h-16 text-white/80 drop-shadow-lg" />
            </div>

            {/* Category Badge */}
            <div className="absolute top-4 right-4 bg-secondary/80 backdrop-blur-sm text-on-secondary text-xs font-bold px-3 py-1 rounded-full z-10">
                {project.category}
            </div>

            {/* Text Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
                <h3 className="text-xl font-bold mb-2 text-white transition-colors duration-300 group-hover:text-secondary">{project.title}</h3>
                <p className="text-slate-300 text-sm line-clamp-3">{project.description}</p>
            </div>
        </button>
    );
};

export default ProjectCard;
