import { prisma } from "../prismaClient/prisma";

async function queryRange(lowerLimit: Date, upperLimit: Date) {
    return await prisma.btcUpdate.findMany({
        where: {
            timestamp: {
                gte: lowerLimit,
                lte: upperLimit,
            },
        },
    });
}

export { queryRange };
