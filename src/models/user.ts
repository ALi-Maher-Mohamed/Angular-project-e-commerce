export type UserRole = 'Admin' | 'Customer';

export interface User {
  id?: number;
  username: string;
  password: string;
  role: UserRole;
}
