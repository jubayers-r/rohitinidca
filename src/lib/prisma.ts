import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import pg from "pg";

const prismaClientSingleton = () => {
  // 1. Setup the connection pool
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

  // 2. Initialize the adapter
  const adapter = new PrismaPg(pool);

  // 3. Pass the adapter to the Client
  return new PrismaClient({ adapter });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
