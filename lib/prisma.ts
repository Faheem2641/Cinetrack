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
    console.warn("PostgreSQL pool connection error (auto-handled):", err.message);
  });

  const adapter = new PrismaPg(pool);
  const client = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.pgPool = pool;
    globalForPrisma.prisma = client;
  }

  return client;
};

export const prisma = getPrismaClient();

// Resilient query execution helper with auto-reconnect on closed sockets
export async function dbQuery<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
  try {
    return await fn();
  } catch (err: any) {
    const isConnErr =
      err?.message?.includes("closed the connection") ||
      err?.message?.includes("Connection terminated") ||
      err?.message?.includes("Kind: Command failed") ||
      err?.code === "P1001" ||
      err?.code === "P1017";

    if (retries > 0 && isConnErr) {
      console.warn("Database connection dropped, resetting pool & retrying...", err.message);
      if (globalForPrisma.pgPool) {
        try { globalForPrisma.pgPool.end(); } catch (e) { /* ignore cleanup error */ }
        globalForPrisma.pgPool = undefined;
      }
      globalForPrisma.prisma = undefined;

      await new Promise((resolve) => setTimeout(resolve, 300));
      return dbQuery(fn, retries - 1);
    }
    throw err;
  }
}
