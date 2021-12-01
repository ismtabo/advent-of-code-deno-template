import {
  CsvContent,
  CsvRow,
  Result,
  ResultDay,
  ResultsDays,
  RunOptions,
} from "./types.d.ts";
import { extractDayNumber, isResult, isResultDay } from "./utils.ts";

function logResult(result: Result, prefix = "") {
  if (result.time == null && prefix === "") {
    console.log(prefix + result.result);
  } else {
    console.log(prefix + `Result: ${result.result}`);
    if (result.time != null) {
      console.log(prefix + `Spent time: ${result.time}`);
    }
  }
}

function logResultDay(result: ResultDay, prefix = "") {
  if ("partOne" in result) {
    console.log(prefix + "Part 1:");
    logResult(result.partOne, prefix + " ");
  }
  if ("partTwo" in result) {
    console.log(prefix + "Part 2:");
    logResult(result.partTwo, prefix + " ");
  }
}

function logResultsDays(result: ResultsDays) {
  Object.entries(result).forEach(([day, result]) => {
    const dayNumber = extractDayNumber(day);
    console.log(`Day ${dayNumber}:`);
    if (isResult(result)) {
      logResult(result, " ");
    } else {
      logResultDay(result, " ");
    }
  });
}

function csvResult(
  result: Result,
  { time }: Pick<RunOptions, "time">,
): CsvContent {
  const header = ["result"];
  const resultRow: CsvRow = { "result": result.result.toString() };
  if (time) {
    header.push("time");
    resultRow["time"] = result.time?.toString() || "";
  }
  return { header, rows: [resultRow] };
}

function csvResultsDay(
  result: ResultDay,
  { time }: Pick<RunOptions, "time">,
) {
  const header = ["part", "result"];
  if (time) {
    header.push("time");
  }
  const rows = [];

  if ("partOne" in result) {
    const { rows: rowsPartOne } = csvResult(
      result.partOne,
      { time },
    );
    rows.push(...rowsPartOne.map((row) => ({ ...row, "part": "1" })));
  }

  if ("partTwo" in result) {
    const { rows: rowsPartOne } = csvResult(
      result.partTwo,
      { time },
    );
    rows.push(...rowsPartOne.map((row) => ({ ...row, "part": "2" })));
  }

  return { header, rows };
}

function csvResultsDays(
  result: ResultsDays,
  { allParts, time }: Pick<RunOptions, "allParts" | "time">,
): CsvContent {
  const header = ["day", "result"];
  if (allParts) {
    header.splice(1, 0, "part");
  }
  if (time) {
    header.push("time");
  }
  const rows = Object.entries(result).map(([day, dayResult]) =>
    isResult(dayResult)
      ? csvResult(dayResult, { time }).rows.map((row) => ({
        "day": extractDayNumber(day).toString(),
        ...row,
      }))
      : csvResultsDay(dayResult, { time }).rows.map((row) => ({
        "day": extractDayNumber(day).toString(),
        ...row,
      }))
  ).flatMap((rows) => rows);
  return { header, rows };
}

function logCsv({ header, rows }: CsvContent) {
  console.log(header.join(","));
  for (const row of rows) {
    console.log(header.map((col) => row[col]).join(","));
  }
}

export function log(
  result: Result | ResultDay | ResultsDays,
  { format, time, allParts }: Pick<RunOptions, "format" | "time" | "allParts">,
) {
  switch (format) {
    case "json":
      return console.log(result);
    case "plain":
      if (isResult(result)) {
        return logResult(result);
      } else if (isResultDay(result)) {
        return logResultDay(result);
      } else {
        return logResultsDays(result);
      }
    // deno-lint-ignore no-case-declarations
    case "csv":
      let content: CsvContent | undefined = undefined;
      if (isResult(result)) {
        content = csvResult(result, { time });
      } else if (isResultDay(result)) {
        content = csvResultsDay(result, { time });
      } else {
        content = csvResultsDays(result, { allParts, time });
      }
      if (content != null) {
        logCsv(content);
      }
      break;
  }
}
