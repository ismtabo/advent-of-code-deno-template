import { Format, Result, ResultDay, ResultsDays } from "./types.d.ts";

export function isResult(obj: Result | ResultDay | ResultsDays): obj is Result {
  return typeof obj === "object" && "result" in obj;
}

export function isResultDay(
  obj: Result | ResultDay | ResultsDays,
): obj is ResultDay {
  return typeof obj === "object" &&
    ["partOne", "partTwo"].some((part) => part in obj);
}

export function isResultsDays(
  obj: Result | ResultDay | ResultsDays,
): obj is ResultsDays {
  return !isResult(obj) && !isResultsDays(obj);
}

export function extractDayNumber(day: string) {
  return +((day.match(/(?<=day)\d+/) || [])[0] || NaN);
}

export function dayKey(day: number) {
  return `day${day}`;
}

export function isFormat(value: string | null): value is Format {
  if (value == null) {
    return false;
  }
  return ["plain", "json", "csv"].includes(value);
}
