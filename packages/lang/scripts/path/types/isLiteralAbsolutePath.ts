import { type IsLiteralPath } from "./isLiteralPath";

export type IsLiteralAbsolutePath<
	GenericValue extends string,
> = IsLiteralPath<GenericValue> extends true
	? GenericValue extends `/${string}`
		? true
		: false
	: false;
