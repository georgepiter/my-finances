import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { auth } from "@/services/auth";

let jwt = require("jsonwebtoken");

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "custom",
      credentials: {
        username: {
          label: "Usuário",
          type: "text",
          placeholder: "jsmith@test.pl",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        const u = {
          name: credentials?.username,
          password: credentials?.password,
        };

        try {
          const res = await auth(u);
          if (res.status != undefined && res.status != 200) {
            throw new Error(res.message);
          }
          if (res.token) {
            return { id: res.token };
          }
        } catch (error: any) {
          throw new Error(error.message);
        }
        return null;
      },
    })
  ],
  secret: process.env.JWT_SECRET,
  session: {
    strategy: "jwt",
  },
  jwt: {
    async encode({ secret, token }) {
      return jwt.sign(token, secret);
    },
    async decode({ secret, token }) {
      return jwt.verify(token, secret);
    },
  },
  callbacks: {
    async signIn({ account }) {
      if (!account?.providerAccountId) return false;
      return true;
    },
    async jwt({ token }) {
      if (token.sub) {
        return token;
      } else {
        throw new Error("Usuário inválido.");
      }
    },
    async session({ session, token }) {
      if (!token.sub) {
        throw new Error("Sessão inválida.");
      }

      const decoded = jwt.decode(token.sub, process.env.JWT_SECRET);
      const dateExp = new Date(decoded.exp * 1000);
      const dateNow = new Date();
      if (dateNow > dateExp) {
        return { ...session, error: "TokenExpiredError" };
      }

      session.user.name = decoded.sub;
      session.user.id = decoded.userId;
      session.user.role = decoded.role;
      session.user.email = decoded.email;
      session.accessToken = token.sub;
      session.nameApp = decoded.nameApp;
      session.expires = decoded.exp;
      return { ...session, accessToken: token.sub };
    }
  },
  debug: process.env.NODE_ENV === "development",
  pages: {
    signIn: "/signIn",
  },
});
