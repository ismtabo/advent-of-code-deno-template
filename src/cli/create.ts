import { ensureDirSync, exists } from "https://deno.land/std/fs/mod.ts";
import { dirname, join } from "https://deno.land/std/path/mod.ts";
import { renderFileToString } from "https://deno.land/x/dejs@0.9.3/mod.ts";
import { listDays, SOLUTIONS_MODULE, SOLUTIONS_PATH } from "./load.ts";

const __dirname = dirname(new URL(import.meta.url).pathname);

export async function createDay(day: number) {
  if (day == null) {
    const days = await listDays();
    day = 1;
    if (days.length > 0) {
      day = Math.max(...days) + 1;
    }
  }

  const mainFolder = join(SOLUTIONS_PATH, `day${day}`);

  if (await exists(mainFolder)) {
    console.error(`Error - Day ${day} already exists`);
    Deno.exit(1);
  }

  ensureDirSync(mainFolder);

  Deno.writeTextFileSync(
    join(mainFolder, "mod.ts"),
    await renderFileToString(
      join(__dirname, "templates/main-mod.template"),
      {},
    ),
  );

  for (const part of ["partOne", "partTwo"]) {
    ensureDirSync(join(mainFolder, part));
    Deno.writeTextFileSync(
      join(mainFolder, part, "mod.ts"),
      await renderFileToString(
        join(__dirname, "templates/part-mod.template"),
        { partName: part },
      ),
    );
  }
  const solutionsModule = Deno.readTextFileSync(SOLUTIONS_MODULE);
  const solutionsModuleLines = solutionsModule.split("\n");
  solutionsModuleLines.splice(
    -1,
    0,
    `export * as day${day} from "./day${day}/mod.ts";`,
  );
  Deno.writeTextFileSync(SOLUTIONS_MODULE, solutionsModuleLines.join("\n"));
  Deno.run({ cmd: ["deno", "fmt", SOLUTIONS_MODULE] });
}
