/*
  # Add PostgreSQL Functions for Flow Version Management

  1. New Functions
    - increment_flow_version: Safely increments flow version when updating
    - update_flow_schema: Updates flow schema and increments version

  2. Changes
    - Adds proper version incrementing logic
    - Ensures atomic updates
    - Maintains data integrity
*/

-- Function to increment flow version
CREATE OR REPLACE FUNCTION increment_flow_version(
  flow_id uuid,
  flow_data jsonb
)
RETURNS TABLE (
  id uuid,
  name text,
  description text,
  schema jsonb,
  created_at timestamptz,
  updated_at timestamptz,
  user_id uuid,
  is_active boolean,
  version integer,
  project_id uuid
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
    UPDATE flows
    SET
      version = version + 1,
      name = COALESCE((flow_data->>'name'), name),
      description = COALESCE((flow_data->>'description'), description),
      is_active = COALESCE((flow_data->>'is_active')::boolean, is_active),
      updated_at = now()
    WHERE id = flow_id
    RETURNING flows.*;
END;
$$;

-- Function to update flow schema
CREATE OR REPLACE FUNCTION update_flow_schema(
  flow_id uuid,
  new_schema jsonb
)
RETURNS TABLE (
  id uuid,
  name text,
  description text,
  schema jsonb,
  created_at timestamptz,
  updated_at timestamptz,
  user_id uuid,
  is_active boolean,
  version integer,
  project_id uuid
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
    UPDATE flows
    SET
      schema = new_schema,
      version = version + 1,
      updated_at = now()
    WHERE id = flow_id
    RETURNING flows.*;
END;
$$;