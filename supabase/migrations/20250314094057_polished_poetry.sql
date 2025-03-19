/*
  # Update flows table policies

  1. Changes
    - Add existence checks for policies before creation
    - Ensure idempotent policy creation
    - Maintain all existing functionality

  2. Security
    - Maintain RLS policies for CRUD operations
    - Only allow users to access their own flows

  3. Features
    - Safe policy creation
    - No data loss
    - Maintains existing indexes and triggers
*/

-- Create policies with existence checks
DO $$ 
BEGIN
  -- Check and create "Users can read own flows" policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'flows' 
    AND policyname = 'Users can read own flows'
  ) THEN
    CREATE POLICY "Users can read own flows"
      ON flows
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  -- Check and create "Users can create flows" policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'flows' 
    AND policyname = 'Users can create flows'
  ) THEN
    CREATE POLICY "Users can create flows"
      ON flows
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Check and create "Users can update own flows" policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'flows' 
    AND policyname = 'Users can update own flows'
  ) THEN
    CREATE POLICY "Users can update own flows"
      ON flows
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Check and create "Users can delete own flows" policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'flows' 
    AND policyname = 'Users can delete own flows'
  ) THEN
    CREATE POLICY "Users can delete own flows"
      ON flows
      FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;