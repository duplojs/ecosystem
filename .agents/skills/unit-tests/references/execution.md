# Exécution et validation

Les tests unitaires utilisent **Vitest en mode workspace**.

Chaque package possède sa propre configuration Vitest et déclare son propre projet de test. L'exécution des tests doit cependant passer par les commandes définies au niveau de l'écosystème.

Vitest est configuré avec ses API globales. Les primitives comme `describe`, `it`, `expect` ou `vi` ne doivent donc pas être importées explicitement.

Les tests utilisent également le contexte TypeScript dédié défini par `tsconfig.test.json`.

## Prérequis

Le `dist` des packages doit être à jour avant les validations de typage et de lint.

L'ordre général de validation du projet est :

```text
Build
  ↓
Type checking + Lint
  ↓
Tests unitaires
```

Le type checking et le lint nécessitent donc un build à jour.

## Build

Pour construire l'ensemble du monorepo :

```bash
pnpm build
```

Lorsqu'un seul package est concerné et que ses dépendances internes sont déjà à jour :

```bash
pnpm --filter <package> build
```

## Type checking

Le typage des tests fait partie de leur validation.

Pour vérifier un package :

```bash
pnpm --filter <package> test:types
```

Pour cibler un fichier précis :

```bash
pnpm --filter <package> test:types:target <file-path>
```

Les tests de typage utilisant notamment `DCommon.ExpectType` ou `@ts-expect-error` ne doivent pas être considérés comme validés uniquement parce que Vitest s'exécute correctement. Le type checking doit également réussir.

## Lint

Pour vérifier un package :

```bash
pnpm --filter <package> test:lint
```

Pour cibler un fichier :

```bash
pnpm --filter <package> test:lint <file-path>
```

## Tests unitaires

Les tests unitaires sont exécutés à travers le workspace Vitest de l'écosystème.

Pour exécuter les tests d'un package :

```bash
pnpm test:ut -- --project <package>
```

Pour cibler un fichier précis :

```bash
pnpm test:ut -- --project <package> <file-path>
```

Pour exécuter tous les projets :

```bash
pnpm test:ut
```

Pendant le développement d'un test, privilégier l'exécution ciblée du fichier ou du package concerné.

Une validation plus large peut être effectuée une fois le test stabilisé.

## Coverage

L'objectif minimal est **100 % de couverture** pour le module testé.

La couverture doit être utilisée pour identifier les chemins d'exécution qui n'ont pas encore été exercés.

Atteindre 100 % ne signifie cependant pas que le travail est terminé. Vérifier également que :

* toutes les déclarations publiques pertinentes ont été testées ;
* les déclarations curifiées sont testées dans leur contexte d'utilisation ;
* les predicates vérifient leur narrowing ;
* les garanties importantes du typage sont couvertes ;
* les différents résultats possibles sont traités lorsque le contrat de la fonction l'exige.

Ne pas ajouter des tests uniquement pour faire augmenter artificiellement le pourcentage de couverture.

## Validation finale

Avant de considérer la modification terminée :

1. vérifier le typage ;
2. vérifier le lint ;
3. exécuter les tests unitaires concernés ;
4. vérifier que tous les tests passent ;
5. vérifier que le module atteint 100 % de couverture ;
6. vérifier que les garanties de typage attendues sont effectivement couvertes.

Si une validation révèle une incohérence entre le typage, l'intention et le comportement runtime, ne pas modifier l'implémentation pour faire passer les tests. Signaler l'incohérence conformément aux règles du skill.
