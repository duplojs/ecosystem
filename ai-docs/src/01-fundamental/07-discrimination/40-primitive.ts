/**
 * @title Primitives et élimination
 *
 * Pour les unions de literals `string` ou `number`, les fonctions
 * `matchWithString` et `matchWithNumber` sont les solutions à privilégier.
 *
 * Plus généralement, une donnée métier devrait autant que possible posséder
 * une identité explicite permettant d'utiliser les outils de discrimination
 * de DuploJS.
 *
 * Certaines données externes ne suivent cependant pas cette modélisation.
 * Une API, une base de données ou une librairie peut fournir des unions
 * d'objets dont la forme elle-même est la seule manière de distinguer les cas.
 *
 * `match`, `when` et `whenNot` permettent alors de réaliser une discrimination
 * par élimination : chaque pattern traite une partie de la donnée et réduit
 * progressivement les cas restant à résoudre.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DPattern from "@duplojs/lang/pattern";

declare const status: "pending" | "ready" | "failed";

// `matchWithString` discrimine exhaustivement une union de string literals.
//
// Chaque valeur possible doit posséder un handler et chaque callback reçoit
// précisément le literal correspondant.

// "wait" | "run" | "error"
const matchedStatus = DPattern.matchWithString(
	status,
	{
		// "pending"
		pending: () => "wait" as const,

		// "ready"
		ready: () => "run" as const,

		// "failed"
		failed: () => "error" as const,
	},
);

// La forme curried peut être utilisée directement dans un pipe.

// "wait" | "run" | "error"
const matchedStatusInPipe = DCommon.pipe(
	status,
	DPattern.matchWithString({
		pending: () => "wait" as const,
		ready: () => "run" as const,
		failed: () => "error" as const,
	}),
);

// La variante `otherwise` permet de ne sélectionner qu'une partie de l'union.
//
// Le callback `otherwise` reçoit précisément les literals non traités.

// "run" | "not-ready"
const matchedStatusOtherwise = DPattern.matchWithStringOtherwise(
	status,
	{
		ready: () => "run" as const,
	},
	// "pending" | "failed"
	() => "not-ready" as const,
);

declare const code: 200 | 404 | 500;

// `matchWithNumber` applique le même principe aux unions de number literals.

// "success" | "not-found" | "error"
const matchedCode = DPattern.matchWithNumber(
	code,
	{
		200: () => "success" as const,
		404: () => "not-found" as const,
		500: () => "error" as const,
	},
);

// `matchWithNumberOtherwise` permet également une sélection partielle.

// "success" | "error"
const matchedCodeOtherwise = DPattern.matchWithNumberOtherwise(
	code,
	{
		200: () => "success" as const,
	},
	// 404 | 500
	() => "error" as const,
);

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

// `when` permet d'effectuer cette même discrimination par élimination
// à partir d'un predicate.
//
// Il est préférable de réutiliser les predicates fournis par `@duplojs/lang`
// lorsqu'ils correspondent au besoin.
//
// Avec un type predicate, la branche traitée est retirée du type restant.

declare const externalValue: string | number | null;

// string | number | "empty"
const normalizedValue = DCommon.pipe(
	externalValue,
	DPattern.when(
		DCommon.isType("number"),
		// number
		(value) => value * 2,
	),
	DPattern.whenNot(
		DCommon.isType("string"),
		// null
		() => "empty" as const,
	),
	DPattern.when(
		DCommon.isType("string"),
		// string
		(value) => value.trim(),
	),
	DPattern.exhaustive,
);

// `whenNot` applique le predicate de manière inverse.
//
// Dans l'exemple précédent, après l'élimination des `number`,
// il ne reste que `string | null`.
//
// `whenNot(isType("string"))` sélectionne donc précisément `null`.

// Les predicates de literals peuvent également être construits avec
// les outils existants du package.

declare const framework: "duplojs" | "other";

// "known" | "unknown"
const frameworkResult = DCommon.pipe(
	framework,
	DPattern.whenNot(
		DCommon.equal("other"),
		// "duplojs"
		() => "known" as const,
	),
	DPattern.when(
		DCommon.equal("other"),
		// "other"
		() => "unknown" as const,
	),
	DPattern.exhaustive,
);

// `match`, `when` et `whenNot` sont donc principalement utiles lorsque
// la discrimination doit être déduite de la donnée elle-même.
//
// Lorsque le modèle peut être contrôlé, préférer une identité explicite
// (`Entity`, `Fact`, `TaggedObject`) ou une union de literals directement
// discriminable avec `matchWithString` ou `matchWithNumber`.
