"use client";

import React, { useState, useEffect } from 'react';
import { PortableTextBlock } from '@portabletext/types';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsWidgetProps {
  body: PortableTextBlock[];
}

const TableOfContentsWidget: React.FC<TableOfContentsWidgetProps> = ({ body }) => {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Extract headings from portable text content
  useEffect(() => {
    const extractedHeadings: Heading[] = [];
    
    body.forEach((block) => {
      if (block._type === 'block' && (block.style === 'h1' || block.style === 'h2' || block.style === 'h3')) {
        const text = block.children
          ?.map((child: any) => child.text)
          .join('') || '';
        
        if (text.trim()) {
          const cleanText = text.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
          const id = `heading-${cleanText}`;
          extractedHeadings.push({
            id,
            text: text.trim(),
            level: parseInt(block.style.replace('h', ''))
          });
        }
      }
    });

    setHeadings(extractedHeadings);
  }, [body]);

  // Handle scroll to track active heading and calculate progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollTop / docHeight, 1);
      setScrollProgress(progress);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { 
        rootMargin: '-20% 0% -35% 0%',
        threshold: 0
      }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [headings]);

  // Don't render if no headings or too few headings
  if (headings.length < 2) {
    return null;
  }

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
      // Keep widget open for easy navigation between sections
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50 bg-white border border-gray-200 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-gray-50"
        aria-label="Toggle table of contents"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-600"
        >
          <line x1="8" y1="6" x2="21" y2="6"></line>
          <line x1="8" y1="12" x2="21" y2="12"></line>
          <line x1="8" y1="18" x2="21" y2="18"></line>
          <line x1="3" y1="6" x2="3.01" y2="6"></line>
          <line x1="3" y1="12" x2="3.01" y2="12"></line>
          <line x1="3" y1="18" x2="3.01" y2="18"></line>
        </svg>
      </button>

      {/* Widget Panel - Right side, full height, no backdrop */}
      <div 
        className={`fixed right-0 top-0 h-full z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ width: '320px' }}
      >
        <nav className="h-full bg-white border-l border-gray-200 shadow-xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 tracking-wide uppercase">
              Table of contents
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="relative">
              {/* Progress bar */}
              <div className="absolute left-0 top-0 w-0.5 h-full bg-gray-200 rounded-full">
                <div 
                  className="w-full bg-primary rounded-full transition-all duration-300 ease-out"
                  style={{ height: `${scrollProgress * 100}%` }}
                />
              </div>
              
              <ul className="space-y-1 pl-4">
                {headings.map(({ id, text, level }) => (
                  <li key={id}>
                    <button
                      onClick={() => scrollToHeading(id)}
                      className={`
                        text-left w-full text-sm transition-all duration-200 py-3 px-3 rounded-md
                        hover:text-primary hover:bg-primary/5
                        ${level === 1 ? 'font-medium' : 'font-normal'}
                        ${level === 2 ? 'pl-6' : ''}
                        ${level === 3 ? 'pl-10' : ''}
                        ${activeId === id 
                          ? 'text-primary font-medium bg-primary/10' 
                          : 'text-gray-600'
                        }
                      `}
                    >
                      {text}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Progress indicator at bottom */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span>Reading progress</span>
              <span>{Math.round(scrollProgress * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-primary h-1.5 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${scrollProgress * 100}%` }}
              />
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default TableOfContentsWidget;