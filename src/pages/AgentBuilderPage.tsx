import React, { useState, useRef, useEffect } from 'react';
import { Bot, Settings, Database, Code, Play, Pause, Send, Paperclip, Image, X, Search, Heart, Star, Plus, ChevronDown, Filter, SortDesc, Users, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Agent types
interface Agent {
  id: string;
  name: string;
  description: string;
  creator: string;
  category: string;
  favorites: number;
  isActive: boolean;
  isFavorite: boolean;
  createdAt: string;
}

const AgentBuilderPage = () => {
  // State for different views
  const [activeView, setActiveView] = useState<'browse' | 'create' | 'my-agents'>('browse');
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'popular' | 'recent'>('popular');
  const [showFilters, setShowFilters] = useState(false);
  
  // Sample agents data
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: 'customer-support',
      name: 'Customer Support Agent',
      description: 'Handles customer inquiries and support tickets',
      creator: 'EZPZ Team',
      category: 'Support',
      favorites: 245,
      isActive: true,
      isFavorite: true,
      createdAt: '2023-09-15'
    },
    {
      id: 'sales-assistant',
      name: 'Sales Assistant',
      description: 'Helps qualify leads and answer product-related questions',
      creator: 'EZPZ Team',
      category: 'Sales',
      favorites: 189,
      isActive: false,
      isFavorite: false,
      createdAt: '2023-10-20'
    },
    {
      id: 'knowledge-base',
      name: 'Knowledge Base Agent',
      description: 'Retrieves information from your knowledge bases',
      creator: 'John Doe',
      category: 'Knowledge',
      favorites: 132,
      isActive: true,
      isFavorite: true,
      createdAt: '2023-11-05'
    },
    {
      id: 'recruitment-assistant',
      name: 'Recruitment Assistant',
      description: 'Helps screen candidates and schedule interviews',
      creator: 'Jane Smith',
      category: 'HR',
      favorites: 98,
      isActive: false,
      isFavorite: false,
      createdAt: '2024-01-10'
    },
    {
      id: 'content-writer',
      name: 'Content Writer',
      description: 'Generates blog posts, social media content, and marketing copy',
      creator: 'Marketing Team',
      category: 'Content',
      favorites: 176,
      isActive: false,
      isFavorite: false,
      createdAt: '2024-02-15'
    },
    {
      id: 'data-analyst',
      name: 'Data Analyst',
      description: 'Analyzes data and generates insights and visualizations',
      creator: 'Data Science Team',
      category: 'Analytics',
      favorites: 154,
      isActive: false,
      isFavorite: false,
      createdAt: '2024-03-01'
    }
  ]);
  
  // My agents (subset of all agents)
  const myAgents = agents.filter(agent => 
    agent.creator === 'John Doe' || agent.isFavorite
  );
  
  // Chat messages
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([
    {role: 'assistant', content: 'How can I help you build an AI agent today?'}
  ]);
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const dropzoneRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Filter and sort agents
  const filteredAgents = agents
    .filter(agent => {
      // Apply search filter
      const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           agent.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Apply category filter
      const matchesCategory = !categoryFilter || agent.category === categoryFilter;
      
      // For "My Agents" view, only show user's agents and favorites
      if (activeView === 'my-agents') {
        return matchesSearch && matchesCategory && (agent.creator === 'John Doe' || agent.isFavorite);
      }
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'popular') {
        return b.favorites - a.favorites;
      } else {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  
  // Get unique categories for filter
  const categories = Array.from(new Set(agents.map(agent => agent.category)));
  
  // Auto-resize textarea
  useEffect(() => {
    if (messageInputRef.current) {
      messageInputRef.current.style.height = 'auto';
      messageInputRef.current.style.height = `${messageInputRef.current.scrollHeight}px`;
    }
  }, [message]);
  
  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);
  
  // Handle file drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
    
    if (dropzoneRef.current) {
      dropzoneRef.current.classList.remove('bg-blue-50', 'border-blue-300');
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropzoneRef.current) {
      dropzoneRef.current.classList.add('bg-blue-50', 'border-blue-300');
    }
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropzoneRef.current) {
      dropzoneRef.current.classList.remove('bg-blue-50', 'border-blue-300');
    }
  };
  
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };
  
  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleSendMessage = () => {
    if (message.trim() === '' && files.length === 0) return;
    
    // Add user message to chat
    setChatMessages(prev => [...prev, {role: 'user', content: message}]);
    
    setIsSending(true);
    
    // Simulate AI response
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev, 
        {
          role: 'assistant', 
          content: "I'll help you build that agent. I've created a basic customer support agent template. You can customize it in the configuration panel on the right."
        }
      ]);
      setIsSending(false);
      setMessage('');
      setFiles([]);
      setActiveAgent('customer-support');
      setActiveView('create');
    }, 2000);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Toggle favorite status
  const toggleFavorite = (agentId: string) => {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId 
        ? { 
            ...agent, 
            isFavorite: !agent.isFavorite,
            favorites: agent.isFavorite ? agent.favorites - 1 : agent.favorites + 1
          } 
        : agent
    ));
  };
  
  // Render different views
  const renderBrowseView = () => (
    <div className="p-6 h-full flex flex-col">
      {/* Top Controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search agents..."
            className="pl-9 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
            Filters
            <ChevronDown className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => setSortBy(sortBy === 'popular' ? 'recent' : 'popular')}
          >
            <SortDesc className="h-4 w-4" />
            Sort: {sortBy === 'popular' ? 'Popular' : 'Recent'}
          </Button>
          
          <Button 
            variant="primary" 
            className="flex items-center gap-1"
            onClick={() => {
              setActiveView('create');
              setActiveAgent(null);
            }}
          >
            <Plus className="h-4 w-4" />
            Create New Agent
          </Button>
        </div>
      </div>
      
      {/* Filter options */}
      {showFilters && (
        <div className="mb-6 p-4 border rounded-md bg-gray-50">
          <h3 className="text-sm font-medium mb-3">Filter by Category</h3>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={categoryFilter === null ? "primary" : "outline"} 
              size="sm"
              onClick={() => setCategoryFilter(null)}
            >
              All
            </Button>
            {categories.map(category => (
              <Button 
                key={category}
                variant={categoryFilter === category ? "primary" : "outline"} 
                size="sm"
                onClick={() => setCategoryFilter(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      )}
      
      {/* Agent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAgents.map(agent => (
          <div key={agent.id} className="border rounded-lg hover:shadow-md transition-shadow">
            <div className="p-5">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                  <div className={`p-2 rounded-md ${
                    agent.category === 'Support' ? 'bg-blue-100 text-blue-600' :
                    agent.category === 'Sales' ? 'bg-green-100 text-green-600' :
                    agent.category === 'Knowledge' ? 'bg-purple-100 text-purple-600' :
                    agent.category === 'HR' ? 'bg-orange-100 text-orange-600' :
                    agent.category === 'Content' ? 'bg-pink-100 text-pink-600' :
                    'bg-gray-100 text-gray-600'
                  } mr-3`}>
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">{agent.name}</h3>
                    <p className="text-xs text-gray-500">{agent.category}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400"
                  onClick={() => toggleFavorite(agent.id)}
                >
                  <Heart className={`h-4 w-4 ${agent.isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
              </div>
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{agent.description}</p>
              
              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <div className="flex items-center">
                  <Users className="h-3.5 w-3.5 mr-1" />
                  <span>{agent.favorites} users</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  <span>Created {agent.createdAt}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                  By {agent.creator}
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setActiveAgent(agent.id);
                    setActiveView('create');
                  }}
                >
                  Configure
                </Button>
              </div>
            </div>
          </div>
        ))}
        
        {/* Create New Agent Card */}
        <div className="border rounded-lg border-dashed hover:shadow-md transition-shadow flex flex-col items-center justify-center p-8 text-center">
          <Bot className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="font-medium text-gray-700 mb-2">Create New Agent</h3>
          <p className="text-sm text-gray-500 mb-4">Build a custom AI agent from scratch</p>
          <Button 
            variant="outline"
            onClick={() => {
              setActiveView('create');
              setActiveAgent(null);
            }}
          >
            Get Started
          </Button>
        </div>
      </div>
      
      {filteredAgents.length === 0 && (
        <div className="text-center py-12">
          <Bot className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No agents found</h3>
          <p className="text-gray-500 mb-6">
            Try adjusting your search or filters, or create a new agent
          </p>
          <Button
            onClick={() => {
              setActiveView('create');
              setActiveAgent(null);
            }}
          >
            Create New Agent
          </Button>
        </div>
      )}
    </div>
  );
  
  const renderMyAgentsView = () => (
    <div className="p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">My Agents</h2>
        <Button 
          variant="primary" 
          className="flex items-center gap-1"
          onClick={() => {
            setActiveView('create');
            setActiveAgent(null);
          }}
        >
          <Plus className="h-4 w-4" />
          Create New Agent
        </Button>
      </div>
      
      {/* Active Agents */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Active Agents</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myAgents.filter(agent => agent.isActive).map(agent => (
            <div key={agent.id} className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
              <div className="flex items-center mb-3">
                <div className={`p-2 rounded-md ${
                  agent.category === 'Support' ? 'bg-blue-100 text-blue-600' :
                  agent.category === 'Sales' ? 'bg-green-100 text-green-600' :
                  agent.category === 'Knowledge' ? 'bg-purple-100 text-purple-600' :
                  'bg-gray-100 text-gray-600'
                } mr-3`}>
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">{agent.name}</h3>
                  <div className="flex items-center text-xs text-gray-500">
                    <span className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      {agent.favorites}
                    </span>
                    <span className="mx-2">•</span>
                    <span>{agent.category}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">Active</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setActiveAgent(agent.id);
                    setActiveView('create');
                  }}
                >
                  Configure
                </Button>
              </div>
            </div>
          ))}
          
          {myAgents.filter(agent => agent.isActive).length === 0 && (
            <div className="col-span-full text-center py-8 border rounded-lg bg-gray-50">
              <p className="text-gray-500">No active agents</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Favorite Agents */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Favorite Agents</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myAgents.filter(agent => agent.isFavorite).map(agent => (
            <div key={agent.id} className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
              <div className="flex items-center mb-3">
                <div className={`p-2 rounded-md ${
                  agent.category === 'Support' ? 'bg-blue-100 text-blue-600' :
                  agent.category === 'Sales' ? 'bg-green-100 text-green-600' :
                  agent.category === 'Knowledge' ? 'bg-purple-100 text-purple-600' :
                  'bg-gray-100 text-gray-600'
                } mr-3`}>
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">{agent.name}</h3>
                  <div className="flex items-center text-xs text-gray-500">
                    <span>By {agent.creator}</span>
                    <span className="mx-2">•</span>
                    <span>{agent.category}</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-500 ml-auto"
                  onClick={() => toggleFavorite(agent.id)}
                >
                  <Heart className="h-4 w-4 fill-red-500" />
                </Button>
              </div>
              
              <div className="flex justify-between items-center">
                <span className={`text-xs px-2 py-1 ${agent.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'} rounded-full`}>
                  {agent.isActive ? 'Active' : 'Inactive'}
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setActiveAgent(agent.id);
                    setActiveView('create');
                  }}
                >
                  Configure
                </Button>
              </div>
            </div>
          ))}
          
          {myAgents.filter(agent => agent.isFavorite).length === 0 && (
            <div className="col-span-full text-center py-8 border rounded-lg bg-gray-50">
              <p className="text-gray-500">No favorite agents</p>
              <Button 
                variant="outline" 
                size="sm"
                className="mt-4"
                onClick={() => setActiveView('browse')}
              >
                Browse Agents
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Draft Agents */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Draft Agents</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myAgents.filter(agent => agent.creator === 'John Doe' && !agent.isActive).map(agent => (
            <div key={agent.id} className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
              <div className="flex items-center mb-3">
                <div className={`p-2 rounded-md ${
                  agent.category === 'Support' ? 'bg-blue-100 text-blue-600' :
                  agent.category === 'Sales' ? 'bg-green-100 text-green-600' :
                  agent.category === 'Knowledge' ? 'bg-purple-100 text-purple-600' :
                  'bg-gray-100 text-gray-600'
                } mr-3`}>
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">{agent.name}</h3>
                  <p className="text-xs text-gray-500">{agent.category}</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">Draft</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setActiveAgent(agent.id);
                    setActiveView('create');
                  }}
                >
                  Edit
                </Button>
              </div>
            </div>
          ))}
          
          {/* Create New Agent Card */}
          <div className="border rounded-lg border-dashed hover:shadow-md transition-shadow flex flex-col items-center justify-center p-6 text-center">
            <Plus className="h-8 w-8 text-gray-300 mb-3" />
            <h3 className="font-medium text-gray-700 mb-1">New Agent</h3>
            <p className="text-xs text-gray-500 mb-3">Create from scratch</p>
            <Button 
              variant="outline"
              size="sm"
              onClick={() => {
                setActiveView('create');
                setActiveAgent(null);
              }}
            >
              Create
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
  
  const renderCreateView = () => (
    <div className="h-full grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left Column - Chat Interface */}
      <div className="flex flex-col bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Agent Builder Assistant</h2>
          <p className="text-sm text-gray-500">Describe the agent you want to build</p>
        </div>
        
        {/* Chat Messages */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {chatMessages.map((msg, index) => (
            <div 
              key={index} 
              className={`max-w-[80%] p-3 rounded-lg ${
                msg.role === 'user' 
                  ? 'bg-blue-500 text-white ml-auto rounded-br-none' 
                  : 'bg-gray-100 text-gray-800 rounded-bl-none'
              }`}
            >
              <p className="text-sm">{msg.content}</p>
            </div>
          ))}
          
          {isSending && (
            <div className="bg-gray-100 text-gray-800 p-3 rounded-lg rounded-bl-none max-w-[80%] animate-pulse">
              <div className="flex space-x-2">
                <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          )}
        </div>
        
        {/* File attachments */}
        {files.length > 0 && (
          <div className="px-4 py-2 border-t bg-gray-50">
            <div className="text-xs font-medium mb-1">Attachments ({files.length})</div>
            <div className="flex flex-wrap gap-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center bg-white px-2 py-1 rounded border text-xs">
                  <span className="truncate max-w-[120px]">{file.name}</span>
                  <button 
                    className="ml-1 text-gray-500 hover:text-red-500"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Message Input */}
        <div 
          ref={dropzoneRef}
          className="border-t p-4 relative"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <textarea
            ref={messageInputRef}
            className="w-full p-3 pr-24 text-sm rounded-md border resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[60px] max-h-[150px]"
            placeholder="Describe the agent you want to build..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          
          {/* Action buttons */}
          <div className="absolute bottom-7 right-7 flex items-center">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleFileInputChange}
              multiple
            />
            <input 
              type="file" 
              ref={imageInputRef} 
              className="hidden" 
              onChange={handleFileInputChange}
              accept="image/*"
              multiple
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-gray-400 hover:text-gray-600"
              onClick={() => fileInputRef.current?.click()}
              title="Attach file"
            >
              <Paperclip className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-gray-400 hover:text-gray-600"
              onClick={() => imageInputRef.current?.click()}
              title="Attach image"
            >
              <Image className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant={isSending ? "secondary" : "primary"}
              size="icon"
              className={`h-6 w-6 ${isSending ? 'animate-pulse' : ''}`}
              onClick={handleSendMessage}
              disabled={isSending}
              title={isSending ? "Processing..." : "Send message"}
            >
              <Send className="h-3.5 w-3.5" />
            </Button>
          </div>
          
          {/* Dropzone hint */}
          {files.length === 0 && (
            <div className="px-3 pb-2 text-xs text-gray-500 text-center">
              Drop files here to attach
            </div>
          )}
        </div>
      </div>
      
      {/* Right Column - Agent Configuration */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Agent Configuration</h2>
          <p className="text-sm text-gray-500">
            {activeAgent 
              ? "Configure your agent's capabilities and settings" 
              : "Describe your agent in the chat to get started"}
          </p>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {activeAgent ? (
            <div className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Agent Name
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  defaultValue="Customer Support Agent"
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 h-20"
                  defaultValue="An agent that can handle customer inquiries and support tickets."
                />
              </div>
              
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Knowledge Bases</h3>
                <div className="space-y-2">
                  <div className="flex items-center p-3 border rounded-md bg-gray-50">
                    <input type="checkbox" className="mr-3" defaultChecked />
                    <div>
                      <p className="text-sm font-medium">Product Documentation</p>
                      <p className="text-xs text-gray-500">Technical documentation for our products</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 border rounded-md">
                    <input type="checkbox" className="mr-3" />
                    <div>
                      <p className="text-sm font-medium">Marketing Materials</p>
                      <p className="text-xs text-gray-500">Brand guidelines and marketing assets</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-1">
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Add Knowledge Base
                  </Button>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Capabilities</h3>
                <div className="space-y-2">
                  <div className="flex items-center p-3 border rounded-md">
                    <input type="checkbox" className="mr-3" defaultChecked />
                    <div>
                      <p className="text-sm font-medium">Answer Questions</p>
                      <p className="text-xs text-gray-500">Respond to customer inquiries</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 border rounded-md">
                    <input type="checkbox" className="mr-3" defaultChecked />
                    <div>
                      <p className="text-sm font-medium">Create Tickets</p>
                      <p className="text-xs text-gray-500">Generate support tickets from conversations</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 border rounded-md">
                    <input type="checkbox" className="mr-3" />
                    <div>
                      <p className="text-sm font-medium">Process Refunds</p>
                      <p className="text-xs text-gray-500">Handle customer refund requests</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Model Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Base Model
                    </label>
                    <select className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm">
                      <option>GPT-4</option>
                      <option>GPT-3.5 Turbo</option>
                      <option>Claude 3 Opus</option>
                      <option>Claude 3 Sonnet</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Temperature
                    </label>
                    <input 
                      type="range" 
                      min="0" 
                      max="1" 
                      step="0.1" 
                      defaultValue="0.7"
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Precise</span>
                      <span>Balanced</span>
                      <span>Creative</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline">
                  Save Draft
                </Button>
                <Button>
                  <Play className="h-4 w-4 mr-2" />
                  Deploy Agent
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <Bot className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium mb-2">No Agent Selected</h3>
              <p className="text-gray-500 mb-6 max-w-md">
                Describe the agent you want to build in the chat on the left, or choose from our templates below
              </p>
              <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                <Button 
                  variant="outline" 
                  className="flex flex-col h-auto py-4 px-2"
                  onClick={() => setActiveAgent('customer-support')}
                >
                  <Bot className="h-8 w-8 text-blue-500 mb-2" />
                  <span className="text-sm">Customer Support</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex flex-col h-auto py-4 px-2"
                  onClick={() => setActiveAgent('sales-assistant')}
                >
                  <Bot className="h-8 w-8 text-green-500 mb-2" />
                  <span className="text-sm">Sales Assistant</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex flex-col h-auto py-4 px-2"
                  onClick={() => setActiveAgent('knowledge-base')}
                >
                  <Bot className="h-8 w-8 text-purple-500 mb-2" />
                  <span className="text-sm">Knowledge Base</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex flex-col h-auto py-4 px-2"
                  onClick={() => setActiveAgent('custom-agent')}
                >
                  <Bot className="h-8 w-8 text-orange-500 mb-2" />
                  <span className="text-sm">Custom Agent</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      {/* View Tabs */}
      <div className="bg-white border-b">
        <div className="flex border-b">
          <button
            className={`py-3 px-6 text-sm font-medium flex items-center gap-1
              ${activeView === 'browse' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveView('browse')}
          >
            <Search className="h-4 w-4" />
            Browse Agents
          </button>
          <button
            className={`py-3 px-6 text-sm font-medium flex items-center gap-1
              ${activeView === 'my-agents' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveView('my-agents')}
          >
            <Star className="h-4 w-4" />
            My Agents
          </button>
          <button
            className={`py-3 px-6 text-sm font-medium flex items-center gap-1
              ${activeView === 'create' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveView('create')}
          >
            <Plus className="h-4 w-4" />
            Create Agent
          </button>
        </div>
      </div>
      
      {/* View Content */}
      <div className="flex-1 overflow-y-auto">
        {activeView === 'browse' && renderBrowseView()}
        {activeView === 'my-agents' && renderMyAgentsView()}
        {activeView === 'create' && renderCreateView()}
      </div>
    </div>
  );
};

export default AgentBuilderPage;