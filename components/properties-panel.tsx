'use client';

import React, { useRef, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
} from 'lucide-react';
import { useEditor } from '@/app/editor-context';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

const TEXT_VARIANTS = [
  { label: 'Heading 1', size: 48, weight: 'bold' as const },
  { label: 'Heading 2', size: 36, weight: 'bold' as const },
  { label: 'Heading 3', size: 28, weight: 'bold' as const },
  { label: 'Paragraph', size: 16, weight: 'normal' as const },
  { label: 'Small', size: 12, weight: 'normal' as const },
];

const FONT_FAMILIES = [
  'Arial',
  'Georgia',
  'Times New Roman',
  'Courier New',
  'Trebuchet MS',
  'Verdana',
];

export function PropertiesPanel() {
  const { getSelectedElement, updateElement } = useEditor();
  const element = getSelectedElement();
  const textEditorRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  // Initialize editor content only once when element changes
  useEffect(() => {
    if (element?.type === 'text' && textEditorRef.current && isInitialMount.current) {
      textEditorRef.current.innerHTML = element.text || '';
      isInitialMount.current = false;
    }
  }, [element?.id]);

  // Reset flag when element selection changes
  useEffect(() => {
    isInitialMount.current = true;
  }, [element?.id]);

  if (!element) {
    return (
      <div className="w-full h-full p-6 bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 font-medium">No Element Selected</p>
          <p className="text-gray-500 text-sm mt-1">Click on an element to edit its properties</p>
        </div>
      </div>
    );
  }

  const handleUpdate = (updates: Record<string, any>) => {
    updateElement(element.id, updates);
  };

  const handleTextEditorInput = () => {
    if (textEditorRef.current) {
      const newContent = textEditorRef.current.innerHTML;
      console.log('[v0] Text updated:', newContent);
      handleUpdate({ text: newContent });
    }
  };

  const applyFormatting = (command: string, value?: string) => {
    textEditorRef.current?.focus();
    document.execCommand(command, false, value);
    // Update element after formatting
    setTimeout(() => {
      if (textEditorRef.current) {
        const newContent = textEditorRef.current.innerHTML;
        console.log('[v0] Formatting applied:', command);
        handleUpdate({ text: newContent });
      }
    }, 0);
  };

  return (
    <div className="w-full h-full bg-white overflow-y-auto">
      <div className="p-4 space-y-4">
        {/* Position & Size */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 className="font-semibold text-sm mb-3 text-gray-900">Position & Size</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">X Position: {Math.round(element.x)}px</label>
              <input
                type="number"
                value={Math.round(element.x)}
                onChange={(e) => handleUpdate({ x: parseInt(e.target.value) || 0 })}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Y Position: {Math.round(element.y)}px</label>
              <input
                type="number"
                value={Math.round(element.y)}
                onChange={(e) => handleUpdate({ y: parseInt(e.target.value) || 0 })}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Width: {Math.round(element.width)}px</label>
              <input
                type="number"
                value={Math.round(element.width)}
                onChange={(e) => handleUpdate({ width: parseInt(e.target.value) || 0 })}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Height: {Math.round(element.height)}px</label>
              <input
                type="number"
                value={Math.round(element.height)}
                onChange={(e) => handleUpdate({ height: parseInt(e.target.value) || 0 })}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded"
              />
            </div>
          </div>
        </div>

        {/* Rotation & Opacity */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 className="font-semibold text-sm mb-3 text-gray-900">Transform</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-2">Rotation: {element.rotation}°</label>
              <Slider
                value={[element.rotation]}
                onValueChange={(val) => handleUpdate({ rotation: val[0] })}
                max={360}
                min={0}
                step={1}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-2">Opacity: {element.opacity}%</label>
              <Slider
                value={[element.opacity]}
                onValueChange={(val) => handleUpdate({ opacity: val[0] })}
                max={100}
                min={0}
                step={1}
              />
            </div>
          </div>
        </div>

        {/* Text Properties */}
        {element.type === 'text' && (
          <>
            {/* Rich Text Editor */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="font-semibold text-sm mb-3 text-gray-900">Text Content & Formatting</h3>
              
              {/* Formatting Toolbar */}
              <div className="flex items-center gap-1 mb-3 pb-3 border-b border-gray-300 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => applyFormatting('bold')}
                  title="Bold"
                  className="w-8 h-8 p-0"
                >
                  <Bold className="w-3.5 h-3.5" />
                </Button>
                <div className="w-px h-6 bg-gray-300 mx-1" />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => applyFormatting('insertUnorderedList')}
                  title="Unordered List"
                  className="w-8 h-8 p-0"
                >
                  <List className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => applyFormatting('insertOrderedList')}
                  title="Ordered List"
                  className="w-8 h-8 p-0"
                >
                  <ListOrdered className="w-3.5 h-3.5" />
                </Button>
                <div className="w-px h-6 bg-gray-300 mx-1" />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => applyFormatting('justifyLeft')}
                  title="Align Left"
                  className="w-8 h-8 p-0"
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => applyFormatting('justifyCenter')}
                  title="Align Center"
                  className="w-8 h-8 p-0"
                >
                  <AlignCenter className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => applyFormatting('justifyRight')}
                  title="Align Right"
                  className="w-8 h-8 p-0"
                >
                  <AlignRight className="w-3.5 h-3.5" />
                </Button>
              </div>

              {/* Contenteditable Editor - No dangerouslySetInnerHTML to prevent overwriting */}
              <div
                ref={textEditorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={handleTextEditorInput}
                onBlur={handleTextEditorInput}
                className="w-full p-2 border border-gray-300 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-20"
                style={{
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  whiteSpace: 'normal',
                }}
              />
            </div>

            {/* Text Variants */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="font-semibold text-sm mb-3 text-gray-900">Text Style</h3>
              <div className="space-y-2">
                {TEXT_VARIANTS.map((variant) => (
                  <button
                    key={variant.label}
                    onClick={() => {
                      handleUpdate({
                        fontSize: variant.size,
                        fontWeight: variant.weight,
                      });
                    }}
                    style={{
                      fontSize: `${Math.max(variant.size * 0.35, 12)}px`,
                      fontWeight: variant.weight as any,
                    }}
                    className={`w-full px-3 py-2.5 rounded text-left border-2 transition-all ${
                      element.fontSize === variant.size &&
                      element.fontWeight === variant.weight
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}
                  >
                    {variant.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Family & Size */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="font-semibold text-sm mb-3 text-gray-900">Typography</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-2">Font Family</label>
                  <select
                    value={element.fontFamily || 'Arial'}
                    onChange={(e) => handleUpdate({ fontFamily: e.target.value })}
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded"
                  >
                    {FONT_FAMILIES.map((font) => (
                      <option key={font} value={font}>
                        {font}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-2">Font Size: {element.fontSize || 16}px</label>
                  <Slider
                    value={[element.fontSize || 16]}
                    onValueChange={(val) => handleUpdate({ fontSize: val[0] })}
                    max={96}
                    min={8}
                    step={1}
                  />
                </div>
              </div>
            </div>

            {/* Text Formatting */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="font-semibold text-sm mb-3 text-gray-900">Format</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-2">Style</label>
                  <div className="flex gap-2">
                    <Button
                      variant={element.fontWeight === 'bold' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() =>
                        handleUpdate({
                          fontWeight: element.fontWeight === 'bold' ? 'normal' : 'bold',
                        })
                      }
                      className="flex-1"
                    >
                      <Bold className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={element.fontStyle === 'italic' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() =>
                        handleUpdate({
                          fontStyle: element.fontStyle === 'italic' ? 'normal' : 'italic',
                        })
                      }
                      className="flex-1"
                    >
                      <Italic className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={element.textDecoration === 'underline' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() =>
                        handleUpdate({
                          textDecoration:
                            element.textDecoration === 'underline' ? 'none' : 'underline',
                        })
                      }
                      className="flex-1"
                    >
                      <Underline className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-2">Alignment</label>
                  <div className="flex gap-2">
                    <Button
                      variant={element.textAlign === 'left' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleUpdate({ textAlign: 'left' })}
                      className="flex-1"
                    >
                      <AlignLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={element.textAlign === 'center' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleUpdate({ textAlign: 'center' })}
                      className="flex-1"
                    >
                      <AlignCenter className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={element.textAlign === 'right' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleUpdate({ textAlign: 'right' })}
                      className="flex-1"
                    >
                      <AlignRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Text Color */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="font-semibold text-sm mb-3 text-gray-900">Colors</h3>
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-2">Text Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={element.color || '#000000'}
                    onChange={(e) => handleUpdate({ color: e.target.value })}
                    className="w-14 h-10 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={element.color || '#000000'}
                    onChange={(e) => handleUpdate({ color: e.target.value })}
                    className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded font-mono"
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Shape Properties */}
        {element.type === 'shape' && (
          <>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="font-semibold text-sm mb-3 text-gray-900">Shape Properties</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-2">Fill Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={element.fill || '#3b82f6'}
                      onChange={(e) => handleUpdate({ fill: e.target.value })}
                      className="w-14 h-10 rounded border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={element.fill || '#3b82f6'}
                      onChange={(e) => handleUpdate({ fill: e.target.value })}
                      className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-2">Border Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={element.stroke || '#1e40af'}
                      onChange={(e) => handleUpdate({ stroke: e.target.value })}
                      className="w-14 h-10 rounded border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={element.stroke || '#1e40af'}
                      onChange={(e) => handleUpdate({ stroke: e.target.value })}
                      className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-2">Border Width: {element.strokeWidth || 2}px</label>
                  <Slider
                    value={[element.strokeWidth || 2]}
                    onValueChange={(val) => handleUpdate({ strokeWidth: val[0] })}
                    max={20}
                    min={0}
                    step={0.5}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Image/Video Properties */}
        {(element.type === 'image' || element.type === 'video') && (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="font-semibold text-sm mb-3 text-gray-900">Media Properties</h3>
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-2">Fit</label>
              <select
                value={element.objectFit || 'cover'}
                onChange={(e) =>
                  handleUpdate({ objectFit: e.target.value as 'cover' | 'contain' | 'fill' })
                }
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded"
              >
                <option value="cover">Cover</option>
                <option value="contain">Contain</option>
                <option value="fill">Fill</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
