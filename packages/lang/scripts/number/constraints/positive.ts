import { type GreaterThanOrEqual } from "./greaterThanOrEqual";

export interface Positive extends GreaterThanOrEqual<0> {}
