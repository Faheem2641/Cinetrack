import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  pgPool?: Pool;
};

const createPrismaClient = () => {
  const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

  let pool = globalForPrisma.pgPool;
  if (!pool) {
    pool = new Pool({
      connectionString,
      max: 10,
      idleTimeoutMillis: 60000,
      connectionTimeoutMillis: 20000,
      keepAlive: true,
      keepAliveInitialDelayMillis: 10000,
      ssl: { rejectUnauthorized: false },
    });
    pool.on("error", (err) => {
      console.warn("PostgreSQL client connection error (auto-reconnecting):", err.message);
    });
  }

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.pgPool = pool;
  }

  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
};

export const prisma = globalForPrisma.prisma ?? (globalForPrisma.prisma = createPrismaClient());

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Utility helper to safely execute database operations with auto-retry on closed connections
export async function dbQuery<T>(fn: () => Promise<T>, retries = 2): Promise<T> {
  try {
    return await fn();
  } catch (err: any) {
    if (retries > 0 && err?.message?.includes("closed the connection")) {
      console.warn("Retrying database query after connection drop...");
      await new Promise((resolve) => setTimeout(resolve, 300));
      return dbQuery(fn, retries - 1);
    }
    throw err;
  }
}
