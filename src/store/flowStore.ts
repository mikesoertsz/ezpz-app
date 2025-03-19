import { createWithEqualityFn } from 'zustand/traditional';
import {
  Node,
  Edge,
  Connection,
  addEdge,
  MarkerType,
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';
import { NodeType, NODE_TYPES } from '@/types/nodes';
import { flowService } from '@/services/flowService';
import { toast } from 'sonner';

export interface NodeData {
  type: NodeType;
  label: string;
  description: string;
  params: Record<string, string>;
  position?: { x: number; y: number };
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  action: string;
  details: string;
}

interface FlowCache {
  flowId: string | null;
  lastSaved: number;
  isDirty: boolean;
}

type RFState = {
  nodes: Node<NodeData>[];
  edges: Edge[];
  history: HistoryItem[];
  flowName: string;
  cache: FlowCache;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (type: NodeType, position: { x: number; y: number }) => void;
  updateNodeData: (nodeId: string, data: Partial<NodeData>) => void;
  deleteNode: (nodeId: string) => void;
  deleteEdge: (edgeId: string) => void;
  clearCanvas: () => void;
  addHistoryItem: (action: string, details: string) => void;
  insertNodeOnEdge: (type: NodeType, position: { x: number; y: number }, edgeId: string) => void;
  updateFlowName: (name: string) => void;
  autoLayout: () => void;
  setNodes: (nodes: Node<NodeData>[]) => void;
  setEdges: (edges: Edge[]) => void;
  setActiveFlow: (flowId: string | null) => void;
  saveFlow: () => Promise<void>;
};

const initialNodes: Node<NodeData>[] = [
  {
    id: 'start-node',
    type: 'recruitmentNode',
    position: { x: 250, y: 50 },
    data: {
      type: NODE_TYPES.START,
      label: 'Start Recruitment',
      description: 'Begin the recruitment process',
      params: {}
    },
  },
  {
    id: '1',
    type: 'recruitmentNode',
    position: { x: 250, y: 200 },
    data: {
      type: NODE_TYPES.REVIEW_APPLICATION,
      label: 'Initial Screening',
      description: 'Review candidate application and documents',
      params: {
        criteria: 'Experience > 2 years',
        reviewer: 'HR Team'
      }
    },
  }
];

const initialEdges: Edge[] = [
  {
    id: 'e-start-1',
    source: 'start-node',
    target: '1',
    type: 'smoothstep',
    animated: true,
    style: { strokeDasharray: '5,5' },
    markerEnd: { type: MarkerType.ArrowClosed },
  }
];

export const useStore = createWithEqualityFn<RFState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  history: [],
  flowName: "Developer Recruitment Flow",
  cache: {
    flowId: null,
    lastSaved: Date.now(),
    isDirty: false
  },
  onNodesChange: (changes) => {
    set((state) => {
      const newNodes = applyNodeChanges(changes, state.nodes);
      return {
        nodes: newNodes,
        cache: {
          ...state.cache,
          isDirty: true,
          lastSaved: Date.now()
        }
      };
    });
  },
  onEdgesChange: (changes) => {
    set((state) => {
      const newEdges = applyEdgeChanges(changes, state.edges);
      return {
        edges: newEdges,
        cache: {
          ...state.cache,
          isDirty: true,
          lastSaved: Date.now()
        }
      };
    });
  },
  onConnect: (connection) => {
    set((state) => {
      const newEdges = addEdge({
        ...connection,
        type: 'smoothstep',
        animated: true,
        style: { strokeDasharray: '5,5' },
        markerEnd: { type: MarkerType.ArrowClosed },
      }, state.edges);
      
      get().addHistoryItem('Connect Nodes', `Connected nodes ${connection.source} → ${connection.target}`);
      
      return {
        edges: newEdges,
        cache: {
          ...state.cache,
          isDirty: true,
          lastSaved: Date.now()
        }
      };
    });
  },
  addNode: (type, position) => {
    const newNode: Node<NodeData> = {
      id: `${Date.now()}`,
      type: 'recruitmentNode',
      position,
      data: {
        type,
        label: 'New Step',
        description: 'Add a description',
        params: {},
        position
      },
    };
    
    set((state) => {
      const updatedNodes = [...state.nodes, newNode];
      state.addHistoryItem('Add Node', `Added ${NODE_TYPES[type]} node`);
      return {
        nodes: updatedNodes,
        cache: {
          ...state.cache,
          isDirty: true,
          lastSaved: Date.now()
        }
      };
    });
  },
  updateNodeData: (nodeId, data) => {
    set((state) => ({
      nodes: state.nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              ...data,
              position: node.position
            }
          };
        }
        return node;
      }),
      cache: {
        ...state.cache,
        isDirty: true,
        lastSaved: Date.now()
      }
    }));
  },
  deleteNode: (nodeId) => {
    set((state) => {
      const nodeToDelete = state.nodes.find(node => node.id === nodeId);
      const nodeType = nodeToDelete ? nodeToDelete.data.type : 'unknown';
      
      state.addHistoryItem('Delete Node', `Deleted ${nodeType} node`);
      
      return {
        nodes: state.nodes.filter((node) => node.id !== nodeId),
        edges: state.edges.filter(
          (edge) => edge.source !== nodeId && edge.target !== nodeId
        ),
        cache: {
          ...state.cache,
          isDirty: true,
          lastSaved: Date.now()
        }
      };
    });
  },
  deleteEdge: (edgeId) => {
    set((state) => {
      const edgeToDelete = state.edges.find(edge => edge.id === edgeId);
      if (edgeToDelete) {
        state.addHistoryItem('Delete Edge', `Deleted edge from ${edgeToDelete.source} → ${edgeToDelete.target}`);
      }
      
      return {
        edges: state.edges.filter((edge) => edge.id !== edgeId),
        cache: {
          ...state.cache,
          isDirty: true,
          lastSaved: Date.now()
        }
      };
    });
  },
  clearCanvas: () => {
    set((state) => {
      state.addHistoryItem('Clear Canvas', 'Removed all nodes and edges');
      return {
        nodes: [],
        edges: [],
        cache: {
          ...state.cache,
          isDirty: true,
          lastSaved: Date.now()
        }
      };
    });
  },
  addHistoryItem: (action, details) => {
    set((state) => ({
      history: [
        {
          id: `history-${Date.now()}`,
          timestamp: Date.now(),
          action,
          details
        },
        ...state.history
      ].slice(0, 50) // Keep only the last 50 items
    }));
  },
  insertNodeOnEdge: (type, position, edgeId) => {
    const state = get();
    const edge = state.edges.find((e) => e.id === edgeId);
    
    if (!edge) return;
    
    const newNodeId = `${Date.now()}`;
    const newNode: Node<NodeData> = {
      id: newNodeId,
      type: 'recruitmentNode',
      position,
      data: {
        type,
        label: 'New Step',
        description: 'Add a description',
        params: {},
        position
      },
    };
    
    const newEdge1: Edge = {
      id: `e-${edge.source}-${newNodeId}`,
      source: edge.source,
      target: newNodeId,
      type: 'smoothstep',
      animated: true,
      style: { strokeDasharray: '5,5' },
      markerEnd: { type: MarkerType.ArrowClosed },
    };
    
    const newEdge2: Edge = {
      id: `e-${newNodeId}-${edge.target}`,
      source: newNodeId,
      target: edge.target,
      type: 'smoothstep',
      animated: true,
      style: { strokeDasharray: '5,5' },
      markerEnd: { type: MarkerType.ArrowClosed },
    };
    
    set((state) => {
      state.addHistoryItem('Insert Node', `Inserted ${NODE_TYPES[type]} node between ${edge.source} and ${edge.target}`);
      
      return {
        nodes: [...state.nodes, newNode],
        edges: [
          ...state.edges.filter((e) => e.id !== edgeId),
          newEdge1,
          newEdge2
        ],
        cache: {
          ...state.cache,
          isDirty: true,
          lastSaved: Date.now()
        }
      };
    });
  },
  updateFlowName: (name) => {
    set({ flowName: name });
  },
  autoLayout: () => {
    set((state) => {
      const nodeMap = new Map(state.nodes.map(node => [node.id, node]));
      const visited = new Set<string>();
      const levels = new Map<string, number>();
      
      const rootNodes = state.nodes.filter(node => 
        !state.edges.some(edge => edge.target === node.id)
      );
      
      const queue = rootNodes.map(node => ({ id: node.id, level: 0 }));
      while (queue.length > 0) {
        const { id, level } = queue.shift()!;
        if (visited.has(id)) continue;
        
        visited.add(id);
        levels.set(id, level);
        
        const outgoingEdges = state.edges.filter(edge => edge.source === id);
        outgoingEdges.forEach(edge => {
          queue.push({ id: edge.target, level: level + 1 });
        });
      }
      
      const VERTICAL_SPACING = 150;
      const HORIZONTAL_SPACING = 300;
      const nodesAtLevel = new Map<number, number>();
      
      const updatedNodes = state.nodes.map(node => {
        const level = levels.get(node.id) || 0;
        const nodesInLevel = Array.from(levels.entries())
          .filter(([_, l]) => l === level).length;
        const position = nodesAtLevel.get(level) || 0;
        nodesAtLevel.set(level, position + 1);
        
        const x = (position - (nodesInLevel - 1) / 2) * HORIZONTAL_SPACING + 500;
        const y = level * VERTICAL_SPACING + 50;
        
        return {
          ...node,
          position: { x, y },
          data: {
            ...node.data,
            position: { x, y }
          }
        };
      });
      
      state.addHistoryItem('Auto Layout', 'Automatically arranged nodes');
      
      return {
        nodes: updatedNodes,
        cache: {
          ...state.cache,
          isDirty: true,
          lastSaved: Date.now()
        }
      };
    });
  },
  setNodes: (nodes) => set((state) => ({
    nodes: nodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        position: node.position
      }
    })),
    cache: {
      ...state.cache,
      isDirty: true,
      lastSaved: Date.now()
    }
  })),
  setEdges: (edges) => set((state) => ({
    edges,
    cache: {
      ...state.cache,
      isDirty: true,
      lastSaved: Date.now()
    }
  })),
  setActiveFlow: (flowId) => set((state) => ({
    cache: {
      ...state.cache,
      flowId,
      isDirty: false,
      lastSaved: Date.now()
    }
  })),
  saveFlow: async () => {
    const state = get();
    const { flowId, isDirty } = state.cache;
    
    if (!flowId || !isDirty) return;

    try {
      await flowService.saveFlowSchema(flowId, state.nodes, state.edges);
      set((state) => ({
        cache: {
          ...state.cache,
          isDirty: false,
          lastSaved: Date.now()
        }
      }));
      toast.success('Flow saved successfully');
    } catch (error) {
      console.error('Failed to save flow:', error);
      toast.error('Failed to save flow');
      throw error;
    }
  }
}), Object.is);