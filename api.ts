import type { Project, IncomeEntry } from './types';

const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
const API_BASE_URL = isProduction ? '' : 'http://localhost:3001';

// PROJECTS API
export const getProjects = (): Promise<Project[]> => 
    fetch(`${API_BASE_URL}/api/projects`).then(res => {
        if (!res.ok) throw new Error('Failed to fetch projects');
        return res.json();
    });

export const addProject = (project: Omit<Project, 'id'>): Promise<Project> => 
    fetch(`${API_BASE_URL}/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project)
    }).then(res => {
        if (!res.ok) throw new Error('Failed to add project');
        return res.json();
    });

export const updateProject = (project: Project): Promise<Project> => 
    fetch(`${API_BASE_URL}/api/projects/${project.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project)
    }).then(res => {
        if (!res.ok) throw new Error('Failed to update project');
        return res.json();
    });

export const deleteProject = (id: string): Promise<Response> => 
    fetch(`${API_BASE_URL}/api/projects/${id}`, {
        method: 'DELETE'
    }).then(res => {
        if (!res.ok) throw new Error('Failed to delete project');
        return res;
    });

// INCOMES API
export const getIncomes = (): Promise<IncomeEntry[]> =>
    fetch(`${API_BASE_URL}/api/incomes`).then(res => {
        if (!res.ok) throw new Error('Failed to fetch incomes');
        return res.json();
    });

export const addIncome = (income: Omit<IncomeEntry, 'id'>): Promise<IncomeEntry> => 
    fetch(`${API_BASE_URL}/api/incomes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(income)
    }).then(res => {
        if (!res.ok) throw new Error('Failed to add income');
        return res.json();
    });

export const deleteIncome = (id: string): Promise<Response> => 
    fetch(`${API_BASE_URL}/api/incomes/${id}`, {
        method: 'DELETE'
    }).then(res => {
        if (!res.ok) throw new Error('Failed to delete income');
        return res;
    });
