export type AuthJwtPayload = {
  id: number;
  sub: {
    username: string;
  };
  iat?: number;
  exp?: number;
};
