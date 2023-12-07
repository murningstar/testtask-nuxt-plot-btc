import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
console.log(
    await prisma.btcUpdate.findMany({
        take: 50,
        orderBy: {
            timestamp: "desc",
        },
        select: {
            json: true,
        },
    }),
);
