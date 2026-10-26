import * as DString from "@scripts/string";
import { type Segment } from "./constraints";

export function concatSegment(
	newPart: string & Segment,
): (base: string & Segment) => string & Segment;

export function concatSegment(
	base: string & Segment,
	newPart: string & Segment,
	...newParts: (string & Segment)[]
): string & Segment;

export function concatSegment(
	...args:
		| [newPart: string & Segment]
		| [base: string & Segment, newPart: string & Segment, ...newParts: (string & Segment)[]]
) {
	if (args.length === 1) {
		const [newPart] = args;

		return (base: string & Segment) => concatSegment(base, newPart);
	}

	const [base, newPart, ...newParts] = args as [
		string & Segment,
		string & Segment,
		...(string & Segment)[],
	];

	return DString.concat(base, newPart, ...newParts) as string & Segment;
}
