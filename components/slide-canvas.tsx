'use client';

import React, { useRef, useState } from 'react';
import { useEditor, EditorElement } from '@/app/editor-context';

export function SlideCanvas() {
  const {
    getCurrentSlide,
    getSelectedElement,
    selectElement,
    updateElement,
    zoom,
  } = useEditor();
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef<{
    id: string;
    startX: number;
    startY: number;
    elementX: number;
    elementY: number;
  } | null>(null);
  
  const resizeStateRef = useRef<{
    id: string;
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
    handle: string;
  } | null>(null);

  const [draggingElement, setDraggingElement] = useState<{
    id: string;
    startX: number;
    startY: number;
    elementX: number;
    elementY: number;
  } | null>(null);

  const [resizingElement, setResizingElement] = useState<{
    id: string;
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
    handle: string;
  } | null>(null);

  const [editingElementId, setEditingElementId] = useState<string | null>(null);
  const [textEditorOpen, setTextEditorOpen] = useState<boolean>(false);
  const [editingElement, setEditingElement] = useState<EditorElement | null>(null);

  const slide = getCurrentSlide();
  const selectedElement = getSelectedElement();

  if (!slide) return null;

  const handleMouseDown = (e: React.MouseEvent, elementId: string) => {
    e.stopPropagation();
    if (e.button !== 0) return;
    selectElement(elementId);
    
    const element = slide.elements.find((el) => el.id === elementId);
    if (!element) return;
    
    dragStateRef.current = {
      id: elementId,
      startX: e.clientX,
      startY: e.clientY,
      elementX: element.x,
      elementY: element.y,
    };
  };



  const handleTextEditorSave = (content: string) => {
    if (editingElementId) {
      updateElement(editingElementId, { text: content });
    }
  };

  const handleResizeStart = (
    e: React.MouseEvent,
    elementId: string,
    handle: string
  ) => {
    e.stopPropagation();
    selectElement(elementId);
    
    const element = slide.elements.find((el) => el.id === elementId);
    if (!element) return;

    resizeStateRef.current = {
      id: elementId,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: element.width,
      startHeight: element.height,
      handle,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragStateRef.current) {
      const dragState = dragStateRef.current;
      const deltaX = (e.clientX - dragState.startX) / (zoom / 100);
      const deltaY = (e.clientY - dragState.startY) / (zoom / 100);

      console.log('[v0] Dragging:', { deltaX, deltaY, zoom });
      
      updateElement(dragState.id, {
        x: dragState.elementX + deltaX,
        y: dragState.elementY + deltaY,
      });
    }

    if (resizeStateRef.current) {
      const resizeState = resizeStateRef.current;
      const element = slide.elements.find((el) => el.id === resizeState.id);
      if (!element) return;

      const deltaX = (e.clientX - resizeState.startX) / (zoom / 100);
      const deltaY = (e.clientY - resizeState.startY) / (zoom / 100);

      const updates: Partial<EditorElement> = {};

      switch (resizeState.handle) {
        case 'se':
          updates.width = Math.max(50, resizeState.startWidth + deltaX);
          updates.height = Math.max(50, resizeState.startHeight + deltaY);
          break;
        case 'sw':
          updates.width = Math.max(50, resizeState.startWidth - deltaX);
          updates.height = Math.max(50, resizeState.startHeight + deltaY);
          updates.x = element.x + deltaX;
          break;
        case 'ne':
          updates.width = Math.max(50, resizeState.startWidth + deltaX);
          updates.height = Math.max(50, resizeState.startHeight - deltaY);
          updates.y = element.y + deltaY;
          break;
        case 'nw':
          updates.width = Math.max(50, resizeState.startWidth - deltaX);
          updates.height = Math.max(50, resizeState.startHeight - deltaY);
          updates.x = element.x + deltaX;
          updates.y = element.y + deltaY;
          break;
      }

      updateElement(resizeState.id, updates);
    }
  };

  const handleMouseUp = () => {
    dragStateRef.current = null;
    resizeStateRef.current = null;
  };

  const renderElement = (element: EditorElement) => {
    const isSelected = selectedElement?.id === element.id;
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      left: element.x,
      top: element.y,
      width: element.width,
      height: element.height,
      zIndex: element.zIndex,
      opacity: element.opacity / 100,
      transform: `rotate(${element.rotation}deg)`,
      cursor: 'move',
    };

    let content: React.ReactNode;

    switch (element.type) {
      case 'text':
        content = (
          <div
            style={{
              ...baseStyle,
              fontSize: element.fontSize || 24,
              fontFamily: element.fontFamily || 'Arial',
              fontWeight: element.fontWeight || 'normal',
              fontStyle: element.fontStyle || 'normal',
              textDecoration: element.textDecoration || 'none',
              color: element.color || '#000000',
              padding: '8px',
              wordWrap: 'break-word',
              whiteSpace: 'normal',
              border: isSelected ? '2px solid #3b82f6' : 'none',
              boxSizing: 'border-box',
              overflow: 'hidden',
              textAlign: element.textAlign as any || 'left',
            }}
            onMouseDown={(e) => handleMouseDown(e, element.id)}
            dangerouslySetInnerHTML={{ __html: element.text || 'Click to add text' }}
          />
        );
        break;

      case 'image':
        content = (
          <div
            style={{
              ...baseStyle,
              border: isSelected ? '2px solid #3b82f6' : 'none',
              boxSizing: 'border-box',
            }}
            onMouseDown={(e) => handleMouseDown(e, element.id)}
          >
            {element.src && (
              <img
                src={element.src || '/placeholder.svg'}
                alt="Slide element"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: element.objectFit || 'cover',
                  pointerEvents: 'none',
                }}
              />
            )}
          </div>
        );
        break;

      case 'shape':
        content = (
          <div
            style={{
              ...baseStyle,
              backgroundColor: element.fill || '#000000',
              border:
                element.stroke && !isSelected
                  ? `${element.strokeWidth || 2}px solid ${element.stroke}`
                  : isSelected
                    ? '2px solid #3b82f6'
                    : 'none',
              borderRadius: element.shapeType === 'circle' ? '50%' : '0',
              boxSizing: 'border-box',
            }}
            onMouseDown={(e) => handleMouseDown(e, element.id)}
          />
        );
        break;

      case 'video':
        content = (
          <div
            style={{
              ...baseStyle,
              border: isSelected ? '2px solid #3b82f6' : 'none',
              boxSizing: 'border-box',
              overflow: 'hidden',
              borderRadius: element.shapeType === 'circle' ? '50%' : '0',
            }}
            onMouseDown={(e) => handleMouseDown(e, element.id)}
          >
            {element.src ? (
              <video
                src={element.src}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: element.objectFit || 'cover',
                  pointerEvents: 'none',
                  backgroundColor: '#000000',
                }}
                controls
                controlsList="nodownload"
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#000000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '12px',
                  textAlign: 'center',
                  padding: '8px',
                }}
              >
                No video source
              </div>
            )}
          </div>
        );
        break;

      default:
        content = null;
    }

    return (
      <div key={element.id}>
        {content}
        {isSelected && (
          <div style={{ position: 'absolute' }}>
            {/* Resize handles */}
            {['nw', 'ne', 'sw', 'se'].map((handle) => (
              <div
                key={handle}
                onMouseDown={(e) => handleResizeStart(e, element.id, handle)}
                style={{
                  position: 'absolute',
                  width: 10,
                  height: 10,
                  backgroundColor: '#3b82f6',
                  border: '2px solid white',
                  borderRadius: '50%',
                  cursor: `${handle}-resize`,
                  zIndex: 1000,
                  pointerEvents: 'auto',
                  ...(handle === 'nw' && {
                    top: element.y - 5,
                    left: element.x - 5,
                  }),
                  ...(handle === 'ne' && {
                    top: element.y - 5,
                    left: element.x + element.width - 5,
                  }),
                  ...(handle === 'sw' && {
                    top: element.y + element.height - 5,
                    left: element.x - 5,
                  }),
                  ...(handle === 'se' && {
                    top: element.y + element.height - 5,
                    left: element.x + element.width - 5,
                  }),
                }}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      selectElement(null);
    }
  };

  return (
    <div
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleCanvasClick}
      style={{
        position: 'relative',
        width: (slide.width * zoom) / 100,
        height: (slide.height * zoom) / 100,
        backgroundColor: slide.backgroundColor,
        backgroundImage: slide.backgroundImage
          ? `url(${slide.backgroundImage})`
          : 'none',
        backgroundSize: 'cover',
        overflow: 'auto',
        border: '1px solid #e5e7eb',
        cursor: 'default',
      }}
    >
      {slide.elements.map((element) => renderElement(element))}
    </div>
  );
}
