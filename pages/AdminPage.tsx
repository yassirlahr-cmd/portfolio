import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';
import type { Project } from '../types';
import { TrashIcon, ExternalLinkIcon, EditIcon } from '../components/icons';
import ConfirmationModal from '../components/ConfirmationModal';

const AdminPage: React.FC = () => {
    const { projects, addProject, updateProject, deleteProject, loading, error } = usePortfolio();
    
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [client, setClient] = useState('');
    const [year, setYear] = useState('');
    const [duration, setDuration] = useState('');
    const [tools, setTools] = useState('');
    const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

    const resetForm = () => {
        setIsEditing(null);
        setTitle('');
        setCategory('');
        setDescription('');
        setImageUrl('');
        setVideoUrl('');
        setClient('');
        setYear('');
        setDuration('');
        setTools('');
    };

    const handleEditClick = (project: Project) => {
        setIsEditing(project.id);
        setTitle(project.title);
        setCategory(project.category);
        setDescription(project.description);
        setImageUrl(project.imageUrl);
        setVideoUrl(project.videoUrl || '');
        setClient(project.client || '');
        setYear(project.year?.toString() || '');
        setDuration(project.duration || '');
        setTools(project.tools?.join(', ') || '');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !category || !description || !imageUrl) {
            alert("Please fill out Title, Category, Description, and Image URL.");
            return;
        }

        const projectData: Omit<Project, 'id'> = {
            title,
            category,
            description,
            imageUrl,
            videoUrl: videoUrl || undefined,
            client: client || undefined,
            year: year ? parseInt(year, 10) : undefined,
            duration: duration || undefined,
            tools: tools ? tools.split(',').map(t => t.trim()).filter(Boolean) : undefined,
        };
        
        if (isEditing) {
            await updateProject({ ...projectData, id: isEditing });
        } else {
            await addProject(projectData);
        }
        resetForm();
    };

    const handleDeleteClick = (project: Project) => {
        setProjectToDelete(project);
    };

    const handleConfirmDelete = async () => {
        if (projectToDelete) {
            await deleteProject(projectToDelete.id);
            setProjectToDelete(null);
        }
    };
    
    const inputClasses = "w-full bg-black/20 border border-white/10 rounded-xl py-2.5 px-4 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300";

    return (
        <>
            <div className="space-y-12">
                <div className="animate-fade-in-up text-center">
                    <h1 className="text-5xl font-bold text-glow">Admin Panel</h1>
                    <p className="text-slate-300 mt-4">Manage your website content here.</p>
                </div>

                <section className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <h2 className="text-3xl font-bold mb-6 text-white text-glow">Portfolio Management</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1 glass-pane p-6 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
                            <h3 className="text-2xl font-bold mb-6 text-white">{isEditing ? 'Edit Project' : 'Add New Project'}</h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input type="text" placeholder="* Project Title" value={title} onChange={e => setTitle(e.target.value)} required className={inputClasses} aria-label="Project Title" />
                                <input type="text" placeholder="* Category" value={category} onChange={e => setCategory(e.target.value)} required className={inputClasses} aria-label="Category" />
                                <textarea placeholder="* Description" value={description} onChange={e => setDescription(e.target.value)} required rows={4} className={inputClasses} aria-label="Description" />
                                <input type="url" placeholder="* Image URL" value={imageUrl} onChange={e => setImageUrl(e.target.value)} required className={inputClasses} aria-label="Image URL" />
                                <input type="url" placeholder="Video URL (YouTube embed)" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} className={inputClasses} aria-label="Video URL" />
                                <input type="text" placeholder="Client Name" value={client} onChange={e => setClient(e.target.value)} className={inputClasses} aria-label="Client Name" />
                                <input type="number" placeholder="Year Completed" value={year} onChange={e => setYear(e.target.value)} className={inputClasses} aria-label="Year Completed" />
                                <input type="text" placeholder="Project Duration (e.g., 2 Weeks)" value={duration} onChange={e => setDuration(e.target.value)} className={inputClasses} aria-label="Project Duration" />
                                <input type="text" placeholder="Tools Used (comma-separated)" value={tools} onChange={e => setTools(e.target.value)} className={inputClasses} aria-label="Tools Used" />
                                
                                <div className="flex space-x-3 pt-2">
                                    <button type="submit" className="flex-grow bg-primary text-on-primary font-bold py-2.5 px-4 rounded-xl hover:bg-primary/90 transition-colors text-glow shadow-lg shadow-primary/20">{isEditing ? 'Update Project' : 'Add Project'}</button>
                                    {isEditing && (
                                        <button type="button" onClick={resetForm} className="bg-white/10 text-slate-200 font-bold py-2.5 px-4 rounded-xl hover:bg-white/20 transition-colors">Cancel</button>
                                    )}
                                </div>
                            </form>
                        </div>

                        <div className="lg:col-span-2 glass-pane p-6 flex flex-col">
                            <h3 className="text-2xl font-bold mb-4 text-white flex-shrink-0">Existing Projects ({projects.length})</h3>
                             {error && <p className="text-center py-4 text-error">{error}</p>}
                            <div className="overflow-y-auto space-y-3 pr-2 -mr-2">
                                {loading ? (
                                     <p className="text-center py-12 text-slate-400">Loading projects...</p>
                                ) : projects.length > 0 ? projects.map(project => (
                                    <div key={project.id} className="flex items-center justify-between p-3 bg-black/20 rounded-xl hover:bg-black/30 border border-transparent hover:border-primary/50 transition-all">
                                        <div className="flex items-center space-x-4 overflow-hidden">
                                            <img src={project.imageUrl} alt={project.title} className="w-20 h-12 object-cover rounded-lg flex-shrink-0"/>
                                            <div className="overflow-hidden">
                                                <p className="font-bold truncate text-white" title={project.title}>{project.title}</p>
                                                <p className="text-sm text-slate-400">{project.category}</p>
                                            </div>
                                        </div>
                                        <div className="flex space-x-1 flex-shrink-0 ml-4">
                                            <button onClick={() => handleEditClick(project)} className="text-sky-400 hover:text-sky-300 p-2 rounded-full hover:bg-white/10 transition" aria-label={`Edit ${project.title}`}><EditIcon className="w-5 h-5"/></button>
                                            <button onClick={() => handleDeleteClick(project)} className="text-error/80 hover:text-error p-2 rounded-full hover:bg-white/10 transition" aria-label={`Delete ${project.title}`}><TrashIcon className="w-5 h-5"/></button>
                                        </div>
                                    </div>
                                )) : (
                                    <p className="text-center py-12 text-slate-400">No projects found. Add one using the form!</p>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
                
                <section className="animate-fade-in-up glass-pane p-8" style={{ animationDelay: '0.2s' }}>
                    <div className="text-center">
                        <h2 className="text-3xl font-bold mb-4 text-white text-glow">Income Management</h2>
                        <p className="text-slate-300 mb-6 max-w-xl mx-auto">Manage your income entries, view charts, and track your earnings on a dedicated page.</p>
                        <Link to="/income" className="inline-flex items-center justify-center bg-secondary/90 text-on-secondary hover:bg-secondary font-semibold py-3 px-6 rounded-full transition-all duration-300 shadow-lg shadow-secondary/20">
                            Go to Income Tracker
                            <ExternalLinkIcon className="w-5 h-5 ml-2" />
                        </Link>
                    </div>
                </section>
            </div>
            <ConfirmationModal
                isOpen={!!projectToDelete}
                onClose={() => setProjectToDelete(null)}
                onConfirm={handleConfirmDelete}
                title="Confirm Deletion"
                message={`Are you sure you want to permanently delete the project "${projectToDelete?.title}"? This action cannot be undone.`}
            />
        </>
    );
};

export default AdminPage;