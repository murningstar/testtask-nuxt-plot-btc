import { PrismaClient } from "@prisma/client";
import {
    getDateDayAgo,
    getDateWeekAgo,
    getDateMonthAgo,
    getDateYearAgo,
} from "~/utils/dateUtils";
import { queryRange } from "../dataLayer/queryRange";

export default defineEventHandler(async (event) => {
    // @ts-ignore
    const prisma = useNitroApp().prisma as PrismaClient;
    const params = getQuery(event);
    switch ((params as any).interval) {
        case "day": {
            return await queryRange(getDateDayAgo(), new Date(), prisma);
        }
        case "week": {
            return await queryRange(getDateWeekAgo(), new Date(), prisma);
        }
        case "month": {
            return await queryRange(getDateMonthAgo(), new Date(), prisma);
        }
        case "year": {
            return await queryRange(getDateYearAgo(), new Date(), prisma);
        }
        case "customrange": {
            const { lowerLimit, upperLimit } = params as any;
            const isLowerNumeric = !Number.isNaN(lowerLimit);
            const isUpperNumeric = !Number.isNaN(upperLimit);
            if (isLowerNumeric && isUpperNumeric) {
                return await queryRange(
                    new Date(Number(lowerLimit)),
                    new Date(Number(upperLimit)),
                    prisma,
                );
            } else {
                throw createError({
                    statusCode: 400,
                    statusMessage:
                        "Range limits should be in milliseconds since midnight, January 1, 1970 UTC",
                });
            }
        }

        default: {
            throw createError({
                statusCode: 400,
                statusMessage: "Interval parameter is invalid",
            });
        }
    }
});
