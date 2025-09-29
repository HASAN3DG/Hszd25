import React, { useState } from 'react';
import ImageUploader from './components/ImageUploader';
import PromptDisplay from './components/PromptDisplay';
import StyleButtons from './components/StyleButtons';
import { generateImageDescription, applyStyleToPrompt } from './services/geminiService';
import { ART_STYLES } from './constants';

const App: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [basePrompt, setBasePrompt] = useState<string>('');
  const [styledPrompt, setStyledPrompt] = useState<string>('');
  const [isLoadingBase, setIsLoadingBase] = useState<boolean>(false);
  const [isLoadingStyled, setIsLoadingStyled] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleImageUpload = async (imageData: string, mimeType: string) => {
    setImage(`data:${mimeType};base64,${imageData}`);
    setIsLoadingBase(true);
    setError('');
    setBasePrompt('');
    setStyledPrompt('');

    try {
      const description = await generateImageDescription(imageData, mimeType);
      setBasePrompt(description);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoadingBase(false);
    }
  };
  
  const handleStyleSelect = async (stylePrompt: string) => {
    if (!basePrompt) return;
    
    setIsLoadingStyled(true);
    setError('');
    // Keep the old styled prompt visible while loading for better UX
    // setStyledPrompt(''); 
    
    try {
      const finalPrompt = await applyStyleToPrompt(basePrompt, stylePrompt);
      setStyledPrompt(finalPrompt);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoadingStyled(false);
    }
  };

  return (
    <div className="min-h-screen text-white flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-6xl mx-auto space-y-8">
        <header className="text-center group">
          <div className="flex items-center justify-center gap-3">
             <svg className="w-10 h-10 text-cyan-400 transition-transform duration-500 group-hover:rotate-180" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.2495 16.3339L15.4295 17.5139C16.3295 18.4139 17.8495 18.4139 18.7495 17.5139L21.6295 14.6339C22.5295 13.7339 22.5295 12.2139 21.6295 11.3139L20.4495 10.1339" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9.75 7.66602L8.57 6.48602C7.67 5.58602 6.15 5.58602 5.25 6.48602L2.37 9.36602C1.47 10.266 1.47 11.786 2.37 12.686L3.55 13.866" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 12L16 12" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 py-2">
              Hszd25
            </h1>
          </div>
          <p className="mt-2 text-lg text-slate-300">AI-Powered Image Prompt Generator</p>
        </header>

        {error && (
          <div className="glass-card rounded-lg bg-red-500/20 border-red-500/50 text-red-200 px-4 py-3" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <main className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 flex flex-col space-y-8">
            <div className="glass-card rounded-2xl p-4 sm:p-6">
                <h2 className="text-xl font-bold mb-4 text-cyan-300">1. Upload Image</h2>
                <ImageUploader onImageUpload={handleImageUpload} isLoading={isLoadingBase} />
            </div>
            {image && (
              <div className="glass-card rounded-2xl p-4 sm:p-6">
                <h2 className="text-xl font-bold mb-4 text-slate-300">Image Preview</h2>
                <img src={image} alt="Uploaded preview" className="rounded-lg max-h-72 w-full object-contain" />
              </div>
            )}
          </div>
          
          <div className="lg:col-span-3 flex flex-col space-y-8">
            <PromptDisplay 
              title="2. Base Prompt"
              prompt={basePrompt}
              isLoading={isLoadingBase}
              placeholder="Your generated prompt description will appear here..."
            />
            <StyleButtons 
              styles={ART_STYLES}
              onStyleSelect={handleStyleSelect}
              isDisabled={!basePrompt || isLoadingBase || isLoadingStyled}
            />
            <PromptDisplay 
              title="3. Styled Prompt"
              prompt={styledPrompt}
              isLoading={isLoadingStyled}
              placeholder="Your final prompt with the applied style will appear here..."
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;