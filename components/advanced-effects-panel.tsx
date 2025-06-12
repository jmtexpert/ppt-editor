'use client';

import React, { useState } from 'react';
import { AlignVerticalJustifyCenterIcon as AlignVerticalCenterIcon, Layers } from 'lucide-react';
import { useEditor } from '@/app/editor-context';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

export function AdvancedEffectsPanel() {
  const {
    getCurrentSlide,
    getSelectedElement,
    updateElement,
    slides,
    currentSlideId,
  } = useEditor();

  const slide = getCurrentSlide();
  const selectedElement = getSelectedElement();

  if (!selectedElement || !slide) return null;

  const handleAlignLeft = () => {
    updateElement(selectedElement.id, { x: 0 });
  };

  const handleAlignRight = () => {
    updateElement(selectedElement.id, {
      x: slide.width - selectedElement.width,
    });
  };

  const handleAlignCenter = () => {
    updateElement(selectedElement.id, {
      x: (slide.width - selectedElement.width) / 2,
    });
  };

  const handleAlignTop = () => {
    updateElement(selectedElement.id, { y: 0 });
  };

  const handleAlignBottom = () => {
    updateElement(selectedElement.id, {
      y: slide.height - selectedElement.height,
    });
  };

  const handleAlignVerticalCenter = () => {
    updateElement(selectedElement.id, {
      y: (slide.height - selectedElement.height) / 2,
    });
  };

  const distributeHorizontal = () => {
    const elements = slide.elements
      .filter((el) => el.id !== selectedElement.id)
      .sort((a, b) => a.x - b.x);
    
    if (elements.length < 2) return;

    const minX = 0;
    const maxX = slide.width - selectedElement.width;
    const spacing = (maxX - minX) / (elements.length + 1);

    elements.forEach((el, idx) => {
      updateElement(el.id, { x: minX + spacing * (idx + 1) });
    });
  };

  const distributeVertical = () => {
    const elements = slide.elements
      .filter((el) => el.id !== selectedElement.id)
      .sort((a, b) => a.y - b.y);
    
    if (elements.length < 2) return;

    const minY = 0;
    const maxY = slide.height - selectedElement.height;
    const spacing = (maxY - minY) / (elements.length + 1);

    elements.forEach((el, idx) => {
      updateElement(el.id, { y: minY + spacing * (idx + 1) });
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" title="Advanced Effects">
          <Layers className="w-4 h-4 mr-2" />
          Effects
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Advanced Editing Tools</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Alignment Section */}
          <Card className="p-4">
            <h3 className="font-semibold text-sm mb-3">Alignment</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-600 mb-2">Horizontal</p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAlignLeft}
                    className="flex-1 bg-transparent"
                  >
                    Left
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAlignCenter}
                    className="flex-1 bg-transparent"
                  >
                    Center
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAlignRight}
                    className="flex-1 bg-transparent"
                  >
                    Right
                  </Button>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-600 mb-2">Vertical</p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAlignTop}
                    className="flex-1 bg-transparent"
                  >
                    Top
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAlignVerticalCenter}
                    className="flex-1 bg-transparent"
                  >
                    Middle
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAlignBottom}
                    className="flex-1 bg-transparent"
                  >
                    Bottom
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Distribution Section */}
          <Card className="p-4">
            <h3 className="font-semibold text-sm mb-3">Distribution</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={distributeHorizontal}
                className="w-full bg-transparent"
              >
                Distribute Horizontally
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={distributeVertical}
                className="w-full bg-transparent"
              >
                Distribute Vertically
              </Button>
            </div>
          </Card>

          {/* Shadow Effects (for future enhancement) */}
          <Card className="p-4">
            <h3 className="font-semibold text-sm mb-3">Appearance</h3>
            <div className="space-y-3">
              <div>
                <Label className="text-xs">Shadow Blur</Label>
                <Slider
                  value={[0]}
                  onValueChange={() => {}}
                  max={20}
                  step={1}
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">Coming soon</p>
              </div>

              <div>
                <Label className="text-xs">Blur Effect</Label>
                <Slider
                  value={[0]}
                  onValueChange={() => {}}
                  max={20}
                  step={1}
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">Coming soon</p>
              </div>
            </div>
          </Card>

          {/* Duplication for Layout */}
          <Card className="p-4">
            <h3 className="font-semibold text-sm mb-3">Quick Actions</h3>
            <Button variant="outline" size="sm" className="w-full bg-transparent">
              Group Elements (Coming Soon)
            </Button>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
