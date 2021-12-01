import { existsSync } from "https://deno.land/std/fs/mod.ts";
import { dirname, join } from "https://deno.land/std/path/mod.ts";
import { Solution, Solutions } from "./types.d.ts";
import { dayKey, extractDayNumber } from "./utils.ts";

const __dirname = dirname(new URL(import.meta.url).pathname);
export const SOLUTIONS_PATH = join(__dirname, "../solutions");
export const SOLUTIONS_MODULE = join(SOLUTIONS_PATH, "mod.ts");

export async function listDays() {
  const solutions = await import(SOLUTIONS_MODULE);
  const days = Array.from(Object.keys(solutions)).map((day) =>
    extractDayNumber(day)
  );
  return days;
}

export function readDaySampleInput(day: number) {
  const dayName = dayKey(day);
  const daySampleInput = join(SOLUTIONS_PATH, dayName, "sample.txt");
  if (!existsSync(daySampleInput)) {
    console.error(`Day ${day} sample input not found`);
    Deno.exit(1);
  }
  return Deno.readTextFileSync(daySampleInput);
}

export function readDayInput(day: number) {
  const dayName = dayKey(day);
  const daySampleInput = join(SOLUTIONS_PATH, dayName, "input.txt");
  if (!existsSync(daySampleInput)) {
    console.error(`Day ${day} input not found`);
    Deno.exit(1);
  }
  return Deno.readTextFileSync(daySampleInput);
}

export async function loadSolutionsModules(): Promise<Solutions> {
  return import(SOLUTIONS_MODULE);
}

export async function loadModule(day: number): Promise<Solution> {
  const dayName = dayKey(day);
  const dayModule = join(SOLUTIONS_PATH, dayName, "mod.ts");
  if (!existsSync(dayModule)) {
    console.error(`Day ${day} module not found`);
    Deno.exit(1);
  }
  return await import(dayModule);
}
