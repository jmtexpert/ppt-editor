'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Edit3, Zap, Layers, Download } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="border-b border-gray-700 bg-gray-800/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Edit3 className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">SlideStudio</h1>
            </div>
            <Link href="/editor">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Launch Editor
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
            Create Stunning Course Slides
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Professional slide editor for educators. Add text, images, shapes, and videos to create engaging course content in minutes.
          </p>
          <Link href="/editor">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg px-8">
              Start Creating
            </Button>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          <Card className="bg-gray-800 border-gray-700 p-6 hover:bg-gray-750 transition">
            <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4">
              <Edit3 className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Rich Editor</h3>
            <p className="text-gray-400 text-sm">
              Intuitive drag-and-drop interface with professional design tools
            </p>
          </Card>

          <Card className="bg-gray-800 border-gray-700 p-6 hover:bg-gray-750 transition">
            <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
              <Layers className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Multi-Element Support</h3>
            <p className="text-gray-400 text-sm">
              Add text, images, videos, and shapes to your slides
            </p>
          </Card>

          <Card className="bg-gray-800 border-gray-700 p-6 hover:bg-gray-750 transition">
            <div className="w-12 h-12 bg-pink-600/20 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-pink-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Advanced Formatting</h3>
            <p className="text-gray-400 text-sm">
              Full text formatting, colors, opacity, rotation, and more
            </p>
          </Card>

          <Card className="bg-gray-800 border-gray-700 p-6 hover:bg-gray-750 transition">
            <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center mb-4">
              <Download className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Easy Export</h3>
            <p className="text-gray-400 text-sm">
              Save and export your presentations in multiple formats
            </p>
          </Card>
        </div>

        {/* How It Works */}
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-12 mb-20">
          <h3 className="text-3xl font-bold text-white mb-12 text-center">How It Works</h3>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: 1, title: 'Create Slide', desc: 'Add a new slide to start your course content' },
              { step: 2, title: 'Add Elements', desc: 'Insert text, images, shapes, and videos' },
              { step: 3, title: 'Customize', desc: 'Format and style your elements professionally' },
              { step: 4, title: 'Export', desc: 'Save and share your finished presentation' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg">{item.step}</span>
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">{item.title}</h4>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Create Your Course?
          </h3>
          <p className="text-blue-100 mb-8 text-lg">
            Launch the editor and start building professional slides today
          </p>
          <Link href="/editor">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8">
              Open Editor
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-700 bg-gray-800/50 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-center text-gray-400">
            © 2024 SlideStudio. Create beautiful course presentations.
          </p>
        </div>
      </footer>
    </div>
  );
}
