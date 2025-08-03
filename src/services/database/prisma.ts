import { PrismaClient } from "@prisma/client";

const PrismaSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prisma: ReturnType<typeof PrismaSingleton> | undefined;
}

export const prisma = globalThis.prisma ?? PrismaSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
