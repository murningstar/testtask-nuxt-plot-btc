import { PrismaClient } from "@prisma/client";

async function queryInRange(
    lowerLimit: Date,
    upperLimit: Date,
    prisma: PrismaClient,
) {
    return await prisma.btcUpdate.findMany({
        where: {
            timestamp: {
                gte: lowerLimit,
                lte: upperLimit,
            },
        },
    });
}

export { queryInRange };
