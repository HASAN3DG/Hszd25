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
    setStyledPrompt('');
    
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
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl mx-auto space-y-6">
        <header className="text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Hszd25
          </h1>
          <p className="mt-2 text-lg text-gray-300">AI-Powered Image Prompt Generator</p>
        </header>

        {error && (
          <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex flex-col space-y-6">
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-blue-300">1. Upload Image</h2>
                <ImageUploader onImageUpload={handleImageUpload} isLoading={isLoadingBase} />
            </div>
            {image && (
              <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                <h2 className="text-xl font-bold mb-4 text-gray-300">Image Preview</h2>
                <img src={image} alt="Uploaded preview" className="rounded-lg max-h-64 w-full object-contain" />
              </div>
            )}
          </div>
          
          <div className="flex flex-col space-y-6">
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
