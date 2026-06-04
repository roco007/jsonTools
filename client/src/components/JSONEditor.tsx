/**
 * JSONEditor Component
 * Main dual-panel editor with input and output areas
 * Design: Developer's Workspace - Minimalist Technical
 */

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Copy,
  Download,
  Upload,
  Zap,
  RotateCcw,
  RotateCw,
  Eye,
  Code,
  AlertCircle,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import {
  formatJSON,
  minifyJSON,
  validateJSON,
  repairJSON,
  buildJSONTree,
  sortJSON,
  jsonToXML,
  jsonToCSV,
  jsonToYAML,
  getJSONStats,
} from '@/lib/jsonUtils';
import { toast } from 'sonner';
import JSONTreeView from './JSONTreeView';

type EditorMode = 'editor' | 'tree';
type IndentSize = 2 | 3 | 4;

interface EditorState {
  input: string;
  output: string;
  history: string[];
  historyIndex: number;
}

const SAMPLE_JSON = JSON.stringify(
  {
    name: 'JSON Master',
    version: '1.0.0',
    features: ['Format', 'Validate', 'Convert', 'Tree View'],
    active: true,
  },
  null,
  2
);

export default function JSONEditor() {
  const [editorState, setEditorState] = useState<EditorState>({
    input: SAMPLE_JSON,
    output: SAMPLE_JSON,
    history: [SAMPLE_JSON],
    historyIndex: 0,
  });

  const [indentSize, setIndentSize] = useState<IndentSize>(2);
  const [editorMode, setEditorMode] = useState<EditorMode>('editor');
  const [outputMode, setOutputMode] = useState<'formatted' | 'tree' | 'xml' | 'csv' | 'yaml'>('formatted');
  const [validation, setValidation] = useState<{ valid: boolean; error?: string; line?: number; column?: number }>({ valid: true, error: '' });
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const outputRef = useRef<HTMLTextAreaElement>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('jsonmaster_input');
    if (saved) {
      setEditorState((prev) => ({
        ...prev,
        input: saved,
        output: saved,
      }));
    }
  }, []);

  // Save to localStorage on input change
  useEffect(() => {
    localStorage.setItem('jsonmaster_input', editorState.input);
  }, [editorState.input]);

  // Validate input on change
  useEffect(() => {
    const result = validateJSON(editorState.input);
    setValidation(result);
  }, [editorState.input]);

  const updateInput = (value: string) => {
    setEditorState((prev) => ({
      ...prev,
      input: value,
      history: [...prev.history.slice(0, prev.historyIndex + 1), value],
      historyIndex: prev.historyIndex + 1,
    }));
  };

  const handleFormat = () => {
    try {
      const formatted = formatJSON(editorState.input, indentSize);
      updateInput(formatted);
      toast.success('JSON formatted successfully');
    } catch (error) {
      toast.error('Invalid JSON');
    }
  };

  const handleMinify = () => {
    try {
      const minified = minifyJSON(editorState.input);
      updateInput(minified);
      toast.success('JSON minified');
    } catch (error) {
      toast.error('Invalid JSON');
    }
  };

  const handleSort = () => {
    try {
      const sorted = sortJSON(editorState.input);
      updateInput(sorted);
      toast.success('JSON sorted');
    } catch (error) {
      toast.error('Invalid JSON');
    }
  };

  const handleRepair = () => {
    try {
      const repaired = repairJSON(editorState.input);
      updateInput(repaired);
      toast.success('JSON repaired');
    } catch (error) {
      toast.error('Could not repair JSON');
    }
  };

  const handleUndo = () => {
    if (editorState.historyIndex > 0) {
      setEditorState((prev) => ({
        ...prev,
        historyIndex: prev.historyIndex - 1,
        input: prev.history[prev.historyIndex - 1],
      }));
    }
  };

  const handleRedo = () => {
    if (editorState.historyIndex < editorState.history.length - 1) {
      setEditorState((prev) => ({
        ...prev,
        historyIndex: prev.historyIndex + 1,
        input: prev.history[prev.historyIndex + 1],
      }));
    }
  };

  const handleCopyInput = () => {
    navigator.clipboard.writeText(editorState.input);
    toast.success('Copied to clipboard');
  };

  const handleCopyOutput = () => {
    navigator.clipboard.writeText(editorState.output);
    toast.success('Copied to clipboard');
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(editorState.output)}`);
    element.setAttribute('download', 'data.json');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Downloaded');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result;
        if (typeof content === 'string') {
          updateInput(content);
          toast.success('File loaded');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleClear = () => {
    updateInput('');
    setValidation({ valid: true, error: '' });
    toast.success('Cleared');
  };

  const generateOutput = () => {
    try {
      let output = editorState.input;

      switch (outputMode) {
        case 'formatted':
          output = formatJSON(editorState.input, indentSize);
          break;
        case 'tree':
          // Tree view is handled separately
          return;
        case 'xml':
          output = jsonToXML(editorState.input);
          break;
        case 'csv':
          output = jsonToCSV(editorState.input);
          break;
        case 'yaml':
          output = jsonToYAML(editorState.input);
          break;
      }

      setEditorState((prev) => ({
        ...prev,
        output,
      }));
    } catch (error: any) {
      toast.error(error.message || 'Conversion failed');
    }
  };

  useEffect(() => {
    generateOutput();
  }, [outputMode, indentSize, editorState.input]);

  const stats = getJSONStats(editorState.input);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold font-mono">JSON Master</h1>
              <p className="text-sm text-muted-foreground">Formatter • Validator • Converter</p>
            </div>
            <div className="flex items-center gap-2">
              <a href="/tools" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                All Tools
              </a>
              <a href="/advanced" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Advanced
              </a>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {validation.valid ? (
                  <div className="flex items-center gap-2 text-success">
                    <CheckCircle2 size={18} />
                    <span className="text-sm font-medium">Valid JSON</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertCircle size={18} />
                    <span className="text-sm font-medium">Invalid JSON</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex flex-wrap gap-2 items-center">
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="outline"
                onClick={handleFormat}
                title="Format JSON (Ctrl+I)"
                className="gap-2"
              >
                <Zap size={16} />
                Format
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleMinify}
                title="Minify JSON (Ctrl+Shift+I)"
                className="gap-2"
              >
                <Code size={16} />
                Minify
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleSort}
                title="Sort keys"
                className="gap-2"
              >
                Sort
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleRepair}
                title="Repair JSON"
                className="gap-2"
              >
                Repair
              </Button>
            </div>

            <div className="w-px h-6 bg-border" />

            <div className="flex gap-1">
              <Button
                size="sm"
                variant="outline"
                onClick={handleUndo}
                disabled={editorState.historyIndex === 0}
                title="Undo (Ctrl+Z)"
              >
                <RotateCcw size={16} />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleRedo}
                disabled={editorState.historyIndex === editorState.history.length - 1}
                title="Redo (Ctrl+Shift+Z)"
              >
                <RotateCw size={16} />
              </Button>
            </div>

            <div className="w-px h-6 bg-border" />

            <select
              value={indentSize}
              onChange={(e) => setIndentSize(parseInt(e.target.value) as IndentSize)}
              className="px-3 py-1.5 text-sm bg-input border border-border rounded-md text-foreground"
            >
              <option value={2}>2 Spaces</option>
              <option value={3}>3 Spaces</option>
              <option value={4}>4 Spaces</option>
            </select>

            <div className="flex-1" />

            <label className="cursor-pointer">
              <input
                type="file"
                accept=".json,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button size="sm" variant="outline" asChild className="gap-2 cursor-pointer">
                <span>
                  <Upload size={16} />
                  Upload
                </span>
              </Button>
            </label>

            <Button
              size="sm"
              variant="outline"
              onClick={handleClear}
              className="gap-2"
            >
              <Trash2 size={16} />
              Clear
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container py-4 flex gap-4 overflow-hidden">
        {/* Input Panel */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-muted-foreground">INPUT</h2>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCopyInput}
              className="gap-2 h-8"
            >
              <Copy size={14} />
              Copy
            </Button>
          </div>
          <textarea
            ref={inputRef}
            value={editorState.input}
            onChange={(e) => updateInput(e.target.value)}
            className="flex-1 p-4 bg-card border border-border rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            spellCheck="false"
          />
          {!validation.valid && validation.error && (
            <div className="mt-2 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive">
              <strong>Error:</strong> {validation.error}
              {validation.line && ` (Line ${validation.line})`}
            </div>
          )}
          <div className="mt-2 text-xs text-muted-foreground flex gap-4">
            <span>Size: {stats.size} bytes</span>
            <span>Lines: {stats.lines}</span>
            <span>Keys: {stats.keys}</span>
            <span>Depth: {stats.depth}</span>
          </div>
        </div>

        {/* Output Panel */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-muted-foreground">OUTPUT</h2>
              <Tabs value={outputMode} onValueChange={(v) => setOutputMode(v as any)}>
                <TabsList className="h-7 bg-card border border-border">
                  <TabsTrigger value="formatted" className="text-xs">
                    Formatted
                  </TabsTrigger>
                  <TabsTrigger value="tree" className="text-xs">
                    Tree
                  </TabsTrigger>
                  <TabsTrigger value="xml" className="text-xs">
                    XML
                  </TabsTrigger>
                  <TabsTrigger value="csv" className="text-xs">
                    CSV
                  </TabsTrigger>
                  <TabsTrigger value="yaml" className="text-xs">
                    YAML
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCopyOutput}
                className="gap-2 h-8"
              >
                <Copy size={14} />
                Copy
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDownload}
                className="gap-2 h-8"
              >
                <Download size={14} />
                Download
              </Button>
            </div>
          </div>

          {outputMode === 'tree' ? (
            <div className="flex-1 overflow-auto bg-card border border-border rounded-lg p-4">
              <JSONTreeView json={editorState.input} />
            </div>
          ) : (
            <textarea
              ref={outputRef}
              value={editorState.output}
              readOnly
              className="flex-1 p-4 bg-card border border-border rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              spellCheck="false"
            />
          )}
        </div>
      </main>
    </div>
  );
}
