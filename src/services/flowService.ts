import { supabase } from '@/lib/supabase';
import { Node, Edge } from 'reactflow';
import { NodeData } from '@/store/flowStore';
import { toast } from 'sonner';

export interface Flow {
  id: string;
  name: string;
  description: string | null;
  schema: {
    nodes: Node<NodeData>[];
    edges: Edge[];
  };
  created_at: string;
  updated_at: string;
  is_active: boolean;
  version: number;
  user_id: string;
  project_id: string | null;
}

export const flowService = {
  async getFlows() {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('flows')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data as Flow[];
  },

  async getFlow(id: string) {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('flows')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) throw error;
    return data as Flow;
  },

  async createFlow(flow: Partial<Flow>) {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error('No authenticated user');

    // Ensure schema has the correct structure
    const schema = flow.schema || { nodes: [], edges: [] };
    if (!schema.nodes || !schema.edges) {
      throw new Error('Invalid schema structure');
    }

    const flowWithUser = {
      ...flow,
      user_id: user.id,
      schema
    };

    const { data, error } = await supabase
      .from('flows')
      .insert([flowWithUser])
      .select()
      .single();

    if (error) {
      console.error('Error creating flow:', error);
      throw error;
    }

    return data as Flow;
  },

  async updateFlow(id: string, flow: Partial<Flow>) {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error('No authenticated user');

    try {
      const { data, error } = await supabase.rpc('increment_flow_version', {
        flow_id: id,
        flow_data: {
          ...flow,
          user_id: user.id
        }
      });

      if (error) throw error;
      return data as Flow;
    } catch (error) {
      console.error('Error updating flow:', error);
      throw error;
    }
  },

  async deleteFlow(id: string) {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error('No authenticated user');

    const { error } = await supabase
      .from('flows')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
  },

  async saveFlowSchema(id: string, nodes: Node<NodeData>[], edges: Edge[]) {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error('No authenticated user');

    try {
      const schema = {
        nodes: nodes.map(node => ({
          ...node,
          data: {
            ...node.data,
            position: node.position // Save position in data for consistency
          }
        })),
        edges
      };

      const { data, error } = await supabase.rpc('update_flow_schema', {
        flow_id: id,
        new_schema: schema
      });

      if (error) throw error;
      return data as Flow;
    } catch (error) {
      console.error('Error saving flow schema:', error);
      throw error;
    }
  },
};