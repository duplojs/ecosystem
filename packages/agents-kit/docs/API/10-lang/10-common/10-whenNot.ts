/**
 * @title DCommon.whenNot
 *
 * Transformer une valeur uniquement lorsqu’un prédicat n’est pas satisfait.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DNumber from "@duplojs/lang/number";
import * as DString from "@duplojs/lang/string";

// Appel classique : remplacer un nom vide, sans modifier les noms déjà renseignés.
declare const displayName: string;
const named = DCommon.whenNot(
	displayName,
	DString.isNotEmpty,
	DCommon.justReturn("Anonyme"),
);
// La chaîne vide devient "Anonyme" ; les autres noms conservent la preuve NotEmpty.
type _CheckNamed = DCommon.ExpectType<typeof named, (string & DString.NotEmpty) | "Anonyme", "strict">;

// Appel curifié : convertir les références numériques avant de normaliser leur casse.
declare const reference: string | number;
const normalizedReference = DCommon.pipe(
	reference,
	DCommon.whenNot(
		DCommon.isType("string"),
		DString.to,
	),
	DString.toUpperCase,
);
// Par exemple, 42 donne "42" et "ticket-ab" donne "TICKET-AB".
type _CheckNormalizedReference = DCommon.ExpectType<typeof normalizedReference, Uppercase<string>, "strict">;

// Predicates composés : signaler seulement les états qui ne sont ni prêts ni en attente.
declare const state: "ready" | "queued" | "blocked";
const labeledState = DCommon.whenNot(
	state,
	DCommon.or([DCommon.equal("ready"), DCommon.equal("queued")]),
	DString.prepend("Attention : "),
);
// "blocked" devient "Attention : blocked" ; les deux autres littéraux sont conservés.
type _CheckLabeledState = DCommon.ExpectType<
	typeof labeledState,
	"ready" | "queued" | "Attention : blocked",
	"strict"
>;

// Test booléen : appliquer un délai minimum calculé à l'exécution.
declare const delay: number;
declare const minimumDelay: number;
const boundedDelay = DCommon.whenNot(
	delay,
	DNumber.greaterThanOrEqual(minimumDelay),
	DCommon.justReturn(minimumDelay),
);
// Les délais trop courts sont relevés au minimum ; les autres restent inchangés.
// La borne dynamique ne peut pas être représentée comme une contrainte littérale.
type _CheckBoundedDelay = DCommon.ExpectType<typeof boundedDelay, number, "strict">;
