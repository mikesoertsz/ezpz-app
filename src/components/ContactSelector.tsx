import React from 'react';
import { Contact } from '@/types/contacts';
import { User } from 'lucide-react';

interface ContactSelectorProps {
  contacts: Contact[];
  selectedContactId: string;
  onSelect: (contactId: string) => void;
}

export const ContactSelector: React.FC<ContactSelectorProps> = ({
  contacts,
  selectedContactId,
  onSelect,
}) => {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-gray-700">
        Select Contact
      </label>
      <div className="relative">
        <select
          value={selectedContactId}
          onChange={(e) => onSelect(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Choose a contact...</option>
          {contacts.map((contact) => (
            <option key={contact.id} value={contact.id}>
              {contact.name}
            </option>
          ))}
        </select>
        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>
    </div>
  );
};