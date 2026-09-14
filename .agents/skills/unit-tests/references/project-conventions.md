# Conventions du projet

Ces règles s'appliquent à tous les tests unitaires du monorepo DuploJS.

## Périmètre

Un test unitaire doit être pensé autour du **package courant comme unité sous test**.

Le fait qu'un package dépende d'autres packages de l'écosystème DuploJS n'interdit pas leur utilisation dans ses tests unitaires. Ces dépendances peuvent être nécessaires pour construire des entrées, utiliser des primitives communes ou vérifier correctement le comportement du module testé.

Le test doit cependant rester centré sur :

* le module actuellement testé ;
* son API ;
* son typage ;
* son comportement attendu.

Les autres packages utilisés restent des dépendances du test et ne deviennent pas eux-mêmes des unités à valider.

Les tests d'intégration répondent à un objectif différent : vérifier le package généré à travers son `dist`, ses exports publics, la résolution de ses dépendances et son fonctionnement dans un contexte proche d'un véritable projet consommateur.


## Organisation des fichiers

Chaque package possède un dossier `tests/` contenant ses tests unitaires.

L'arborescence de `tests/` doit être isomorphe à celle du dossier `scripts/`.

```text
scripts/
└── object/
    └── merge.ts

tests/
└── object/
    └── merge.test.ts
```

Sauf exception justifiée :

* un fichier source correspond à un fichier de test ;
* tous les tests d'un fichier source restent regroupés dans ce fichier de test ;
* le fichier de test reprend le nom du fichier source avec le suffixe `.test`.

Même lorsqu'un fichier source contient plusieurs fonctions, ses tests restent regroupés dans le fichier de test correspondant.

## Structure des tests

Tous les tests doivent être contenus dans un `describe`.

Ne pas déclarer de `it` ou de `test` isolé en dehors d'un `describe`.

```ts
describe("functionName", () => {
	it("returns the expected result", () => {
		// ...
	});
});
```

## Imports du module courant

Les tests situés dans `tests/` importent les éléments du package courant depuis `@scripts`. Cette convention est explicitement prévue pour les tests directs du package.

```ts
import {
	DNamespace,
} from "@scripts";
```

Ne pas importer directement un fichier interne de `scripts/`.

```ts
// À éviter
import {
	functionName,
} from "../scripts/domain/functionName";
```

Les namespaces doivent respecter les conventions d'importation du projet et utiliser leur nom long.

## Imports depuis les autres packages DuploJS

Lorsqu'un test utilise un domaine provenant d'un autre package DuploJS, l'import doit cibler directement le sous-export concerné et utiliser son namespace long.

```ts
import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
```

Ne pas importer ces domaines depuis l'index principal de `@duplojs/lang`.

```ts
// À éviter
import {
	DCommon,
	DEither,
} from "@duplojs/lang";
```

Les frontières publiques des packages doivent toujours être respectées. Un package ne doit consommer un autre package qu'à travers ses exports publics.

## Utilitaires communs

Les outils communs nécessaires aux tests fonctionnels et aux vérifications de typage proviennent du domaine `common` de `@duplojs/lang`.

```ts
import * as DCommon from "@duplojs/lang/common";
```

Cela concerne notamment :

```ts
DCommon.pipe(...);
DCommon.when(...);

type _Check = DCommon.ExpectType<
	Actual,
	Expected,
	"strict"
>;
```

Ne pas importer `pipe`, `when` ou `ExpectType` depuis `@scripts` lorsqu'ils proviennent de `@duplojs/lang/common`.

## Résultats `Either`

Lorsqu'une fonction retourne un `Either`, son résultat doit être interprété uniquement à l'aide des outils fournis par le domaine `DEither`.

```ts
import * as DEither from "@duplojs/lang/either";
```

Ne pas inspecter, déstructurer ou interpréter manuellement la représentation interne d'un `Either`.

Choisir la fonction `DEither` correspondant à l'intention du test afin que la résolution du résultat et son typage restent cohérents.

Par exemple :

```ts
const result = DEither.unwrapByInformationOrThrow(
	input,
	"success",
);

expect(result).toStrictEqual(expectedResult);
```

`DEither` est responsable de l'interprétation et du narrowing du résultat.

Une fois le résultat unwrap, sa valeur peut être vérifiée librement avec les assertions Vitest adaptées.

Les patterns détaillés permettant de choisir entre les différents outils `DEither` sont décrits dans [test-patterns.md](test-patterns.md).

## Conventions spécifiques au package

Un package peut définir des règles supplémentaires propres à ses tests unitaires dans :

```text
.agents/unit-tests.md
```

Avant de créer ou modifier des tests unitaires, vérifier si ce fichier existe dans le package courant.

Lorsqu'il est présent, ses instructions complètent les conventions générales définies par ce skill et doivent être prises en compte pour les tests du package concerné.

Les conventions spécifiques au package sont prioritaires lorsqu'elles précisent ou spécialisent une règle générale.

Elles ne doivent cependant pas être utilisées pour déduire des conventions applicables aux autres packages du monorepo.

## Export nécessaire aux tests

Les éléments du package courant doivent être testés à travers les exports disponibles depuis `@scripts`.

Si une fonction ne peut pas être testée uniquement parce que son fichier n'est pas exporté par le barrel correspondant, il est autorisé de modifier le fichier `index` concerné afin d'ajouter l'export manquant.

Cette modification doit être strictement limitée à l'exposition du fichier nécessaire au test.

Ne pas modifier l'implémentation de la fonction ou son comportement dans le but de rendre le test possible ou de le faire passer.
