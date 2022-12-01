import {
  loadModule,
  loadSolutionsModules,
  readDayInput,
  readDaySampleInput,
} from "./load.ts";
import { log } from "./log.ts";
import { Result, ResultDay, RunOptions, Solution } from "./types.d.ts";
import { dayKey, extractDayNumber } from "./utils.ts";

function runWithTime<T>(fn: () => Result<T>): Result<T> {
  const startTime = performance.now();
  const result = fn();
  const time = performance.now() - startTime;
  return { ...result, time };
}

function runModule(
  module: Solution,
  text: string,
  { part, sample, time }: Pick<RunOptions, "part" | "sample" | "time">,
): Result {
  const sampleExtraArgs = sample
    ? module.config?.sampleExtraOptions
    : undefined;
  const moduleFn = sampleExtraArgs
    ? () => module.main(text, part === 2, sampleExtraArgs)
    : () => module.main(text, part === 2);
  return time !== true
    ? { result: moduleFn() }
    : runWithTime(() => ({ result: moduleFn() }));
}

function runAllParts(
  module: Solution,
  text: string,
  { sample, time }: Pick<RunOptions, "sample" | "time">,
): ResultDay {
  const partOne = runModule(module, text, { part: 1, sample, time });
  const partTwo = runModule(module, text, { part: 2, sample, time });
  return { partOne, partTwo };
}

export async function runDay(
  day: number,
  file: string | undefined,
  { part, allParts, time, sample, format }: RunOptions,
) {
  const module: Solution = await loadModule(day);
  const text = file != null
    ? Deno.readTextFileSync(file)
    : sample === true
    ? readDaySampleInput(day)
    : readDayInput(day);
  const result = allParts
    ? runAllParts(module, text, { time, sample })
    : runModule(module, text, { part, time, sample });
  log(result, { format, time, allParts });
  Deno.exit(0);
}

export async function runAllDays(
  { time, part, allParts, sample, format }: RunOptions,
) {
  const daysSolutions = await loadSolutionsModules();
  const result = Object.entries(daysSolutions)
    .map(([day, solution]) => ({ day: extractDayNumber(day), solution }))
    .sort(({ day }, { day: other }) => day - other)
    .map(
      ({ day, solution }) => {
        const text = sample ? readDaySampleInput(day) : readDayInput(day);
        console.assert(
          "preprocess" in solution,
          "preprocess does not exist in day " + day,
        );
        return {
          [dayKey(day)]: allParts
            ? runAllParts(solution, text, { time, sample })
            : runModule(solution, text, { part, time, sample }),
        };
      },
    ).reduce((acc, val) => ({ ...acc, ...val }));
  log(result, { format, time, allParts });
  Deno.exit(0);
}
