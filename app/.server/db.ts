import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient();
} else {
    if (!global.__prismaClient) {
        global.__prismaClient = new PrismaClient();
    }
    prisma = global.__prismaClient;
}

export { prisma };
