/**
 * @title DPattern.whenNot
 *
 * Exécuter un traitement pour les valeurs refusées par le predicate et laisser les autres non traitées.
 */
import * as DPattern from "@duplojs/lang/pattern";
import * as DCommon from "@duplojs/lang/common";

type Input = {
	kind: "known";
	id: number;
} | {
	kind: "other";
	value: string;
};
declare const input: Input;
const result = DPattern.whenNot(
	input,
	DPattern.isMatch({ kind: "known" }),
	(value) => value.value,
);
// Ici, « other » passe au callback et « known » reste disponible pour une étape suivante.
type _CheckResult = DCommon.ExpectType<typeof result, DPattern.PatternResult<string> | {
	kind: "known";
	id: number;
}, "strict">;

// Enchaînée à un fallback, la branche reconnue par le predicate est traitée ensuite.
const piped = DCommon.pipe(
	input,
	DPattern.whenNot(DPattern.isMatch({ kind: "known" }), (value) => value.value),
	DPattern.otherwise((value) => value.id),
);
type _CheckPiped = DCommon.ExpectType<typeof piped, string | number, "strict">;
