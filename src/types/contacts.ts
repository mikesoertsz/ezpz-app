export interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
  email: string;
  city: string;
  company: string;
}

export const defaultContacts: Contact[] = [
  {
    id: '1',
    name: 'Jordi',
    phoneNumber: '+31641532184',
    email: 'jordi@ezpzrecruitment.com',
    city: 'Amsterdam',
    company: 'EZPZ Recruitment'
  },
  {
    id: '2',
    name: 'Roman',
    phoneNumber: '+49 1522 2615139',
    email: 'roman@ezpz.com',
    city: 'Berlin',
    company: 'EZPZ'
  },
  {
    id: '3',
    name: 'Mike',
    phoneNumber: '+351912580952',
    email: 'mike@ezpzrecruitment.com',
    city: 'Lisbon',
    company: 'EZPZ Recruitment'
  }
];