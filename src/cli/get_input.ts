import { join } from "https://deno.land/std@0.166.0/path/mod.ts";
import { SOLUTIONS_PATH } from "./load.ts";

export async function getInput(day: number, cookie: string) {
  const mainFolder = join(SOLUTIONS_PATH, `day${day}`);

  // Ensure the folder exists
  try {
    Deno.mkdirSync(mainFolder);
  } catch (error) {
    if (!(error instanceof Deno.errors.AlreadyExists)) {
      throw error;
    }
  }

  const url = `https://adventofcode.com/2023/day/${day}/input`;
  const response = await fetch(url, {
    headers: {
      "Cookie": `session=${cookie}`,
    },
  });

  if (response.status !== 200) {
    throw new Error(
      `Failed to get input for day ${day}: ${response.statusText}`,
    );
  }

  const input = await response.text();
  const filePath = join(mainFolder, "input.txt");
  Deno.writeTextFileSync(filePath, input);
}
