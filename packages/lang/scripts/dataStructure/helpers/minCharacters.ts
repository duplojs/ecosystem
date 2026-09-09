import { MinCharactersConstraint } from "../constraint";

export function minCharacters<
	GenericMin extends number,
>(min: GenericMin) {
	return MinCharactersConstraint(min);
}
