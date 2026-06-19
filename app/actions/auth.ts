"use server";

import { signIn, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { AuthError } from "next-auth";

function hashPassword(password: string) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Please fill in all fields" };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid email or password." };
    }
    throw error; // Rethrow redirect errors! Next.js uses errors for redirects.
  }
}

export async function signupAction(prevState: any, formData: FormData) {
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const name = formData.get("name") as string;
  const password = formData.get("password") as string;

  if (!username || !email || !password || !name) {
    return { error: "Please fill in all fields." };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters long." };
  }

  if (username.length < 3) {
    return { error: "Username must be at least 3 characters long." };
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { error: "Username can only contain letters, numbers, and underscores." };
  }

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return { error: "Email already registered." };
      }
      if (existingUser.username === username) {
        return { error: "Username already taken." };
      }
    }

    const passwordHash = hashPassword(password);
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0f172a&color=f8fafc&size=158&bold=true`;

    await prisma.user.create({
      data: {
        username: username.toLowerCase().trim(),
        email: email.toLowerCase().trim(),
        name,
        passwordHash,
        avatarUrl,
        bio: `Hi, I am ${name}! Welcome to my movie journey.`,
      },
    });
  } catch (dbError) {
    console.error("Database error during signup:", dbError);
    return { error: "Failed to create user. Please try again." };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    throw error; // Rethrow redirect
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}
