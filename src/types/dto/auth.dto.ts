export enum ERole {
  Admin = "Admin",
  User = "User",
}

export interface Session {
  id: string;
  user: User;
  refreshToken: string;
  expiresAt: Date;
  lastAccessAt: Date;
  ipAddress?: string;
  language?: string;
  userAgent?: string;
  createdAt: Date;
}

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  roles: ERole[];
  confirmed: boolean;
  createdAt: Date;
  updatedAt: Date;
}
