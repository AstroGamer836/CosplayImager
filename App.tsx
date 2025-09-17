import React, { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ImageUpload } from './components/ImageUpload';
import { ImageEditor } from './components/ImageEditor';
import type { ImageData } from './types';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<ImageData | null>(null);

  const handleImageUpload = (imageData: ImageData) => {
    setOriginalImage(imageData);
  };

  const handleStartOver = () => {
    setOriginalImage(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900/30 font-sans text-gray-200">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center justify-center">
        {!originalImage ? (
          <ImageUpload onImageUpload={handleImageUpload} />
        ) : (
          <ImageEditor originalImage={originalImage} onStartOver={handleStartOver} />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;