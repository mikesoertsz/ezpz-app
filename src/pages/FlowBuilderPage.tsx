import React, { useState, useCallback, useRef, DragEvent, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Panel,
  NodeTypes,
  ReactFlowProvider,
  useReactFlow,
  Edge,
  Connection,
  useOnSelectionChange,
  useKeyPress
} from 'reactflow';
import { Plus, ArrowLeft, Check, X, Save } from 'lucide-react';
import { toast } from 'sonner';
import 'reactflow/dist/style.css';

import { useStore } from '@/store/flowStore';
import RecruitmentNode from '@/components/RecruitmentNode';
import Sidebar from '@/components/Sidebar';
import NodeEditPanel from '@/components/NodeEditPanel';
import { NODE_TYPES } from '@/types/nodes';
import { FlowsTable, Flow } from '@/components/FlowsTable';
import { flowService } from '@/services/flowService';
import { Button } from '@/components/ui/button';

function FlowWithProvider() {
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [flows, setFlows] = useState<Flow[]>([]);
  const [activeFlow, setActiveFlow] = useState<Flow | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const deleteKeyPressed = useKeyPress('Delete');
  const backspaceKeyPressed = useKeyPress('Backspace');
  const autoSaveTimerRef = useRef<NodeJS.Timeout>();
  
  const { 
    nodes, 
    edges, 
    onNodesChange, 
    onEdgesChange, 
    onConnect,
    addNode,
    deleteEdge,
    insertNodeOnEdge,
    setNodes,
    setEdges,
    clearCanvas,
    setActiveFlow: setActiveFlowInStore,
    saveFlow,
    cache
  } = useStore();
  
  const { project } = useReactFlow();

  useEffect(() => {
    loadFlows();
  }, []);

  // Auto-save effect
  useEffect(() => {
    if (cache.isDirty && cache.flowId) {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
      
      autoSaveTimerRef.current = setTimeout(() => {
        saveFlow().catch(console.error);
      }, 2000);
    }
    
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [cache.isDirty, cache.flowId, nodes, edges]);

  const loadFlows = async () => {
    try {
      setIsLoading(true);
      const data = await flowService.getFlows();
      setFlows(data);
    } catch (error) {
      console.error('Failed to load flows:', error);
      toast.error('Failed to load flows');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateFlow = async () => {
    try {
      const newFlow = await flowService.createFlow({
        name: 'New Flow',
        description: 'A new recruitment flow',
        schema: { nodes: [], edges: [] },
      });
      setFlows(prev => [newFlow, ...prev]);
      setActiveFlow(newFlow);
      setActiveFlowInStore(newFlow.id);
      clearCanvas();
      toast.success('Flow created successfully');
    } catch (error) {
      console.error('Failed to create flow:', error);
      toast.error('Failed to create flow');
    }
  };

  const handleEditFlow = async (flow: Flow) => {
    setActiveFlow(flow);
    setActiveFlowInStore(flow.id);
    if (flow.schema) {
      setNodes(flow.schema.nodes);
      setEdges(flow.schema.edges);
    }
  };

  const handleDeleteFlow = async (flow: Flow) => {
    try {
      await flowService.deleteFlow(flow.id);
      setFlows(prev => prev.filter(f => f.id !== flow.id));
      if (activeFlow?.id === flow.id) {
        setActiveFlow(null);
        setActiveFlowInStore(null);
        clearCanvas();
      }
      toast.success('Flow deleted successfully');
    } catch (error) {
      console.error('Failed to delete flow:', error);
      toast.error('Failed to delete flow');
    }
  };

  const handleEditNode = useCallback((nodeId: string) => {
    setEditingNodeId(nodeId);
  }, []);

  const startEditingName = () => {
    if (activeFlow) {
      setEditedName(activeFlow.name);
      setIsEditingName(true);
      setTimeout(() => nameInputRef.current?.focus(), 0);
    }
  };

  const handleNameSave = async () => {
    if (!activeFlow || !editedName.trim()) return;

    try {
      const updatedFlow = await flowService.updateFlow(activeFlow.id, {
        name: editedName.trim()
      });
      setActiveFlow(updatedFlow);
      setFlows(prev => prev.map(f => f.id === updatedFlow.id ? updatedFlow : f));
      setIsEditingName(false);
      toast.success('Flow name updated');
    } catch (error) {
      console.error('Failed to update flow name:', error);
      toast.error('Failed to update flow name');
    }
  };

  const nodeTypes: NodeTypes = {
    recruitmentNode: (props) => (
      <RecruitmentNode {...props} onEdit={handleEditNode} />
    ),
  };

  useOnSelectionChange({
    onChange: ({ edges }) => {
      if (edges.length === 1) {
        setSelectedEdge(edges[0]);
      } else {
        setSelectedEdge(null);
      }
    },
  });

  React.useEffect(() => {
    if ((deleteKeyPressed || backspaceKeyPressed) && selectedEdge) {
      deleteEdge(selectedEdge.id);
      setSelectedEdge(null);
    }
  }, [deleteKeyPressed, backspaceKeyPressed, selectedEdge, deleteEdge]);

  const handleAddNode = useCallback((type: string) => {
    const position = {
      x: Math.random() * 500,
      y: Math.random() * 500,
    };
    addNode(type, position);
  }, [addNode]);

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      if (!reactFlowWrapper.current) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');
      
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      
      const droppedOnEdge = edges.find(edge => {
        const sourceNode = nodes.find(node => node.id === edge.source);
        const targetNode = nodes.find(node => node.id === edge.target);
        
        if (!sourceNode || !targetNode) return false;
        
        const minX = Math.min(sourceNode.position.x, targetNode.position.x) - 50;
        const maxX = Math.max(sourceNode.position.x, targetNode.position.x) + 50;
        const minY = Math.min(sourceNode.position.y, targetNode.position.y) - 50;
        const maxY = Math.max(sourceNode.position.y, targetNode.position.y) + 50;
        
        return (
          position.x >= minX && 
          position.x <= maxX && 
          position.y >= minY && 
          position.y <= maxY
        );
      });
      
      if (droppedOnEdge) {
        insertNodeOnEdge(type, position, droppedOnEdge.id);
      } else {
        addNode(type, position);
      }
    },
    [project, addNode, nodes, edges, insertNodeOnEdge]
  );

  if (!activeFlow) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Recruitment Flows</h1>
          <Button onClick={handleCreateFlow} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create New Flow
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <FlowsTable
            flows={flows}
            onEdit={handleEditFlow}
            onDelete={handleDeleteFlow}
          />
        )}
      </div>
    );
  }

  return (
    <div className="h-full flex">
      {/* Left Sidebar */}
      <div className="w-[400px] border-r bg-white flex flex-col">
        {editingNodeId ? (
          <NodeEditPanel 
            nodeId={editingNodeId} 
            onClose={() => setEditingNodeId(null)} 
          />
        ) : (
          <Sidebar
            isOpen={true}
            onToggle={() => {}}
            onAddNode={handleAddNode}
          />
        )}
      </div>

      {/* Flow Canvas */}
      <div className="flex-1 relative" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onDragOver={onDragOver}
          onDrop={onDrop}
          fitView
          edgesFocusable={true}
          selectNodesOnDrag={false}
          defaultEdgeOptions={{
            type: 'smoothstep',
            animated: true,
            style: { strokeDasharray: '5,5' }
          }}
        >
          <Background />
          <Controls />
          
          {selectedEdge && (
            <Panel position="top-left" className="bg-white p-2 rounded shadow-md text-sm">
              <div className="flex items-center gap-2">
                <span>Selected edge: {selectedEdge.source} → {selectedEdge.target}</span>
                <button 
                  className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                  onClick={() => {
                    deleteEdge(selectedEdge.id);
                    setSelectedEdge(null);
                  }}
                >
                  Delete
                </button>
              </div>
            </Panel>
          )}

          {/* Save Status */}
          <Panel position="bottom-right" className="bg-white p-2 rounded shadow-md">
            <div className="flex items-center gap-2 text-sm">
              {cache.isDirty ? (
                <span className="text-orange-500">Unsaved changes...</span>
              ) : (
                <span className="text-green-500">All changes saved</span>
              )}
              <Button
                size="sm"
                variant="outline"
                className="h-7"
                onClick={() => saveFlow()}
                disabled={!cache.isDirty}
              >
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
            </div>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
}

const FlowBuilderPage = () => {
  return (
    <ReactFlowProvider>
      <FlowWithProvider />
    </ReactFlowProvider>
  );
};

export default FlowBuilderPage;