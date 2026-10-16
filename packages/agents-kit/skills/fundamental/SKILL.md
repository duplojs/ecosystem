---
name: duplojs-fundamental
description: "Appliquer les API et la philosophie fonctionnelle DuploJS pour toute tâche impliquant du code TypeScript, quel que soit le contexte d'exécution."
---

# Fondamentaux DuploJS

## Trouver les concepts

Pour rechercher un concept ou une façon de faire, consulter en priorité `docs/concepts.llms.md` dans le package `@duplojs/agents-kit` et lire uniquement les pages et exemples pertinents pour la tâche. Le setup indique son chemin dans `AGENTS.md` ou `CLAUDE.md` : le résoudre depuis le dossier de ce fichier. Les chemins `docs/` partent de la racine du package installé ; les liens de chaque document se résolvent depuis son dossier. Même avec `--copy`, la documentation reste dans le package installé ; les références propres au skill se résolvent depuis son `SKILL.md`.

Si le chemin du routeur manque, le retrouver depuis le projet consommateur :

```sh
node --input-type=module -e 'import { fileURLToPath } from "node:url"; console.log(fileURLToPath(import.meta.resolve("@duplojs/agents-kit/docs/concepts.llms.md")))'
```

## Utiliser DuploJS pour coder

Utiliser obligatoirement les API et l'écosystème DuploJS dès qu'un équivalent existe, y compris dans les tests. Avant d'utiliser une API native ou tierce ou de créer un utilitaire, chercher l'équivalent DuploJS.

- `@duplojs/lang` : primitives et manipulations JavaScript indépendantes de la plateforme.
- `@duplojs/server` : interactions avec l'environnement d'exécution serveur, notamment le système de fichiers. Par exemple, calculer un chemin avec `lang/path` et lire un fichier avec `server/file`.
- Pour un besoin spécialisé, rechercher le package et les API adaptés dans l'écosystème à partir de la documentation.

Importer le sous-export du domaine avec son namespace long lorsqu'il est exposé, comme dans les exemples liés depuis les références.

## Laisser les types s'inférer

Laisser TypeScript inférer les retours des fonctions et les valeurs issues des appels pour que leurs types suivent l'implémentation et ses dépendances. Ne pas reconstituer manuellement un type que l'expression ou l'API peut inférer. Annoter un type de retour uniquement pour résoudre une récursivité.

## Faire évoluer le code à l'endroit responsable

Pour toute tâche de code, lire les définitions, les contrats et les appelants concernés avant de choisir où intervenir. Intégrer le besoin dans la fonction, le modèle ou le module qui porte cette responsabilité. Si une modification multiplie les conditions, les adaptations ou les imbrications dans le traitement ou chez ses appelants, réexaminer la déclaration d'origine et simplifier la partie concernée plutôt qu'accumuler des contournements autour d'elle.

Privilégier les fonctions pures, l'immutabilité et des transformations explicites. Isoler les interactions avec l'environnement et représenter les échecs dans les types de retour. Recomposer les étapes ou extraire une responsabilité lorsque cela clarifie le traitement, en conservant les garanties métier et le rôle de chaque couche.

Limiter le remaniement au besoin demandé, puis relire la partie modifiée avec ses usages : déroulement compréhensible, absence de duplication et complexité proportionnée. Adapter les appelants concernés et vérifier les contrats ainsi que le comportement attendu.

## Composer les transformations

De nombreuses fonctions proposent une forme curifiée pour `DCommon.pipe` : fournir les paramètres fixes, puis laisser le pipe transmettre la donnée entre les étapes d'une même transformation.

Un appel simple peut rester direct. Préparer séparément les arguments issus de sources indépendantes avant de les combiner. Lire [Composition](references/composition.md) pour composer un traitement ou gérer l'asynchronisme.

## Valider les entrées et conserver les garanties

Toute donnée entrante est non sûre et passe par un data parser. Décrire son contrat avec une `DDataStructure`, en utilisant l'intégration prévue par le module qui reçoit la donnée lorsqu'elle existe. Exploiter ensuite les valeurs validées.

Préciser les contraintes utiles : bornes, entier, format, longueur minimale, maximale ou exacte. Une contrainte enrichit le type ; sa seule déclaration ne valide rien au runtime.

Choisir la construction selon les informations disponibles :

1. **Littéral ou garantie compatible** : `DCommon.cast`, `DCommon.infer` pour conserver le littéral, ou un helper comme `DPath.declarePath`. Pour Chrono, préférer la surcharge littérale sûre.
2. **Valeur runtime sans preuve** : validation ou fabrique sûre renvoyant un `Either` à traiter ou propager.
3. **Refus de `cast` ou `infer`** : ne pas forcer avec `as`, `!` ou un helper sans preuve. Si un paramètre générique direct bloque l'inférence, ajouter `satisfies` avec le type contraint attendu ; sinon choisir une autre construction sûre.

`cast` et `infer` calculent une compatibilité de types, sans validation runtime. Lire [Contraintes et validation](references/constraints-and-validation.md) pour choisir une construction ou résoudre une difficulté de typage.

Exploiter les garanties propagées par les fonctions : `MinElements<2>` garantit `first`, `last` et `at` aux indices `0` et `1`, sans absence ajoutée au type. Ne pas ajouter de garde ou d'assertion redondante. Respecter le nouveau type si une transformation perd une garantie.

## Renvoyer les échecs, décider à la frontière d'exécution

Une fonction réutilisable qui peut échouer renvoie un `Either` : `Right` pour la réussite, `Left` pour l'échec. Résoudre, propager ou adapter le `Left` en conservant l'échec dans le type de retour. Discriminer avant de déballer ; composer avec les outils `DEither`.

La frontière d'exécution est l'endroit responsable de décider de l'effet final du traitement. Elle interprète le `Left` et peut produire une réponse, terminer l'exécution ou lever une exception adaptée. Ses sous-fonctions renvoient leurs résultats sans `throw` caché, quel que soit le mécanisme qui déclenche l'exécution.

Préférer les déclarations sûres et les `Either` à `OrThrow`. **Ne jamais utiliser `OrThrow` pour valider ou contraindre une donnée externe**, quelle que soit sa provenance. Même au point d'entrée, valider puis interpréter le résultat.

Exceptions limitées : préparation de valeurs en tests sans déclaration sûre adaptée ; configuration de l'environnement au démarrage ; opération d'environnement sans entrée externe dont l'échec est très rare et la propagation très coûteuse en complexité, comme le répertoire courant. Lire [Résultats et erreurs](references/results-and-errors.md) avant d'utiliser `throw` ou `OrThrow`.
