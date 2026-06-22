import { UserRole } from './user';

export interface JwtPayload {
  sub: number;
  username: string;
  role: UserRole;
  iat: number;
  exp: number;
}
