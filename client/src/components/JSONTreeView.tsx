/**
 * JSONTreeView Component
 * Hierarchical tree visualization of JSON data
 */

import { useState, useMemo } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { buildJSONTree, JSONNode } from '@/lib/jsonUtils';

interface TreeNodeProps {
  node: JSONNode;
  level: number;
}

function TreeNodeComponent({ node, level }: TreeNodeProps) {
  const [collapsed, setCollapsed] = useState(false);
  const hasChildren = node.children && node.children.length > 0;

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'string':
        return 'text-[#ff6b6b]'; // Coral
      case 'number':
        return 'text-[#f59e0b]'; // Amber
      case 'boolean':
        return 'text-[#10b981]'; // Emerald
      case 'null':
        return 'text-[#64748b]'; // Slate
      default:
        return 'text-foreground';
    }
  };

  const getValueDisplay = (value: any, type: string) => {
    if (type === 'string') return `"${value}"`;
    if (type === 'boolean') return value ? 'true' : 'false';
    if (type === 'null') return 'null';
    return String(value);
  };

  return (
    <div className="font-mono text-sm">
      <div className="flex items-center gap-1 hover:bg-card/50 px-2 py-0.5 rounded cursor-pointer group">
        {hasChildren ? (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-4 h-4 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
          </button>
        ) : (
          <div className="w-4" />
        )}

        {node.key && (
          <>
            <span className="text-[#0066ff]">{node.key}</span>
            <span className="text-muted-foreground">:</span>
          </>
        )}

        {node.type === 'object' || node.type === 'array' ? (
          <>
            <span className="text-muted-foreground">
              {node.type === 'array' ? '[' : '{'}
            </span>
            {!hasChildren && (
              <span className="text-muted-foreground">
                {node.type === 'array' ? ']' : '}'}
              </span>
            )}
            {hasChildren && !collapsed && (
              <span className="text-muted-foreground text-xs ml-1">
                ({node.children?.length} {node.type === 'array' ? 'items' : 'keys'})
              </span>
            )}
          </>
        ) : (
          <span className={getTypeColor(node.type)}>
            {getValueDisplay(node.value, node.type)}
          </span>
        )}
      </div>

      {hasChildren && !collapsed && (
        <div className="ml-4 border-l border-border/50 pl-0">
          {node.children?.map((child, index) => (
            <TreeNodeComponent key={index} node={child} level={level + 1} />
          ))}
          <div className="flex items-center gap-1 px-2 py-0.5 text-muted-foreground">
            <div className="w-4" />
            <span className="text-muted-foreground">
              {node.type === 'array' ? ']' : '}'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

interface JSONTreeViewProps {
  json: string;
}

export default function JSONTreeView({ json }: JSONTreeViewProps) {
  const tree = useMemo(() => buildJSONTree(json), [json]);

  if (!tree) {
    return (
      <div className="text-muted-foreground text-sm p-4">
        Invalid JSON - cannot display tree view
      </div>
    );
  }

  return (
    <div className="w-full">
      <TreeNodeComponent node={tree} level={0} />
    </div>
  );
}
