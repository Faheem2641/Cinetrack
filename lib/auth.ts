import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

function hashPassword(password: string) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

function generateFallbackUsername(identifier: string): string {
  const base = identifier.includes("@") ? identifier.split("@")[0] : identifier;
  const cleaned = base.toLowerCase().replace(/[^a-z0-9_]/g, "");
  return cleaned.length >= 3 ? cleaned : `user_${cleaned || "cinema"}`;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    Credentials({
      credentials: {
        email: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const inputIdentifier = (credentials.email as string).trim();
        const lowerIdentifier = inputIdentifier.toLowerCase();
        const password = credentials.password as string;
        const passwordHash = hashPassword(password);

        // 1. Try to find user by email OR username (case-insensitive)
        let user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: lowerIdentifier },
              { username: lowerIdentifier },
            ],
          },
        });

        // 2. If user exists, verify password
        if (user) {
          if (user.passwordHash !== passwordHash) {
            return null;
          }
        } else {
          // 3. Auto-create user account & username if not existing upon login
          let baseUsername = generateFallbackUsername(inputIdentifier);
          let uniqueUsername = baseUsername;
          const existingUser = await prisma.user.findUnique({ where: { username: baseUsername } });
          if (existingUser) {
            uniqueUsername = `${baseUsername}_${Math.floor(100 + Math.random() * 900)}`;
          }

          const userEmail = inputIdentifier.includes("@")
            ? lowerIdentifier
            : `${lowerIdentifier}@cinetrack.local`;

          const displayName = inputIdentifier.includes("@")
            ? inputIdentifier.split("@")[0]
            : inputIdentifier;

          const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=0f172a&color=f8fafc&size=158&bold=true`;

          user = await prisma.user.create({
            data: {
              username: uniqueUsername,
              email: userEmail,
              passwordHash,
              name: displayName,
              avatarUrl,
              bio: `Hi, I am ${displayName}! Welcome to my movie journey.`,
            },
          });
        }

        // Ensure username field is present on user object
        if (!user.username) {
          let baseUsername = generateFallbackUsername(user.email || user.name || user.id);
          const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: { username: baseUsername },
          });
          user = updatedUser;
        }

        return {
          id: user.id,
          name: user.name || user.username,
          email: user.email,
          image: user.avatarUrl,
          username: user.username,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        if (!user.email) return false;
        const cleanEmail = user.email.toLowerCase().trim();

        let dbUser = await prisma.user.findUnique({
          where: { email: cleanEmail },
        });

        if (!dbUser) {
          let baseUsername = generateFallbackUsername(user.name || cleanEmail);
          let uniqueUsername = baseUsername;
          const existingUsername = await prisma.user.findUnique({ where: { username: baseUsername } });
          if (existingUsername) {
            uniqueUsername = `${baseUsername}_${Math.floor(100 + Math.random() * 900)}`;
          }

          const displayName = user.name || uniqueUsername;
          const avatarUrl = user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=0f172a&color=f8fafc&size=158&bold=true`;

          dbUser = await prisma.user.create({
            data: {
              username: uniqueUsername,
              email: cleanEmail,
              name: displayName,
              passwordHash: "", // Google OAuth user
              avatarUrl,
              bio: `Hi, I am ${displayName}! Welcome to my movie journey.`,
            },
          });
        }

        user.id = dbUser.id;
        (user as any).username = dbUser.username;
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = (user as any).username;
      }
      if (token.id && !token.username) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { username: true, email: true },
        });
        if (dbUser) {
          token.username = dbUser.username || dbUser.email.split("@")[0];
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = (token.username as string) || "user";
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
});
