import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface MainLayoutProps {
    children: ReactNode;
    showFooter?: boolean;
    className?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, showFooter = true, className = "" }) => {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <Navbar />
            <main className={`flex-1 pt-16 ${className}`}>
                {children}
            </main>
            {showFooter && <Footer />}
        </div>
    );
};

export default MainLayout;
