import { Mail, MessageSquare, FileText, Phone, Users, CheckCircle, AlertCircle, Play, Flag } from 'lucide-react';

export const NODE_TYPES = {
  START: 'start',
  END: 'end',
  COLLECT_DATA: 'collect_data',
  SEND_EMAIL: 'send_email',
  SEND_WHATSAPP: 'send_whatsapp',
  MAKE_CALL: 'make_call',
  REVIEW_APPLICATION: 'review_application',
  DECISION: 'decision',
  NOTIFICATION: 'notification',
} as const;

export type NodeType = typeof NODE_TYPES[keyof typeof NODE_TYPES];

export const NODE_TYPE_DETAILS = {
  [NODE_TYPES.START]: {
    label: 'Start Process',
    icon: Play,
    color: 'text-green-600',
    params: []
  },
  [NODE_TYPES.END]: {
    label: 'End Process',
    icon: Flag,
    color: 'text-red-600',
    params: []
  },
  [NODE_TYPES.COLLECT_DATA]: {
    label: 'Collect Data',
    icon: FileText,
    color: 'text-blue-500',
    params: ['fields', 'required']
  },
  [NODE_TYPES.SEND_EMAIL]: {
    label: 'Send Email',
    icon: Mail,
    color: 'text-green-500',
    params: ['template', 'subject']
  },
  [NODE_TYPES.SEND_WHATSAPP]: {
    label: 'Send WhatsApp',
    icon: MessageSquare,
    color: 'text-emerald-500',
    params: ['message', 'template']
  },
  [NODE_TYPES.MAKE_CALL]: {
    label: 'Make Call',
    icon: Phone,
    color: 'text-purple-500',
    params: ['script', 'duration']
  },
  [NODE_TYPES.REVIEW_APPLICATION]: {
    label: 'Review Application',
    icon: Users,
    color: 'text-orange-500',
    params: ['criteria', 'reviewer']
  },
  [NODE_TYPES.DECISION]: {
    label: 'Decision',
    icon: CheckCircle,
    color: 'text-sky-500',
    params: ['conditions', 'outcomes']
  },
  [NODE_TYPES.NOTIFICATION]: {
    label: 'Notification',
    icon: AlertCircle,
    color: 'text-red-500',
    params: ['message', 'urgency']
  },
} as const;