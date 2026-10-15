/**
 * @title Discrimination par prédicats et élimination.
 *
 * Affiner les branches et réduire les cas restants, avec sélection positive ou inverse.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DPattern from "@duplojs/lang/pattern";
import * as DString from "@duplojs/lang/string";

// when et whenNot discriminent par élimination
// à partir d’un predicate, sans nécessiter de pattern décrivant la forme.
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
		DString.trim,
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

// Les étapes when et whenNot produisent aussi un PatternResult après sélection.
// Les étapes suivantes le transmettent sans réexaminer sa valeur.
// exhaustive termine le pipe uniquement lorsque le typage n’a plus de cas non traités.

// Un predicate retournant seulement boolean ne permet pas d’éliminer une variante dans le typage.
// otherwise termine alors le traitement avec une branche de repli sur les cas restants.
const valueWithFallback = DCommon.pipe(
	externalValue,
	DPattern.when(
		(value): boolean => value === null,
		() => "empty" as const,
	),
	DPattern.otherwise((value) => value),
);
