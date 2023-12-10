const nowDate = new Date();
function getDateDayAgo() {
    const res = new Date().setDate(nowDate.getDate() - 1);
    return new Date(res);
}
function getDateWeekAgo() {
    const res = new Date().setDate(nowDate.getDate() - 7);
    return new Date(res);
}

function getDateMonthAgo() {
    const res = new Date().setMonth(nowDate.getMonth() - 1);
    return new Date(res);
}
function getDateYearAgo() {
    const res = new Date().setFullYear(nowDate.getFullYear() - 1);
    return new Date(res);
}
export { getDateDayAgo, getDateWeekAgo, getDateMonthAgo, getDateYearAgo };
