import React, { useState, useRef } from 'react';
import { 
  Plus, 
  FolderPlus, 
  Upload, 
  Search, 
  Filter, 
  SortDesc, 
  MoreVertical, 
  File, 
  Trash2, 
  Edit,
  X,
  Check,
  FileText,
  FileImage,
  FileCode
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface KnowledgeBase {
  id: string;
  name: string;
  description: string;
  files: KnowledgeFile[];
  createdAt: string;
  updatedAt: string;
}

interface KnowledgeFile {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
}

const KnowledgeBasePage = () => {
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([
    {
      id: '1',
      name: 'Product Documentation',
      description: 'Technical documentation for our products',
      files: [
        { id: '1-1', name: 'API Reference.pdf', type: 'pdf', size: '2.4 MB', uploadedAt: '2023-09-15' },
        { id: '1-2', name: 'User Guide.docx', type: 'docx', size: '1.8 MB', uploadedAt: '2023-09-10' },
      ],
      createdAt: '2023-09-01',
      updatedAt: '2023-09-15'
    },
    {
      id: '2',
      name: 'Marketing Materials',
      description: 'Brand guidelines and marketing assets',
      files: [
        { id: '2-1', name: 'Brand Guidelines.pdf', type: 'pdf', size: '4.2 MB', uploadedAt: '2023-08-20' },
        { id: '2-2', name: 'Social Media Strategy.pptx', type: 'pptx', size: '3.5 MB', uploadedAt: '2023-08-15' },
      ],
      createdAt: '2023-08-01',
      updatedAt: '2023-08-20'
    }
  ]);
  
  const [activeKnowledgeBase, setActiveKnowledgeBase] = useState<string | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newKbName, setNewKbName] = useState('');
  const [newKbDescription, setNewKbDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'date'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterType, setFilterType] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropzoneRef = useRef<HTMLDivElement>(null);
  
  // Get the active knowledge base object
  const activeKb = knowledgeBases.find(kb => kb.id === activeKnowledgeBase);
  
  // Filter and sort knowledge bases
  const filteredKnowledgeBases = knowledgeBases
    .filter(kb => kb.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc' 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name);
      } else {
        return sortOrder === 'asc'
          ? new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
          : new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });
  
  // Handle file upload
  const handleFileUpload = (files: FileList | null) => {
    if (!files || !activeKnowledgeBase) return;
    
    const newFiles: KnowledgeFile[] = Array.from(files).map(file => ({
      id: `${activeKnowledgeBase}-${Date.now()}-${file.name}`,
      name: file.name,
      type: file.name.split('.').pop() || 'unknown',
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      uploadedAt: new Date().toISOString().split('T')[0]
    }));
    
    setKnowledgeBases(prev => prev.map(kb => {
      if (kb.id === activeKnowledgeBase) {
        return {
          ...kb,
          files: [...kb.files, ...newFiles],
          updatedAt: new Date().toISOString().split('T')[0]
        };
      }
      return kb;
    }));
  };
  
  // Handle file drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (dropzoneRef.current) {
      dropzoneRef.current.classList.remove('bg-blue-50', 'border-blue-300');
    }
    handleFileUpload(e.dataTransfer.files);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (dropzoneRef.current) {
      dropzoneRef.current.classList.add('bg-blue-50', 'border-blue-300');
    }
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (dropzoneRef.current) {
      dropzoneRef.current.classList.remove('bg-blue-50', 'border-blue-300');
    }
  };
  
  // Create new knowledge base
  const handleCreateKnowledgeBase = () => {
    if (!newKbName.trim()) return;
    
    const newKb: KnowledgeBase = {
      id: Date.now().toString(),
      name: newKbName,
      description: newKbDescription,
      files: [],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    
    setKnowledgeBases(prev => [...prev, newKb]);
    setNewKbName('');
    setNewKbDescription('');
    setIsCreatingNew(false);
    setActiveKnowledgeBase(newKb.id);
  };
  
  // Delete file
  const handleDeleteFile = (fileId: string) => {
    setKnowledgeBases(prev => prev.map(kb => {
      if (kb.id === activeKnowledgeBase) {
        return {
          ...kb,
          files: kb.files.filter(file => file.id !== fileId),
          updatedAt: new Date().toISOString().split('T')[0]
        };
      }
      return kb;
    }));
  };
  
  // Delete knowledge base
  const handleDeleteKnowledgeBase = (kbId: string) => {
    setKnowledgeBases(prev => prev.filter(kb => kb.id !== kbId));
    if (activeKnowledgeBase === kbId) {
      setActiveKnowledgeBase(null);
    }
  };
  
  // Get file icon based on type
  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return <File className="h-5 w-5 text-red-500" />;
      case 'docx':
      case 'doc':
      case 'txt':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <FileImage className="h-5 w-5 text-purple-500" />;
      case 'js':
      case 'ts':
      case 'html':
      case 'css':
      case 'json':
        return <FileCode className="h-5 w-5 text-green-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };
  
  return (
    <div className="p-6 h-full flex flex-col">
      {/* Top Controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search knowledge bases..."
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
            onClick={() => {
              setSortBy(sortBy === 'name' ? 'date' : 'name');
              setSortOrder('asc');
            }}
          >
            <SortDesc className="h-4 w-4" />
            Sort: {sortBy === 'name' ? 'Name' : 'Date'}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          </Button>
          
          <Button 
            variant="primary" 
            className="flex items-center gap-1"
            onClick={() => {
              setIsCreatingNew(true);
              setActiveKnowledgeBase(null);
            }}
          >
            <FolderPlus className="h-4 w-4" />
            New Knowledge Base
          </Button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Knowledge Base List */}
        <div className="w-1/3 overflow-y-auto border rounded-lg bg-white shadow-sm">
          <div className="p-4 border-b">
            <h2 className="font-semibold">Knowledge Bases</h2>
          </div>
          
          <div className="divide-y">
            {filteredKnowledgeBases.map(kb => (
              <div 
                key={kb.id} 
                className={`p-4 hover:bg-gray-50 cursor-pointer ${activeKnowledgeBase === kb.id ? 'bg-blue-50' : ''}`}
                onClick={() => {
                  setActiveKnowledgeBase(kb.id);
                  setIsCreatingNew(false);
                }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{kb.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{kb.description}</p>
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <span>{kb.files.length} files</span>
                      <span className="mx-2">•</span>
                      <span>Updated {kb.updatedAt}</span>
                    </div>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteKnowledgeBase(kb.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
            
            {filteredKnowledgeBases.length === 0 && !isCreatingNew && (
              <div className="p-8 text-center text-gray-500">
                <p>No knowledge bases found.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setIsCreatingNew(true)}
                >
                  Create New
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Knowledge Base Details or Create New */}
        <div className="w-2/3 border rounded-lg bg-white shadow-sm overflow-hidden flex flex-col">
          {isCreatingNew ? (
            <div className="p-6 flex-1">
              <h2 className="text-xl font-semibold mb-6">Create New Knowledge Base</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter knowledge base name"
                    value={newKbName}
                    onChange={(e) => setNewKbName(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 h-24"
                    placeholder="Enter a description"
                    value={newKbDescription}
                    onChange={(e) => setNewKbDescription(e.target.value)}
                  />
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button 
                    variant="outline"
                    onClick={() => setIsCreatingNew(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="primary"
                    onClick={handleCreateKnowledgeBase}
                    disabled={!newKbName.trim()}
                  >
                    Create Knowledge Base
                  </Button>
                </div>
              </div>
            </div>
          ) : activeKb ? (
            <>
              <div className="p-4 border-b flex justify-between items-center">
                <div>
                  <h2 className="font-semibold">{activeKb.name}</h2>
                  <p className="text-sm text-gray-500">{activeKb.description}</p>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4" />
                  Upload Files
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    multiple
                    onChange={(e) => handleFileUpload(e.target.files)}
                  />
                </Button>
              </div>
              
              <div className="flex-1 overflow-hidden flex flex-col">
                {/* File List */}
                <div className="flex-1 overflow-y-auto p-4">
                  {activeKb.files.length > 0 ? (
                    <div className="space-y-2">
                      {activeKb.files.map(file => (
                        <div key={file.id} className="flex items-center p-3 border rounded-md hover:bg-gray-50">
                          <div className="mr-3">
                            {getFileIcon(file.type)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{file.name}</p>
                            <div className="flex items-center text-xs text-gray-500">
                              <span>{file.size}</span>
                              <span className="mx-2">•</span>
                              <span>Uploaded {file.uploadedAt}</span>
                            </div>
                          </div>
                          
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-red-500"
                            onClick={() => handleDeleteFile(file.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div 
                      ref={dropzoneRef}
                      className="border-2 border-dashed rounded-lg p-8 text-center h-full flex flex-col items-center justify-center transition-colors duration-200"
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                    >
                      <Upload className="h-12 w-12 text-gray-300 mb-4" />
                      <h3 className="font-medium text-gray-700 mb-2">Drop files here</h3>
                      <p className="text-sm text-gray-500 mb-4">or click to browse</p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Browse Files
                      </Button>
                    </div>
                  )}
                </div>
                
                {/* Drop Zone */}
                {activeKb.files.length > 0 && (
                  <div 
                    ref={dropzoneRef}
                    className="p-4 border-t border-dashed text-center transition-colors duration-200"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                  >
                    <p className="text-sm text-gray-500">Drop files here to upload</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-gray-500 flex-1 flex flex-col items-center justify-center">
              <FolderPlus className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium mb-2">Select a Knowledge Base</h3>
              <p className="text-sm">Choose a knowledge base from the list or create a new one</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBasePage;