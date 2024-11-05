import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import prisma from "@/app/libs/prismadb"; // Adjust if necessary
import type { NextAuthOptions } from "next-auth"; // Import the correct types

export const authOptions: NextAuthOptions = { // Make sure to export authOptions
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope: "openid profile email",
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });
        if (!user || !user.hashedPassword) {
          throw new Error("Invalid credentials");
        }
        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );
        if (!isCorrectPassword) {
          throw new Error("Invalid credentials");
        }
        return user;
      },
    }),
  ],
  pages: {
    signIn: "/",
    error: "/app/error",
  },
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt" as const, // Ensure to keep this line
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Export as Next.js Route Handler compatible with Next.js 13 app directory
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
