import { type Path } from "./constraints";
import { type RequireLiteralPath } from "./types";

export function declarePath<
	GenericValue extends string,
>(
	value: (
		& GenericValue
		& RequireLiteralPath<GenericValue>
	),
) {
	return value as unknown as GenericValue & Path;
}
