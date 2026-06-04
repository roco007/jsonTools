/**
 * JSON Utilities - Core JSON processing functions
 * Handles formatting, validation, conversion, and manipulation
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
  line?: number;
  column?: number;
}

export interface JSONNode {
  key?: string;
  value: any;
  type: 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null';
  children?: JSONNode[];
  collapsed?: boolean;
}

/**
 * Format JSON with specified indentation
 */
export function formatJSON(input: string, spaces: number = 2): string {
  try {
    const parsed = JSON.parse(input);
    return JSON.stringify(parsed, null, spaces);
  } catch (error) {
    throw new Error('Invalid JSON');
  }
}

/**
 * Minify JSON - remove all whitespace
 */
export function minifyJSON(input: string): string {
  try {
    const parsed = JSON.parse(input);
    return JSON.stringify(parsed);
  } catch (error) {
    throw new Error('Invalid JSON');
  }
}

/**
 * Validate JSON and return detailed error information
 */
export function validateJSON(input: string): ValidationResult {
  try {
    JSON.parse(input);
    return { valid: true };
  } catch (error: any) {
    const message = error.message;
    const match = message.match(/position (\d+)/);
    const position = match ? parseInt(match[1]) : 0;

    // Calculate line and column from position
    const lines = input.substring(0, position).split('\n');
    const line = lines.length;
    const column = lines[lines.length - 1].length + 1;

    return {
      valid: false,
      error: message,
      line,
      column,
    };
  }
}

/**
 * Attempt to repair common JSON errors
 */
export function repairJSON(input: string): string {
  let repaired = input;

  // Remove trailing commas
  repaired = repaired.replace(/,(\s*[}\]])/g, '$1');

  // Add missing quotes around keys
  repaired = repaired.replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":');

  // Remove comments (// and /* */)
  repaired = repaired.replace(/\/\/.*$/gm, '');
  repaired = repaired.replace(/\/\*[\s\S]*?\*\//g, '');

  // Try to parse and re-format
  try {
    const parsed = JSON.parse(repaired);
    return JSON.stringify(parsed, null, 2);
  } catch {
    return repaired;
  }
}

/**
 * Build tree structure from JSON
 */
export function buildJSONTree(input: string): JSONNode | null {
  try {
    const parsed = JSON.parse(input);
    return createNode(parsed);
  } catch {
    return null;
  }
}

function createNode(value: any, key?: string): JSONNode {
  const type = Array.isArray(value)
    ? 'array'
    : value === null
      ? 'null'
      : typeof value;

  const node: JSONNode = {
    key,
    value: type === 'object' || type === 'array' ? undefined : value,
    type: type as any,
    collapsed: false,
  };

  if (typeof value === 'object' && value !== null) {
    node.children = Array.isArray(value)
      ? value.map((item, index) => createNode(item, `[${index}]`))
      : Object.entries(value).map(([k, v]) => createNode(v, k));
  }

  return node;
}

/**
 * Sort JSON keys alphabetically
 */
export function sortJSON(input: string): string {
  try {
    const parsed = JSON.parse(input);
    const sorted = sortObject(parsed);
    return JSON.stringify(sorted, null, 2);
  } catch {
    throw new Error('Invalid JSON');
  }
}

function sortObject(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(sortObject);
  }
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj)
      .sort()
      .reduce(
        (result, key) => {
          result[key] = sortObject(obj[key]);
          return result;
        },
        {} as any
      );
  }
  return obj;
}

/**
 * Convert JSON to XML
 */
export function jsonToXML(input: string, rootName: string = 'root'): string {
  try {
    const parsed = JSON.parse(input);
    return `<?xml version="1.0" encoding="UTF-8"?>\n${objectToXML(parsed, rootName)}`;
  } catch {
    throw new Error('Invalid JSON');
  }
}

