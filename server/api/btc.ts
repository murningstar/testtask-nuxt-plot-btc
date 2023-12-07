import { PrismaClient } from "@prisma/client";
export default defineEventHandler(async () => {
    // @ts-ignore
    const prisma = useNitroApp().prisma as PrismaClient;
    const query = await prisma.btcUpdate.findMany({
        take: 50,
        orderBy: {
            timestamp: "desc",
        },
        select: {
            json: true,
        },
    });
    return query;
});
