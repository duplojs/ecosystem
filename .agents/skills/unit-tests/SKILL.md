---
name: unit-tests
description: Créer, modifier ou corriger des tests unitaires dans le monorepo DuploJS, notamment pour tester un comportement, ajouter des cas de test ou améliorer la couverture.
---

# Tests unitaires

Les tests unitaires doivent vérifier que l'exécution respecte l'intention du code.

L'intention n'est pas toujours explicitement documentée. Lorsqu'elle peut être déduite du typage, la déclaration de type doit être considérée comme la référence principale du comportement attendu.

Les tests doivent être écrits à partir de cette intention et non simplement reproduire le comportement observé à l'exécution.

Si une incohérence est constatée ou suspectée entre le typage et le comportement réel :

* ne pas modifier l'implémentation pour faire passer les tests ;
* ne pas adapter les tests au comportement observé ;
* conserver l'état actuel du comportement ;
* signaler explicitement l'incohérence au développeur.

L'ajout d'un export manquant dans un barrel du package est toutefois autorisé lorsqu'il est strictement nécessaire pour rendre le module accessible aux tests.


L'objectif minimal est d'obtenir **100 % de couverture**.

La couverture d'exécution ne suffit cependant pas. Les garanties apportées par le typage doivent également être testées, y compris lorsque certains tests semblent redondants du point de vue du runtime.

## Fonctions de l'écosystème

Dans tout le code des tests, utiliser obligatoirement les fonctions de l'écosystème dès qu'un équivalent existe. Avant de recourir à une méthode prototype, une API native ou une réimplémentation locale, vérifier l'existence de cet équivalent. Cette obligation s'applique à toutes les opérations, y compris la préparation des données et des valeurs attendues, dans les pipes comme en dehors.

En cas de besoin pour retrouver une fonction ou comprendre sa composition, la [documentation conceptuelle d'AgentKit](../../../packages/agents-kit/docs/concepts), notamment la rubrique [Currification](../../../packages/agents-kit/docs/concepts/01-fundamental/02-currying/index.md), peut servir de point d'entrée. Le routeur `packages/agents-kit/docs/concepts.llms.md` est généré au build. Consulter uniquement les pages pertinentes.

## Pipes et assertions

Appliquer les [règles de composition des pipes](../../curried-functions.md#composition-des-pipes). Dans les tests, récupérer le résultat du pipe dans une variable, puis écrire l'assertion séparément avec `expect(result)`.

Voir l'[exemple de préparation des arguments et d'assertion du résultat](references/test-patterns.md#pipe-et-assertions).

## Tests paramétrés

Dans `it.each`, chaque ligne associe explicitement les arguments à leur résultat attendu. Si l'attendu dépend du cas, le renseigner dans une propriété de la ligne, puis utiliser directement cette propriété dans l'assertion. Ne pas le sélectionner ou le calculer dans le corps du test avec un ternaire, un `if`, un `switch` ou tout autre branchement selon le cas courant. Si la préparation ou l'appel nécessite une logique différente, écrire des tests séparés.

```ts
import { DNumber } from "@scripts";

describe("max", () => {
	it.each([
		{ input: 1, limit: 3, expected: 3 },
		{ input: 5, limit: 3, expected: 5 },
	])("max($input, $limit) returns $expected", ({ input, limit, expected }) => {
		const result = DNumber.max([input, limit]);
		expect(result).toBe(expected);
	});
});
```

## Workflow

1. Identifier le package et le module concernés.
2. Déterminer l'intention à partir de l'API et de son typage.
3. Lire impérativement [les règles d'importation du projet](../../importations.md) avant d'inspecter, d'ajouter ou de modifier des imports.
4. Lire les conventions du projet dans [references/project-conventions.md](references/project-conventions.md).
5. Identifier les différentes formes de déclaration exposées par le module.
6. Appliquer les patterns correspondants décrits dans [references/test-patterns.md](references/test-patterns.md).
7. Créer ou modifier les tests nécessaires.
8. Valider les tests selon [references/execution.md](references/execution.md).
9. Vérifier que le comportement runtime et les garanties de typage sont couverts.
10. Si une incohérence entre typage et exécution apparaît, arrêter toute tentative de correction et la signaler.
