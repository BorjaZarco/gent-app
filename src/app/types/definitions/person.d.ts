export interface Person {
  id: string;
  name: string;
  surname: string;
  sex: 'M' | 'F';
  birthDate?: string;
  birthPlace?: string;
  dead?: boolean;
  deathDate?: string;
  deathPlace?: string;
}
