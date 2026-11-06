/**
 * @title DPattern.union
 *
 * Combiner plusieurs motifs en un seul motif correspondant à l’un d’eux.
 */
import * as DPattern from "@duplojs/lang/pattern";
import * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";

type Input = {
	kind: "draft";
	id: number;
} | {
	kind: "published";
	id: number;
} | {
	kind: "archived";
	id: number;
};
declare const input: Input;
const result = DCommon.pipe(
	input,
	DPattern.when(
		DPattern.isMatch(DPattern.union({ kind: "draft" }, { kind: "published" })),
		(value) => value.id,
	),
	DPattern.otherwise(
		(value) => value.id,
	),
);
// Draft, published et archived fournissent leur id numérique.
type _CheckResult = DCommon.ExpectType<typeof result, number, "strict">;

// Motifs de valeurs : union exprime un OU, y compris avec un predicate fourni.
declare const status: "ready" | "draft" | "archived";
const label = DCommon.pipe(
	status,
	DPattern.match(
		DPattern.union("ready", DString.startsWith("draft")),
		DString.toUpperCase,
	),
	DPattern.otherwise(
		(value) => value,
	),
);
// Ready et draft donnent leur majuscule ; archived reste inchangé.
type _CheckLabel = DCommon.ExpectType<typeof label, "READY" | "DRAFT" | "archived", "strict">;
