import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import { number } from "zod";

declare module "next-auth" {

  export interface UserSession {
    name: string;
    id: number;
    email: string;
    role: "ROLE_MANAGER" | "ROLE_ADMIN";
  }

  interface Session {
    user: UserSession;
    nameApp: string;
    expires: number;
    accessToken: string;
    error?: string;
  }
}

