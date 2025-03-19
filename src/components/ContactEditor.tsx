import React from 'react';
import { Contact } from '@/types/contacts';
import { Phone, Mail, Building2, MapPin } from 'lucide-react';

interface ContactEditorProps {
  contact: Contact | null;
  onContactUpdate: (contact: Contact) => void;
}

export const ContactEditor: React.FC<ContactEditorProps> = ({
  contact,
  onContactUpdate,
}) => {
  const handleChange = (field: keyof Contact, value: string) => {
    if (contact) {
      onContactUpdate({ ...contact, [field]: value });
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-medium text-gray-700">Contact Details</h3>
      
      <div className="space-y-1.5">
        <div className="relative">
          <input
            type="tel"
            value={contact?.phoneNumber || ''}
            onChange={(e) => handleChange('phoneNumber', e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Phone Number"
          />
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>

        <div className="relative">
          <input
            type="email"
            value={contact?.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Email Address"
          />
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>

        <div className="relative">
          <input
            type="text"
            value={contact?.company || ''}
            onChange={(e) => handleChange('company', e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Company"
          />
          <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>

        <div className="relative">
          <input
            type="text"
            value={contact?.city || ''}
            onChange={(e) => handleChange('city', e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="City"
          />
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>
    </div>
  );
};