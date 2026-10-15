/**
 * @title Discrimination par la forme des données.
 *
 * Sélectionner les variantes sans identité explicite par des patterns, y compris imbriqués.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DPattern from "@duplojs/lang/pattern";

// `match` est utile lorsque la donnée ne possède pas de discriminant propre.
//
// Ce type de structure est généralement à éviter dans le domaine,
// mais peut être imposé par une API, une base de données ou un système externe.
//
// Ici, aucune propriété commune ne permet d'identifier directement le cas.
// La discrimination doit donc être réalisée à partir de la shape de l'objet.

type ExternalProduct =
	| {
		id: string;
		price: number;
		merchant: {
			id: string;
			name: string;
		};
	}
	| {
		id: string;
		price: number;
		secondHand: {
			condition: "good" | "damaged";
			discount: number;
		};
	}
	| {
		id: string;
		unavailable: {
			reason: "deleted" | "out-of-stock";
			message: string;
		};
	};

declare const externalProduct: ExternalProduct;

// Le builder permet d'enchaîner plusieurs shapes.
//
// Après chaque `.with`, les valeurs correspondant au pattern sont retirées
// du type restant.
//
// La dernière branche peut donc devenir exhaustive même sans discriminant
// explicite sur la donnée.

// string
const productLabel = DPattern.match(externalProduct)
	.with(
		{
			merchant: {
				id: DCommon.isType("string"),
			},
		},
		// ExternalProduct possédant `merchant`
		(product) => `merchant:${product.merchant.name}`,
	)
	.with(
		{
			secondHand: {
				condition: DPattern.union(
					"good",
					"damaged",
				),
			},
		},
		// ExternalProduct possédant `secondHand`
		(product) => `second-hand:${product.secondHand.discount}`,
	)
	.with(
		{
			unavailable: {
				reason: DPattern.union(
					"deleted",
					"out-of-stock",
				),
			},
		},
		// ExternalProduct possédant `unavailable`
		(product) => `unavailable:${product.unavailable.reason}`,
	)
	.exhaustive();

// Les patterns peuvent être profondément imbriqués.
//
// Il est donc possible de discriminer à partir de propriétés internes,
// de literals, de tableaux, de predicates ou de plusieurs conditions combinées.
//
// Cette puissance est surtout utile pour adapter des données dont la shape
// n'a pas été conçue pour être facilement discriminable.

// La même discrimination peut être réalisée sous forme de pipe.
//
// Lorsqu'un `match` réussit, son résultat devient un `PatternResult`.
// Les étapes suivantes détectent ce résultat et ne tentent plus de le matcher.
//
// Chaque étape travaille donc uniquement avec les valeurs qui n'ont pas encore
// été traitées.

// string
const productLabelInPipe = DCommon.pipe(
	externalProduct,
	DPattern.match(
		{
			merchant: {
				id: DCommon.isType("string"),
			},
		},
		(product) => `merchant:${product.merchant.name}`,
	),
	DPattern.match(
		{
			secondHand: {
				condition: DPattern.union(
					"good",
					"damaged",
				),
			},
		},
		(product) => `second-hand:${product.secondHand.discount}`,
	),
	DPattern.match(
		{
			unavailable: {
				reason: DPattern.union(
					"deleted",
					"out-of-stock",
				),
			},
		},
		(product) => `unavailable:${product.unavailable.reason}`,
	),
	DPattern.exhaustive,
);

// Une sélection partielle peut se terminer par otherwise plutôt que par exhaustive.
// Le callback de repli reçoit précisément les formes qui restent à traiter.
const productLabelWithFallback = DPattern.match(externalProduct)
	.with(
		{ merchant: { id: DCommon.isType("string") } },
		(product) => `merchant:${product.merchant.name}`,
	)
	.otherwise((product) => product.id);

// Lorsque le modèle est contrôlé, privilégier une identité explicite.
// La sélection par forme sert surtout à adapter des données externes imposées par
// une API, une base de données ou une librairie.
