import React from 'react';
import { useStore } from '@/store/flowStore';

export const JsonViewer = () => {
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);
  const cache = useStore((state) => state.cache);

  const flowData = {
    nodes,
    edges,
    metadata: {
      flowId: cache.flowId,
      lastSaved: new Date(cache.lastSaved).toLocaleString(),
      isDirty: cache.isDirty
    }
  };

  return (
    <div className="p-4">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Flow JSON Structure</h3>
        <p className="text-xs text-gray-500">
          Real-time view of the flow's JSON data structure
        </p>
      </div>
      
      <div className="mt-4 font-mono text-xs">
        <pre className="bg-gray-50 p-4 rounded-lg border overflow-auto max-h-[calc(100vh-200px)]">
          {JSON.stringify(flowData, null, 2)}
        </pre>
      </div>
    </div>
  );
};