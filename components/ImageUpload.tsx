import React, { useCallback, useRef, useState } from 'react';
import type { ImageData } from '../types';

interface ImageUploadProps {
    onImageUpload: (imageData: ImageData) => void;
}

const UploadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);


export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            processFile(file);
        }
    };
    
    const processFile = (file: File) => {
        if (!file.type.startsWith('image/')) {
            setError('Please upload a valid image file (PNG, JPG, etc.).');
            return;
        }
        setError(null);
        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result as string;
            onImageUpload({ base64: result, mimeType: file.type });
        };
        reader.onerror = () => {
             setError('Failed to read the file.');
        }
        reader.readAsDataURL(file);
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };
    
    const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
    }, []);

    const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
            processFile(event.dataTransfer.files[0]);
            event.dataTransfer.clearData();
        }
    }, []);

    return (
        <div className="w-full max-w-2xl text-center">
            <div
                className="bg-white/5 border-2 border-dashed border-gray-500 rounded-xl p-12 cursor-pointer hover:border-teal-400 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-teal-500/20"
                onClick={handleClick}
                onDragOver={onDragOver}
                onDrop={onDrop}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                />
                <div className="flex flex-col items-center">
                    <UploadIcon />
                    <p className="text-xl font-semibold text-gray-300">Click to upload or drag & drop</p>
                    <p className="text-gray-400 mt-1">PNG, JPG, GIF, WEBP</p>
                </div>
            </div>
             {error && <p className="text-red-400 mt-4">{error}</p>}
        </div>
    );
};