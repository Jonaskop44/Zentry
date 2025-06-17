export interface User {
  id?: number;
  username?: string;
  password?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  tokens: Tokens;
}
