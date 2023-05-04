export type JwtPayload = {
  email: string;
  username: string;
  sub: number;
  isAdmin: boolean;
}