import React, { useEffect, useState } from 'react';
import { X, Save } from 'lucide-react';
import { Button } from './ui/button';
import { NodeData, useStore } from '@/store/flowStore';
import { NODE_TYPE_DETAILS, NODE_TYPES } from '@/types/nodes';

interface NodeEditPanelProps {
  nodeId: string;
  onClose: () => void;
}

const NodeEditPanel: React.FC<NodeEditPanelProps> = ({ nodeId, onClose }) => {
  const nodes = useStore(state => state.nodes);
  const updateNodeData = useStore(state => state.updateNodeData);
  const node = nodes.find(n => n.id === nodeId);
  
  const [formData, setFormData] = useState<NodeData | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  
  useEffect(() => {
    if (node) {
      setFormData(node.data);
    }
  }, [node]);
  
  if (!node || !formData) return null;
  
  const handleChange = (field: string, value: string) => {
    setFormData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [field]: value
      };
    });
    setIsDirty(true);
    
    // Auto-save after a short delay
    const timeoutId = setTimeout(() => {
      if (formData) {
        updateNodeData(nodeId, { [field]: value });
        setIsDirty(false);
      }
    }, 500);
    
    return () => clearTimeout(timeoutId);
  };
  
  const handleParamChange = (param: string, value: string) => {
    setFormData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        params: {
          ...prev.params,
          [param]: value
        }
      };
    });
    setIsDirty(true);
    
    // Auto-save after a short delay
    const timeoutId = setTimeout(() => {
      if (formData) {
        updateNodeData(nodeId, {
          params: {
            ...formData.params,
            [param]: value
          }
        });
        setIsDirty(false);
      }
    }, 500);
    
    return () => clearTimeout(timeoutId);
  };
  
  const handleSave = () => {
    if (formData) {
      updateNodeData(nodeId, formData);
      setIsDirty(false);
    }
  };
  
  const renderNodeSpecificFields = () => {
    switch (formData.type) {
      case NODE_TYPES.SEND_EMAIL:
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Template
              </label>
              <select
                className="w-full p-2 border rounded-md"
                value={formData.params.template || ''}
                onChange={(e) => handleParamChange('template', e.target.value)}
              >
                <option value="">Select a template</option>
                <option value="welcome">Welcome Email</option>
                <option value="interview">Interview Invitation</option>
                <option value="offer">Job Offer</option>
                <option value="rejection">Rejection</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject Line
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={formData.params.subject || ''}
                onChange={(e) => handleParamChange('subject', e.target.value)}
                placeholder="Enter email subject"
              />
            </div>
          </>
        );
      
      case NODE_TYPES.MAKE_CALL:
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Call Script
              </label>
              <textarea
                className="w-full p-2 border rounded-md h-32"
                value={formData.params.script || ''}
                onChange={(e) => handleParamChange('script', e.target.value)}
                placeholder="Enter call script"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expected Duration (minutes)
              </label>
              <input
                type="number"
                className="w-full p-2 border rounded-md"
                value={formData.params.duration || ''}
                onChange={(e) => handleParamChange('duration', e.target.value)}
                min="1"
                max="60"
              />
            </div>
          </>
        );
      
      case NODE_TYPES.REVIEW_APPLICATION:
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Review Criteria
              </label>
              <textarea
                className="w-full p-2 border rounded-md h-32"
                value={formData.params.criteria || ''}
                onChange={(e) => handleParamChange('criteria', e.target.value)}
                placeholder="Enter review criteria"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assigned Reviewer
              </label>
              <select
                className="w-full p-2 border rounded-md"
                value={formData.params.reviewer || ''}
                onChange={(e) => handleParamChange('reviewer', e.target.value)}
              >
                <option value="">Select reviewer</option>
                <option value="hr_team">HR Team</option>
                <option value="hiring_manager">Hiring Manager</option>
                <option value="tech_lead">Tech Lead</option>
                <option value="department_head">Department Head</option>
              </select>
            </div>
          </>
        );
      
      case NODE_TYPES.DECISION:
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Decision Conditions
              </label>
              <textarea
                className="w-full p-2 border rounded-md h-32"
                value={formData.params.conditions || ''}
                onChange={(e) => handleParamChange('conditions', e.target.value)}
                placeholder="Enter decision conditions"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Possible Outcomes
              </label>
              <textarea
                className="w-full p-2 border rounded-md h-32"
                value={formData.params.outcomes || ''}
                onChange={(e) => handleParamChange('outcomes', e.target.value)}
                placeholder="Enter possible outcomes"
              />
            </div>
          </>
        );
      
      case NODE_TYPES.NOTIFICATION:
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notification Message
              </label>
              <textarea
                className="w-full p-2 border rounded-md h-32"
                value={formData.params.message || ''}
                onChange={(e) => handleParamChange('message', e.target.value)}
                placeholder="Enter notification message"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Urgency Level
              </label>
              <select
                className="w-full p-2 border rounded-md"
                value={formData.params.urgency || ''}
                onChange={(e) => handleParamChange('urgency', e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </>
        );
      
      case NODE_TYPES.COLLECT_DATA:
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Required Fields
              </label>
              <textarea
                className="w-full p-2 border rounded-md h-32"
                value={formData.params.required || ''}
                onChange={(e) => handleParamChange('required', e.target.value)}
                placeholder="Enter required fields (one per line)"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Optional Fields
              </label>
              <textarea
                className="w-full p-2 border rounded-md h-32"
                value={formData.params.fields || ''}
                onChange={(e) => handleParamChange('fields', e.target.value)}
                placeholder="Enter optional fields (one per line)"
              />
            </div>
          </>
        );
      
      case NODE_TYPES.SEND_WHATSAPP:
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message Template
              </label>
              <select
                className="w-full p-2 border rounded-md"
                value={formData.params.template || ''}
                onChange={(e) => handleParamChange('template', e.target.value)}
              >
                <option value="">Select a template</option>
                <option value="welcome">Welcome Message</option>
                <option value="interview">Interview Details</option>
                <option value="reminder">Reminder</option>
                <option value="followup">Follow-up</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Custom Message
              </label>
              <textarea
                className="w-full p-2 border rounded-md h-32"
                value={formData.params.message || ''}
                onChange={(e) => handleParamChange('message', e.target.value)}
                placeholder="Enter custom message"
              />
            </div>
          </>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="font-semibold">Edit Node</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Node Type
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded-md bg-gray-50"
            value={NODE_TYPE_DETAILS[formData.type].label}
            disabled
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Label
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            value={formData.label}
            onChange={(e) => handleChange('label', e.target.value)}
            placeholder="Enter node label"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            className="w-full p-2 border rounded-md h-24"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Enter node description"
          />
        </div>
        
        {renderNodeSpecificFields()}
      </div>
      
      <div className="p-4 border-t">
        <Button 
          className="w-full"
          onClick={handleSave}
          disabled={!isDirty}
        >
          <Save className="h-4 w-4 mr-2" />
          {isDirty ? 'Save Changes' : 'Saved'}
        </Button>
      </div>
    </div>
  );
};

export default NodeEditPanel;