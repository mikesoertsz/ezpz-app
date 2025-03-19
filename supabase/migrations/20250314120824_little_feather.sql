/*
  # Add projects and agents tables

  1. New Tables
    - `projects`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `user_id` (uuid) - References auth.users
      - `is_active` (boolean)

    - `agents`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `project_id` (uuid) - References projects
      - `type` (text)
      - `configuration` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `user_id` (uuid) - References auth.users
      - `is_active` (boolean)
      - `version` (integer)

  2. Changes
    - Add project_id to flows table
    - Add foreign key constraints
    - Add indexes for performance

  3. Security
    - Enable RLS on all tables
    - Add appropriate policies for CRUD operations
*/

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id),
  is_active boolean DEFAULT true
);

-- Create agents table
CREATE TABLE IF NOT EXISTS agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  project_id uuid REFERENCES projects(id),
  type text NOT NULL,
  configuration jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id),
  is_active boolean DEFAULT true,
  version integer DEFAULT 1
);

-- Add project_id to flows
ALTER TABLE flows ADD COLUMN IF NOT EXISTS project_id uuid REFERENCES projects(id);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

-- Create policies for projects
CREATE POLICY "Users can read own projects"
  ON projects
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create projects"
  ON projects
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON projects
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
  ON projects
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for agents
CREATE POLICY "Users can read own agents"
  ON agents
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create agents"
  ON agents
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own agents"
  ON agents
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own agents"
  ON agents
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX projects_user_id_idx ON projects(user_id);
CREATE INDEX projects_created_at_idx ON projects(created_at);
CREATE INDEX projects_is_active_idx ON projects(is_active);

CREATE INDEX agents_user_id_idx ON agents(user_id);
CREATE INDEX agents_project_id_idx ON agents(project_id);
CREATE INDEX agents_created_at_idx ON agents(created_at);
CREATE INDEX agents_is_active_idx ON agents(is_active);

-- Create updated_at triggers
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agents_updated_at
  BEFORE UPDATE ON agents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();