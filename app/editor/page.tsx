'use client';

import React, { useState } from 'react';
import { EditorProvider } from '@/app/editor-context';
import { EditorToolbar } from '@/components/editor-toolbar';
import { SlidesPanel } from '@/components/slides-panel';
import { SlideCanvas } from '@/components/slide-canvas';
import { PropertiesPanel } from '@/components/properties-panel';
import { LayersPanel } from '@/components/layers-panel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function EditorContent() {
  const [rightPanelTab, setRightPanelTab] = useState('properties');

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <h1 className="text-2xl font-bold text-gray-900">Course Slide Editor</h1>
        <p className="text-sm text-gray-600 mt-1">
          Create professional slides for your course
        </p>
      </div>

      {/* Toolbar */}
      <EditorToolbar />

      {/* Main Editor Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Slides Panel */}
        <SlidesPanel />

        {/* Canvas Area */}
        <div className="flex-1 overflow-auto p-6 bg-gray-100">
          <div className="flex justify-center items-center min-h-full">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <SlideCanvas />
            </div>
          </div>
        </div>

        {/* Right Panel with Tabs */}
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
          <Tabs 
            value={rightPanelTab} 
            onValueChange={setRightPanelTab}
            className="flex flex-col h-full"
          >
            <TabsList className="w-full justify-start border-b rounded-none bg-gray-50">
              <TabsTrigger value="properties" className="flex-1">Properties</TabsTrigger>
              <TabsTrigger value="layers" className="flex-1">Layers</TabsTrigger>
            </TabsList>
            <TabsContent value="properties" className="flex-1 overflow-y-auto p-0 m-0">
              <PropertiesPanel />
            </TabsContent>
            <TabsContent value="layers" className="flex-1 overflow-y-auto p-0 m-0">
              <LayersPanel />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default function EditorPage() {
  return (
    <EditorProvider>
      <EditorContent />
    </EditorProvider>
  );
}
