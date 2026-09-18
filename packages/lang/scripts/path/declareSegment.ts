import { type Segment } from "./constraints";
import { type RequireLiteralSegmentPath } from "./types";

export function declareSegment<
	GenericValue extends string,
>(
	value: (
		& GenericValue
		& RequireLiteralSegmentPath<GenericValue>
	),
) {
	return value as unknown as GenericValue & Segment;
}
