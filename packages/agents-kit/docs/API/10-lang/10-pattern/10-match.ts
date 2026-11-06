/**
 * @title DPattern.match
 *
 * Traiter une valeur selon un motif et conserver les cas qui ne correspondent pas.
 */
import * as DPattern from "@duplojs/lang/pattern";
import * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";
import * as DNumber from "@duplojs/lang/number";

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
		DCommon.forward,
	),
);
// Les chaînes sont mises en majuscules ; number et null restent inchangés.
type _CheckSelected = DCommon.ExpectType<typeof selected, Uppercase<string> | number | null, "strict">;

// Sélection inverse dans le builder : traiter les états en lecture seule avant les états actifs.
declare const state: "ready" | "draft" | "archived";
const byPredicates = DPattern.match(state)
	.whenNot(
		DCommon.or([DCommon.equal("ready"), DCommon.equal("draft")]),
		DString.prepend("Lecture seule : "),
	)
	.when(DCommon.equal("ready"), DString.toUpperCase)
	.with("draft", DString.prepend("À compléter : "))
	.exhaustive();
// whenNot traite archived ; seuls ready et draft doivent encore être couverts.
type _CheckByPredicates = DCommon.ExpectType<
	typeof byPredicates,
	"Lecture seule : archived" | "READY" | "À compléter : draft",
	"strict"
>;

// Test booléen dans whenNot : le montant reste à traiter lorsque la livraison est offerte.
declare const orderTotal: number;
declare const freeShippingThreshold: number;
declare const shippingFee: number;
const withShipping = DPattern.match(orderTotal)
	.whenNot(DNumber.greaterThanOrEqual(freeShippingThreshold), (value) => {
		type _CheckValue = DCommon.ExpectType<typeof value, number, "strict">;

		return DNumber.sum([value, shippingFee]);
	});
// Le seuil dynamique ne retire pas number des cas restants : exhaustive n'est pas disponible.
type _CheckWithShipping = DCommon.ExpectType<typeof withShipping, DPattern.MatchBuilder<number, number>, "strict">;

const pricedTotal = withShipping.otherwise(DCommon.forward);
// Les petites commandes reçoivent les frais ; les autres conservent leur montant initial.
type _CheckPricedTotal = DCommon.ExpectType<typeof pricedTotal, number, "strict">;

// Motifs littéraux combinés : union regroupe plusieurs valeurs dans une même branche.
const byValue = DPattern.match(state)
	.with(DPattern.union("ready", "draft"), DString.toUpperCase)
	.otherwise(DString.toUpperCase);
// La valeur obtenue est "READY", "DRAFT" ou "ARCHIVED", selon l’entrée.
type _CheckByValue = DCommon.ExpectType<typeof byValue, "READY" | "DRAFT" | "ARCHIVED", "strict">;
