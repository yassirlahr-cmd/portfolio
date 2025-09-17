import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import type { Project } from '../types';
import { PORTFOLIO_PROJECTS } from '../constants';

interface PortfolioContextType {
    projects: Project[];
    addProject: (project: Omit<Project, 'id'>) => void;
    updateProject: (project: Project) => void;
    deleteProject: (id: string) => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        try {
            const storedProjects = localStorage.getItem('portfolioProjects');
            if (storedProjects) {
                setProjects(JSON.parse(storedProjects));
            } else {
                setProjects(PORTFOLIO_PROJECTS);
            }
        } catch (error) {
            console.error("Failed to load projects from localStorage", error);
            setProjects(PORTFOLIO_PROJECTS);
        }
    }, []);

    useEffect(() => {
        // Only save when projects are loaded to avoid overwriting on initial mount
        if (projects && projects.length > 0) { 
            localStorage.setItem('portfolioProjects', JSON.stringify(projects));
        }
    }, [projects]);

    const addProject = (projectData: Omit<Project, 'id'>) => {
        const newProject: Project = { ...projectData, id: new Date().getTime().toString() };
        setProjects(prev => [newProject, ...prev]);
    };

    const updateProject = (updatedProject: Project) => {
        setProjects(prev => prev.map(p => (p.id === updatedProject.id ? updatedProject : p)));
    };

    const deleteProject = (id: string) => {
        setProjects(prev => prev.filter(p => p.id !== id));
    };

    return (
        <PortfolioContext.Provider value={{ projects, addProject, updateProject, deleteProject }}>
            {children}
        </PortfolioContext.Provider>
    );
};

export const usePortfolio = (): PortfolioContextType => {
    const context = useContext(PortfolioContext);
    if (!context) {
        throw new Error('usePortfolio must be used within a PortfolioProvider');
    }
    return context;
};
