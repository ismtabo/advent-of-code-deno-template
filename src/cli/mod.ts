import { Command } from "https://deno.land/x/cliffy/command/mod.ts";
import { createDay } from "./create.ts";
import { runAllDays, runDay } from "./run.ts";

try {
  await new Command()
    .name("aoc")
    .version("<version>")
    .description("Solutions for Advent of Code. https://adventofcode.com/")
    .throwErrors()
    .command(
      "run",
      new Command()
        .description("Run day solution")
        .option("-d, --day <day:number>", "Day to run")
        .option(
          "-p, --part <part:number>",
          "Part of the day solution to run.",
          { default: 1 },
        )
        .option(
          "-a, --all-parts",
          "Execute both parts. If present part option will be ignore.",
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
            value(value: string) {
              if (!["plain", "json", "csv"].includes(value)) {
                throw new Error(
                  `Format must be one of plain, json or csv but got: ${value}`,
                );
              }
              return value;
            },
          },
        )
        .action(({ day, part, allParts, time, sample, format, file }) =>
          runDay(day, file, { part, allParts, time, sample, format })
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
          "Execute both parts. If present part option will be ignore.",
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
            value(value: string) {
              if (!["plain", "json", "csv"].includes(value)) {
                throw new Error(
                  `Format must be one of plain, json or csv but got: ${value}`,
                );
              }
              return value;
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
          "Day of the solution. By default the corresponding next day will be created.",
        )
        .action(({ day }) => createDay(day)),
    )
    .parse(Deno.args);
} catch (error) {
  console.error(error);
}
