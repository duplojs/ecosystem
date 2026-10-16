/**
 * @title DDataStructure.refine
 *
 * Construire une contrainte personnalisée à partir d’un predicate DuploJS.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DString from "@duplojs/lang/string";

const constraint = DDataStructure.refine(
	DString.startsWith("user:"),
);
type _CheckConstraint = DCommon.ExpectType<
	typeof constraint,
	DDataStructure.RefineConstraint<string, `user:${string}`>,
	"strict"
>;

const structure = DDataStructure.string([constraint]);
const result = structure.check("user:42");

// Le predicate affine la valeur validée vers le format du préfixe.
type _CheckStructureValue = DCommon.ExpectType<
	DDataStructure.StructureValue<typeof structure>,
	`user:${string}`,
	"strict"
>;
