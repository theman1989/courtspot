import NextAuth, { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { connectDB } from "@/shared/libs/mongodb";
import { User } from "@/features/users/server/user.model";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        const result = loginSchema.safeParse(credentials);
        if (!result.success) return null;

        await connectDB();

        const user = await User.findOne({
          email: result.data.email.toLowerCase(),
        }).select("+passwordHash");

        if (!user) return null;

        const validPassword = await bcrypt.compare(
          result.data.password,
          user.passwordHash,
        );

        if (!validPassword) return null;

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.role = (user as { role?: string }).role ?? "";
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
