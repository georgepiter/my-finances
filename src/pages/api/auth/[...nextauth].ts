import { auth } from "@/services/auth";
import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

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
    }),
    // ...add more providers
  ],
  secret: process.env.JWT_SECRET,
  session: {
    strategy: "jwt",
  },
  jwt: {
    encode: ({ secret, token }) => {
      const encodedToken = jwt.sign(token!, secret, {
        algorithm: process.env.JWT_SECRET,
      });
      return encodedToken;
    },
    decode: async ({ secret, token }) => {
      const decodedToken = jwt.verify(token!, secret, {
        algorithms: [process.env.JWT_SECRET],
      });
      return decodedToken as JWT;
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

      const decoded = jwt.decode(token.sub, "HS512");
      const dateExp = new Date(decoded.exp * 1000);
      const dateNow = new Date();

      // const dateNow = Date.now();

      console.log("decoded.exp", decoded.exp);

      console.log("dateExp", dateExp.toLocaleString());
      console.log("dateNow", dateNow.toLocaleString());

      if (dateNow.toLocaleString() > dateExp.toLocaleString()) {
        console.log("expirou");
        return { ...session, error: "TokenExpiredError" };
      } else {
        console.log("n expirou");
      }

      session.user.name = decoded.sub;
      session.user.id = decoded.userId;
      session.user.role = decoded.role;
      session.user.email = decoded.email;
      session.token = token.sub;
      session.nameApp = decoded.nameApp;
      session.expires = decoded.exp;
      return { ...session, accessToken: token.sub };
    },
    // async redirect({ url }) {
    //   if (url.includes("/signIn")) return "/";
    //   if (!url.includes("/")) return "/signIn";
    //   return url;
    // },
  },
  debug: process.env.NODE_ENV === "development",
  pages: {
    signIn: "/signIn",
  },
});
