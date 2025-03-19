import { supabase } from '@/lib/supabase';

export interface Project {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
  is_active: boolean;
}

export const projectService = {
  async getProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data as Project[];
  },

  async getProject(id: string) {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        flows (*),
        agents (*),
        knowledge_bases (*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Project & {
      flows: any[];
      agents: any[];
      knowledge_bases: any[];
    };
  },

  async createProject(project: Partial<Project>) {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error('No authenticated user');

    const projectWithUser = {
      ...project,
      user_id: user.id
    };

    const { data, error } = await supabase
      .from('projects')
      .insert([projectWithUser])
      .select()
      .single();

    if (error) throw error;
    return data as Project;
  },

  async updateProject(id: string, project: Partial<Project>) {
    const { data, error } = await supabase
      .from('projects')
      .update(project)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Project;
  },

  async deleteProject(id: string) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};