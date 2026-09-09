import type { Format } from "./format";

export interface Uuid extends Format<"uuid", `${string}-${string}-${string}-${string}-${string}`> {}
