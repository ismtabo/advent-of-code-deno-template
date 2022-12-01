import { Command } from "https://deno.land/x/cliffy@v0.25.4/command/mod.ts";
import { createDay } from "./create.ts";
import { runAllDays, runDay } from "./run.ts";
import { Format } from "./types.d.ts";
import { isFormat } from "./utils.ts";

try {
  await new Command()
    .name("aoc")
    .version("0.1.1")
    .description("Solutions for Advent of Code. https://adventofcode.com/")
    .throwErrors()
    .command(
      "run",
      new Command()
        .description("Run day solution")
        .option("-d, --day <day:number>", "Day to run", { required: true })
        .option(
          "-p, --part <part:number>",
          "Part of the day solution to run.",
          { required: true },
        )
        .option(
          "-a, --all-parts",
          "Execute both parts. If present part option will be ignore.",
          { conflicts: ["part"] },
        )
        .option("-t, --time", "Show spent time")
        .option(
          "-f, --file <file:string>",
          "Input file. If missing, the day input file is used instead.",
        )
        .option(
          "--sample",
          "Run day using sample input instead of day input file.",
          { conflicts: ["file"] },
        )
        .option(
          "--format <format:string>",
          "Output format.",
          {
            default: "plain",
            value(value: string): Format {
              if (!isFormat(value)) {
                throw new Error(
                  `Format must be one of plain, json or csv but got: ${value}`,
                );
              }
              return value;
            },
          },
        )
        .action(({ day, part, allParts, time, sample, format, file }) =>
          runDay(
            day,
            file,
            { part, allParts, time, sample, format },
          )
        ),
    )
    .command(
      "run-all",
      new Command()
        .description("Run multiple day solution")
        .option(
          "-p, --part <part:number>",
          "Part of the day solution to run.",
          { default: 1 },
        )
        .option(
          "-a, --all-parts",
          "Execute both parts. If present 'part' option will be ignore.",
          { conflicts: ["part"] },
        )
        .option("-t, --time", "Show spent time")
        .option(
          "--sample",
          "Run day using sample input instead of day input file.",
        )
        .option(
          "--format <format:string>",
          "Output format.",
          {
            default: "plain",
            value(value: string): Format {
              if (isFormat(value)) {
                return value;
              }
              throw new Error(
                `Format must be one of plain, json or csv but got: ${value}`,
              );
            },
          },
        )
        .action((options) => runAllDays(options)),
    )
    .command(
      "new",
      new Command()
        .description("Create new day solution folder skeleton")
        .option(
          "-d, --day <day:number>",
          "Day of the solution. If omit the corresponding next day will be created.",
        )
        .action(({ day }) => createDay(day)),
    )
    .parse(Deno.args);
} catch (error) {
  console.error(error);
}
