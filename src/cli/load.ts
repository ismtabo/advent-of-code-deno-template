import { dirname, join } from "https://deno.land/std@0.166.0/path/mod.ts";
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
  try {
    return Deno.readTextFileSync(daySampleInput);
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      throw new Error(`Day ${day} sample input not found`, error);
    }
    throw error;
  }
}

export function readDayInput(day: number): string {
  const dayName = dayKey(day);
  const daySampleInput = join(SOLUTIONS_PATH, dayName, "input.txt");
  try {
    return Deno.readTextFileSync(daySampleInput);
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      throw Error(`Day ${day} input not found`, error);
    }
    throw error;
  }
}

export function loadSolutionsModules(): Promise<Solutions> {
  return import(SOLUTIONS_MODULE);
}

export async function loadModule(day: number): Promise<Solution> {
  const dayName = dayKey(day);
  const dayModule = join(SOLUTIONS_PATH, dayName, "mod.ts");
  try {
    return await import(dayModule);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(`Day ${day} module not found`, error);
    }
    throw error;
  }
}
