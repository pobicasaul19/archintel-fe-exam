export interface AuthUser {
  userInfo: User | null;
  token: string | null;
}
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  type: string;
  status: string
}