function objectToXML(obj: any, name: string, indent: number = 0): string {
  const spaces = '  '.repeat(indent);

  if (obj === null) {
    return `${spaces}<${name} />`;
  }

  if (typeof obj !== 'object') {
    return `${spaces}<${name}>${escapeXML(String(obj))}</${name}>`;
  }

  if (Array.isArray(obj)) {
    const items = obj
      .map((item, index) => objectToXML(item, 'item', indent + 1))
      .join('\n');
    return `${spaces}<${name}>\n${items}\n${spaces}</${name}>`;
  }

  const entries = Object.entries(obj)
    .map(([key, value]) => objectToXML(value, key, indent + 1))
    .join('\n');

  return `${spaces}<${name}>\n${entries}\n${spaces}</${name}>`;
}

function escapeXML(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Convert JSON to CSV
 */
export function jsonToCSV(input: string): string {
  try {
    const parsed = JSON.parse(input);

    if (!Array.isArray(parsed) || parsed.length === 0) {
      throw new Error('JSON must be an array of objects');
    }

    const headers = Object.keys(parsed[0]);
    const headerRow = headers.map(escapeCSV).join(',');

    const rows = parsed.map((obj) =>
      headers.map((header) => escapeCSV(String(obj[header] ?? ''))).join(',')
    );

    return [headerRow, ...rows].join('\n');
  } catch (error: any) {
    throw new Error(error.message || 'Invalid JSON for CSV conversion');
  }
}

function escapeCSV(str: string): string {
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Convert JSON to YAML
 */
export function jsonToYAML(input: string, indent: number = 0): string {
  try {
    const parsed = JSON.parse(input);
    return objectToYAML(parsed, indent);
  } catch {
    throw new Error('Invalid JSON');
  }
}

function objectToYAML(obj: any, indent: number = 0): string {
  const spaces = '  '.repeat(indent);

  if (obj === null) {
    return 'null';
  }

  if (typeof obj !== 'object') {
    if (typeof obj === 'string') {
      return `'${obj.replace(/'/g, "''")}'`;
    }
    return String(obj);
  }

  if (Array.isArray(obj)) {
    if (obj.length === 0) {
      return '[]';
    }
    return obj
      .map((item) => {
        const yaml = objectToYAML(item, indent + 1);
        return `${spaces}- ${yaml}`;
      })
      .join('\n');
  }

  if (Object.keys(obj).length === 0) {
    return '{}';
  }

  return Object.entries(obj)
    .map(([key, value]) => {
      const yaml = objectToYAML(value, indent + 1);
      if (yaml.includes('\n')) {
        return `${spaces}${key}:\n${yaml}`;
      }
      return `${spaces}${key}: ${yaml}`;
    })
    .join('\n');
}

/**
 * Get JSON statistics
 */
export function getJSONStats(input: string): {
  size: number;
  lines: number;
  keys: number;
  depth: number;
} {
  try {
    const parsed = JSON.parse(input);
    return {
      size: input.length,
      lines: input.split('\n').length,
      keys: countKeys(parsed),
      depth: getDepth(parsed),
    };
  } catch {
    return { size: 0, lines: 0, keys: 0, depth: 0 };
  }
}

function countKeys(obj: any): number {
  if (typeof obj !== 'object' || obj === null) {
    return 0;
  }

  if (Array.isArray(obj)) {
    return obj.reduce((sum: number, item: any) => sum + countKeys(item), 0);
  }

  return (
    Object.keys(obj).length +
    Object.values(obj).reduce((sum: number, value: any) => sum + countKeys(value), 0)
  );
}

function getDepth(obj: any): number {
  if (typeof obj !== 'object' || obj === null) {
    return 0;
  }

  if (Array.isArray(obj)) {
    return obj.length === 0 ? 1 : 1 + Math.max(...obj.map(getDepth));
  }

  const values = Object.values(obj);
  return values.length === 0 ? 1 : 1 + Math.max(...values.map(getDepth));
}

/**
 * Escape JSON string
 */
export function escapeJSONString(input: string): string {
  return JSON.stringify(input).slice(1, -1);
}

/**
 * Unescape JSON string
 */
export function unescapeJSONString(input: string): string {
  try {
    return JSON.parse(`"${input}"`);
  } catch {
    return input;
  }
}
