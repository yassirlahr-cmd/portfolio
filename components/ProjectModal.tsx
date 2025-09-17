import React, { useEffect, useState } from 'react';
import type { Project } from '../types';
import { CloseIcon, ShareIcon } from './icons';

interface ProjectModalProps {
    project: Project | null;
    onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);
    
    useEffect(() => {
        if (project) {
            setCopied(false);
        }
    }, [project]);
    
    if (!project) return null;

    const handleCopyLink = () => {
        if (!project) return;
        const url = `${window.location.origin}/#/portfolio/${project.id}`;
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }).catch(err => {
            console.error('Failed to copy link: ', err);
        });
    };

    const hasDetails = project.client || project.year || project.duration || (project.tools && project.tools.length > 0);

    return (
        <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="glass-pane w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                <div className="relative aspect-video bg-black flex-shrink-0">
                    {project.videoUrl ? (
                        <iframe 
                            src={project.videoUrl} 
                            title={project.title} 
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                            className="w-full h-full"
                        ></iframe>
                    ) : (
                        <img src={project.imageUrl} alt={project.title} className="w-full h-full object-contain" />
                    )}
                </div>
                <div className="p-8 overflow-y-auto">
                    <div className="flex justify-between items-start gap-4 mb-4">
                        <div>
                             <span className="bg-secondary/80 backdrop-blur-sm text-on-secondary text-xs font-bold px-3 py-1 rounded-full mb-4 inline-block">
                                {project.category}
                            </span>
                            <h2 className="text-3xl font-bold text-white text-glow">{project.title}</h2>
                        </div>
                        <div className="flex items-center flex-shrink-0 relative">
                             <button
                                onClick={handleCopyLink}
                                className="p-2 rounded-full text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                                aria-label="Copy project link"
                                title="Copy project link"
                            >
                                <ShareIcon className="w-5 h-5" />
                            </button>
                            <span className={`absolute top-1/2 -translate-y-1/2 right-full mr-2 bg-secondary text-on-secondary text-xs font-bold px-2 py-1 rounded-md transition-opacity duration-300 pointer-events-none ${copied ? 'opacity-100' : 'opacity-0'}`}>
                                Copied!
                            </span>
                            <button 
                                onClick={onClose} 
                                className="p-2 rounded-full text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                                aria-label="Close modal"
                            >
                                <CloseIcon className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                    
                    <p className={`text-slate-300 leading-relaxed ${hasDetails ? 'mb-8' : ''}`}>{project.description}</p>
                    
                    {hasDetails && (
                        <div className="border-t border-white/10 pt-6 space-y-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                                {project.client && (
                                    <div>
                                        <h4 className="font-semibold text-slate-400 uppercase tracking-wider text-xs mb-1">Client</h4>
                                        <p className="text-white">{project.client}</p>
                                    </div>
                                )}
                                {project.year && (
                                    <div>
                                        <h4 className="font-semibold text-slate-400 uppercase tracking-wider text-xs mb-1">Year</h4>
                                        <p className="text-white">{project.year}</p>
                                    </div>
                                )}
                                {project.duration && (
                                    <div>
                                        <h4 className="font-semibold text-slate-400 uppercase tracking-wider text-xs mb-1">Duration</h4>
                                        <p className="text-white">{project.duration}</p>
                                    </div>
                                )}
                            </div>
                    
                            {project.tools && project.tools.length > 0 && (
                                <div>
                                    <h4 className="font-semibold text-slate-400 uppercase tracking-wider text-xs mb-3">Tools Used</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {project.tools.map(tool => (
                                            <span key={tool} className="bg-white/10 text-slate-200 text-xs font-medium px-3 py-1 rounded-full">
                                                {tool}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectModal;
