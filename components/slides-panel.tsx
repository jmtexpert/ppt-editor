'use client';

import React from 'react';
import { Plus, Trash2, Copy } from 'lucide-react';
import { useEditor } from '@/app/editor-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export function SlidesPanel() {
  const {
    slides,
    currentSlideId,
    addSlide,
    deleteSlide,
    duplicateSlide,
    setCurrentSlide,
    updateSlide,
  } = useEditor();

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-3 overflow-y-auto flex flex-col">
      <div className="mb-4">
        <Button
          onClick={addSlide}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Slide
        </Button>
      </div>

      <div className="flex-1 space-y-2">
        {slides.map((slide, index) => (
          <div key={slide.id}>
            <div
              onClick={() => setCurrentSlide(slide.id)}
              className={`relative group cursor-pointer rounded-lg border-2 overflow-hidden transition-all ${
                currentSlideId === slide.id
                  ? 'border-blue-500 shadow-lg'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Slide Thumbnail */}
              <div
                style={{
                  width: '100%',
                  aspectRatio: '16 / 9',
                  backgroundColor: slide.backgroundColor,
                  backgroundImage: slide.backgroundImage
                    ? `url(${slide.backgroundImage})`
                    : 'none',
                  backgroundSize: 'cover',
                  fontSize: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#999',
                }}
              >
                {slide.elements.length > 0 && (
                  <span>{slide.elements.length} elements</span>
                )}
              </div>

              {/* Slide Number */}
              <div className="px-2 py-1 bg-gray-50 border-t border-gray-200">
                <p className="text-xs font-semibold text-gray-700">
                  Slide {index + 1}
                </p>
              </div>

              {/* Actions */}
              <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-6 w-6 p-0 bg-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    duplicateSlide(slide.id);
                  }}
                  title="Duplicate"
                >
                  <Copy className="w-3 h-3" />
                </Button>
                {slides.length > 1 && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 w-6 p-0 bg-white text-red-600 hover:text-red-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSlide(slide.id);
                    }}
                    title="Delete"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>

            {/* Slide Properties (Editable Name) */}
            <div className="px-2 py-1">
              <Input
                value={slide.name}
                onChange={(e) =>
                  updateSlide(slide.id, { name: e.target.value })
                }
                placeholder="Slide name"
                className="h-7 text-xs"
              />
            </div>

            {/* Background Color Picker */}
            <div className="px-2 py-1 flex items-center gap-2">
              <span className="text-xs text-gray-600">BG:</span>
              <input
                type="color"
                value={slide.backgroundColor}
                onChange={(e) =>
                  updateSlide(slide.id, { backgroundColor: e.target.value })
                }
                className="w-8 h-8 rounded cursor-pointer"
              />
              <span className="text-xs font-mono text-gray-500">
                {slide.backgroundColor}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Slide Counter */}
      <div className="mt-4 pt-4 border-t border-gray-200 text-center text-xs text-gray-600">
        {slides.length} slide{slides.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}
