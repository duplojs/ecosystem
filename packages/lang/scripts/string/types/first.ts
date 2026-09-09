import type { At } from "./at";

export type First<
	GenericValue extends string,
> = At<GenericValue, 0>;
