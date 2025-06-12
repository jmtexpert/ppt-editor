'use client';

import React, { useState } from 'react';
import {
  Type,
  Square,
  Circle,
  ImageIcon,
  Video,
  Trash2,
  Copy,
  BringToFront,
  SendToBack,
  ChevronDown,
  Download,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { useEditor } from '@/app/editor-context';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Slider } from '@/components/ui/slider';
import { AdvancedEffectsPanel } from './advanced-effects-panel';
import { ExportDialog } from './export-dialog';
import { ImportDialog } from './import-dialog';

export function EditorToolbar() {
  const {
    addElement,
    deleteElement,
    updateElement,
    getSelectedElement,
    moveElementToFront,
    moveElementToBack,
    setZoom,
    zoom,
    handleExport,
  } = useEditor();

  const selectedElement = getSelectedElement();
  const [showShapeMenu, setShowShapeMenu] = useState(false);

  const handleAddText = (fontSize = 24, fontWeight: 'normal' | 'bold' = 'normal') => {
    addElement({
      type: 'text',
      text: 'Edit text here',
      x: 100,
      y: 100,
      width: 300,
      height: 80,
      rotation: 0,
      zIndex: 0,
      opacity: 100,
      fontSize,
      fontFamily: 'Arial',
      fontWeight,
      color: '#000000',
      textAlign: 'left',
    });
  };

  const handleAddShape = (shapeType: 'rectangle' | 'circle' | 'triangle') => {
    addElement({
      type: 'shape',
      shapeType,
      x: 100,
      y: 100,
      width: 150,
      height: 150,
      rotation: 0,
      zIndex: 0,
      opacity: 100,
      fill: '#3b82f6',
      stroke: '#1e40af',
      strokeWidth: 2,
    });
  };

  const handleAddImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          addElement({
            type: 'image',
            src: event.target?.result as string,
            x: 100,
            y: 100,
            width: 300,
            height: 200,
            rotation: 0,
            zIndex: 0,
            opacity: 100,
            objectFit: 'cover',
          });
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleAddVideo = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          addElement({
            type: 'video',
            src: event.target?.result as string,
            x: 100,
            y: 100,
            width: 300,
            height: 200,
            rotation: 0,
            zIndex: 0,
            opacity: 100,
          });
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleDelete = () => {
    if (selectedElement) {
      deleteElement(selectedElement.id);
    }
  };

  const handleDuplicate = () => {
    if (selectedElement) {
      addElement({
        ...selectedElement,
        x: selectedElement.x + 20,
        y: selectedElement.y + 20,
      });
    }
  };



  return (
    <div className="flex items-center gap-2 p-3 bg-white border-b border-gray-200 overflow-x-auto">
      <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" title="Add Text">
              <Type className="w-4 h-4 mr-1" />
              Text
              <ChevronDown className="w-3 h-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleAddText(48, 'bold')}>
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>Heading 1</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAddText(36, 'bold')}>
              <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Heading 2</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAddText(28, 'bold')}>
              <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Heading 3</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAddText(16, 'normal')}>
              <span style={{ fontSize: '14px' }}>Paragraph</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAddText(12, 'normal')}>
              <span style={{ fontSize: '12px' }}>Small Text</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleAddShape('rectangle')}
          title="Add Rectangle"
        >
          <Square className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleAddShape('circle')}
          title="Add Circle"
        >
          <Circle className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddImage}
          title="Add Image"
        >
          <ImageIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddVideo}
          title="Add Video"
        >
          <Video className="w-4 h-4" />
        </Button>
      </div>

      {selectedElement && (
        <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDuplicate}
            title="Duplicate"
          >
            <Copy className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => moveElementToFront(selectedElement.id)}
            title="Bring to Front"
          >
            <BringToFront className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => moveElementToBack(selectedElement.id)}
            title="Send to Back"
          >
            <SendToBack className="w-4 h-4" />
          </Button>
          <AdvancedEffectsPanel />
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            title="Delete"
            className="text-red-600 hover:text-red-700 bg-transparent"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )}

      <div className="flex items-center gap-1 border-r border-gray-200 pr-2 ml-auto">
        <span className="text-sm text-gray-600">{zoom}%</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setZoom(Math.max(25, zoom - 10))}
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setZoom(Math.min(200, zoom + 10))}
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
      </div>

      <ImportDialog />
      <ExportDialog />
    </div>
  );
}
