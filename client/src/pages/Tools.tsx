/**
 * Tools Navigation Page
 * Central hub for accessing all JSON tools
 */

import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Zap,
  CheckCircle2,
  Eye,
  Code,
  ArrowRight,
  Filter,
  GitCompare,
  Layers,
  Merge,
  Type,
} from 'lucide-react';

const tools = [
  {
    id: 'formatter',
    title: 'JSON Formatter',
    description: 'Format, beautify, and minify JSON with multiple indentation options',
    icon: Zap,
    features: ['Format', 'Minify', 'Sort', 'Repair'],
    href: '/',
  },
  {
    id: 'validator',
    title: 'JSON Validator',
    description: 'Validate JSON syntax and get detailed error messages',
    icon: CheckCircle2,
    features: ['Validation', 'Error Detection', 'Line Numbers'],
    href: '/',
  },
  {
    id: 'viewer',
    title: 'JSON Tree Viewer',
    description: 'Visualize JSON structure in an interactive tree view',
    icon: Eye,
    features: ['Tree View', 'Collapsible Nodes', 'Color-coded Types'],
    href: '/',
  },
  {
    id: 'converter',
    title: 'JSON Converter',
    description: 'Convert JSON to XML, CSV, YAML, and other formats',
    icon: Code,
    features: ['XML', 'CSV', 'YAML', 'One-line'],
    href: '/',
  },
  {
    id: 'compare',
    title: 'JSON Comparer',
    description: 'Compare two JSON objects and find differences',
    icon: GitCompare,
    features: ['Diff Detection', 'Change Tracking', 'Detailed Reports'],
    href: '/advanced',
  },
  {
    id: 'filter',
    title: 'JSON Filter',
    description: 'Filter JSON by keys or values',
    icon: Filter,
    features: ['Key Filtering', 'Value Search', 'Pattern Matching'],
    href: '/advanced',
  },
  {
    id: 'flatten',
    title: 'JSON Flattener',
    description: 'Flatten nested JSON to a single level',
    icon: Layers,
    features: ['Flatten', 'Unflatten', 'Custom Separators'],
    href: '/advanced',
  },
  {
    id: 'merge',
    title: 'JSON Merger',
    description: 'Merge multiple JSON objects into one',
    icon: Merge,
    features: ['Deep Merge', 'Multiple Objects', 'Conflict Resolution'],
    href: '/advanced',
  },
  {
    id: 'escape',
    title: 'String Escaper',
    description: 'Escape and unescape JSON strings',
    icon: Type,
    features: ['Escape', 'Unescape', 'Unicode Support'],
    href: '/advanced',
  },
];

export default function Tools() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold font-mono">JSON Master</h1>
              <p className="text-muted-foreground mt-1">Complete JSON toolkit for developers</p>
            </div>
            <Link href="/">
              <Button variant="outline" className="gap-2">
                <Zap size={18} />
                Main Editor
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Available Tools</h2>
          <p className="text-muted-foreground mb-8">
            Choose a tool to get started with JSON processing, validation, and conversion
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link key={tool.id} href={tool.href}>
                  <Card className="bg-card border-border hover:border-primary/50 transition-all cursor-pointer h-full hover:shadow-lg">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Icon size={24} className="text-primary" />
                        </div>
                      </div>
                      <CardTitle className="text-lg">{tool.title}</CardTitle>
                      <CardDescription>{tool.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {tool.features.map((feature) => (
                          <span
                            key={feature}
                            className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                      <Button variant="ghost" className="w-full justify-between group">
                        <span>Open Tool</span>
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 pt-12 border-t border-border">
          <h2 className="text-2xl font-bold mb-8">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <CheckCircle2 size={20} className="text-primary" />
                Real-time Validation
              </h3>
              <p className="text-sm text-muted-foreground">
                Instantly validate JSON syntax with detailed error messages and line numbers
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Code size={20} className="text-primary" />
                Multiple Formats
              </h3>
              <p className="text-sm text-muted-foreground">
                Convert JSON to XML, CSV, YAML, and other popular data formats
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Eye size={20} className="text-primary" />
                Visual Tree View
              </h3>
              <p className="text-sm text-muted-foreground">
                Navigate complex JSON structures with an interactive tree visualization
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Zap size={20} className="text-primary" />
                Fast Processing
              </h3>
              <p className="text-sm text-muted-foreground">
                All processing happens in your browser - no server uploads required
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <GitCompare size={20} className="text-primary" />
                Compare & Merge
              </h3>
              <p className="text-sm text-muted-foreground">
                Compare JSON objects and merge multiple files with deep merge support
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Layers size={20} className="text-primary" />
                Flatten & Unflatten
              </h3>
              <p className="text-sm text-muted-foreground">
                Convert between nested and flat JSON structures with custom separators
              </p>
            </div>
          </div>
        </div>

        {/* Quick Start */}
        <div className="mt-16 pt-12 border-t border-border">
          <h2 className="text-2xl font-bold mb-4">Quick Start</h2>
          <div className="bg-card border border-border rounded-lg p-8">
            <ol className="space-y-4">
              <li className="flex gap-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-semibold flex-shrink-0">
                  1
                </span>
                <div>
                  <p className="font-semibold">Paste or Upload JSON</p>
                  <p className="text-sm text-muted-foreground">
                    Enter your JSON data directly or upload a file
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-semibold flex-shrink-0">
                  2
                </span>
                <div>
                  <p className="font-semibold">Choose Your Tool</p>
                  <p className="text-sm text-muted-foreground">
                    Select from format, validate, convert, or analyze options
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-semibold flex-shrink-0">
                  3
                </span>
                <div>
                  <p className="font-semibold">Get Results</p>
                  <p className="text-sm text-muted-foreground">
                    View results instantly and download or copy to clipboard
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 mt-16">
        <div className="container py-8">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              JSON Master © 2026 - Developer's JSON Toolkit
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
