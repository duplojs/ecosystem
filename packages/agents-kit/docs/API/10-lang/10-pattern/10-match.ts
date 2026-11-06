/**
 * @title DPattern.match
 *
 * Traiter une valeur selon un motif et conserver les cas qui ne correspondent pas.
 */
import * as DPattern from "@duplojs/lang/pattern";
import * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";

type Input = {
	status: "created";
	id: number;
} | {
	status: "deleted";
	id: number;
	reason: string;
};
declare const input: Input;

// Appel curifié : les étapes suivantes ignorent une branche déjà enveloppée.
const piped = DCommon.pipe(
	input,
	DPattern.match(
		{ status: "created" },
		(value) => value.id,
	),
	DPattern.match(
		{ status: "deleted" },
		(value) => value.reason,
	),
	DPattern.exhaustive,
);
// La sortie est l’id créé ou la raison de suppression, sans wrapper.
type _CheckPiped = DCommon.ExpectType<typeof piped, number | string, "strict">;

// Le builder retire chaque branche traitée du domaine restant, puis exige son épuisement.
const built = DPattern.match(input)
	.with({ status: "created" }, (value) => value.id)
	.with({ status: "deleted" }, (value) => value.reason)
	.exhaustive();
// Après couverture des deux variantes, exhaustive retourne directement number | string.
type _CheckBuilt = DCommon.ExpectType<typeof built, number | string, "strict">;

// Builder avec repli : seule la première branche correspondante est exécutée.
const withFallback = DPattern.match(input)
	.with({ status: "created" }, (value) => value.id)
	.otherwise((remaining) => {
		type _CheckRemaining = DCommon.ExpectType<typeof remaining, {
			status: "deleted";
			id: number;
			reason: string;
		}, "strict">;
		return remaining.reason;
	});
// Même sortie, mais otherwise couvre explicitement le cas restant.
type _CheckWithFallback = DCommon.ExpectType<typeof withFallback, number | string, "strict">;

// Tableau imbriqué : le motif décrit un préfixe, pas une longueur exacte.
declare const packet: { items: ["text", string] | ["count", number] };
const nested = DCommon.pipe(
	packet,
	DPattern.match(
		{ items: ["text"] },
		(value) => {
			type _CheckValue = DCommon.ExpectType<typeof value, { items: ["text", string] }, "strict">;
			return value.items[1];
		},
	),
	DPattern.match(
		{ items: ["count"] },
		(value) => value.items[1],
	),
	DPattern.exhaustive,
);
// Les deux préfixes imbriqués sont traités ; la sortie est le texte ou le nombre du tuple.
type _CheckNested = DCommon.ExpectType<typeof nested, string | number, "strict">;

// Motif predicate : une garantie peut remplacer un motif objet ou tableau.
declare const scalar: string | number | null;
const selected = DCommon.pipe(
	scalar,
	DPattern.match(
		DCommon.isType("string"),
		DString.toUpperCase,
	),
	DPattern.otherwise(
		(value) => value,
	),
);
// Les chaînes sont mises en majuscules ; number et null restent inchangés.
type _CheckSelected = DCommon.ExpectType<typeof selected, Uppercase<string> | number | null, "strict">;

// Le builder expose aussi when et whenNot pour composer les predicates.
const byPredicates = DPattern.match(scalar)
	.when(DCommon.isType("string"), DString.toUpperCase)
	.whenNot(DCommon.isType("number"), () => "absent")
	.with(DCommon.isType("number"), (value) => value)
	.exhaustive();
// Les chaînes sont mises en majuscules, null devient "absent", le nombre est conservé.
type _CheckByPredicates = DCommon.ExpectType<typeof byPredicates, string | number, "strict">;

// Motifs littéraux combinés : union regroupe plusieurs valeurs dans une même branche.
declare const state: "ready" | "draft" | "archived";
const byValue = DPattern.match(state)
	.with(DPattern.union("ready", "draft"), DString.toUpperCase)
	.otherwise(DString.toUpperCase);
// La valeur obtenue est "READY", "DRAFT" ou "ARCHIVED", selon l’entrée.
type _CheckByValue = DCommon.ExpectType<typeof byValue, "READY" | "DRAFT" | "ARCHIVED", "strict">;
