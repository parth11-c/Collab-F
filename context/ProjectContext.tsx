import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

type Project = {
  id: string;
  name: string;
  description: string;
  created_at: string;
  status: 'active' | 'completed';
  tags: string[];
  technologies: string[];
  tech_stack: string[];
  languages: string[];
  group_members: string[];
  duration: string;
  type: string;
  category: string;
  owner_id: string;
};

type ProjectInput = Omit<Project, 'id' | 'created_at' | 'owner_id'>;

type ProjectContextType = {
  projects: Project[];
  loading: boolean;
  error: string | null;
  addProject: (project: ProjectInput) => Promise<Project | null>;
  updateProject: (id: string, updates: Partial<ProjectInput>) => Promise<Project | null>;
  deleteProject: (id: string) => Promise<boolean>;
  getProjectById: (id: string) => Promise<Project | null>;
  refreshProjects: () => Promise<void>;
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all projects on mount
  useEffect(() => {
    refreshProjects();
    
    // Subscribe to realtime updates
    const channel = supabase
      .channel('projects_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects'
        },
        (payload) => {
          refreshProjects();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const refreshProjects = async () => {
    try {
      setLoading(true);
      setError(null); // Clear any previous errors
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setProjects([]);
        return;
      }

      const { data, error } = await supabase
        .from('projects')
        .select(`
          id,
          name,
          description,
          created_at,
          status,
          tags,
          technologies,
          tech_stack,
          languages,
          group_members,
          duration,
          type,
          category,
          owner_id
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects:', error);
        throw error;
      }
      
      // Ensure all array fields are properly initialized
      const processedData = (data || []).map(project => ({
        ...project,
        tags: project.tags || [],
        technologies: project.technologies || [],
        tech_stack: project.tech_stack || [],
        languages: project.languages || [],
        group_members: project.group_members || []
      }));
      
      setProjects(processedData);
    } catch (err) {
      console.error('Error in refreshProjects:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addProject = async (project: ProjectInput): Promise<Project | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('projects')
        .insert([{ ...project, owner_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      await refreshProjects();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    }
  };

  const updateProject = async (id: string, updates: Partial<ProjectInput>): Promise<Project | null> => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await refreshProjects();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    }
  };

  const deleteProject = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await refreshProjects();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    }
  };

  const getProjectById = async (id: string): Promise<Project | null> => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    }
  };

  return (
    <ProjectContext.Provider 
      value={{ 
        projects, 
        loading, 
        error, 
        addProject, 
        updateProject, 
        deleteProject, 
        getProjectById,
        refreshProjects
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
} 