
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';
import ProjectCard from '../components/ProjectCard';
import type { Project } from '../types';
import { ClipboardListIcon, ScissorsIcon, ColorSwatchIcon, SparklesIcon, VolumeUpIcon } from '../components/icons';

const ContactForm: React.FC = () => {
    const [submitted, setSubmitted] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log({ name, email, message });
        setSubmitted(true);
    };
    
    const inputClasses = "w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300";

    if (submitted) {
        return (
            <div className="text-center p-8 bg-green-500/10 border border-green-500/20 rounded-2xl animate-fade-in-up">
                <h3 className="text-2xl font-bold text-green-300">Thank you!</h3>
                <p className="mt-2 text-on-surface">Your message has been sent. I'll get back to you shortly.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div>
                <label htmlFor="name" className="sr-only">Name</label>
                <input type="text" name="name" id="name" required value={name} onChange={e => setName(e.target.value)}
                    className={inputClasses}
                    placeholder="Your Name" />
            </div>
            <div>
                <label htmlFor="email" className="sr-only">Email</label>
                <input type="email" name="email" id="email" required value={email} onChange={e => setEmail(e.target.value)}
                    className={inputClasses}
                    placeholder="Your Email" />
            </div>
            <div>
                <label htmlFor="message" className="sr-only">Message</label>
                <textarea name="message" id="message" rows={4} required value={message} onChange={e => setMessage(e.target.value)}
                    className={inputClasses}
                    placeholder="Your Message"></textarea>
            </div>
            <div>
                <button type="submit"
                    className="w-full bg-primary hover:bg-primary/80 text-on-primary font-bold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg shadow-primary/30 hover:shadow-primary/50 text-glow">
                    Send Message
                </button>
            </div>
        </form>
    );
};


