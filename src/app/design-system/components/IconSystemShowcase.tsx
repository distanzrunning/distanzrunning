'use client';

import {
  Home, Search, Settings, User, Bell, Mail, Calendar, Clock,
  ChevronRight, ChevronLeft, ChevronDown, ChevronUp,
  Plus, Minus, X, Check, AlertCircle, Info, HelpCircle,
  Edit, Trash2, Download, Upload, Share2, Copy,
  Heart, Star, Bookmark, Flag, ThumbsUp, MessageCircle,
  ArrowRight, ArrowLeft, ArrowUp, ArrowDown, ExternalLink,
  Menu, MoreVertical, MoreHorizontal, Filter, SlidersHorizontal,
  Eye, EyeOff, Lock, Unlock, Shield, Key,
  Moon, Sun, Zap, Loader2, CheckCircle2, XCircle, AlertTriangle
} from 'lucide-react';
import { useState } from 'react';

interface IconDisplayProps {
  icon: React.ReactNode;
  name: string;
  size?: number;
}

function IconDisplay({ icon, name, size = 24 }: IconDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`import { ${name} } from 'lucide-react';`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="group relative flex flex-col items-center gap-2 p-4 rounded-lg border border-borderNeutral hover:border-neutral-400 dark:hover:border-neutral-500 hover:bg-surface-subtle transition-all"
    >
      <div className="text-textDefault group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
        {icon}
      </div>
      <span className="text-xs text-textSubtle text-center font-mono">{name}</span>
      {copied && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs px-2 py-1 rounded whitespace-nowrap">
          Copied!
        </div>
      )}
    </button>
  );
}

