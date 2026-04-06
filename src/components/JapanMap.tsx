import React from 'react';
import './JapanMap.css';

const JapanMap: React.FC = () => {
  return (
    <div className="japan-map-container">
      <svg viewBox="0 0 200 400" className="japan-svg">
        {/* Simplified stylized Japan Map as a series of abstract shapes/dots */}
        {/* Hokkaido */}
        <path d="M140 20 Q160 10 180 40 Q170 60 140 50 Z" className="region-path region-hokkaido" />
        
        {/* Honshu (North) */}
        <path d="M130 60 Q150 90 140 140 Q120 130 110 100 Z" className="region-path region-tohoku" />
        
        {/* Honshu (Central/Kansai) - Highlighted */}
        <path d="M110 150 Q130 190 100 230 Q70 210 80 180 Z" className="region-path region-kansai visited" />
        
        {/* Honshu (West/Chugoku) */}
        <path d="M75 235 Q50 250 30 260 L25 245 Q50 230 75 225 Z" className="region-path region-chugoku visited" />
        
        {/* Shikoku */}
        <path d="M50 270 Q70 270 80 290 Q60 300 45 285 Z" className="region-path region-shikoku visited" />
        
        {/* Kyushu */}
        <path d="M15 280 Q35 300 30 350 Q10 340 5 300 Z" className="region-path region-kyushu" />

        {/* Decorative connecting line (Timeline feel) */}
        <path 
          d="M100 190 L75 240 L55 275" 
          fill="none" 
          stroke="rgba(255,255,255,0.2)" 
          strokeWidth="1" 
          strokeDasharray="4 4"
        />
      </svg>
    </div>
  );
};

export default JapanMap;
