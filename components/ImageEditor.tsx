
import React, { useState } from 'react';
import { editImageWithNanoBanana, getPromptSuggestions } from '../services/geminiService';
import type { EditedImageResult, ImageData } from '../types';
import { Button } from './Button';
import { Spinner } from './Spinner';
import { Alert } from './Alert';

interface ImageEditorProps {
    originalImage: ImageData;
    onStartOver: () => void;
}

const ImagePanel: React.FC<{ title: string; imageUrl?: string; isLoading?: boolean }> = ({ title, imageUrl, isLoading }) => (
    <div className="w-full md:w-1/2 flex flex-col items-center p-4">
        <h3 className="text-lg font-semibold text-gray-400 mb-3">{title}</h3>
        <div className="relative w-full aspect-square bg-black/20 rounded-lg overflow-hidden border border-white/10 flex items-center justify-center shadow-lg">
            {isLoading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                    <Spinner />
                </div>
            )}
            {imageUrl ? (
                <img src={imageUrl} alt={title} className="w-full h-full object-contain" />
            ) : (
                 <div className="text-gray-500">Your edited image will appear here</div>
            )}
        </div>
    </div>
);


export const ImageEditor: React.FC<ImageEditorProps> = ({ originalImage, onStartOver }) => {
    const [prompt, setPrompt] = useState('');
    const [editedResult, setEditedResult] = useState<EditedImageResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // State for iterative editing
    const [activeOriginalImage, setActiveOriginalImage] = useState<ImageData>(originalImage);

    // State for suggestions
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [suggestionError, setSuggestionError] = useState<string | null>(null);


    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError("Please enter an editing prompt.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setEditedResult(null);

        try {
            const result = await editImageWithNanoBanana(activeOriginalImage, prompt);
            setEditedResult(result);
        } catch (err: any) {
            setError(err.message || "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGetSuggestions = async () => {
        setIsSuggesting(true);
        setSuggestionError(null);
        setSuggestions([]);
        try {
            const result = await getPromptSuggestions(activeOriginalImage);
            setSuggestions(result);
        } catch (err: any) {
            setSuggestionError(err.message || "Failed to get suggestions.");
        } finally {
            setIsSuggesting(false);
        }
    };
    
    const handleContinueEditing = () => {
        if (editedResult?.imageUrl && editedResult?.mimeType) {
            setActiveOriginalImage({
                base64: editedResult.imageUrl,
                mimeType: editedResult.mimeType,
            });
            setEditedResult(null);
            setPrompt('');
            setError(null);
            setSuggestions([]);
            setSuggestionError(null);
        }
    };


    return (
        <div className="w-full max-w-6xl">
            <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-8">
                <ImagePanel title="Original" imageUrl={activeOriginalImage.base64} />
                <ImagePanel title="Edited" imageUrl={editedResult?.imageUrl} isLoading={isLoading} />
            </div>

            {editedResult?.text && (
                <div className="my-6 p-4 bg-black/20 rounded-lg border border-white/10 backdrop-blur-sm">
                    <p className="text-teal-300 font-semibold mb-1">AI Response:</p>
                    <p className="text-gray-300">{editedResult.text}</p>
                </div>
            )}

            {(error || suggestionError) && (
                <div className="my-6">
                    <Alert message={error || suggestionError || ''} type="error" />
                </div>
            )}

            <div className="mt-6 flex flex-col gap-4">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., add a birthday hat on the cat"
                    className="w-full p-3 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-teal-400 focus:outline-none transition-shadow placeholder-gray-400"
                    rows={3}
                    disabled={isLoading}
                />
                
                <div className="flex flex-col items-center gap-3">
                    <Button onClick={handleGetSuggestions} variant="secondary" disabled={isLoading || isSuggesting}>
                        {isSuggesting ? 'Thinking...' : 'Suggest Ideas ✨'}
                    </Button>
                     {suggestions.length > 0 && !isSuggesting && (
                        <div className="flex flex-wrap justify-center gap-2 animate-fade-in">
                            {suggestions.map((s, i) => (
                                <button
                                    key={i}
                                    onClick={() => setPrompt(s)}
                                    className="px-3 py-1 bg-teal-900/50 text-teal-200 rounded-full text-sm hover:bg-teal-800/50 transition-colors"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="mt-4 flex flex-col sm:flex-row gap-4">
                    <Button onClick={handleGenerate} disabled={isLoading || !prompt.trim()} className="w-full sm:w-auto flex-grow">
                        {isLoading ? 'Generating...' : 'Generate Edit'}
                    </Button>
                    {editedResult?.imageUrl && (
                         <Button onClick={handleContinueEditing} variant="secondary" disabled={isLoading} className="w-full sm:w-auto">
                            Continue Editing
                        </Button>
                    )}
                    <Button onClick={onStartOver} variant="secondary" disabled={isLoading} className="w-full sm:w-auto">
                        Start Over
                    </Button>
                </div>
            </div>
        </div>
    );
};