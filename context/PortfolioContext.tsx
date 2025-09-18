import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import type { Project } from '../types';
import * as api from '../api';

interface PortfolioContextType {
    projects: Project[];
    addProject: (project: Omit<Project, 'id'>) => Promise<void>;
    updateProject: (project: Project) => Promise<void>;
    deleteProject: (id: string) => Promise<void>;
    loading: boolean;
    error: string | null;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await api.getProjects();
                setProjects(data);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
                setError(`Failed to load projects: ${errorMessage}`);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    const addProject = useCallback(async (projectData: Omit<Project, 'id'>) => {
        try {
            const newProject = await api.addProject(projectData);
            setProjects(prev => [newProject, ...prev]);
        } catch (err) {
            console.error("Failed to add project", err);
            setError('Failed to add project. Please try again.');
        }
    }, []);

    const updateProject = useCallback(async (updatedProject: Project) => {
        try {
            const returnedProject = await api.updateProject(updatedProject);
            setProjects(prev => prev.map(p => (p.id === returnedProject.id ? returnedProject : p)));
        } catch (err) {
            console.error("Failed to update project", err);
            setError('Failed to update project. Please try again.');
        }
    }, []);

    const deleteProject = useCallback(async (id: string) => {
        try {
            await api.deleteProject(id);
            setProjects(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            console.error("Failed to delete project", err);
            setError('Failed to delete project. Please try again.');
        }
    }, []);

    return (
        <PortfolioContext.Provider value={{ projects, addProject, updateProject, deleteProject, loading, error }}>
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
