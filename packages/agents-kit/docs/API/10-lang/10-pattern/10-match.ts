/**
 * @title DPattern.match
 *
 * Traiter une valeur selon un motif structurel et conserver les portions qui ne correspondent pas.
 */
import * as DPattern from "@duplojs/lang/pattern";
import type * as DCommon from "@duplojs/lang/common";

type Input = {
	kind: "created";
	id: number;
} | {
	kind: "deleted";
	id: number;
	reason: string;
};
declare const input: Input;

// Forme directe : le callback reçoit la partie de l’objet garantie par le motif.
const direct = DPattern.match(input, { kind: "created" }, (value) => value.id);
// La branche traitée devient PatternResult<number> ; la variante deleted reste l’entrée à examiner.
type _CheckDirect = DCommon.ExpectType<typeof direct, DPattern.PatternResult<number> | {
	kind: "deleted";
	id: number;
	reason: string;
}, "strict">;

// Le builder retire chaque branche traitée du domaine restant, puis exige son épuisement.
const built = DPattern.match(input)
	.with({ kind: "created" }, (value) => value.id)
	.with({ kind: "deleted" }, (value) => value.reason)
	.exhaustive();
// Après couverture des deux variantes, exhaustive retourne directement number | string.
type _CheckBuilt = DCommon.ExpectType<typeof built, number | string, "strict">;
