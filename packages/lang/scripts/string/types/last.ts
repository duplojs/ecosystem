import type { At } from "./at";

export type Last<
	GenericValue extends string,
> = At<GenericValue, -1>;
