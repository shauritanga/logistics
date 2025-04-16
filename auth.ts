import NextAuth, { User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { MongoDBAdapter } from "@auth/mongodb-adapter";

import { User } from "./models/index";
import dbConnect from "./lib/mongodb";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      role: string;
    } & NextAuthUser;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(dbConnect),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();

        const user = await User.findOne({
          email: credentials?.email,
        });

        if (!user) {
          throw new Error("Invalid email");
        }

        const password = credentials?.password as string;

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        if ("role" in user) {
          token.role = user.role;
        }
      }
      return token;
    },
    session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id as string,
        email: token.email as string,
        role: token.role as string,
      };
      return session;
    },
  },
});
