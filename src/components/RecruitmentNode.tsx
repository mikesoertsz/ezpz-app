import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { MoreHorizontal, Trash2, Edit, Copy } from 'lucide-react';
import { Button } from './ui/button';
import { NODE_TYPE_DETAILS, NODE_TYPES } from '@/types/nodes';
import { NodeData, useStore } from '@/store/flowStore';
import { NodeEditSheet } from './NodeEditSheet';
import { toast } from 'sonner';

interface RecruitmentNodeProps extends NodeProps<NodeData> {}

const RecruitmentNode = ({ data, isConnectable, id }: RecruitmentNodeProps) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const typeDetails = NODE_TYPE_DETAILS[data.type];
  const Icon = typeDetails.icon;
  const deleteNode = useStore((state) => state.deleteNode);
  const updateNodeData = useStore((state) => state.updateNodeData);
  const addNode = useStore((state) => state.addNode);

  console.log('Rendering node:', id, 'with data:', data);

  const handleDelete = (e: React.MouseEvent) => {
    console.log('Delete button clicked for node:', id);
    e.preventDefault();
    e.stopPropagation();
    deleteNode(id);
    toast.success('Node deleted');
  };
  
  const handleEdit = (e: React.MouseEvent) => {
    console.log('Edit button clicked for node:', id);
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleCopy = (e: React.MouseEvent) => {
    console.log('Copy button clicked for node:', id);
    e.preventDefault();
    e.stopPropagation();
    
    // Add the new node at an offset from the current node's position
    const position = {
      x: data.position?.x + 100 || 100,
      y: data.position?.y + 100 || 100
    };
    
    addNode(data.type, position);
    toast.success('Node copied');
  };

  const handleSave = (updatedData: Partial<NodeData>) => {
    console.log('Saving node:', id, 'with data:', updatedData);
    updateNodeData(id, updatedData);
    setIsEditing(false);
    toast.success('Node updated');
  };

  // Special styling for start and end nodes
  const isSpecialNode = data.type === NODE_TYPES.START || data.type === NODE_TYPES.END;
  const nodeClass = isSpecialNode 
    ? `bg-${data.type === NODE_TYPES.START ? 'green' : 'red'}-50 border-${data.type === NODE_TYPES.START ? 'green' : 'red'}-300` 
    : 'bg-white border-gray-200';

  return (
    <>
      <div 
        className={`rounded-lg shadow-md p-3 min-w-[240px] border ${nodeClass} relative`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Only show target handle if not a start node */}
        {data.type !== NODE_TYPES.START && (
          <Handle
            type="target"
            position={Position.Top}
            isConnectable={isConnectable}
            className="w-2 h-2 !bg-gray-400"
          />
        )}
        
        <div className="flex items-start gap-2">
          <div className={`p-1.5 rounded-md ${typeDetails.color} bg-opacity-10`}>
            <Icon className={`h-4 w-4 ${typeDetails.color}`} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center gap-2">
              <div>
                <h3 className="font-medium text-sm truncate">{data.label}</h3>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{data.description}</p>
              </div>
            </div>
            
            {Object.entries(data.params).length > 0 && (
              <div className="mt-2 pt-2 border-t border-gray-100">
                {Object.entries(data.params).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2 text-xs">
                    <span className="font-medium text-gray-600">{key}:</span>
                    <span className="text-gray-500 truncate">{value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Action buttons at the bottom */}
        <div className="mt-3 pt-2 border-t border-gray-200 flex justify-end gap-1 relative z-10">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            onClick={handleEdit}
            type="button"
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            onClick={handleCopy}
            type="button"
          >
            <Copy className="h-3 w-3" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            type="button"
          >
            <MoreHorizontal className="h-3 w-3" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={handleDelete}
            type="button"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
        
        {/* Only show source handle if not an end node */}
        {data.type !== NODE_TYPES.END && (
          <Handle
            type="source"
            position={Position.Bottom}
            isConnectable={isConnectable}
            className="w-2 h-2 !bg-gray-400"
          />
        )}
      </div>

      <NodeEditSheet
        open={isEditing}
        onOpenChange={setIsEditing}
        node={data}
        onSave={handleSave}
      />
    </>
  );
};

export default memo(RecruitmentNode);