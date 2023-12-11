import {
    getDateDayAgo,
    getDateWeekAgo,
    getDateMonthAgo,
    getDateYearAgo,
} from "~/utils/dateUtils";
import { queryRange } from "../dataLayer/queryRange";

export default defineEventHandler(async (event) => {
    const params = getQuery(event);
    switch ((params as any).interval) {
        case "day": {
            return await queryRange(getDateDayAgo(), new Date());
        }
        case "week": {
            return await queryRange(getDateWeekAgo(), new Date());
        }
        case "month": {
            return await queryRange(getDateMonthAgo(), new Date());
        }
        case "year": {
            return await queryRange(getDateYearAgo(), new Date());
        }
        case "customrange": {
            const { lowerLimit, upperLimit } = params as any;
            const isLowerNumeric = !Number.isNaN(lowerLimit);
            const isUpperNumeric = !Number.isNaN(upperLimit);
            if (isLowerNumeric && isUpperNumeric) {
                return await queryRange(
                    new Date(Number(lowerLimit)),
                    new Date(Number(upperLimit)),
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
