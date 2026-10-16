/**
 * @title Valider un contrat de données.
 *
 * Décrire les contraintes puis discriminer le résultat de validation.
 */
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import type * as DCommon from "@duplojs/lang/common";

const requestStructure = DDataStructure.object({
	name: DDataStructure.string([
		DDataStructure.minCharacters(3),
		DDataStructure.maxCharacters(40),
	]),
	age: DDataStructure.number([
		DDataStructure.integer(),
		DDataStructure.greaterThanOrEqual(18),
	]),
	tags: DDataStructure.array(
		DDataStructure.string(),
		[DDataStructure.minElements(2)],
	),
});

type Request = DDataStructure.StructureValue<typeof requestStructure>;

function validateRequest(input: unknown) {
	return requestStructure.check(input);
}

declare const input: unknown;
const result = validateRequest(input);
if (DEither.isRight(result)) {
	const request = DEither.unwrapRight(result);

	type _CheckRequest = DCommon.ExpectType<typeof request, Request, "strict">;
}
