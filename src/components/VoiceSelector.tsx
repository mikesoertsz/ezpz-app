import React from 'react';
import { Voice } from '@/types/voices';
import { Mic } from 'lucide-react';

interface VoiceSelectorProps {
  voices: Voice[];
  selectedVoiceId: string;
  onSelect: (voiceId: string) => void;
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  voices,
  selectedVoiceId,
  onSelect,
}) => {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-gray-700">
        Select Voice
      </label>
      <div className="relative">
        <select
          value={selectedVoiceId}
          onChange={(e) => onSelect(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Choose a voice...</option>
          {voices.map((voice) => (
            <option key={voice.id} value={voice.id}>
              {voice.label} ({voice.accent})
            </option>
          ))}
        </select>
        <Mic className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>
    </div>
  );
};