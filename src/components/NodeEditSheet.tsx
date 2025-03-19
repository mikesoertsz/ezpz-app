import React from 'react';
import { NodeData } from '@/store/flowStore';
import { NODE_TYPE_DETAILS } from '@/types/nodes';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Save, X } from 'lucide-react';

interface NodeEditSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  node: NodeData | null;
  onSave: (data: Partial<NodeData>) => void;
}

export const NodeEditSheet: React.FC<NodeEditSheetProps> = ({
  open,
  onOpenChange,
  node,
  onSave,
}) => {
  const [formData, setFormData] = React.useState<Partial<NodeData>>({});

  React.useEffect(() => {
    if (node) {
      setFormData(node);
    }
  }, [node]);

  if (!node) return null;

  const typeDetails = NODE_TYPE_DETAILS[node.type];

  const handleSave = () => {
    onSave(formData);
    onOpenChange(false);
  };

  const renderNodeSpecificFields = () => {
    switch (node.type) {
      case 'send_email':
        return (
          <>
            <div className="space-y-2">
              <Label>Email Template</Label>
              <Select
                value={formData.params?.template}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    params: { ...prev.params, template: value },
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="welcome">Welcome Email</SelectItem>
                  <SelectItem value="interview">Interview Invitation</SelectItem>
                  <SelectItem value="offer">Job Offer</SelectItem>
                  <SelectItem value="rejection">Rejection</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Subject Line</Label>
              <Textarea
                value={formData.params?.subject || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    params: { ...prev.params, subject: e.target.value },
                  }))
                }
                placeholder="Enter email subject"
              />
            </div>
            <div className="space-y-2">
              <Label>Email Body</Label>
              <Textarea
                value={formData.params?.body || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    params: { ...prev.params, body: e.target.value },
                  }))
                }
                placeholder="Enter email body"
                className="min-h-[200px]"
              />
            </div>
          </>
        );

      case 'make_call':
        return (
          <>
            <div className="space-y-2">
              <Label>Call Script</Label>
              <Textarea
                value={formData.params?.script || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    params: { ...prev.params, script: e.target.value },
                  }))
                }
                placeholder="Enter call script"
                className="min-h-[200px]"
              />
            </div>
            <div className="space-y-2">
              <Label>Expected Duration (minutes)</Label>
              <Select
                value={formData.params?.duration}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    params: { ...prev.params, duration: value },
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="10">10 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );

      case 'review_application':
        return (
          <>
            <div className="space-y-2">
              <Label>Review Criteria</Label>
              <Textarea
                value={formData.params?.criteria || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    params: { ...prev.params, criteria: e.target.value },
                  }))
                }
                placeholder="Enter review criteria"
                className="min-h-[200px]"
              />
            </div>
            <div className="space-y-2">
              <Label>Assigned Reviewer</Label>
              <Select
                value={formData.params?.reviewer}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    params: { ...prev.params, reviewer: value },
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select reviewer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hr_team">HR Team</SelectItem>
                  <SelectItem value="hiring_manager">Hiring Manager</SelectItem>
                  <SelectItem value="tech_lead">Tech Lead</SelectItem>
                  <SelectItem value="department_head">Department Head</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );

      case 'decision':
        return (
          <>
            <div className="space-y-2">
              <Label>Decision Conditions</Label>
              <Textarea
                value={formData.params?.conditions || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    params: { ...prev.params, conditions: e.target.value },
                  }))
                }
                placeholder="Enter decision conditions"
                className="min-h-[200px]"
              />
            </div>
            <div className="space-y-2">
              <Label>Possible Outcomes</Label>
              <Textarea
                value={formData.params?.outcomes || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    params: { ...prev.params, outcomes: e.target.value },
                  }))
                }
                placeholder="Enter possible outcomes"
                className="min-h-[100px]"
              />
            </div>
          </>
        );

      case 'notification':
        return (
          <>
            <div className="space-y-2">
              <Label>Notification Message</Label>
              <Textarea
                value={formData.params?.message || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    params: { ...prev.params, message: e.target.value },
                  }))
                }
                placeholder="Enter notification message"
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label>Urgency Level</Label>
              <Select
                value={formData.params?.urgency}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    params: { ...prev.params, urgency: value },
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select urgency level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );

      case 'collect_data':
        return (
          <>
            <div className="space-y-2">
              <Label>Required Fields</Label>
              <Textarea
                value={formData.params?.required || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    params: { ...prev.params, required: e.target.value },
                  }))
                }
                placeholder="Enter required fields (one per line)"
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label>Optional Fields</Label>
              <Textarea
                value={formData.params?.fields || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    params: { ...prev.params, fields: e.target.value },
                  }))
                }
                placeholder="Enter optional fields (one per line)"
                className="min-h-[100px]"
              />
            </div>
          </>
        );

      case 'send_whatsapp':
        return (
          <>
            <div className="space-y-2">
              <Label>Message Template</Label>
              <Select
                value={formData.params?.template}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    params: { ...prev.params, template: value },
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="welcome">Welcome Message</SelectItem>
                  <SelectItem value="interview">Interview Details</SelectItem>
                  <SelectItem value="reminder">Reminder</SelectItem>
                  <SelectItem value="followup">Follow-up</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Custom Message</Label>
              <Textarea
                value={formData.params?.message || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    params: { ...prev.params, message: e.target.value },
                  }))
                }
                placeholder="Enter custom message"
                className="min-h-[200px]"
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit {typeDetails.label}</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label>Label</Label>
            <Textarea
              value={formData.label || ''}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, label: e.target.value }))
              }
              placeholder="Enter node label"
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={formData.description || ''}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Enter node description"
            />
          </div>

          {renderNodeSpecificFields()}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-1" />
              Save Changes
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};