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
    return { error: "Please fill in all fields." };
  }

  try {
    await signIn("credentials", {
      email: email.trim(),
      password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid credentials." };
    }
    throw error; // Rethrow redirect errors! Next.js uses errors for redirects.
  }
}

export async function signupAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const name = formData.get("name") as string;
  const password = formData.get("password") as string;

  if (!email || !password || !name) {
    return { error: "Please fill in all fields." };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters long." };
  }

  const cleanEmail = email.toLowerCase().trim();
  const cleanName = name.trim();

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      return { error: "Email already registered." };
    }

    // Auto-generate username from Full Name (fallback to email prefix)
    let baseUsername = cleanName.toLowerCase().replace(/[^a-z0-9_]/g, "");
    if (baseUsername.length < 3) {
      baseUsername = cleanEmail.split("@")[0].toLowerCase().replace(/[^a-z0-9_]/g, "");
    }
    if (baseUsername.length < 3) {
      baseUsername = `user_${baseUsername || "cinema"}`;
    }

    let uniqueUsername = baseUsername;
    const existingUsername = await prisma.user.findUnique({ where: { username: baseUsername } });
    if (existingUsername) {
      uniqueUsername = `${baseUsername}_${Math.floor(100 + Math.random() * 900)}`;
    }

    const passwordHash = hashPassword(password);
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanName)}&background=0f172a&color=f8fafc&size=158&bold=true`;

    await prisma.user.create({
      data: {
        username: uniqueUsername,
        email: cleanEmail,
        name: cleanName,
        passwordHash,
        avatarUrl,
        bio: `Hi, I am ${cleanName}! Welcome to my movie journey.`,
      },
    });
  } catch (dbError: any) {
    console.error("Database error during signup:", dbError);
    const msg = dbError?.message || String(dbError);
    return { error: `Database Error: ${msg.slice(0, 150)}` };
  }

  try {
    await signIn("credentials", {
      email: cleanEmail,
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

export async function googleLoginAction() {
  await signIn("google", { redirectTo: "/dashboard" });
}
