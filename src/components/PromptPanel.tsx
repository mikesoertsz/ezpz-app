import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { aiService } from '@/services/aiService';
import { toast } from 'sonner';

interface PromptPanelProps {
  onFlowGenerated: (nodes: any[], edges: any[]) => void;
}

export const PromptPanel: React.FC<PromptPanelProps> = ({ onFlowGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [prompt]);

  const handleSubmit = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      const result = await aiService.generateFlow(prompt);
      onFlowGenerated(result.nodes, result.edges);
      setPrompt('');
      toast.success('Flow generated successfully');
    } catch (error) {
      toast.error('Failed to generate flow', {
        description: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-medium mb-1">AI Flow Generator</h3>
        <p className="text-xs text-gray-500">
          Describe the recruitment flow you want to create, and AI will generate it for you.
        </p>
      </div>
      
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g., Create a recruitment flow for hiring software developers..."
          className="w-full p-3 pr-12 text-sm border rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[100px]"
          disabled={isGenerating}
        />
        
        <Button
          variant={isGenerating ? "secondary" : "primary"}
          size="sm"
          className={`absolute bottom-3 right-3 h-7 ${isGenerating ? 'animate-pulse' : ''}`}
          onClick={handleSubmit}
          disabled={isGenerating || !prompt.trim()}
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>

      {isGenerating && (
        <div className="text-sm text-gray-500 animate-pulse">
          Generating flow...
        </div>
      )}
    </div>
  );
}