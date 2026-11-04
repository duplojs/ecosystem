/**
 * @title DPattern.union
 *
 * Combiner plusieurs motifs en un seul motif correspondant à l’un d’eux.
 */
import * as DPattern from "@duplojs/lang/pattern";
import type * as DCommon from "@duplojs/lang/common";

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
const result = DPattern.when(input, DPattern.isMatch(DPattern.union({ kind: "draft" }, { kind: "published" })), (value) => value.id);
// Draft et published partagent le traitement ; archived reste non traité.
type _CheckResult = DCommon.ExpectType<typeof result, DPattern.PatternResult<number> | {
	kind: "archived";
	id: number;
}, "strict">;
