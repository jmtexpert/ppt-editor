'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

export interface EditorElement {
  id: string;
  type: 'text' | 'image' | 'shape' | 'video';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  opacity: number;
  // Text properties
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: 'normal' | 'bold' | '600' | '700';
  fontStyle?: 'normal' | 'italic';
  textDecoration?: 'none' | 'underline' | 'line-through';
  textAlign?: 'left' | 'center' | 'right';
  color?: string;
  // Shape properties
  shapeType?: 'rectangle' | 'circle' | 'triangle' | 'line';
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  // Image/Video properties
  src?: string;
  objectFit?: 'cover' | 'contain' | 'fill';
}

export interface Slide {
  id: string;
  name: string;
  elements: EditorElement[];
  backgroundColor: string;
  backgroundImage?: string;
  width: number;
  height: number;
}

interface EditorContextType {
  slides: Slide[];
  currentSlideId: string;
  selectedElementId: string | null;
  zoom: number;
  
  // Slide operations
  addSlide: () => void;
  deleteSlide: (slideId: string) => void;
  duplicateSlide: (slideId: string) => void;
  setCurrentSlide: (slideId: string) => void;
  updateSlide: (slideId: string, updates: Partial<Slide>) => void;
  
  // Element operations
  addElement: (element: Omit<EditorElement, 'id'>) => void;
  updateElement: (elementId: string, updates: Partial<EditorElement>) => void;
  deleteElement: (elementId: string) => void;
  selectElement: (elementId: string | null) => void;
  moveElementToFront: (elementId: string) => void;
  moveElementToBack: (elementId: string) => void;
  
  // Zoom operations
  setZoom: (zoom: number) => void;
  
  // Get current data
  getCurrentSlide: () => Slide | undefined;
  getSelectedElement: () => EditorElement | undefined;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [slides, setSlides] = useState<Slide[]>([
    {
      id: '1',
      name: 'Slide 1',
      elements: [],
      backgroundColor: '#ffffff',
      width: 1280,
      height: 720,
    },
  ]);
  const [currentSlideId, setCurrentSlideId] = useState('1');
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);

  const getCurrentSlide = useCallback(() => {
    return slides.find((s) => s.id === currentSlideId);
  }, [slides, currentSlideId]);

  const getSelectedElement = useCallback(() => {
    const slide = getCurrentSlide();
    return slide?.elements.find((e) => e.id === selectedElementId);
  }, [getCurrentSlide, selectedElementId]);

  const addSlide = useCallback(() => {
    const newSlide: Slide = {
      id: Date.now().toString(),
      name: `Slide ${slides.length + 1}`,
      elements: [],
      backgroundColor: '#ffffff',
      width: 1280,
      height: 720,
    };
    setSlides([...slides, newSlide]);
  }, [slides]);

  const deleteSlide = useCallback((slideId: string) => {
    if (slides.length <= 1) return;
    const newSlides = slides.filter((s) => s.id !== slideId);
    setSlides(newSlides);
    if (currentSlideId === slideId) {
      setCurrentSlideId(newSlides[0].id);
    }
  }, [slides, currentSlideId]);

  const duplicateSlide = useCallback((slideId: string) => {
    const slide = slides.find((s) => s.id === slideId);
    if (!slide) return;
    const newSlide: Slide = {
      ...slide,
      id: Date.now().toString(),
      name: `${slide.name} (Copy)`,
      elements: slide.elements.map((e) => ({ ...e, id: Date.now().toString() + Math.random() })),
    };
    setSlides([...slides, newSlide]);
  }, [slides]);

  const updateSlide = useCallback((slideId: string, updates: Partial<Slide>) => {
    setSlides(
      slides.map((s) => (s.id === slideId ? { ...s, ...updates } : s))
    );
  }, [slides]);

  const addElement = useCallback((element: Omit<EditorElement, 'id'>) => {
    setSlides(
      slides.map((s) =>
        s.id === currentSlideId
          ? {
              ...s,
              elements: [
                ...s.elements,
                { ...element, id: Date.now().toString() + Math.random() },
              ],
            }
          : s
      )
    );
  }, [slides, currentSlideId]);

  const updateElement = useCallback((elementId: string, updates: Partial<EditorElement>) => {
    setSlides(
      slides.map((s) =>
        s.id === currentSlideId
          ? {
              ...s,
              elements: s.elements.map((e) =>
                e.id === elementId ? { ...e, ...updates } : e
              ),
            }
          : s
      )
    );
  }, [slides, currentSlideId]);

  const deleteElement = useCallback((elementId: string) => {
    setSlides(
      slides.map((s) =>
        s.id === currentSlideId
          ? {
              ...s,
              elements: s.elements.filter((e) => e.id !== elementId),
            }
          : s
      )
    );
    setSelectedElementId(null);
  }, [slides, currentSlideId]);

  const selectElement = useCallback((elementId: string | null) => {
    setSelectedElementId(elementId);
  }, []);

  const moveElementToFront = useCallback((elementId: string) => {
    const slide = getCurrentSlide();
    if (!slide) return;
    const maxZ = Math.max(...slide.elements.map((e) => e.zIndex), 0);
    updateElement(elementId, { zIndex: maxZ + 1 });
  }, [getCurrentSlide, updateElement]);

  const moveElementToBack = useCallback((elementId: string) => {
    const slide = getCurrentSlide();
    if (!slide) return;
    const minZ = Math.min(...slide.elements.map((e) => e.zIndex), 0);
    updateElement(elementId, { zIndex: minZ - 1 });
  }, [getCurrentSlide, updateElement]);

  const value: EditorContextType = {
    slides,
    currentSlideId,
    selectedElementId,
    zoom,
    addSlide,
    deleteSlide,
    duplicateSlide,
    setCurrentSlide: (slideId) => {
      setCurrentSlideId(slideId);
      setSelectedElementId(null);
    },
    updateSlide,
    addElement,
    updateElement,
    deleteElement,
    selectElement,
    moveElementToFront,
    moveElementToBack,
    setZoom,
    getCurrentSlide,
    getSelectedElement,
  };

  return (
    <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
  );
}

export function useEditor() {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within EditorProvider');
  }
  return context;
}
