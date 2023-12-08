import { PrismaClient } from "@prisma/client";
import {
    getDateDayAgo,
    getDateWeekAgo,
    getDateMonthAgo,
    getDateYearAgo,
} from "~/utils/dateUtils";
import { queryInRange } from "../dataLayer/queryInRange";

export default defineEventHandler(async (event) => {
    // @ts-ignore
    const prisma = useNitroApp().prisma as PrismaClient;
    const params = getQuery(event);
    switch ((params as any).interval) {
        case "day": {
            return await queryInRange(getDateDayAgo(), new Date(), prisma);
        }
        case "week": {
            return await queryInRange(getDateWeekAgo(), new Date(), prisma);
        }
        case "month": {
            return await queryInRange(getDateMonthAgo(), new Date(), prisma);
        }
        case "year": {
            return await queryInRange(getDateYearAgo(), new Date(), prisma);
        }
        case "customrange": {
            const { lowerLimit, upperLimit } = params as any;
            const isLowerNumeric = !Number.isNaN(lowerLimit);
            const isUpperNumeric = !Number.isNaN(upperLimit);
            if (isLowerNumeric && isUpperNumeric) {
                return await queryInRange(
                    new Date(lowerLimit),
                    new Date(upperLimit),
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

    // return query;
});
