/**
 * AdvancedTools Component
 * Additional utilities for JSON manipulation
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { escapeJSONString, unescapeJSONString } from '@/lib/jsonUtils';
import {
  compareJSON,
  filterJSON,
  flattenJSON,
  unflattenJSON,
  mergeJSON,
} from '@/lib/advancedUtils';
import { Copy } from 'lucide-react';

// Re-export advanced utilities for use in component
export { compareJSON, filterJSON, flattenJSON, unflattenJSON, mergeJSON };

export default function AdvancedTools() {
  const [activeTab, setActiveTab] = useState('compare');
  const [compareInput1, setCompareInput1] = useState('');
  const [compareInput2, setCompareInput2] = useState('');
  const [compareResult, setCompareResult] = useState<string>('');
  
  const [filterInput, setFilterInput] = useState('');
  const [filterQuery, setFilterQuery] = useState('');
  const [filterResult, setFilterResult] = useState('');
  
  const [flattenInput, setFlattenInput] = useState('');
  const [flattenResult, setFlattenResult] = useState('');
  
  const [unflattenInput, setUnflattenInput] = useState('');
  const [unflattenResult, setUnflattenResult] = useState('');
  
  const [mergeInputs, setMergeInputs] = useState(['', '']);
  const [mergeResult, setMergeResult] = useState('');
  
  const [escapeInput, setEscapeInput] = useState('');
  const [escapeResult, setEscapeResult] = useState('');

  const handleCompare = () => {
    try {
      const diffs = compareJSON(compareInput1, compareInput2);
      setCompareResult(JSON.stringify(diffs, null, 2));
      toast.success(`Found ${diffs.length} differences`);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleFilter = () => {
    try {
      const result = filterJSON(filterInput, filterQuery);
      setFilterResult(result);
      toast.success('Filtered successfully');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleFlatten = () => {
    try {
      const result = flattenJSON(flattenInput);
      setFlattenResult(result);
      toast.success('Flattened successfully');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleUnflatten = () => {
    try {
      const result = unflattenJSON(unflattenInput);
      setUnflattenResult(result);
      toast.success('Unflattened successfully');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleMerge = () => {
    try {
      const result = mergeJSON(mergeInputs.filter((i) => i.trim()));
      setMergeResult(result);
      toast.success('Merged successfully');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleEscape = () => {
    try {
      const result = escapeJSONString(escapeInput);
      setEscapeResult(result);
      toast.success('Escaped successfully');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleUnescape = () => {
    try {
      const result = unescapeJSONString(escapeInput);
      setEscapeResult(result);
      toast.success('Unescaped successfully');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-mono mb-2">Advanced JSON Tools</h1>
          <p className="text-muted-foreground">Compare, filter, flatten, merge, and transform JSON</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-card border border-border">
            <TabsTrigger value="compare">Compare</TabsTrigger>
            <TabsTrigger value="filter">Filter</TabsTrigger>
            <TabsTrigger value="flatten">Flatten</TabsTrigger>
            <TabsTrigger value="unflatten">Unflatten</TabsTrigger>
            <TabsTrigger value="merge">Merge</TabsTrigger>
            <TabsTrigger value="escape">Escape</TabsTrigger>
          </TabsList>

          {/* Compare Tab */}
          <TabsContent value="compare" className="space-y-4">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Compare JSON Objects</CardTitle>
                <CardDescription>Find differences between two JSON objects</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">JSON 1</label>
                    <textarea
                      value={compareInput1}
                      onChange={(e) => setCompareInput1(e.target.value)}
                      className="w-full h-40 p-3 bg-background border border-border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter first JSON..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">JSON 2</label>
                    <textarea
                      value={compareInput2}
                      onChange={(e) => setCompareInput2(e.target.value)}
                      className="w-full h-40 p-3 bg-background border border-border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter second JSON..."
                    />
                  </div>
                </div>
                <Button onClick={handleCompare} className="w-full">
                  Compare
                </Button>
                {compareResult && (
                  <div className="relative">
                    <textarea
                      value={compareResult}
                      readOnly
                      className="w-full h-40 p-3 bg-background border border-border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(compareResult)}
                      className="absolute top-2 right-2 gap-2"
                    >
                      <Copy size={14} />
                      Copy
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Filter Tab */}
          <TabsContent value="filter" className="space-y-4">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Filter JSON</CardTitle>
                <CardDescription>Filter JSON by key names or values</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">JSON Input</label>
                  <textarea
                    value={filterInput}
                    onChange={(e) => setFilterInput(e.target.value)}
                    className="w-full h-40 p-3 bg-background border border-border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter JSON..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Search Query</label>
                  <input
                    type="text"
                    value={filterQuery}
                    onChange={(e) => setFilterQuery(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter search term..."
                  />
                </div>
                <Button onClick={handleFilter} className="w-full">
                  Filter
                </Button>
                {filterResult && (
                  <div className="relative">
                    <textarea
                      value={filterResult}
                      readOnly
                      className="w-full h-40 p-3 bg-background border border-border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(filterResult)}
                      className="absolute top-2 right-2 gap-2"
                    >
                      <Copy size={14} />
                      Copy
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Flatten Tab */}
          <TabsContent value="flatten" className="space-y-4">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Flatten JSON</CardTitle>
                <CardDescription>Convert nested JSON to flat structure</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">JSON Input</label>
                  <textarea
                    value={flattenInput}
                    onChange={(e) => setFlattenInput(e.target.value)}
                    className="w-full h-40 p-3 bg-background border border-border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter nested JSON..."
                  />
                </div>
                <Button onClick={handleFlatten} className="w-full">
                  Flatten
                </Button>
                {flattenResult && (
                  <div className="relative">
                    <textarea
                      value={flattenResult}
                      readOnly
                      className="w-full h-40 p-3 bg-background border border-border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(flattenResult)}
                      className="absolute top-2 right-2 gap-2"
                    >
                      <Copy size={14} />
                      Copy
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Unflatten Tab */}
          <TabsContent value="unflatten" className="space-y-4">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Unflatten JSON</CardTitle>
                <CardDescription>Convert flat JSON to nested structure</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Flat JSON Input</label>
                  <textarea
                    value={unflattenInput}
                    onChange={(e) => setUnflattenInput(e.target.value)}
                    className="w-full h-40 p-3 bg-background border border-border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter flat JSON..."
                  />
                </div>
                <Button onClick={handleUnflatten} className="w-full">
                  Unflatten
                </Button>
                {unflattenResult && (
                  <div className="relative">
                    <textarea
                      value={unflattenResult}
                      readOnly
                      className="w-full h-40 p-3 bg-background border border-border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(unflattenResult)}
                      className="absolute top-2 right-2 gap-2"
                    >
                      <Copy size={14} />
                      Copy
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Merge Tab */}
          <TabsContent value="merge" className="space-y-4">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Merge JSON Objects</CardTitle>
                <CardDescription>Combine multiple JSON objects into one</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mergeInputs.map((input, index) => (
                  <div key={index}>
                    <label className="block text-sm font-medium mb-2">JSON {index + 1}</label>
                    <textarea
                      value={input}
                      onChange={(e) => {
                        const newInputs = [...mergeInputs];
                        newInputs[index] = e.target.value;
                        setMergeInputs(newInputs);
                      }}
                      className="w-full h-32 p-3 bg-background border border-border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder={`Enter JSON ${index + 1}...`}
                    />
                  </div>
                ))}
                <Button onClick={handleMerge} className="w-full">
                  Merge
                </Button>
                {mergeResult && (
                  <div className="relative">
                    <textarea
                      value={mergeResult}
                      readOnly
                      className="w-full h-40 p-3 bg-background border border-border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(mergeResult)}
                      className="absolute top-2 right-2 gap-2"
                    >
                      <Copy size={14} />
                      Copy
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Escape Tab */}
          <TabsContent value="escape" className="space-y-4">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Escape/Unescape JSON Strings</CardTitle>
                <CardDescription>Escape or unescape JSON string content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Input</label>
                  <textarea
                    value={escapeInput}
                    onChange={(e) => setEscapeInput(e.target.value)}
                    className="w-full h-40 p-3 bg-background border border-border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter text to escape or unescape..."
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleEscape} className="flex-1">
                    Escape
                  </Button>
                  <Button onClick={handleUnescape} className="flex-1">
                    Unescape
                  </Button>
                </div>
                {escapeResult && (
                  <div className="relative">
                    <textarea
                      value={escapeResult}
                      readOnly
                      className="w-full h-40 p-3 bg-background border border-border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(escapeResult)}
                      className="absolute top-2 right-2 gap-2"
                    >
                      <Copy size={14} />
                      Copy
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
