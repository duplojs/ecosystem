# Formes de tests

Chaque déclaration publique d'une fonction doit être testée selon la forme d'utilisation pour laquelle elle a été conçue.

L'objectif n'est pas uniquement de vérifier le résultat à l'exécution, mais également de vérifier que l'inférence TypeScript fonctionne dans son contexte réel d'utilisation.

## Structure des tests

Tous les tests doivent être regroupés dans un `describe`.

Un fichier de test ne doit pas contenir de `it` ou de `test` isolé en dehors d'un `describe`.

```ts
describe("functionName", () => {
	it("returns the expected result", () => {
		// ...
	});
});
```

## Imports

Les fonctions testées dans le package courant doivent être importées depuis `@scripts`, en respectant les règles d'importation du projet.

```ts
import {
	DNamespace,
} from "@scripts";
```

Ne pas importer directement un fichier interne de `scripts/`.

Les utilitaires `ExpectType`, `pipe` et `when` proviennent directement du domaine `common` de `@duplojs/lang`.

Ils doivent être utilisés à travers le namespace `DCommon` :

```ts
import * as DCommon from "@duplojs/lang/common";
```

Ainsi :

```ts
DCommon.pipe(...);
DCommon.when(...);

type _Check = DCommon.ExpectType<
	Actual,
	Expected,
	"strict"
>;
```

Ne pas importer `pipe`, `when` ou `ExpectType` depuis `@scripts` ou depuis un autre package de l'écosystème.

## Fonction directe

Une déclaration directe ne nécessite aucun contexte particulier. Elle peut être appelée directement dans le test.

```ts
describe("functionName", () => {
	it("returns the expected result", () => {
		expect(
			DNamespace.functionName(input, params),
		).toStrictEqual(expectedResult);
	});
});
```

## Déclaration curifiée

Une déclaration curifiée doit obligatoirement être testée à travers `DCommon.pipe`.

L'appeler directement en dehors d'un `pipe` ne permet pas de vérifier correctement l'inférence pour laquelle cette forme existe.

```ts
describe("functionName", () => {
	it("preserves inference in a pipe", () => {
		const result = DCommon.pipe(
			input,
			DNamespace.functionName(params),
		);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			ExpectedResult,
			"strict"
		>;

		expect(result).toStrictEqual(expectedResult);
	});
});
```

## Predicate direct

Un predicate doit être testé dans un `if` afin de vérifier son narrowing TypeScript.

```ts
describe("functionName", () => {
	it("narrows the direct input", () => {
		const input = value as Input;

		if (DNamespace.functionName(input, predicateParams)) {
			type _CheckInput = DCommon.ExpectType<
				typeof input,
				NarrowedInput,
				"strict"
			>;
		}
	});

	it("returns the expected runtime result", () => {
		expect(
			DNamespace.functionName(input, predicateParams),
		).toBe(expectedResult);
	});
});
```

Le test du narrowing ne remplace pas le test du comportement runtime. Les deux aspects doivent être vérifiés.

## Predicate curifié

La forme curifiée d'un predicate doit être testée dans son contexte réel d'utilisation : `DCommon.pipe` combiné à `DCommon.when`.

```ts
describe("functionName", () => {
	it("preserves narrowing in a pipe", () => {
		const result = DCommon.pipe(
			input,
			DCommon.when(
				DNamespace.functionName(predicateParams),
				(value) => {
					type _CheckValue = DCommon.ExpectType<
						typeof value,
						NarrowedInput,
						"strict"
					>;

					return transform(value);
				},
			),
		);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			ExpectedResult,
			"strict"
		>;

		expect(result).toStrictEqual(expectedResult);
	});
});
```

## Vérification du typage

Les garanties de typage doivent être vérifiées dans le contexte qui provoque réellement l'inférence attendue.

La forme du test est déterminée par la déclaration testée :

* déclaration directe : appel direct ;
* déclaration curifiée : `DCommon.pipe` ;
* predicate direct : `if` ;
* predicate curifié : `DCommon.pipe` combiné à `DCommon.when`.

Les vérifications de type utilisent `DCommon.ExpectType` avec le mode `"strict"` lorsque l'égalité exacte des types est attendue.

Une vérification runtime ne remplace jamais une vérification du contrat de typage.

Inversement, une vérification de typage ne remplace pas les assertions runtime nécessaires pour valider le comportement réel de la fonction.