const HomePage: React.FC = () => {
    const { projects } = usePortfolio();
    const navigate = useNavigate();
    const featuredProjects = projects.slice(0, 3);
    
    const softwareSkills = ["Adobe After Effects", "Adobe Premiere Pro", "DaVinci Resolve", "Cinema 4D", "Adobe Illustrator", "Figma", "Adobe Audition"];
    const creativeSkills = ["Storytelling", "Color Grading", "Motion Design", "Visual Effects (VFX)", "Kinetic Typography", "Compositing", "Sound Editing"];

    const services = [
        { name: 'Concept & Storyboarding', description: 'Collaborating to build a strong narrative foundation and visual plan.', icon: ClipboardListIcon },
        { name: 'Editing & Assembly', description: 'Weaving together footage, sound, and graphics to create a seamless story.', icon: ScissorsIcon },
        { name: 'Color Correction & Grading', description: 'Enhancing mood and atmosphere by meticulously adjusting color and tone.', icon: ColorSwatchIcon },
        { name: 'Motion Graphics & VFX', description: 'Adding polish with dynamic titles and subtle visual effects.', icon: SparklesIcon },
        { name: 'Sound Design & Mixing', description: 'Ensuring crystal-clear audio and creating an immersive soundscape.', icon: VolumeUpIcon },
    ];

    const handleSelectProject = (project: Project) => {
        navigate(`/portfolio/${project.id}`);
    };

    return (
        <>
            <div className="space-y-32">
                {/* Hero Section */}
                <section className="relative text-center rounded-3xl overflow-hidden animate-fade-in-up flex items-center justify-center min-h-[60vh] md:min-h-[75vh]">
                    <div className="absolute inset-0 z-0">
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                            src="https://videos.pexels.com/video-files/853875/853875-hd.mp4"
                            poster="https://picsum.photos/seed/hero-vid/1280/720"
                        >
                            Your browser does not support the video tag.
                        </video>
                        <div className="absolute inset-0 bg-background/70"></div>
                    </div>
                    <div className="relative z-10 p-8">
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-glow">
                            Crafting <span className="text-secondary">Visual Stories</span> That Captivate
                        </h1>
                        <p className="max-w-3xl mx-auto text-lg text-slate-300 mb-10">
                            I'm a passionate video editor and motion graphics designer dedicated to bringing ideas to life through compelling visuals and dynamic motion.
                        </p>
                        <Link to="/portfolio"
                            className="inline-block bg-primary text-on-primary font-bold py-4 px-10 rounded-full hover:bg-primary/90 transition-transform transform hover:scale-105 duration-300 shadow-xl shadow-primary/30 text-glow">
                            View My Work
                        </Link>
                    </div>
                </section>

                {/* About & Skills Section */}
                <section className="glass-pane p-8 md:p-12">
                     <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
                        <div className="lg:col-span-3 animate-slide-in-left">
                            <h2 className="text-4xl font-bold mb-8 text-glow">About Me</h2>
                            <div className="flex flex-col sm:flex-row items-start gap-8">
                                <img 
                                    src="https://i.pravatar.cc/300?u=visioflow"
                                    alt="A portrait of the video editor"
                                    className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover flex-shrink-0 border-4 border-primary/30 shadow-lg"
                                />
                                <div className="space-y-4 text-slate-300 leading-relaxed">
                                    <p>
                                        With over 5 years of experience, I specialize in creating high-impact visual content for brands, filmmakers, and digital creators. My work is driven by a love for storytelling and a meticulous eye for detail, turning complex concepts into clear, engaging, and memorable experiences.
                                    </p>
                                    <p>
                                        Whether it's a slick corporate video, an imaginative motion graphics piece, or a cinematic short film, my goal is always the same: to connect with the audience on an emotional level and leave a lasting impression.
                                    </p>
                                </div>
                            </div>

                            <h3 className="text-3xl font-bold mt-12 mb-6">What I Do</h3>
                            <ul className="space-y-6">
                                {services.map((service, index) => (
                                    <li key={index} className="flex items-start gap-4">
                                        <div className="flex-shrink-0 bg-primary/10 text-primary p-3 rounded-full">
                                            <service.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white">{service.name}</h4>
                                            <p className="text-slate-400 text-sm">{service.description}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="lg:col-span-2 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                             <h3 className="text-3xl font-bold mb-6">Core Competencies</h3>
                             <p className="text-slate-400 mb-8">
                                I am proficient in a wide range of industry-standard software and possess the creative skills to bring any vision to life.
                             </p>
                             
                             <div className="space-y-8">
                                <div>
                                    <h4 className="font-semibold text-secondary mb-4 tracking-wide">SOFTWARE PROFICIENCY</h4>
                                     <div className="flex flex-wrap gap-3">
                                        {softwareSkills.map(skill => (
                                            <span key={skill} className="bg-white/10 backdrop-blur-sm border border-white/10 text-slate-200 text-sm font-medium px-4 py-2 rounded-full">
                                                {skill}
                                            </span>
                                        ))}
                                     </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-secondary mb-4 tracking-wide">CREATIVE SKILLS</h4>
                                     <div className="flex flex-wrap gap-3">
                                        {creativeSkills.map(skill => (
                                            <span key={skill} className="bg-white/10 backdrop-blur-sm border border-white/10 text-slate-200 text-sm font-medium px-4 py-2 rounded-full">
                                                {skill}
                                            </span>
                                        ))}
                                     </div>
                                </div>
                             </div>
                        </div>
                    </div>
                </section>

                {/* Featured Work Section */}
                <section>
                    <h2 className="text-4xl font-bold text-center mb-12 animate-fade-in-up text-glow">Featured Projects</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredProjects.map((project, index) => (
                             <div key={project.id} className="animate-fade-in-up" style={{animationDelay: `${index * 0.15}s`}}>
                                <ProjectCard project={project} onSelectProject={handleSelectProject} />
                            </div>
                        ))}
                    </div>
                     <div className="text-center mt-12">
                         <Link to="/portfolio" className="text-secondary hover:text-secondary/80 font-semibold transition-colors text-glow">
                             View All Projects &rarr;
                         </Link>
                     </div>
                </section>

                {/* Contact Section */}
                <section className="glass-pane p-8 md:p-12">
                    <div className="max-w-2xl mx-auto text-center">
                       <h2 className="text-4xl font-bold mb-4 animate-fade-in-up text-glow">Let's Create Together</h2>
                       <p className="text-slate-300 mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            Have a project in mind or just want to say hello? Drop me a line!
                        </p>
                        <ContactForm />
                    </div>
                </section>
            </div>
        </>
    );
};

export default HomePage;
