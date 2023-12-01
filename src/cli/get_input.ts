import { join } from "https://deno.land/std@0.208.0/path/mod.ts";
import {
  DOMParser,
  Element,
} from "https://deno.land/x/deno_dom@v0.1.43/deno-dom-wasm.ts";

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

export async function getDescription(day: number, cookie: string) {
  const url = `https://adventofcode.com/2023/day/${day}`;
  const response = await fetch(url, {
    headers: {
      "Cookie": `session=${cookie}`,
    },
  });

  if (response.status !== 200) {
    throw new Error(
      `Failed to get description for day ${day}: ${response.statusText}`,
    );
  }

  const html = await response.text();

  const doc = new DOMParser().parseFromString(html, "text/html")!;
  const articles = doc.querySelectorAll(".day-desc")!;

  const matches = Array.from(articles).map((article) => {
    return Array.from(article.childNodes)
      .filter((node) => node instanceof Element)
      .map((node) => node.textContent?.trim())
      .filter((text) => text !== undefined && text !== "")
      .join("\n\n");
  });

  const filePath = join(SOLUTIONS_PATH, `day${day}`, "description.txt");
  Deno.writeTextFileSync(filePath, matches.join("\n\n"));
}
