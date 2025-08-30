export interface User {
  id: string;
  firstName: string;
  lastName: string;
  emailId: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  photoUrl: string;
  about: string;
  skills: string[];
}
