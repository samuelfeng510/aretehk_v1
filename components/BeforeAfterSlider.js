'use client';

import { useState } from 'react';

export default function BeforeAfterSlider({ beforeUrl, afterUrl }) {
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleSliderChange = (e) => {
    setSliderPosition(e.target.value);
  };

  if (!beforeUrl && !afterUrl) {
    return <div className="text-gray-500">No images to compare.</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Visual Comparison</h3>
      
      <div className="relative w-full max-w-lg mx-auto overflow-hidden rounded-lg shadow-md aspect-[4/3]">
        {/* After Image (Background) */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${afterUrl || beforeUrl})` }}
        />
        
        {/* Before Image (Foreground with clip) */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${beforeUrl || afterUrl})`,
            clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`
          }}
        />

        {/* Slider Control */}
        <input
          type="range"
          min="0"
          max="100"
          value={sliderPosition}
          onChange={handleSliderChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        {/* Slider Line/Handle Handle visual representation */}
        <div 
          className="absolute top-0 bottom-0 w-1 bg-white cursor-pointer pointer-events-none"
          style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
        >
          <div className="absolute top-1/2 left-1/2 w-6 h-6 bg-white rounded-full shadow-md transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-xs text-gray-600 font-bold">
            &lt;&gt;
          </div>
        </div>
        
        {/* Labels */}
        <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">Before</div>
        <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">After</div>
      </div>
      
      <p className="text-sm text-gray-600 text-center">Drag the slider to compare before (left) and after (right) images.</p>
    </div>
  );
}
