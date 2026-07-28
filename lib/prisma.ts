import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  pgPool?: Pool;
};

export const getPrismaClient = (): PrismaClient => {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

  const pool = new Pool({
    connectionString,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
    ssl: { rejectUnauthorized: false },
  });

  pool.on("error", (err) => {
    console.warn("PostgreSQL pool connection error (auto-resetting pool):", err.message);
    globalForPrisma.prisma = undefined;
    globalForPrisma.pgPool = undefined;
  });

  const adapter = new PrismaPg(pool);
  const client = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

  globalForPrisma.pgPool = pool;
  globalForPrisma.prisma = client;

  return client;
};

// Dynamic Proxy for prisma export so connection pool resets dynamically update all active query references
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrismaClient();
    const value = (client as any)[prop];
    return typeof value === "function" ? value.bind(client) : value;
  },
});

// Resilient query execution helper with auto-reconnect on closed sockets
export async function dbQuery<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
  try {
    return await fn();
  } catch (err: any) {
    const msg = String(err?.message || "").toLowerCase();
    const isConnErr =
      msg.includes("closed the connection") ||
      msg.includes("connection closed") ||
      msg.includes("connection terminated") ||
      msg.includes("socket hang up") ||
      msg.includes("econnreset") ||
      msg.includes("kind: command failed") ||
      err?.code === "P1001" ||
      err?.code === "P1017";

    if (retries > 0 && isConnErr) {
      console.warn("Database connection closed by server. Auto-resetting client & retrying query...", err.message);
      if (globalForPrisma.pgPool) {
        try { globalForPrisma.pgPool.end(); } catch (e) { /* ignore cleanup error */ }
      }
      globalForPrisma.pgPool = undefined;
      globalForPrisma.prisma = undefined;

      await new Promise((resolve) => setTimeout(resolve, 300));
      return dbQuery(fn, retries - 1);
    }
    throw err;
  }
}
