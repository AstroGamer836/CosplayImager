
import React from 'react';

interface AlertProps {
    message: string;
    type?: 'error' | 'info';
}

const ErrorIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
);

export const Alert: React.FC<AlertProps> = ({ message, type = 'error' }) => {
    const styles = {
        error: 'bg-red-900/50 border-red-500 text-red-300',
        info: 'bg-blue-900/50 border-blue-500 text-blue-300',
    };
    
    return (
        <div className={`flex items-center p-4 rounded-lg border ${styles[type]}`} role="alert">
            <div className="flex-shrink-0">
                {type === 'error' && <ErrorIcon />}
            </div>
            <div className="ml-3 text-sm font-medium">{message}</div>
        </div>
    );
};
