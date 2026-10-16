---
name: duplojs-test
description: "Rédiger ou modifier les tests de code utilisant DuploJS : assertions sur les Either, sélecteurs exhaustifs surveillant l'évolution des résultats, garanties de typage et remplacement des fonctions serveur. Oriente aussi les parcours E2E avec @duplojs/playwright."
---

# Tester avec DuploJS

## Trouver les concepts

Pour rechercher un concept ou une façon de faire, consulter en priorité `docs/concepts.llms.md` dans le package `@duplojs/agents-kit` et lire uniquement les pages et exemples pertinents pour la tâche. Le setup indique son chemin dans `AGENTS.md` ou `CLAUDE.md` : le résoudre depuis le dossier de ce fichier. Les chemins `docs/` partent de la racine du package installé ; les liens de chaque document se résolvent depuis son dossier. Même avec `--copy`, la documentation reste dans le package installé ; les références propres au skill se résolvent depuis son `SKILL.md`.

Si le chemin du routeur manque, le retrouver depuis le projet consommateur :

```sh
node --input-type=module -e 'import { fileURLToPath } from "node:url"; console.log(fileURLToPath(import.meta.resolve("@duplojs/agents-kit/docs/concepts.llms.md")))'
```

## Partir du contrat testé

Lire la signature et les résultats possibles de la fonction avant d'écrire ses assertions. Préparer les données avec les outils DuploJS et conserver le type de retour complet jusqu'à la sélection du résultat attendu. Utiliser les imports publics des domaines avec leur namespace long.

Les outils du runner gardent leur rôle pour les assertions et les spies ; les exemples utilisent Vitest. Ce skill apporte les pratiques propres à DuploJS, à adapter au runner et à l'organisation du projet consommateur.

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

Lire [Résultats, sélecteurs et typage](references/results.md) pour les exemples et le choix d'un contrôle exhaustif.

## Surveiller l'évolution des résultats

Lorsqu'un test doit imposer une révision des résultats possibles, passer le résultat complet à `DEither.unwrapSelectionOrThrow` et renseigner chaque information avec `true` ou `false`. Le sélecteur doit exprimer ce que ce scénario accepte ; généralement une seule information est à `true`. Une information exclue provoque une exception au runtime.

L'ajout d'une information dans le type de retour rend le sélecteur incomplet et provoque une erreur de typage. **Il ne se met pas à jour automatiquement** : décider explicitement si la nouvelle information est acceptée ou rejetée. Ne pas contourner cette alerte par un cast, un dictionnaire générique ou un narrowing préalable qui masquerait la nouvelle variante. Exécuter le contrôle TypeScript des tests : le runner seul ne garantit pas cette surveillance.

Une sélection par information précise n'est pas exhaustive et n'impose pas cette révision lorsqu'une autre variante apparaît. Un sélecteur exhaustif surveille les informations de l'union qui lui est fournie ; il ne détecte pas une nouvelle erreur interne partageant une information existante. Vérifier séparément le type ou l'identifiant de l'erreur contenue lorsque ce contrat compte.

## Isoler les dépendances serveur

Pour les capacités de `@duplojs/server` exposées via son mécanisme d'implémentation, préférer `setEnvironment("TEST")` et `TESTImplementation.set` aux mocks de modules ou aux spies sur leurs exports. Enregistrer chaque fonction effectivement appelée, y compris indirectement : une implémentation absente lève une erreur, sans repli vers le runtime natif.

Lire [Remplacer les fonctions serveur](references/server.md) pour injecter des retours typés, observer les appels et nettoyer l'état partagé même si un test échoue. Les autres dépendances peuvent utiliser les mocks habituels du runner.

## Vérifier les garanties de typage

Quand l'inférence ou le narrowing fait partie du contrat testé, ajouter `DCommon.ExpectType` avec `"strict"` à côté des assertions runtime. Vérifier une API curifiée dans `DCommon.pipe` ou `DCommon.asyncPipe` ; pour un predicate, vérifier le narrowing dans un `if`, ou dans `DCommon.when` pour la forme curifiée. Réserver `@ts-expect-error` aux usages que le contrat doit refuser, avec une explication.

Une vérification de type ne remplace pas une assertion runtime, et réciproquement. Préparer les arguments indépendants avant le pipe, récupérer son résultat dans une variable puis écrire l'assertion séparément. Rechercher « Tester un résultat Either » dans le routeur pour les exemples conceptuels de ces usages.

## Organiser un parcours E2E

Pour un test de navigateur avec `@duplojs/playwright`, lire les concepts « Initialiser le client E2E », « Architecturer une suite E2E » et « Ecrire un parcours de test » selon le besoin. Construire le contexte avec `Website`, déclarer les écrans avec `createPage` et leurs zones réutilisables avec `createComponent`. Garder les locators dans ces objets, puis exprimer les scénarios par leurs éléments, leurs méthodes nommées et les helpers `Actions` / `Assertions`.
