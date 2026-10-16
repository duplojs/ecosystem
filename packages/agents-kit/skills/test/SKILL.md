---
name: duplojs-test
description: "Écrire ou corriger des tests DuploJS : vérifier les résultats Either et le typage, isoler les capacités serveur ou organiser un parcours E2E avec @duplojs/playwright."
---

# Tester avec DuploJS

## Trouver les concepts

Appliquer la démarche du skill et lire les ressources indiquées lorsque leur condition est rencontrée. Pour rechercher un concept ou un mécanisme non couvert, consulter `docs/concepts.llms.md` du package `@duplojs/agents-kit`.

Le setup indique ce chemin dans `AGENTS.md` ou `CLAUDE.md`, relativement à leur dossier. Les chemins `docs/` partent du package installé, même avec `--copy`. Les références du skill partent de son dossier ; les liens d'un document se résolvent depuis ce document.

Si le chemin du routeur manque, le retrouver depuis le projet consommateur :

```sh
node --input-type=module -e 'import { fileURLToPath } from "node:url"; console.log(fileURLToPath(import.meta.resolve("@duplojs/agents-kit/docs/concepts.llms.md")))'
```

## Partir du contrat testé

Lire la signature et les résultats possibles de la fonction avant d'écrire ses assertions. Préparer les données avec les outils DuploJS et conserver le type de retour complet jusqu'à la sélection du résultat attendu. Utiliser les imports publics des domaines avec leur namespace long.

Les outils du runner gardent leur rôle pour les assertions et les spies ; les exemples utilisent Vitest. Ce skill apporte les pratiques propres à DuploJS, à adapter au runner et à l'organisation du projet consommateur.

| Garantie à vérifier | Démarche et ressource à lire |
| --- | --- |
| Une branche de résultat et sa valeur à l'exécution | Sélectionner le résultat puis écrire l'assertion : [Résultats, sélecteurs et typage](references/results.md) et l'[exemple autonome](references/examples/results.ts). |
| L'inférence, le narrowing ou l'évolution d'un contrat | Ajouter les vérifications de type adaptées et exécuter le contrôle TypeScript des tests. Pour les formes curifiées et les assertions de type, lire `docs/concepts/04-tests/01-unit/10-either.ts`. |
| Un traitement utilisant une capacité serveur à isoler | Injecter l'implémentation de test : [Remplacer les fonctions serveur](references/server.md) et l'[exemple de lecture](references/examples/server.ts). |
| Un parcours dans le navigateur | Suivre la démarche E2E ci-dessous ; ses objets de pages et composants portent les interactions du scénario. |

## Sélectionner le résultat attendu et vérifier sa valeur

Un résultat `Either` porte une information et une valeur. Dans un test, `DEither.unwrapByInformationOrThrow` permet de sélectionner l'information attendue, de faire échouer immédiatement le test si une autre information est obtenue, puis de récupérer la valeur avec son type précis. Utiliser ce mécanisme aussi pour un échec attendu : sélectionner son information, puis vérifier l'erreur ou la donnée qu'il contient.

Choisir l'outil selon l'intention :

| Intention du test | Outil |
| --- | --- |
| Attendre une information précise | `DEither.unwrapByInformationOrThrow` |
| Accepter ou rejeter explicitement chaque information possible | `DEither.unwrapSelectionOrThrow` |
| Vérifier seulement le côté du résultat, sans information précise | `DEither.unwrapRightOrThrow` ou `DEither.unwrapLeftOrThrow` |
| Vérifier dans le typage qu'une valeur est déjà un `Either`, sans l'extraire | `DEither.expect` |

Les variantes qui lèvent sont utiles dans les tests : une branche inattendue doit les interrompre. Après l'extraction, écrire une assertion sur le contenu ; la sélection ne prouve pas que la valeur est correcte. Éviter un simple unwrap qui perdrait l'information attendue ou une assertion placée uniquement dans un `if` qui pourrait ne jamais s'exécuter. Cette pratique de test ne justifie pas de remplacer les résultats sûrs du code applicatif par des exceptions.

## Surveiller l'évolution des résultats

Utiliser `DEither.unwrapSelectionOrThrow` lorsqu'un test doit imposer une décision à chaque ajout d'information au contrat. Lui transmettre le résultat complet et décider explicitement des cas acceptés ou rejetés. Une sélection par information précise suffit lorsque le scénario n'a pas cette responsabilité de surveillance.

Pour un point de surveillance exhaustif, lire la section correspondante de la référence sur les résultats avant de construire le sélecteur : le contrôle doit recevoir l'union complète. Exécuter le contrôle TypeScript des tests ; le runner seul ne garantit pas cette surveillance.

## Isoler les dépendances serveur

Pour les capacités de `@duplojs/server` exposées via son mécanisme d'implémentation, préférer `setEnvironment("TEST")` et `TESTImplementation.set` aux mocks de modules ou aux spies sur leurs exports. Enregistrer chaque fonction effectivement appelée, y compris indirectement : une implémentation absente lève une erreur, sans repli vers le runtime natif.

Nettoyer le registre et rétablir l'environnement après chaque test, même en échec ; éviter les tests concurrents qui modifient ce même état. La référence serveur détaille ce cycle et les retours typés à injecter. Les autres dépendances peuvent utiliser les mocks habituels du runner.

## Vérifier les garanties de typage

Quand l'inférence ou le narrowing fait partie du contrat testé, ajouter `DCommon.ExpectType` avec `"strict"` à côté des assertions runtime. Vérifier une API curifiée dans `DCommon.pipe` ou `DCommon.asyncPipe` ; pour un predicate, vérifier le narrowing dans un `if`, ou dans `DCommon.when` pour la forme curifiée. Réserver `@ts-expect-error` aux usages que le contrat doit refuser, avec une explication.

Une vérification de type et une assertion runtime contrôlent des garanties différentes. Préparer les arguments indépendants avant le pipe, récupérer son résultat dans une variable puis écrire l'assertion séparément. Exécuter le contrôle TypeScript lorsque des garanties de type sont vérifiées, puis les tests runtime concernés.

## Organiser un parcours E2E

Avec `@duplojs/playwright`, construire le contexte avec `Website`, les écrans avec `createPage` et leurs zones réutilisables avec `createComponent`. Garder les locators dans ces objets, puis exprimer les scénarios par leurs éléments, méthodes nommées et helpers `Actions` / `Assertions`.

Les concepts sous `docs/concepts/04-tests/02-e2e/` se lisent selon l'intervention : `10-init.ts` pour initialiser le client, `20-architecture.ts` pour créer ou modifier pages et composants, `30-testing.ts` pour écrire le parcours et ses assertions. Reprendre les objets existants lorsque le scénario les utilise déjà.
