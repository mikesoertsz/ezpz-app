import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Trash2, 
  Layers, 
  MessageSquare, 
  History,
  Play,
  Flag,
  X,
  LayoutGrid,
  Plus,
  Code
} from 'lucide-react';
import { Button } from './ui/button';
import { NODE_TYPES, NODE_TYPE_DETAILS } from '@/types/nodes';
import { useStore } from '@/store/flowStore';
import { formatDistanceToNow } from 'date-fns';
import { PromptPanel } from './PromptPanel';
import { JsonViewer } from './JsonViewer';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onAddNode: (type: string) => void;
}

type TabType = 'nodes' | 'prompt' | 'history' | 'json';

export default function Sidebar({ isOpen, onToggle, onAddNode }: SidebarProps) {
  const [activeTab, setActiveTab] = useState<TabType>('nodes');
  const clearCanvas = useStore((state) => state.clearCanvas);
  const autoLayout = useStore((state) => state.autoLayout);
  const history = useStore((state) => state.history);
  const setNodes = useStore((state) => state.setNodes);
  const setEdges = useStore((state) => state.setEdges);

  // Function to handle drag start
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleFlowGenerated = (nodes: any[], edges: any[]) => {
    setNodes(nodes);
    setEdges(edges);
    autoLayout();
  };

  return (
    <div className="h-full flex flex-col bg-white border-r">
      {/* Tabs */}
      <div className="flex border-b">
        <button
          className={`flex-1 py-2 px-3 text-xs font-medium flex items-center justify-center gap-1
            ${activeTab === 'nodes' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('nodes')}
        >
          <Layers className="h-3.5 w-3.5" />
          <span>Nodes</span>
        </button>
        <button
          className={`flex-1 py-2 px-3 text-xs font-medium flex items-center justify-center gap-1
            ${activeTab === 'prompt' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('prompt')}
        >
          <MessageSquare className="h-3.5 w-3.5" />
          <span>Prompt</span>
        </button>
        <button
          className={`flex-1 py-2 px-3 text-xs font-medium flex items-center justify-center gap-1
            ${activeTab === 'history' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('history')}
        >
          <History className="h-3.5 w-3.5" />
          <span>History</span>
        </button>
        <button
          className={`flex-1 py-2 px-3 text-xs font-medium flex items-center justify-center gap-1
            ${activeTab === 'json' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('json')}
        >
          <Code className="h-3.5 w-3.5" />
          <span>JSON</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'nodes' && (
          <div className="p-4 space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Process Nodes</h3>
              <div className="space-y-1.5 mb-4">
                <div
                  draggable
                  onDragStart={(event) => onDragStart(event, NODE_TYPES.START)}
                  className="cursor-grab"
                >
                  <Button
                    variant="outline"
                    className="w-full justify-start border-green-300 bg-green-50 hover:bg-green-100"
                    onClick={() => onAddNode(NODE_TYPES.START)}
                  >
                    <Play className="h-4 w-4 mr-2 text-green-600" />
                    Start Process
                  </Button>
                </div>
                <div
                  draggable
                  onDragStart={(event) => onDragStart(event, NODE_TYPES.END)}
                  className="cursor-grab"
                >
                  <Button
                    variant="outline"
                    className="w-full justify-start border-red-300 bg-red-50 hover:bg-red-100"
                    onClick={() => onAddNode(NODE_TYPES.END)}
                  >
                    <Flag className="h-4 w-4 mr-2 text-red-600" />
                    End Process
                  </Button>
                </div>
              </div>
              
              <h3 className="text-sm font-medium mb-2">Recruitment Steps</h3>
              <div className="space-y-1.5">
                {Object.entries(NODE_TYPE_DETAILS)
                  .filter(([type]) => type !== NODE_TYPES.START && type !== NODE_TYPES.END)
                  .map(([type, details]) => {
                    const Icon = details.icon;
                    return (
                      <div
                        key={type}
                        draggable
                        onDragStart={(event) => onDragStart(event, type)}
                        className="cursor-grab"
                      >
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => onAddNode(type)}
                        >
                          <Icon className={`h-4 w-4 mr-2 ${details.color}`} />
                          {details.label}
                        </Button>
                      </div>
                    );
                  })}
              </div>
            </div>
            
            {/* Canvas Controls */}
            <div className="pt-3 border-t space-y-2">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={autoLayout}
              >
                <LayoutGrid className="h-4 w-4 mr-2" />
                Auto Layout
              </Button>
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={clearCanvas}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Canvas
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'prompt' && (
          <div className="p-4">
            <PromptPanel onFlowGenerated={handleFlowGenerated} />
          </div>
        )}

        {activeTab === 'history' && (
          <div className="p-4">
            <h3 className="text-sm font-medium mb-2">Action History</h3>
            {history.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No actions recorded yet</p>
            ) : (
              <div className="space-y-2">
                {history.map((item) => (
                  <div key={item.id} className="border rounded p-2 text-xs">
                    <div className="flex justify-between">
                      <span className="font-medium">{item.action}</span>
                      <span className="text-gray-500">
                        {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-1">{item.details}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'json' && <JsonViewer />}
      </div>
    </div>
  );
}