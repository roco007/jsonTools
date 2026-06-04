/**
 * Advanced JSON Utilities
 * Comparison, filtering, transformation, and other advanced operations
 */

/**
 * Compare two JSON objects and return differences
 */
export interface JSONDiff {
  path: string;
  type: 'added' | 'removed' | 'modified' | 'type_changed';
  oldValue?: any;
  newValue?: any;
}

export function compareJSON(json1: string, json2: string): JSONDiff[] {
  try {
    const obj1 = JSON.parse(json1);
    const obj2 = JSON.parse(json2);
    return diffObjects(obj1, obj2);
  } catch {
    throw new Error('Invalid JSON');
  }
}

function diffObjects(obj1: any, obj2: any, path: string = ''): JSONDiff[] {
  const diffs: JSONDiff[] = [];

  if (typeof obj1 !== typeof obj2) {
    diffs.push({
      path: path || 'root',
      type: 'type_changed',
      oldValue: obj1,
      newValue: obj2,
    });
    return diffs;
  }

  if (typeof obj1 !== 'object' || obj1 === null) {
    if (obj1 !== obj2) {
      diffs.push({
        path: path || 'root',
        type: 'modified',
        oldValue: obj1,
        newValue: obj2,
      });
    }
    return diffs;
  }

  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    const maxLen = Math.max(obj1.length, obj2.length);
    for (let i = 0; i < maxLen; i++) {
      const newPath = `${path}[${i}]`;
      if (i >= obj1.length) {
        diffs.push({
          path: newPath,
          type: 'added',
          newValue: obj2[i],
        });
      } else if (i >= obj2.length) {
        diffs.push({
          path: newPath,
          type: 'removed',
          oldValue: obj1[i],
        });
      } else {
        diffs.push(...diffObjects(obj1[i], obj2[i], newPath));
      }
    }
  } else {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    const allKeys = Array.from(new Set([...keys1, ...keys2]));

    for (const key of allKeys) {
      const newPath = path ? `${path}.${key}` : key;
      if (!keys1.includes(key)) {
        diffs.push({
          path: newPath,
          type: 'added',
          newValue: obj2[key],
        });
      } else if (!keys2.includes(key)) {
        diffs.push({
          path: newPath,
          type: 'removed',
          oldValue: obj1[key],
        });
      } else {
        diffs.push(...diffObjects(obj1[key], obj2[key], newPath));
      }
    }
  }

  return diffs;
}

/**
 * Filter JSON by key name or value
 */
export function filterJSON(input: string, query: string, searchValues: boolean = false): string {
  try {
    const parsed = JSON.parse(input);
    const filtered = filterObject(parsed, query.toLowerCase(), searchValues);
    return JSON.stringify(filtered, null, 2);
  } catch {
    throw new Error('Invalid JSON');
  }
}

function filterObject(obj: any, query: string, searchValues: boolean): any {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj
      .map((item) => filterObject(item, query, searchValues))
      .filter((item) => {
        if (searchValues && typeof item === 'string') {
          return item.toLowerCase().includes(query);
        }
        return item !== null;
      });
  }

  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const keyMatches = key.toLowerCase().includes(query);
    const valueMatches =
      searchValues &&
      (typeof value === 'string' ? value.toLowerCase().includes(query) : false);

    if (keyMatches || valueMatches) {
      result[key] = typeof value === 'object' ? filterObject(value, query, searchValues) : value;
    }
  }

  return result;
}

/**
 * Extract specific paths from JSON
 */
export function extractPaths(input: string, paths: string[]): string {
  try {
    const parsed = JSON.parse(input);
    const result: any = {};

    for (const path of paths) {
      const value = getValueByPath(parsed, path);
      if (value !== undefined) {
        setValueByPath(result, path, value);
      }
    }

    return JSON.stringify(result, null, 2);
  } catch {
    throw new Error('Invalid JSON');
  }
}

function getValueByPath(obj: any, path: string): any {
  const parts = path.split('.');
  let current = obj;

  for (const part of parts) {
    if (current === null || typeof current !== 'object') {
      return undefined;
    }

    const arrayMatch = part.match(/^(\w+)\[(\d+)\]$/);
    if (arrayMatch) {
      current = current[arrayMatch[1]]?.[parseInt(arrayMatch[2])];
    } else {
      current = current[part];
    }
  }

  return current;
}

function setValueByPath(obj: any, path: string, value: any): void {
  const parts = path.split('.');
  let current = obj;

  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (!(part in current)) {
      current[part] = {};
    }
    current = current[part];
  }

  current[parts[parts.length - 1]] = value;
}

/**
 * Flatten nested JSON
 */
export function flattenJSON(input: string, separator: string = '.'): string {
  try {
    const parsed = JSON.parse(input);
    const flattened = flattenObject(parsed, '', separator);
    return JSON.stringify(flattened, null, 2);
  } catch {
    throw new Error('Invalid JSON');
  }
}

