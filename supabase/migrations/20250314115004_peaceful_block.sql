/*
  # Create node_types table

  1. New Tables
    - `node_types`
      - `id` (text, primary key) - The node type identifier
      - `label` (text) - Display label for the node type
      - `description` (text) - Description of the node type
      - `icon` (text) - Icon identifier
      - `color` (text) - Color theme for the node
      - `params` (jsonb) - Parameter configuration
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `node_types` table
    - Add policies for:
      - Public read access
      - Admin-only write access
*/

CREATE TABLE IF NOT EXISTS node_types (
  id text PRIMARY KEY,
  label text NOT NULL,
  description text,
  icon text NOT NULL,
  color text NOT NULL,
  params jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE node_types ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access"
  ON node_types
  FOR SELECT
  TO public
  USING (true);

-- Insert default node types
INSERT INTO node_types (id, label, description, icon, color, params) VALUES
  ('start', 'Start Process', 'Begin the recruitment process', 'Play', 'text-green-600', '[
    {"name": "description", "type": "text", "label": "Description", "required": false}
  ]'),
  ('end', 'End Process', 'End the recruitment process', 'Flag', 'text-red-600', '[
    {"name": "description", "type": "text", "label": "Description", "required": false}
  ]'),
  ('collect_data', 'Collect Data', 'Collect information from candidates', 'FileText', 'text-blue-500', '[
    {"name": "required", "type": "text", "label": "Required Fields", "required": true},
    {"name": "fields", "type": "text", "label": "Optional Fields", "required": false}
  ]'),
  ('send_email', 'Send Email', 'Send an email to candidates', 'Mail', 'text-green-500', '[
    {"name": "template", "type": "select", "label": "Email Template", "required": true, "options": [
      {"value": "welcome", "label": "Welcome Email"},
      {"value": "interview", "label": "Interview Invitation"},
      {"value": "offer", "label": "Job Offer"},
      {"value": "rejection", "label": "Rejection"}
    ]},
    {"name": "subject",  "type": "text", "label": "Subject Line", "required": true},
    {"name": "body", "type": "textarea", "label": "Email Body", "required": true}
  ]'),
  ('send_whatsapp', 'Send WhatsApp', 'Send a WhatsApp message', 'MessageSquare', 'text-emerald-500', '[
    {"name": "template", "type": "select", "label": "Message Template", "required": true, "options": [
      {"value": "welcome", "label": "Welcome Message"},
      {"value": "interview", "label": "Interview Details"},
      {"value": "reminder", "label": "Reminder"},
      {"value": "followup", "label": "Follow-up"}
    ]},
    {"name": "message", "type": "textarea", "label": "Custom Message", "required": true}
  ]'),
  ('make_call', 'Make Call', 'Make an automated phone call', 'Phone', 'text-purple-500', '[
    {"name": "script", "type": "textarea", "label": "Call Script", "required": true},
    {"name": "duration", "type": "select", "label": "Expected Duration", "required": true, "options": [
      {"value": "5", "label": "5 minutes"},
      {"value": "10", "label": "10 minutes"},
      {"value": "15", "label": "15 minutes"},
      {"value": "30", "label": "30 minutes"}
    ]}
  ]'),
  ('review_application', 'Review Application', 'Review candidate application', 'Users', 'text-orange-500', '[
    {"name": "criteria", "type": "textarea", "label": "Review Criteria", "required": true},
    {"name": "reviewer", "type": "select", "label": "Assigned Reviewer", "required": true, "options": [
      {"value": "hr_team", "label": "HR Team"},
      {"value": "hiring_manager", "label": "Hiring Manager"},
      {"value": "tech_lead", "label": "Tech Lead"},
      {"value": "department_head", "label": "Department Head"}
    ]}
  ]'),
  ('decision', 'Decision', 'Make a decision in the process', 'CheckCircle', 'text-sky-500', '[
    {"name": "conditions", "type": "textarea", "label": "Decision Conditions", "required": true},
    {"name": "outcomes", "type": "textarea", "label": "Possible Outcomes", "required": true}
  ]'),
  ('notification', 'Notification', 'Send a notification', 'AlertCircle', 'text-red-500', '[
    {"name": "message", "type": "textarea", "label": "Notification Message", "required": true},
    {"name": "urgency", "type": "select", "label": "Urgency Level", "required": true, "options": [
      {"value": "low", "label": "Low"},
      {"value": "medium", "label": "Medium"},
      {"value": "high", "label": "High"},
      {"value": "urgent", "label": "Urgent"}
    ]}
  ]');

-- Create updated_at trigger
CREATE TRIGGER update_node_types_updated_at
  BEFORE UPDATE ON node_types
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();