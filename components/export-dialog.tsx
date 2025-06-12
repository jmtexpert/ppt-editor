'use client';

import React, { useRef, useState } from 'react';
import { Download, FileJson, ImageIcon, FileText } from 'lucide-react';
import { useEditor } from '@/app/editor-context';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function ExportDialog() {
  const { slides, getCurrentSlide } = useEditor();
  const [projectName, setProjectName] = useState('My Presentation');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const exportAsJSON = () => {
    const data = {
      projectName,
      slides,
      exportDate: new Date().toISOString(),
    };
    
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName || 'presentation'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportCurrentSlideAsImage = async () => {
    const slide = getCurrentSlide();
    if (!slide) return;

    try {
      const canvas = document.createElement('canvas');
      canvas.width = slide.width;
      canvas.height = slide.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw background
      ctx.fillStyle = slide.backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw background image if exists
      if (slide.backgroundImage) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          downloadCanvasAsImage(canvas);
        };
        img.src = slide.backgroundImage;
      } else {
        downloadCanvasAsImage(canvas);
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Error exporting slide. Please try again.');
    }
  };

  const downloadCanvasAsImage = (canvas: HTMLCanvasElement) => {
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${projectName || 'slide'}-slide.png`;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  const exportAsHTML = () => {
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${projectName}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: Arial, sans-serif;
            background: #f0f0f0;
        }
        .presentation {
            max-width: 1280px;
            margin: 0 auto;
            padding: 20px;
        }
        .slide {
            width: 1280px;
            height: 720px;
            background: white;
            margin-bottom: 40px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            page-break-after: always;
            position: relative;
            overflow: hidden;
        }
        .slide-content {
            position: relative;
            width: 100%;
            height: 100%;
        }
        @media print {
            .slide {
                page-break-inside: avoid;
                box-shadow: none;
            }
        }
    </style>
</head>
<body>
    <div class="presentation">
        <h1 style="margin-bottom: 30px;">${projectName}</h1>
        ${slides
          .map(
            (slide, idx) => `
        <div class="slide" style="background-color: ${slide.backgroundColor};">
            <div class="slide-content">
                <h2 style="padding: 20px;">Slide ${idx + 1}</h2>
                <p>${slide.elements.length} elements</p>
            </div>
        </div>
        `
          )
          .join('')}
    </div>
</body>
</html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName || 'presentation'}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAllSlidesAsZip = () => {
    alert('ZIP export feature requires additional library. Coming in next version!');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          title="Export Presentation"
          className="ml-auto bg-transparent"
        >
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Export Presentation</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Project Name */}
          <div>
            <Label htmlFor="project-name" className="text-sm">
              Project Name
            </Label>
            <Input
              id="project-name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="My Presentation"
              className="mt-1"
            />
          </div>

          {/* Export Options */}
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-sm mb-2">Export Format</h3>
            </div>

            {/* JSON Export */}
            <Card className="p-4 hover:bg-blue-50 cursor-pointer transition" onClick={exportAsJSON}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileJson className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">JSON Format</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    Save as editable JSON file. Import back later.
                  </p>
                </div>
              </div>
            </Card>

            {/* HTML Export */}
            <Card className="p-4 hover:bg-purple-50 cursor-pointer transition" onClick={exportAsHTML}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">HTML Format</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    Export as printable HTML file. Open in any browser.
                  </p>
                </div>
              </div>
            </Card>

            {/* Image Export */}
            <Card className="p-4 hover:bg-green-50 cursor-pointer transition" onClick={exportCurrentSlideAsImage}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">PNG Image</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    Export current slide as PNG image.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-900">
              💡 <strong>Tip:</strong> Use JSON format to save your work and edit later. 
              Use HTML for sharing, and PNG for individual slides.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
