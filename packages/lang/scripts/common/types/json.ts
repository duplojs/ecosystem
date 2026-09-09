import type { MaybeArray } from "./maybeArray";

export type Json = MaybeArray<
	| string
	| undefined
	| boolean
	| number
	| null
	| { readonly [key: string]: Json }
>;
