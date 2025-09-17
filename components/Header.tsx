import React from 'react';

const TanjiroIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none">
        {/* Outer border, slightly transparent teal */}
        <rect x="0.5" y="0.5" width="23" height="23" rx="4" stroke="#5eead4" strokeOpacity="0.5" />
        {/* Checkered pattern using theme colors */}
        <rect x="3" y="3" width="9" height="9" rx="1" fill="#5eead4" /> 
        <rect x="12" y="3" width="9" height="9" rx="1" fill="#1e293b" />
        <rect x="3" y="12" width="9" height="9" rx="1" fill="#1e293b" />
        <rect x="12" y="12" width="9" height="9" rx="1" fill="#5eead4" />
    </svg>
);


export const Header: React.FC = () => {
    return (
        <header className="sticky top-0 z-20 bg-slate-900/60 backdrop-blur-lg border-b border-white/10 shadow-lg w-full">
            <div className="container mx-auto px-4 py-3 flex items-center">
                <TanjiroIcon />
                <h1 className="text-2xl font-bold text-gray-100 ml-3 tracking-tight">
                    Cosplay<span className="text-teal-300">Imager</span>
                </h1>
            </div>
        </header>
    );
};