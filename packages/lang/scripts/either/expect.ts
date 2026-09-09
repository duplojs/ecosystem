import type { Right } from "./right";
import type { Left } from "./left";

type Either = Right | Left;

export function expect<
	GenericEither extends Either,
>(input: GenericEither): GenericEither;

export function expect(
	input: Either,
) {
	return input;
}
