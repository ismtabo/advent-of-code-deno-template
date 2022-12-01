declare enum Format {
  CSV = "csv",
  JSON = "json",
  PLAIN = "plain",
}

export interface RunOptions {
  part: number;
  allParts?: boolean;
  time?: boolean;
  sample?: boolean;
  format: Format;
}

export type SolutionPart<Input = unknown, Output = number> = (
  _: Input,
  __?: unknown,
) => Output;

export interface Solution<Input = unknown, Output = number> {
  preprocess: (_: string) => Input;
  main: (_: string, __: boolean, ___?: unknown) => Output;
  partOne: SolutionPart<Input, Output>;
  partTwo: SolutionPart<Input, Output>;
  config: { sampleExtraOptions: unknown };
}

export interface Solutions {
  [_: string]: Solution;
}

export interface Result<T = number> {
  result: T;
  time?: number;
}
export interface ResultDay<T = number> {
  partOne: Result<T>;
  partTwo: Result<T>;
}
export interface ResultsDays {
  [_: string]: ResultDay | Result;
}

export interface CsvRow {
  [_: string]: string;
}

export interface CsvContent {
  header: string[];
  rows: CsvRow[];
}
