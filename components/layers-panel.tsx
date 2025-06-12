'use client';

import React from 'react';
import { Eye, EyeOff, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { useEditor } from '@/app/editor-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface LayerItem {
  element: any;
  visible: boolean;
}

export function LayersPanel() {
  const {
    getCurrentSlide,
    selectedElementId,
    selectElement,
    deleteElement,
    moveElementToFront,
    moveElementToBack,
    updateElement,
  } = useEditor();

  const slide = getCurrentSlide();
  const [visibilityMap, setVisibilityMap] = React.useState<Record<string, boolean>>({});

  if (!slide) return null;

  const sortedElements = [...slide.elements].sort((a, b) => b.zIndex - a.zIndex);

  const toggleVisibility = (elementId: string) => {
    setVisibilityMap({
      ...visibilityMap,
      [elementId]: !visibilityMap[elementId],
    });
    updateElement(elementId, {
      opacity: visibilityMap[elementId] ? 100 : 0,
    });
  };

  const getElementLabel = (element: any) => {
    if (element.type === 'text') {
      return `Text: "${(element.text || '').substring(0, 20)}"`;
    } else if (element.type === 'image') {
      return 'Image';
    } else if (element.type === 'shape') {
      return `Shape: ${element.shapeType}`;
    } else if (element.type === 'video') {
      return 'Video';
    }
    return 'Element';
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-3 overflow-y-auto">
      <h3 className="font-semibold text-sm mb-3 px-2">Layers</h3>
      <div className="space-y-1">
        {sortedElements.length === 0 ? (
          <p className="text-xs text-gray-500 px-2 py-4 text-center">
            No elements on this slide
          </p>
        ) : (
          sortedElements.map((element, idx) => (
            <div
              key={element.id}
              className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                selectedElementId === element.id
                  ? 'bg-blue-100 border-l-2 border-blue-500'
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => selectElement(element.id)}
            >
              {/* Visibility Toggle */}
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleVisibility(element.id);
                }}
              >
                {visibilityMap[element.id] ? (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                ) : (
                  <Eye className="w-4 h-4 text-gray-600" />
                )}
              </Button>

              {/* Element Name */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-700 truncate">
                  {getElementLabel(element)}
                </p>
                <p className="text-xs text-gray-500">Z: {element.zIndex}</p>
              </div>

              {/* Z-index Controls */}
              <div className="flex gap-1">
                {idx > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      moveElementToFront(element.id);
                    }}
                    title="Raise"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </Button>
                )}
                {idx < sortedElements.length - 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      moveElementToBack(element.id);
                    }}
                    title="Lower"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </Button>
                )}
              </div>

              {/* Delete */}
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteElement(element.id);
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))
        )}
      </div>

      {/* Layer Counter */}
      {sortedElements.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-200 text-center text-xs text-gray-600">
          {sortedElements.length} element{sortedElements.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
