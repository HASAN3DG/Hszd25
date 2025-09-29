import React from 'react';
import { ArtStyle } from '../types';

interface StyleButtonsProps {
  styles: ArtStyle[];
  onStyleSelect: (stylePrompt: string) => void;
  isDisabled: boolean;
}

const StyleButtons: React.FC<StyleButtonsProps> = ({ styles, onStyleSelect, isDisabled }) => {
  return (
    <div className="w-full bg-gray-800 rounded-lg p-4 shadow-inner">
      <h3 className="text-lg font-semibold text-blue-300 mb-3">Apply an Artistic Style</h3>
      {isDisabled ? (
        <p className="text-center text-gray-500">Upload an image to generate a base prompt first.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {styles.map((style) => (
            <button
              key={style.name}
              onClick={() => onStyleSelect(style.prompt)}
              className="w-full text-center p-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-800 transition-transform transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              {style.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default StyleButtons;
