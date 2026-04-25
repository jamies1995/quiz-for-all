import { PrismaClient } from "../app/generated/prisma/client";
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function buildClient(): PrismaClient {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  const adapter = new PrismaNeon({ connectionString: url });
  const client = new PrismaClient({ adapter });
  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = client;
  return client;
}

// Returns a real client when DATABASE_URL is available, or a lazy proxy
// that defers the error to the first actual query (safe for build-time
// module evaluation where env vars may not yet be injected).
export function getPrisma(): PrismaClient {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;
  if (process.env.DATABASE_URL) return buildClient();
  return new Proxy({} as PrismaClient, {
    get(_t, prop) {
      return () => {
        throw new Error(
          `Database not available: DATABASE_URL is not set (accessed via .${String(prop)})`
        );
      };
    },
  });
}
