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
  -- Validate schema structure
  IF (new_schema->>'nodes') IS NULL OR (new_schema->>'edges') IS NULL THEN
    RAISE EXCEPTION 'Invalid schema structure: must contain nodes and edges';
  END IF;

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

-- Create index on schema for better performance
CREATE INDEX IF NOT EXISTS flows_schema_gin_idx ON flows USING gin (schema);

-- Add constraint to ensure schema is valid JSON
ALTER TABLE flows ADD CONSTRAINT flows_schema_is_json 
  CHECK (schema IS NULL OR jsonb_typeof(schema) = 'object');

-- Add constraint to ensure schema has required structure
ALTER TABLE flows ADD CONSTRAINT flows_schema_structure 
  CHECK (
    schema IS NULL OR 
    (
      jsonb_typeof(schema->'nodes') = 'array' AND 
      jsonb_typeof(schema->'edges') = 'array'
    )
  );