export default function IconSystemShowcase() {
  const iconSizes = [
    { name: 'Small', size: 16, class: 'w-4 h-4' },
    { name: 'Medium', size: 20, class: 'w-5 h-5' },
    { name: 'Large', size: 24, class: 'w-6 h-6' },
    { name: 'XL', size: 32, class: 'w-8 h-8' },
    { name: '2XL', size: 40, class: 'w-10 h-10' },
  ];

  return (
    <div className="space-y-12">
      {/* Overview */}
      <div className="bg-surface-subtle rounded-lg p-6 border border-borderNeutral">
        <h3 className="font-serif text-xl font-medium mb-4">Lucide React Icon System</h3>
        <p className="text-textSubtle mb-4">
          Distanz Running uses <a href="https://lucide.dev" target="_blank" rel="noopener noreferrer" className="text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:underline">Lucide React</a> (v0.503.0) for all iconography.
          Lucide provides a consistent, modern icon set with over 1,000 icons designed for clarity at small sizes.
        </p>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="bg-surface dark:bg-[#0c0c0d] rounded p-4">
            <p className="font-medium text-textDefault mb-2">Why Lucide?</p>
            <ul className="space-y-1 text-textSubtle text-xs list-disc list-inside">
              <li>Consistent 24x24 grid system</li>
              <li>Optimized for accessibility</li>
              <li>Tree-shakeable (only imports used icons)</li>
              <li>Actively maintained with regular updates</li>
            </ul>
          </div>
          <div className="bg-surface dark:bg-[#0c0c0d] rounded p-4">
            <p className="font-medium text-textDefault mb-2">Installation</p>
            <pre className="text-xs bg-canvas dark:bg-[#0a0a0a] rounded p-2 overflow-x-auto">
              <code>npm install lucide-react</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Icon Sizes */}
      <div>
        <h3 className="font-serif text-2xl font-medium mb-4">Icon Sizes</h3>
        <p className="text-textSubtle mb-6">Consistent sizing for different contexts and hierarchy.</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {iconSizes.map((size) => (
            <div key={size.name} className="bg-surface dark:bg-[#0c0c0d] rounded-lg p-6 border border-borderNeutral text-center">
              <div className="flex items-center justify-center mb-3">
                <Home className={size.class} />
              </div>
              <div className="space-y-1">
                <p className="font-medium text-sm">{size.name}</p>
                <code className="text-xs text-textSubtler font-mono block">{size.class}</code>
                <p className="text-xs text-textSubtle">{size.size}px</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-surface dark:bg-[#0c0c0d] rounded-lg p-6 border border-borderNeutral">
          <h4 className="font-medium mb-4 text-sm">Usage Examples</h4>
          <div className="space-y-3 text-sm text-textSubtle">
            <p><code className="font-mono text-neutral-700 dark:text-neutral-300">w-4 h-4 (16px)</code> - Inline with small text, compact UI elements</p>
            <p><code className="font-mono text-neutral-700 dark:text-neutral-300">w-5 h-5 (20px)</code> - Buttons, form inputs, navigation items</p>
            <p><code className="font-mono text-neutral-700 dark:text-neutral-300">w-6 h-6 (24px)</code> - Default size for most icons, feature cards</p>
            <p><code className="font-mono text-neutral-700 dark:text-neutral-300">w-8 h-8 (32px)</code> - Section headers, emphasized actions</p>
            <p><code className="font-mono text-neutral-700 dark:text-neutral-300">w-10 h-10 (40px)</code> - Hero sections, empty states</p>
          </div>
        </div>
      </div>

      {/* Common Icons by Category */}
      <div>
        <h3 className="font-serif text-2xl font-medium mb-4">Icon Library</h3>
        <p className="text-textSubtle mb-6">Click any icon to copy its import statement.</p>

        <div className="space-y-8">
          {/* Navigation Icons */}
          <div>
            <h4 className="font-medium mb-4">Navigation & Arrows</h4>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              <IconDisplay icon={<Home size={24} />} name="Home" />
              <IconDisplay icon={<Search size={24} />} name="Search" />
              <IconDisplay icon={<Menu size={24} />} name="Menu" />
              <IconDisplay icon={<Settings size={24} />} name="Settings" />
              <IconDisplay icon={<ChevronRight size={24} />} name="ChevronRight" />
              <IconDisplay icon={<ChevronLeft size={24} />} name="ChevronLeft" />
              <IconDisplay icon={<ChevronDown size={24} />} name="ChevronDown" />
              <IconDisplay icon={<ChevronUp size={24} />} name="ChevronUp" />
              <IconDisplay icon={<ArrowRight size={24} />} name="ArrowRight" />
              <IconDisplay icon={<ArrowLeft size={24} />} name="ArrowLeft" />
              <IconDisplay icon={<ArrowUp size={24} />} name="ArrowUp" />
              <IconDisplay icon={<ArrowDown size={24} />} name="ArrowDown" />
              <IconDisplay icon={<ExternalLink size={24} />} name="ExternalLink" />
            </div>
          </div>

          {/* User & Communication */}
          <div>
            <h4 className="font-medium mb-4">User & Communication</h4>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              <IconDisplay icon={<User size={24} />} name="User" />
              <IconDisplay icon={<Bell size={24} />} name="Bell" />
              <IconDisplay icon={<Mail size={24} />} name="Mail" />
              <IconDisplay icon={<MessageCircle size={24} />} name="MessageCircle" />
              <IconDisplay icon={<Share2 size={24} />} name="Share2" />
            </div>
          </div>

          {/* Actions */}
          <div>
            <h4 className="font-medium mb-4">Actions</h4>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              <IconDisplay icon={<Plus size={24} />} name="Plus" />
              <IconDisplay icon={<Minus size={24} />} name="Minus" />
              <IconDisplay icon={<X size={24} />} name="X" />
              <IconDisplay icon={<Check size={24} />} name="Check" />
              <IconDisplay icon={<Edit size={24} />} name="Edit" />
              <IconDisplay icon={<Trash2 size={24} />} name="Trash2" />
              <IconDisplay icon={<Copy size={24} />} name="Copy" />
              <IconDisplay icon={<Download size={24} />} name="Download" />
              <IconDisplay icon={<Upload size={24} />} name="Upload" />
            </div>
          </div>

          {/* Feedback & Status */}
          <div>
            <h4 className="font-medium mb-4">Feedback & Status</h4>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              <IconDisplay icon={<CheckCircle2 size={24} />} name="CheckCircle2" />
              <IconDisplay icon={<XCircle size={24} />} name="XCircle" />
              <IconDisplay icon={<AlertCircle size={24} />} name="AlertCircle" />
              <IconDisplay icon={<AlertTriangle size={24} />} name="AlertTriangle" />
              <IconDisplay icon={<Info size={24} />} name="Info" />
              <IconDisplay icon={<HelpCircle size={24} />} name="HelpCircle" />
              <IconDisplay icon={<Loader2 size={24} className="animate-spin" />} name="Loader2" />
            </div>
          </div>

          {/* Social & Engagement */}
          <div>
            <h4 className="font-medium mb-4">Social & Engagement</h4>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              <IconDisplay icon={<Heart size={24} />} name="Heart" />
              <IconDisplay icon={<Star size={24} />} name="Star" />
              <IconDisplay icon={<Bookmark size={24} />} name="Bookmark" />
              <IconDisplay icon={<Flag size={24} />} name="Flag" />
              <IconDisplay icon={<ThumbsUp size={24} />} name="ThumbsUp" />
            </div>
          </div>

          {/* Utility & Settings */}
          <div>
            <h4 className="font-medium mb-4">Utility & Settings</h4>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              <IconDisplay icon={<MoreVertical size={24} />} name="MoreVertical" />
              <IconDisplay icon={<MoreHorizontal size={24} />} name="MoreHorizontal" />
              <IconDisplay icon={<Filter size={24} />} name="Filter" />
              <IconDisplay icon={<SlidersHorizontal size={24} />} name="SlidersHorizontal" />
              <IconDisplay icon={<Calendar size={24} />} name="Calendar" />
              <IconDisplay icon={<Clock size={24} />} name="Clock" />
              <IconDisplay icon={<Eye size={24} />} name="Eye" />
              <IconDisplay icon={<EyeOff size={24} />} name="EyeOff" />
              <IconDisplay icon={<Lock size={24} />} name="Lock" />
              <IconDisplay icon={<Unlock size={24} />} name="Unlock" />
              <IconDisplay icon={<Shield size={24} />} name="Shield" />
              <IconDisplay icon={<Key size={24} />} name="Key" />
            </div>
          </div>

          {/* Theme & Brand */}
          <div>
            <h4 className="font-medium mb-4">Theme & Brand</h4>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              <IconDisplay icon={<Moon size={24} />} name="Moon" />
              <IconDisplay icon={<Sun size={24} />} name="Sun" />
              <IconDisplay icon={<Zap size={24} />} name="Zap" />
            </div>
          </div>
        </div>
      </div>

      {/* Implementation Examples */}
      <div>
        <h3 className="font-serif text-2xl font-medium mb-4">Implementation Examples</h3>

        <div className="space-y-6">
          {/* Button with Icon */}
          <div className="bg-surface dark:bg-[#0c0c0d] rounded-lg p-6 border border-borderNeutral">
            <h4 className="font-medium mb-4">Buttons with Icons</h4>
            <div className="flex flex-wrap gap-4 mb-4">
              <button className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-md font-medium flex items-center gap-2 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors">
                <Plus className="w-5 h-5" />
                Create Article
              </button>
              <button className="px-4 py-2 border-2 border-neutral-400 dark:border-neutral-500 text-neutral-900 dark:text-white rounded-md font-medium flex items-center gap-2 hover:bg-neutral-900 dark:hover:bg-white hover:text-white transition-colors">
                <Download className="w-5 h-5" />
                Download
              </button>
              <button className="px-4 py-2 text-neutral-700 dark:text-neutral-300 font-medium flex items-center gap-2 hover:bg-neutral-100 dark:hover:bg-gray-800 rounded-md transition-colors">
                Learn More
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            <pre className="p-3 bg-canvas dark:bg-[#0a0a0a] rounded text-xs overflow-x-auto">
              <code>{`import { Plus } from 'lucide-react';

<button className="flex items-center gap-2">
  <Plus className="w-5 h-5" />
  Create Article
</button>`}</code>
            </pre>
          </div>

          {/* Icon Only Button */}
          <div className="bg-surface dark:bg-[#0c0c0d] rounded-lg p-6 border border-borderNeutral">
            <h4 className="font-medium mb-4">Icon-Only Buttons</h4>
            <div className="flex flex-wrap gap-3 mb-4">
              <button className="w-10 h-10 flex items-center justify-center bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-md hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors" aria-label="Search">
                <Search className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 flex items-center justify-center border-2 border-borderNeutral rounded-md hover:border-neutral-400 dark:hover:border-neutral-500 transition-colors" aria-label="Settings">
                <Settings className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 flex items-center justify-center text-textDefault hover:bg-surface-subtle rounded-md transition-colors" aria-label="More options">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
            <pre className="p-3 bg-canvas dark:bg-[#0a0a0a] rounded text-xs overflow-x-auto">
              <code>{`import { Search } from 'lucide-react';

<button
  className="w-10 h-10 flex items-center justify-center"
  aria-label="Search"
>
  <Search className="w-5 h-5" />
</button>`}</code>
            </pre>
          </div>

          {/* Status Indicators */}
          <div className="bg-surface dark:bg-[#0c0c0d] rounded-lg p-6 border border-borderNeutral">
            <h4 className="font-medium mb-4">Status Indicators</h4>
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm">Success message</span>
              </div>
              <div className="flex items-center gap-2 text-red-600">
                <XCircle className="w-5 h-5" />
                <span className="text-sm">Error message</span>
              </div>
              <div className="flex items-center gap-2 text-yellow-600">
                <AlertTriangle className="w-5 h-5" />
                <span className="text-sm">Warning message</span>
              </div>
              <div className="flex items-center gap-2 text-blue-600">
                <Info className="w-5 h-5" />
                <span className="text-sm">Info message</span>
              </div>
            </div>
            <pre className="p-3 bg-canvas dark:bg-[#0a0a0a] rounded text-xs overflow-x-auto">
              <code>{`import { CheckCircle2 } from 'lucide-react';

<div className="flex items-center gap-2 text-green-600">
  <CheckCircle2 className="w-5 h-5" />
  <span>Success message</span>
</div>`}</code>
            </pre>
          </div>

          {/* Loading States */}
          <div className="bg-surface dark:bg-[#0c0c0d] rounded-lg p-6 border border-borderNeutral">
            <h4 className="font-medium mb-4">Loading States</h4>
            <div className="flex items-center gap-4 mb-4">
              <button className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-md font-medium flex items-center gap-2" disabled>
                <Loader2 className="w-5 h-5 animate-spin" />
                Loading...
              </button>
              <Loader2 className="w-6 h-6 text-neutral-900 dark:text-white animate-spin" />
            </div>
            <pre className="p-3 bg-canvas dark:bg-[#0a0a0a] rounded text-xs overflow-x-auto">
              <code>{`import { Loader2 } from 'lucide-react';

<button disabled>
  <Loader2 className="w-5 h-5 animate-spin" />
  Loading...
</button>`}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Best Practices */}
      <div className="bg-surface-subtle rounded-lg p-6 border border-borderNeutral">
        <h3 className="font-serif text-xl font-medium mb-4">Icon Usage Best Practices</h3>
        <div className="space-y-4 text-sm text-textSubtle">
          <div>
            <p className="font-medium text-textDefault mb-2">✓ Do:</p>
            <ul className="space-y-1 list-disc list-inside ml-4">
              <li>Use consistent icon sizes within the same context</li>
              <li>Always include aria-label for icon-only buttons</li>
              <li>Import only the icons you need for better tree-shaking</li>
              <li>Use semantic color for status icons (green for success, red for error)</li>
              <li>Align icon size with adjacent text (w-4 h-4 for small text, w-5 h-5 for body text)</li>
              <li>Use currentColor to inherit text color for flexibility</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-textDefault mb-2">✗ Don't:</p>
            <ul className="space-y-1 list-disc list-inside ml-4">
              <li>Mix icon libraries (stick to Lucide for consistency)</li>
              <li>Use overly decorative icons that don't serve a functional purpose</li>
              <li>Make icons too small (below 16px) as they become hard to recognize</li>
              <li>Use icon-only buttons without proper accessibility labels</li>
              <li>Override stroke-width unless absolutely necessary</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-textDefault mb-2">Accessibility:</p>
            <ul className="space-y-1 list-disc list-inside ml-4">
              <li>Icons should supplement, not replace, text labels when possible</li>
              <li>Use aria-hidden="true" for purely decorative icons</li>
              <li>Ensure sufficient color contrast for icon visibility</li>
              <li>Icons should be easily recognizable and universally understood</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Resources */}
      <div className="bg-surface dark:bg-[#0c0c0d] rounded-lg p-6 border border-borderNeutral">
        <h3 className="font-serif text-xl font-medium mb-4">Resources</h3>
        <div className="space-y-2 text-sm">
          <a
            href="https://lucide.dev/icons"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:underline"
          >
            <ExternalLink className="w-4 h-4" />
            Browse all Lucide icons
          </a>
          <a
            href="https://lucide.dev/guide/packages/lucide-react"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:underline"
          >
            <ExternalLink className="w-4 h-4" />
            Lucide React documentation
          </a>
          <a
            href="https://github.com/lucide-icons/lucide"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:underline"
          >
            <ExternalLink className="w-4 h-4" />
            Lucide GitHub repository
          </a>
        </div>
      </div>
    </div>
  );
}
