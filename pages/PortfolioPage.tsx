import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';
import { usePortfolio } from '../context/PortfolioContext';
import ProjectModal from '../components/ProjectModal';
import type { Project } from '../types';

const PortfolioPage: React.FC = () => {
    const { projects } = usePortfolio();
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        if (projectId && projects.length > 0) {
            const projectFromUrl = projects.find(p => p.id === projectId);
            if (projectFromUrl) {
                setSelectedProject(projectFromUrl);
            }
        } else {
            setSelectedProject(null);
        }
    }, [projectId, projects]);

    const handleSelectProject = (project: Project) => {
        navigate(`/portfolio/${project.id}`);
    };

    const handleCloseModal = () => {
        navigate('/portfolio');
    };

    const categories = useMemo(() => {
        const uniqueCategories = new Set(projects.map(p => p.category));
        return ['All', ...Array.from(uniqueCategories).sort()];
    }, [projects]);

    const [selectedCategory, setSelectedCategory] = useState('All');

    const filteredProjects = useMemo(() => {
        if (selectedCategory === 'All') {
            return projects;
        }
        return projects.filter(project => project.category === selectedCategory);
    }, [selectedCategory, projects]);

    return (
        <>
            <div>
                <div className="text-center mb-12 animate-fade-in-up">
                    <h1 className="text-5xl font-bold text-glow">My Portfolio</h1>
                    <p className="text-slate-300 mt-4 max-w-2xl mx-auto">A collection of my recent work in video editing and motion design. Browse through different categories to see the breadth of my capabilities.</p>
                </div>

                <div className="flex justify-center flex-wrap gap-3 mb-12 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-5 py-2 text-sm font-semibold rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/80 focus:ring-offset-2 focus:ring-offset-background ${
                                selectedCategory === category
                                    ? 'bg-primary text-on-primary shadow-lg shadow-primary/30 text-glow'
                                    : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white'
                            }`}
                            aria-pressed={selectedCategory === category}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProjects.map((project, index) => (
                        <div key={project.id} className="animate-fade-in-up" style={{animationDelay: `${index * 0.05}s`}}>
                            <ProjectCard project={project} onSelectProject={handleSelectProject} />
                        </div>
                    ))}
                     {filteredProjects.length === 0 && (
                        <div className="col-span-full text-center py-12">
                            <p className="text-slate-400">No projects found in this category.</p>
                        </div>
                    )}
                </div>
            </div>
            <ProjectModal project={selectedProject} onClose={handleCloseModal} />
        </>
    );
};

export default PortfolioPage;
