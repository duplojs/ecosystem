/**
 * @title DDataStructure.typeStructureIdentifier
 *
 * Identifier une structure de type et affiner son type TypeScript.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";

declare const structure: DDataStructure.Structure;

if (DDataStructure.typeStructureIdentifier(
	structure,
	DDataStructure.numberTypeKind,
)) {
	type _CheckStructure = DCommon.ExpectType<
		typeof structure,
		DDataStructure.TypeStructure<number>,
		"strict"
	>;
}

// La forme curifiée s’utilise comme predicate dans DCommon.when.
const result = DCommon.when(
	structure,
	DDataStructure.typeStructureIdentifier(DDataStructure.numberTypeKind),
	(numberStructure) => numberStructure.definition.type.fundamentalType,
);

type _CheckResult = DCommon.ExpectType<
	typeof result,
	DDataStructure.Structure | typeof DDataStructure.TheNumber,
	"one-extends-two"
>;
