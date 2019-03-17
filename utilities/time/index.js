"use strict";

const NANOSECOND_IN_MILLISECONDS = 1e-6;
const MILLISECOND = 1;
const SECOND = 1e3;
const SECOND_IN_NANOSECONDS = 1e9;
const MINUTE_IN_SECONDS = 60;
const MINUTE = MINUTE_IN_SECONDS * SECOND;
const HALF_MINUTE = MINUTE / 2;
const HOUR_IN_MINUTES = 60;
const HOUR = HOUR_IN_MINUTES * MINUTE;
const DAY_IN_HOURS = 24;
const DAY = DAY_IN_HOURS * HOUR;
const MONTH_IN_DAYS = 30;
const MONTH = MONTH_IN_DAYS * DAY;
const YEAR_IN_MONTHS = 12;
const YEAR = YEAR_IN_MONTHS * MONTH;

module.exports = {
    NANOSECOND_IN_MILLISECONDS,
    MILLISECOND,
    SECOND,
    SECOND_IN_NANOSECONDS,
    MINUTE,
    MINUTE_IN_SECONDS,
    HALF_MINUTE,
    HOUR,
    HOUR_IN_MINUTES,
    DAY,
    DAY_IN_HOURS,
    MONTH,
    MONTH_IN_DAYS,
    YEAR,
    YEAR_IN_MONTHS
};
