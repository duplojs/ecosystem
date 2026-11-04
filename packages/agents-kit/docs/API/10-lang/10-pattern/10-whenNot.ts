/**
 * @title DPattern.whenNot
 *
 * Exécuter un traitement pour les valeurs refusées par le predicate et laisser les autres non traitées.
 */
import * as DPattern from "@duplojs/lang/pattern";
import * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";

type Input = {
	kind: "known";
	id: number;
} | {
	kind: "other";
	value: string;
};
// Les PatternResult issus d’une étape précédente sont transmis sans nouveau test.
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
// Other donne son texte ; known donne son id, sans PatternResult dans la sortie.
type _CheckPiped = DCommon.ExpectType<typeof piped, string | number, "strict">;

// Predicate booléen : le test RegExp ne permet pas d’éliminer une variante du type.
declare const text: string;
const conditional = DPattern.whenNot(text, DString.test(/^ready/), DString.toUpperCase);
// Les textes ne commençant pas par ready sont mis en majuscules ; les autres restent inchangés.
// Le cas string reste non traité dans les types : terminer avec otherwise.
type _CheckConditional = DCommon.ExpectType<typeof conditional, string | DPattern.PatternResult<Uppercase<string>>, "strict">;

// Limite actuelle : avec un seuil de type number, l’appel inline
// whenNot(amount, DNumber.greaterThan(threshold), callback) peut éliminer à tort
// number du type restant. Ne pas en déduire que la sélection est exhaustive.
