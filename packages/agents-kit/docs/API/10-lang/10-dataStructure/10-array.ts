/**
 * @title DDataStructure.array
 *
 * Construire une structure de tableau à partir de la structure de ses éléments.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";

const structure = DDataStructure.array(
	DDataStructure.string(),
);
const result = structure.check(["red", "blue"]);

type _CheckStructure = DCommon.ExpectType<
	typeof structure,
	DDataStructure.ArrayStructure<readonly string[], readonly []>,
	"strict"
>;
type _CheckStructureValue = DCommon.ExpectType<
	DDataStructure.StructureValue<typeof structure>,
	readonly string[],
	"strict"
>;
