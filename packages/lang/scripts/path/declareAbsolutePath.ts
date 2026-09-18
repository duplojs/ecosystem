import { type Absolute } from "./constraints";
import { type RequireLiteralAbsolutePath } from "./types";

export function declareAbsolutePath<
	GenericValue extends string,
>(
	value: (
		& GenericValue
		& RequireLiteralAbsolutePath<GenericValue>
	),
) {
	return value as unknown as GenericValue & Absolute;
}
