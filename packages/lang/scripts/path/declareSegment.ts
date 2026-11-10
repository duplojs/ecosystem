import { type Path, type Segment } from "./constraints";
import { type RequireLiteralSegmentPath } from "./types";

export function declareSegment<
	const GenericValue extends string,
>(
	value: (
		& GenericValue
		& RequireLiteralSegmentPath<GenericValue>
	),
) {
	return value as unknown as GenericValue & Segment & Path;
}
