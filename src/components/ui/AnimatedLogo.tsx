import React from 'react';
import { motion } from 'framer-motion';

const AnimatedLogo: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
    // Sizes
    const dimensions = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-24 h-24'
    };

    const textSize = {
        sm: 'text-lg',
        md: 'text-2xl',
        lg: 'text-5xl'
    };

    return (
        <div className="flex items-center gap-3 group cursor-default">
            {/* Logo Container with Running Light Border */}
            <div className="relative flex items-center justify-center p-[2px] overflow-hidden rounded-xl">

                {/* Rotating Border (The "Running White Light" Effect) */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-[-50%] w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_90deg,white_180deg,transparent_270deg)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />

                {/* Inner Background to hide the center of the gradient */}
                <div className="absolute inset-[1px] bg-slate-900 rounded-xl z-0"></div>

                {/* The Logo Image */}
                <motion.img
                    src="/dmind-premium-icon.png"
                    alt="D-MIND Logo"
                    className={`relative z-10 rounded-lg object-cover ${dimensions[size]} shadow-lg shadow-blue-500/20`}
                    initial={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                />
            </div>

            {/* Text with Shimmer Effect */}
            <div className="relative overflow-hidden">
                <span className={`font-bold tracking-tight text-white ${textSize[size]}`}>
                    D-MIND
                </span>

                {/* Text Shimmer Overlay */}
                <motion.div
                    className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[-20deg]"
                    initial={{ x: '-150%' }}
                    animate={{ x: '150%' }}
                    transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
                />
            </div>
        </div>
    );
};

export default AnimatedLogo;
