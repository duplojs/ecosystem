import type { Format } from "./format";

export interface Email extends Format<"email", `${string}@${string}.${string}`> {}
