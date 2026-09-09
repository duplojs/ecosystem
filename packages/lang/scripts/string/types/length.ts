import type { Split } from "./split";

export type Length<
	GenericString extends string,
> = string extends GenericString
	? number
	: Extract<
		Split<GenericString, "">["length"],
		number
	>;
