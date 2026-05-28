import {
  differenceInDays,
  differenceInMonths,
  differenceInWeeks,
  eachDayOfInterval,
  eachMonthOfInterval,
  eachWeekOfInterval,
  eachYearOfInterval,
  endOfWeek,
  max,
  min,
  startOfWeek,
} from "date-fns";

export function formatDate(date: Date) {
  const dateFormatter = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  });

  return dateFormatter.format(date);
}

export function getChartData(startDate: Date, endDate: Date) {
  const period = differenceInDays(endDate, startDate);

  // If the duration is less than 30 days the intervals will be individual days
  if (period < 30) {
    return {
      array: eachDayOfInterval({ start: startDate, end: endDate }),
      format: formatDate,
    };
  }

  const weeks = differenceInWeeks(endDate, startDate);

  // If the days are less than 270, then intervals are taken as individual weeks
  if (weeks < 30) {
    return {
      array: eachWeekOfInterval({ start: startDate, end: endDate }),
      format: (date: Date) => {
        const start = max([startOfWeek(date), startDate]);
        const end = min([endOfWeek(date), endDate]);
        return `${formatDate(start)} - ${formatDate(end)}`;
      },
    };
  }

  const months = differenceInMonths(endDate, startDate);

  // if the number of months are less than 12, then the intervals are taken as individual months
  if (months < 12) {
    return {
      array: eachMonthOfInterval({ start: startDate, end: endDate }),
      format: (date: Date) => {
        return new Intl.DateTimeFormat("en", {
          month: "long",
          year: "numeric",
        }).format(date);
      },
    };
  }

  // if the duration is more than a year, then the intervals are taken as individual years
  return {
    array: eachYearOfInterval({ start: startDate, end: endDate }),
    format: (date: Date) => {
      return new Intl.DateTimeFormat("en", {
        year: "numeric",
      }).format(date);
    },
  };
}
