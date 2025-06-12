'use client';

import React from 'react';
import { Upload } from 'lucide-react';
import { useEditor } from '@/app/editor-context';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function ImportDialog() {
  const { slides } = useEditor();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const data = JSON.parse(content);

        // Validate structure
        if (!data.slides || !Array.isArray(data.slides)) {
          throw new Error('Invalid presentation file format');
        }

        // Show import success and reload page
        alert(
          `✓ Imported "${data.projectName || 'Presentation'}" with ${data.slides.length} slides!`
        );

        // Store in localStorage for demo purposes
        localStorage.setItem('presentationImport', JSON.stringify(data));
        window.location.reload();
      } catch (error) {
        alert(
          'Error importing file. Please ensure it is a valid presentation JSON file.'
        );
      }
    };
    reader.readAsText(file);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" title="Import Presentation">
          <Upload className="w-4 h-4 mr-2" />
          Import
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Import Presentation</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Alert>
            <Upload className="w-4 h-4" />
            <AlertDescription>
              Import a previously exported presentation from a JSON file.
            </AlertDescription>
          </Alert>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              ref={inputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => inputRef.current?.click()}
              className="w-full"
            >
              <Upload className="w-4 h-4 mr-2" />
              Select JSON File
            </Button>
            <p className="text-xs text-gray-500 mt-3">
              Or drag and drop a JSON file here
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs font-semibold text-blue-900 mb-2">
              How to import:
            </p>
            <ol className="text-xs text-blue-800 space-y-1 ml-4 list-decimal">
              <li>Click on "Select JSON File"</li>
              <li>Choose a previously exported presentation</li>
              <li>Your presentation will load automatically</li>
            </ol>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
