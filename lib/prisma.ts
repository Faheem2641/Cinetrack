import { PrismaClient, Prisma } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const createPrismaClient = () => {
  const connectionString = process.env.DATABASE_URL;
  const pool = new Pool({
    connectionString,
    max: 5,
    idleTimeoutMillis: 5000,
    connectionTimeoutMillis: 10000,
    ssl: { rejectUnauthorized: false },
  });
  pool.on("error", () => {
    // Ignore idle disconnects in background pool
  });
  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: [],
  });
};

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export const prisma =
  process.env.NODE_ENV === "production"
    ? globalForPrisma.prisma || (globalForPrisma.prisma = createPrismaClient())
    : createPrismaClient();


