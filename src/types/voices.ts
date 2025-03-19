export interface Voice {
  id: string;
  label: string;
  accent: string;
}

export const availableVoices: Voice[] = [
  {
    id: '0d13d946-b558-4b0d-8160-ce71c2a18c21',
    label: 'Josh',
    accent: 'American'
  },
  {
    id: '186c7011-b637-4e55-9643-2e24dd37d547',
    label: 'Sarah',
    accent: 'American'
  },
  {
    id: 'nicolas-french',
    label: 'Nicolas',
    accent: 'French'
  }
];