import { PrismaClient } from "@prisma/client";
export default defineNitroPlugin((nitro) => {
    //@ts-ignore
    if (!nitro.prisma) {
        const prisma = new PrismaClient();
        //@ts-ignore
        nitro.prisma = prisma;
    }
    nitro.hooks.hookOnce("close", async () => {
        //@ts-ignore
        await prisma.$disconnect();
    });
});
