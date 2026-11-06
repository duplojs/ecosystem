/**
 * @title DPattern.whenNot
 *
 * Exécuter un traitement pour les valeurs refusées par le predicate et laisser les autres non traitées.
 */
import * as DPattern from "@duplojs/lang/pattern";
import * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";
import * as DNumber from "@duplojs/lang/number";

type Input = {
	kind: "known";
	id: number;
} | {
	kind: "other";
	value: string;
};
// Les PatternResult issus d’une étape précédente sont transmis sans nouveau test.
declare const input: Input;
// « other » passe au callback, puis otherwise traite la branche known restée disponible.
const piped = DCommon.pipe(
	input,
	DPattern.whenNot(
		DPattern.isMatch({ kind: "known" }),
		(value) => value.value,
	),
	DPattern.otherwise(
		(value) => value.id,
	),
);
// Other donne son texte ; known donne son id, sans PatternResult dans la sortie.
type _CheckPiped = DCommon.ExpectType<typeof piped, string | number, "strict">;

// Predicate booléen : le test RegExp ne permet pas d’éliminer une variante du type.
declare const text: string;
const conditional = DCommon.pipe(
	text,
	DPattern.whenNot(
		DString.test(/^ready/),
		DString.toUpperCase,
	),
	DPattern.otherwise(
		DString.toUpperCase,
	),
);
// Les textes ne commençant pas par ready sont mis en majuscules ; les autres restent inchangés.
type _CheckConditional = DCommon.ExpectType<typeof conditional, Uppercase<string>, "strict">;

// Un seuil dynamique conserve number dans la callback et parmi les valeurs non traitées.
declare const amount: number;
declare const threshold: number;
const dynamicThreshold = DCommon.pipe(
	amount,
	DPattern.whenNot(
		DNumber.greaterThan(threshold),
		(value) => {
			type _CheckValue = DCommon.ExpectType<typeof value, number, "strict">;

			return DNumber.sum([value, 1]);
		},
	),
	DPattern.otherwise(
		(value) => DNumber.sum([value, 1]),
	),
);
// Chaque valeur finit incrémentée : whenNot et otherwise couvrent les deux côtés du seuil.
// Le typage de whenNot peut mal représenter la branche conservée avec un predicate à seuil dynamique.

// Si le garde accepte tout le type d'entrée, la callback reçoit never et n'est jamais appelée.
const handledText = DCommon.pipe(
	text,
	DPattern.whenNot(
		DCommon.isType("string"),
		(value) => {
			type _CheckValue = DCommon.ExpectType<typeof value, never, "strict">;

			return value;
		},
	),
	DPattern.when(
		DCommon.isType("string"),
		DString.toUpperCase,
	),
	DPattern.exhaustive,
);
// whenNot ne sélectionne rien ici ; when traite la chaîne restante.
type _CheckHandledText = DCommon.ExpectType<typeof handledText, Uppercase<string>, "strict">;

// Avec un garde de type, les valeurs non traitées conservent la contrainte prouvée.
const positive = DCommon.pipe(
	amount,
	DPattern.whenNot(
		DNumber.isPositive,
		(value) => DNumber.sum([value, 1]),
	),
);
// Les nombres positifs restent non traités ; les autres sont incrémentés dans un PatternResult.
// La callback reçoit number : TypeScript ne représente pas précisément le complément de Positive.
type _CheckPositive = DCommon.ExpectType<typeof positive, (number & DNumber.Positive) | DPattern.PatternResult<number>, "strict">;
