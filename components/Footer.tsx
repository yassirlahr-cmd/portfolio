import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="mt-auto py-4">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                 <div className="glass-pane !rounded-full py-4 px-6 text-center">
                    <p className="text-sm text-slate-400">
                        &copy; {new Date().getFullYear()} VisioFlow. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;