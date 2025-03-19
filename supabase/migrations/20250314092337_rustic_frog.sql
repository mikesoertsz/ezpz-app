/*
  # Create flows table

  1. New Tables
    - `flows`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `schema` (jsonb) - Stores the flow's nodes and edges
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `user_id` (uuid) - References auth.users
      - `is_active` (boolean)
      - `version` (integer)

  2. Security
    - Enable RLS on `flows` table
    - Add policies for authenticated users to:
      - Read their own flows
      - Create new flows
      - Update their own flows
      - Delete their own flows
*/

CREATE TABLE IF NOT EXISTS flows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  schema jsonb NOT NULL DEFAULT '{"nodes": [], "edges": []}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id),
  is_active boolean DEFAULT true,
  version integer DEFAULT 1
);

-- Enable RLS
ALTER TABLE flows ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own flows"
  ON flows
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create flows"
  ON flows
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own flows"
  ON flows
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own flows"
  ON flows
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_flows_updated_at
  BEFORE UPDATE ON flows
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes
CREATE INDEX flows_user_id_idx ON flows(user_id);
CREATE INDEX flows_created_at_idx ON flows(created_at);
CREATE INDEX flows_is_active_idx ON flows(is_active);