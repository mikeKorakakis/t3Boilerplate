import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { prisma } from "@/server/db/client";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  // Include user.id on session
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role;
      }
      return session;
    },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, _) {
        const email = credentials?.email;
        const password = credentials?.password;
        console.log("credentials", credentials);
        if (!email || !password) throw new Error("email/password missing!");
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });
        console.log("user", user);
        if (user) {
          return ({ id: user.id, name: user.name, email: user.email, role: user.role || "user" });
        } else {
          return Promise.reject();
        }
      },
    }),
    // DiscordProvider({
    //   clientId: env.DISCORD_CLIENT_ID,
    //   clientSecret: env.DISCORD_CLIENT_SECRET,
    // }),
    // ...add more providers here
  ],
  pages: { signIn: "/auth/signin" },
};

export default NextAuth(authOptions);
