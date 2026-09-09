import { MaxCharactersConstraint } from "../constraint";

export function maxCharacters<
	GenericMax extends number,
>(max: GenericMax) {
	return MaxCharactersConstraint(max);
}
