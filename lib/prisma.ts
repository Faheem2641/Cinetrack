import { PrismaClient, Prisma } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

const getPrismaClient = () => {
  const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
  const logLevels: Prisma.LogLevel[] = process.env.NODE_ENV === "development"
    ? ["query", "error", "warn"]
    : ["error"];

  return new PrismaClient({
    adapter,
    log: logLevels,
  });
};

export const prisma = globalForPrisma.prisma || getPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