function flattenObject(obj: any, prefix: string, separator: string): any {
  const result: any = {};

  if (typeof obj !== 'object' || obj === null) {
    return { [prefix]: obj };
  }

  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      const key = prefix ? `${prefix}${separator}${index}` : `${index}`;
      const flattened = flattenObject(item, key, separator);
      Object.assign(result, flattened);
    });
  } else {
    for (const [key, value] of Object.entries(obj)) {
      const newKey = prefix ? `${prefix}${separator}${key}` : key;
      const flattened = flattenObject(value, newKey, separator);
      Object.assign(result, flattened);
    }
  }

  return result;
}

/**
 * Unflatten JSON
 */
export function unflattenJSON(input: string, separator: string = '.'): string {
  try {
    const parsed = JSON.parse(input);
    if (typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new Error('Input must be a flat object');
    }

    const result: any = {};

    for (const [key, value] of Object.entries(parsed)) {
      const parts = key.split(separator);
      let current = result;

      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        if (!(part in current)) {
          current[part] = isNaN(Number(parts[i + 1])) ? {} : [];
        }
        current = current[part];
      }

      current[parts[parts.length - 1]] = value;
    }

    return JSON.stringify(result, null, 2);
  } catch {
    throw new Error('Invalid JSON');
  }
}

/**
 * Merge multiple JSON objects
 */
export function mergeJSON(inputs: string[]): string {
  try {
    const objects = inputs.map((input) => JSON.parse(input));
    const merged = objects.reduce((acc, obj) => deepMerge(acc, obj), {});
    return JSON.stringify(merged, null, 2);
  } catch {
    throw new Error('Invalid JSON');
  }
}

function deepMerge(target: any, source: any): any {
  if (typeof source !== 'object' || source === null) {
    return source;
  }

  if (Array.isArray(source)) {
    return source;
  }

  const result = { ...target };

  for (const [key, value] of Object.entries(source)) {
    if (key in result && typeof result[key] === 'object' && typeof value === 'object') {
      result[key] = deepMerge(result[key], value);
    } else {
      result[key] = value;
    }
  }

  return result;
}

/**
 * Transform JSON using simple rules
 */
export interface TransformRule {
  from: string;
  to: string;
  type?: 'rename' | 'extract' | 'map';
}

export function transformJSON(input: string, rules: TransformRule[]): string {
  try {
    let parsed = JSON.parse(input);

    for (const rule of rules) {
      if (rule.type === 'rename' || !rule.type) {
        parsed = renameKey(parsed, rule.from, rule.to);
      } else if (rule.type === 'extract') {
        parsed = extractKey(parsed, rule.from, rule.to);
      }
    }

    return JSON.stringify(parsed, null, 2);
  } catch {
    throw new Error('Invalid JSON');
  }
}

function renameKey(obj: any, oldKey: string, newKey: string): any {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => renameKey(item, oldKey, newKey));
  }

  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const newKeyName = key === oldKey ? newKey : key;
    result[newKeyName] = typeof value === 'object' ? renameKey(value, oldKey, newKey) : value;
  }

  return result;
}

function extractKey(obj: any, keyPath: string, newKey: string): any {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => extractKey(item, keyPath, newKey));
  }

  const value = getValueByPath(obj, keyPath);
  if (value !== undefined) {
    obj[newKey] = value;
  }

  return obj;
}

/**
 * Validate JSON against a simple schema
 */
export interface SimpleSchema {
  type: 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null';
  properties?: { [key: string]: SimpleSchema };
  items?: SimpleSchema;
  required?: string[];
}

export function validateSchema(input: string, schema: SimpleSchema): { valid: boolean; errors: string[] } {
  try {
    const parsed = JSON.parse(input);
    const errors: string[] = [];
    validateValue(parsed, schema, '', errors);
    return { valid: errors.length === 0, errors };
  } catch (error: any) {
    return { valid: false, errors: [error.message] };
  }
}

function validateValue(value: any, schema: SimpleSchema, path: string, errors: string[]): void {
  const currentPath = path || 'root';

  // Check type
  const valueType = Array.isArray(value)
    ? 'array'
    : value === null
      ? 'null'
      : typeof value;

  if (valueType !== schema.type) {
    errors.push(`${currentPath}: expected ${schema.type}, got ${valueType}`);
    return;
  }

  if (schema.type === 'object' && schema.properties) {
    if (schema.required) {
      for (const key of schema.required) {
        if (!(key in value)) {
          errors.push(`${currentPath}: missing required property '${key}'`);
        }
      }
    }

    for (const [key, propSchema] of Object.entries(schema.properties)) {
      if (key in value) {
        validateValue(value[key], propSchema, `${currentPath}.${key}`, errors);
      }
    }
  } else if (schema.type === 'array' && schema.items) {
    for (let i = 0; i < value.length; i++) {
      validateValue(value[i], schema.items, `${currentPath}[${i}]`, errors);
    }
  }
}
