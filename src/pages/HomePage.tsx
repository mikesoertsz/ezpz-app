import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutTemplate, 
  Database, 
  Bot, 
  BarChart2, 
  Clock, 
  Users,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const HomePage = () => {
  const recentProjects = [
    { id: 1, name: 'Developer Recruitment', type: 'Flow', lastEdited: '2 hours ago' },
    { id: 2, name: 'Marketing Knowledge Base', type: 'Knowledge Base', lastEdited: '1 day ago' },
    { id: 3, name: 'Customer Support Agent', type: 'Agent', lastEdited: '3 days ago' },
  ];

  const stats = [
    { label: 'Active Flows', value: 12, icon: LayoutTemplate, color: 'bg-blue-100 text-blue-600' },
    { label: 'Knowledge Bases', value: 8, icon: Database, color: 'bg-purple-100 text-purple-600' },
    { label: 'Agents', value: 5, icon: Bot, color: 'bg-green-100 text-green-600' },
    { label: 'Team Members', value: 7, icon: Users, color: 'bg-orange-100 text-orange-600' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Welcome Section */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">Welcome back, John!</h2>
            <p className="text-gray-600 mb-6">
              Continue working on your projects or create something new.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center p-4 border rounded-lg">
                  <div className={`p-3 rounded-lg ${stat.color} mr-4`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold">{stat.value}</p>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Link to="/flow-builder">
                <Button className="gap-2">
                  <LayoutTemplate className="h-4 w-4" />
                  New Flow
                </Button>
              </Link>
              <Link to="/knowledge-bases">
                <Button variant="outline" className="gap-2">
                  <Database className="h-4 w-4" />
                  New Knowledge Base
                </Button>
              </Link>
              <Link to="/agent-builder">
                <Button variant="outline" className="gap-2">
                  <Bot className="h-4 w-4" />
                  New Agent
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Activity Summary */}
        <div>
          <div className="bg-white rounded-lg shadow-sm border p-6 h-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Recent Activity</h3>
              <Button variant="ghost" size="sm" className="text-xs">
                View All
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="p-3 border rounded-lg">
                <div className="flex items-center text-sm">
                  <div className="bg-blue-100 p-2 rounded-full text-blue-600 mr-3">
                    <LayoutTemplate className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">Flow Updated</p>
                    <p className="text-xs text-gray-500">Developer Recruitment</p>
                  </div>
                  <p className="ml-auto text-xs text-gray-500">2h ago</p>
                </div>
              </div>
              
              <div className="p-3 border rounded-lg">
                <div className="flex items-center text-sm">
                  <div className="bg-purple-100 p-2 rounded-full text-purple-600 mr-3">
                    <Database className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">Knowledge Base Created</p>
                    <p className="text-xs text-gray-500">Marketing Materials</p>
                  </div>
                  <p className="ml-auto text-xs text-gray-500">1d ago</p>
                </div>
              </div>
              
              <div className="p-3 border rounded-lg">
                <div className="flex items-center text-sm">
                  <div className="bg-green-100 p-2 rounded-full text-green-600 mr-3">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">Agent Deployed</p>
                    <p className="text-xs text-gray-500">Customer Support</p>
                  </div>
                  <p className="ml-auto text-xs text-gray-500">3d ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Projects */}
      <div className="mt-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Recent Projects</h3>
            <Button variant="ghost" size="sm" className="text-xs">
              View All Projects
            </Button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-xs text-gray-500">
                  <th className="text-left py-3 px-4 font-medium">Name</th>
                  <th className="text-left py-3 px-4 font-medium">Type</th>
                  <th className="text-left py-3 px-4 font-medium">Last Edited</th>
                  <th className="text-right py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentProjects.map((project) => (
                  <tr key={project.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <p className="font-medium">{project.name}</p>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{project.type}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{project.lastEdited}</td>
                    <td className="py-3 px-4 text-right">
                      <Button variant="ghost" size="sm" className="text-xs">
                        Open <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;