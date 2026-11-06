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
declare const input: Input;

// Appel classique : traiter la branche other et conserver known pour la suite.
const selected = DPattern.whenNot(input, DPattern.isMatch({ kind: "known" }), (value) => {
	type _CheckValue = DCommon.ExpectType<typeof value, {
		kind: "other";
		value: string;
	}, "strict">;

	return DString.toUpperCase(value.value);
});
// Other produit un texte enveloppé ; known reste une valeur non traitée.
type _CheckSelected = DCommon.ExpectType<
	typeof selected,
	{
		kind: "known";
		id: number;
	} | DPattern.PatternResult<Uppercase<string>>,
	"strict"
>;

// Appel curifié : préserver les résultats précédents, puis terminer les cas restants.
declare const partiallyHandled: Input | DPattern.PatternResult<Uppercase<string>>;
const piped = DCommon.pipe(
	partiallyHandled,
	DPattern.whenNot(
		DPattern.isMatch({ kind: "known" }),
		(value) => DString.toUpperCase(value.value),
	),
	DPattern.otherwise(
		(value) => value.id,
	),
);
// Les résultats précédents sont transmis ; other est normalisé et known fournit son id.
// otherwise déballe le résultat final : aucun PatternResult ne subsiste dans la sortie.
type _CheckPiped = DCommon.ExpectType<typeof piped, Uppercase<string> | number, "strict">;

// Predicates imbriqués : étiqueter les états tout en conservant leurs littéraux.
declare const state: "ready" | "queued" | "blocked";
const pendingState = DPattern.whenNot(
	state,
	DCommon.or([DCommon.equal("ready"), DCommon.equal("queued")]),
	DString.prepend("Attention : "),
);
type _CheckPendingState = DCommon.ExpectType<
	typeof pendingState,
	"ready" | "queued" | DPattern.PatternResult<"Attention : blocked">,
	"strict"
>;

const labeledState = DCommon.pipe(
	pendingState,
	DPattern.when(
		DCommon.equal("ready"),
		DString.toUpperCase,
	),
	DPattern.otherwise(
		DString.prepend("En attente : "),
	),
);
// Une branche déjà enveloppée n'est pas traitée une seconde fois par les étapes suivantes.
type _CheckLabeledState = DCommon.ExpectType<
	typeof labeledState,
	"Attention : blocked" | "READY" | "En attente : queued",
	"strict"
>;

// Test booléen : ajouter les frais de livraison seulement sous un seuil dynamique.
declare const orderTotal: number;
declare const freeShippingThreshold: number;
declare const shippingFee: number;
const shippingApplied = DPattern.whenNot(
	orderTotal,
	DNumber.greaterThanOrEqual(freeShippingThreshold),
	(value) => {
		type _CheckValue = DCommon.ExpectType<typeof value, number, "strict">;

		return DNumber.sum([value, shippingFee]);
	},
);
// Les petites commandes sont enveloppées après ajout des frais ; les autres restent brutes.
type _CheckShippingApplied = DCommon.ExpectType<
	typeof shippingApplied,
	number | DPattern.PatternResult<number>,
	"strict"
>;

const pricedTotal = DCommon.pipe(
	shippingApplied,
	DPattern.otherwise(
		DCommon.forward,
	),
);
// otherwise conserve le total des commandes sans frais ou déballe le total avec frais.
// Le test booléen laisse number parmi les cas restants : exhaustive ne conviendrait pas.
type _CheckPricedTotal = DCommon.ExpectType<typeof pricedTotal, number, "strict">;

// Contrainte préservée : signaler les découverts et garder les soldes positifs ou nuls.
declare const balance: number;
const checkedBalance = DPattern.whenNot(balance, DNumber.isPositive, DCommon.justReturn("à découvert"));
// Un solde négatif donne un PatternResult ; zéro et les soldes positifs restent des nombres.
type _CheckCheckedBalance = DCommon.ExpectType<
	typeof checkedBalance,
	(number & DNumber.Positive) | DPattern.PatternResult<"à découvert">,
	"strict"
>;
