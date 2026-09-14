# Patterns de tests

Chaque déclaration publique d'une fonction doit être testée selon la forme d'utilisation pour laquelle elle a été conçue.

L'objectif n'est pas uniquement de vérifier son résultat à l'exécution, mais également de vérifier que l'inférence TypeScript fonctionne dans son contexte réel d'utilisation.

## Fonction directe

Une déclaration directe ne nécessite aucun contexte particulier.

```ts
describe("functionName", () => {
	it("returns the expected result", () => {
		expect(
			DNamespace.functionName(input, params),
		).toStrictEqual(expectedResult);
	});
});
```

Lorsque le typage du résultat constitue une garantie de l'API, le vérifier également avec `DCommon.ExpectType`.

```ts
const result = DNamespace.functionName(input, params);

type _CheckResult = DCommon.ExpectType<
	typeof result,
	ExpectedResult,
	"strict"
>;
```

## Déclaration curifiée

Une déclaration curifiée doit obligatoirement être testée dans `DCommon.pipe`.

L'appeler uniquement comme une fonction retournée en dehors d'un `pipe` ne permet pas de vérifier l'inférence pour laquelle cette déclaration existe.

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

Toutes les déclarations publiques doivent être couvertes. Tester la déclaration directe d'une fonction ne remplace pas le test de sa déclaration curifiée.

## Predicate direct

Un predicate doit être placé dans un `if` pour vérifier son narrowing TypeScript.

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

Le test du narrowing ne remplace pas la vérification runtime du predicate.

## Predicate curifié

La déclaration curifiée d'un predicate doit être testée dans son contexte réel d'utilisation : `DCommon.pipe` combiné à `DCommon.when`.

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

Les garanties TypeScript doivent être vérifiées dans le contexte qui provoque réellement l'inférence attendue.

La forme du test est déterminée par la déclaration :

* déclaration directe : appel direct ;
* déclaration curifiée : `DCommon.pipe` ;
* predicate direct : `if` ;
* predicate curifié : `DCommon.pipe` combiné à `DCommon.when`.

Utiliser `DCommon.ExpectType` avec `"strict"` lorsqu'une égalité exacte entre les types est attendue.

```ts
type _Check = DCommon.ExpectType<
	Actual,
	Expected,
	"strict"
>;
```

Une vérification runtime ne remplace jamais une vérification du contrat de typage.

Inversement, une vérification de typage ne remplace pas les assertions runtime nécessaires.

Lorsque l'API impose qu'une utilisation soit invalide au niveau TypeScript, utiliser également `@ts-expect-error` lorsque cela permet de vérifier explicitement cette garantie.

```ts
// @ts-expect-error input must be an either
DEither.expect("plain");
```

## Résolution d'un `Either` par information

Lorsqu'un test attend explicitement un résultat portant une information donnée, privilégier les outils de `DEither` permettant de sélectionner cette information et d'échouer immédiatement lorsqu'un autre résultat est obtenu.

```ts
const input = (
	Math.random() > -1
		? DEither.success(42)
		: DEither.error("message")
);

const result = DEither.unwrapByInformationOrThrow(
	input,
	"success",
);

expect(result).toBe(42);
```

`unwrapByInformationOrThrow` permet à la fois :

* d'exprimer clairement le résultat attendu ;
* de faire échouer le test si une autre information est obtenue ;
* de récupérer directement la valeur avec le narrowing correspondant.

Une fois la valeur unwrap, utiliser normalement les assertions Vitest pour vérifier son contenu.

## Garantie qu'une valeur est un `Either`

Lorsque le contrat testé garantit qu'une valeur doit être un `Either`, `DEither.expect` peut être utilisé pour matérialiser cette garantie.

```ts
const input = DEither.success(42);

const result = DEither.expect(input);

expect(result).toBe(input);

type _CheckResult = DCommon.ExpectType<
	typeof result,
	DEither.Success<42>,
	"strict"
>;

// @ts-expect-error input must be an either
DEither.expect("plain");
```

Ce pattern permet de vérifier conjointement le comportement runtime et la contrainte TypeScript.

## Sélection exhaustive des résultats d'un `Either`

Lorsque le test doit explicitement décider quels résultats sont acceptés ou rejetés, privilégier `DEither.unwrapSelectionOrThrow`.

```ts
const input = (
	Math.random() > -1
		? DEither.right("my-super-result", 42)
		: DEither.left("this-is-an-error", "error")
);

const result = DEither.unwrapSelectionOrThrow(
	input,
	{
		"my-super-result": true,
		"this-is-an-error": false,
	},
);
```

Ce pattern constitue un **checkpoint sur les résultats possibles**.

La sélection doit obliger le test à prendre explicitement position sur chaque résultat pertinent.

Ainsi, lorsqu'une nouvelle variante de résultat apparaît, le test doit conduire à reconsidérer intentionnellement son traitement plutôt que de l'accepter implicitement.

Utiliser ce pattern lorsqu'une évolution des résultats possibles doit nécessiter une décision explicite dans les tests.

## Observation des appels

Lorsqu'un test doit vérifier qu'une fonction est appelée, privilégier systématiquement les spies Vitest.

Ne pas créer une structure mutable uniquement pour enregistrer manuellement les appels.

```ts
// À éviter
const calls: unknown[] = [];

const callback = (value: unknown) => {
	calls.push(value);
};
```

Préférer :

```ts
const callback = vi.fn();

DNamespace.functionName(callback);

expect(callback).toHaveBeenCalled();
```

Les spies doivent également être privilégiés pour vérifier :

* le nombre d'appels ;
* les arguments reçus ;
* les appels successifs ;
* l'ordre des appels ;
* les valeurs retournées ou comportements associés aux différents appels.

Lorsqu'il faut vérifier la succession de plusieurs appels à une même fonction, utiliser l'historique et les assertions fournies par le spy plutôt que de reconstruire manuellement cet historique.

Une structure d'état dédiée reste pertinente lorsque cet état constitue lui-même une partie du comportement réellement testé.
