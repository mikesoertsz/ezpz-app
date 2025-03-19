import { supabase } from '@/lib/supabase';

export interface Agent {
  id: string;
  name: string;
  description: string | null;
  project_id: string | null;
  type: string;
  configuration: Record<string, any>;
  created_at: string;
  updated_at: string;
  user_id: string;
  is_active: boolean;
  version: number;
}

export const agentService = {
  async getAgents() {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data as Agent[];
  },

  async getAgent(id: string) {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Agent;
  },

  async createAgent(agent: Partial<Agent>) {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error('No authenticated user');

    const agentWithUser = {
      ...agent,
      user_id: user.id
    };

    const { data, error } = await supabase
      .from('agents')
      .insert([agentWithUser])
      .select()
      .single();

    if (error) throw error;
    return data as Agent;
  },

  async updateAgent(id: string, agent: Partial<Agent>) {
    const { data, error } = await supabase
      .from('agents')
      .update({
        ...agent,
        version: agent.configuration ? undefined : "version + 1"
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Agent;
  },

  async deleteAgent(id: string) {
    const { error } = await supabase
      .from('agents')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};