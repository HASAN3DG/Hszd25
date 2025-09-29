import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { ArtStyle } from '../types';

interface StyleButtonsProps {
  styles: ArtStyle[];
  onStyleSelect: (stylePrompt: string) => void;
  isDisabled: boolean;
}

const StyleButtons: React.FC<StyleButtonsProps> = ({ styles, onStyleSelect, isDisabled }) => {
  const [hoveredStyle, setHoveredStyle] = useState<{ style: ArtStyle; rect: DOMRect } | null>(null);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (hoveredStyle) {
      // Tooltip height is roughly 128 (image) + 8 (padding) + 8 (padding) + 20 (text) + 6 (margin) = 170px
      const tooltipHeight = 170;
      // Tooltip width is 144px
      const tooltipWidth = 144;
      
      let top = hoveredStyle.rect.top - tooltipHeight;
      if (top < 10) { // If it goes off-screen at the top, show it below
          top = hoveredStyle.rect.bottom + 10;
      }

      let left = hoveredStyle.rect.left + hoveredStyle.rect.width / 2 - tooltipWidth / 2;
      // Clamp to viewport
      left = Math.max(10, Math.min(left, window.innerWidth - tooltipWidth - 10));

      setTooltipPosition({ top, left });
      // Use a short delay to allow for CSS transition
      const timer = setTimeout(() => setIsTooltipVisible(true), 50);
      return () => clearTimeout(timer);
    } else {
      setIsTooltipVisible(false);
    }
  }, [hoveredStyle]);

  const handleMouseEnter = (event: React.MouseEvent<HTMLButtonElement>, style: ArtStyle) => {
    setHoveredStyle({ style, rect: event.currentTarget.getBoundingClientRect() });
  };

  const handleMouseLeave = () => {
    setHoveredStyle(null);
  };

  return (
    <>
      <div className="w-full glass-card rounded-2xl p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-cyan-300 mb-4">Apply an Artistic Style</h3>
        {isDisabled ? (
          <p className="text-center text-slate-500 text-sm h-[100px] flex items-center justify-center">Upload an image to generate a base prompt first.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {styles.map((style) => (
              <button
                key={style.name}
                onClick={() => onStyleSelect(style.prompt)}
                onMouseEnter={(e) => handleMouseEnter(e, style)}
                onMouseLeave={handleMouseLeave}
                className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-800 transition-transform transform hover:scale-105"
                aria-label={`Apply ${style.name} style`}
              >
                <span className="relative w-full text-center px-3 py-2 transition-all ease-in duration-75 bg-gray-900 rounded-md group-hover:bg-opacity-0">
                  {style.name}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
      {hoveredStyle && ReactDOM.createPortal(
        <div 
          className="preview-tooltip"
          role="tooltip"
          style={{ 
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
            opacity: isTooltipVisible ? 1 : 0,
            transform: isTooltipVisible ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(10px)',
          }}
        >
          <img
            src={hoveredStyle.style.image}
            alt={`${hoveredStyle.style.name} preview`}
            style={{ filter: hoveredStyle.style.filters || 'none' }}
          />
          <span>{hoveredStyle.style.name}</span>
        </div>,
        document.body
      )}
    </>
  );
};

export default StyleButtons;