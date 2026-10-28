import type { Absolute, Path, Segment } from "../constraints";

export type AnyPath = string & (Path | Absolute | Segment);
