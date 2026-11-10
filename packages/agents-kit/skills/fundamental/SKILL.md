---
name: duplojs-fundamental
description: "Appliquer les API et la philosophie fonctionnelle DuploJS pour toute tâche impliquant du code TypeScript, quel que soit le contexte d'exécution."
---

# Fondamentaux DuploJS

## Trouver les concepts

Appliquer la démarche du skill et lire les ressources indiquées lorsque leur condition est rencontrée. Pour rechercher un concept ou un mécanisme non couvert, consulter `docs/concepts.llms.md` du package `@duplojs/agents-kit`.

Le setup indique ce chemin dans `AGENTS.md` ou `CLAUDE.md`, relativement à leur dossier. Les chemins `docs/` partent du package installé, même avec `--copy`. Les références du skill partent de son dossier ; les liens d'un document se résolvent depuis ce document.

Si le chemin du routeur manque, le retrouver depuis le projet consommateur :

```sh
node --input-type=module -e 'import { fileURLToPath } from "node:url"; console.log(fileURLToPath(import.meta.resolve("@duplojs/agents-kit/docs/concepts.llms.md")))'
```

## Utiliser les API DuploJS

Utiliser obligatoirement l'équivalent DuploJS avant une API native, tierce ou un nouvel utilitaire, y compris dans les tests. Chercher dans `lang` pour les primitives indépendantes de la plateforme, dans `server` pour les interactions avec l'environnement, puis dans les packages spécialisés.

Importer le sous-export du domaine avec son namespace long, comme dans les exemples des références.

## Modifier à l'endroit responsable

Lire les contrats, définitions et appelants concernés ; intégrer le besoin dans la fonction, le modèle ou le module responsable. Limiter le remaniement au besoin, adapter les usages et vérifier les garanties conservées.

Privilégier fonctions pures, immutabilité et transformations explicites ; isoler les interactions avec l'environnement.

## Laisser les types s'inférer

Laisser TypeScript inférer les valeurs et les retours des implémentations. Annoter un retour uniquement pour résoudre une récursivité ; les signatures d'interfaces et les déclarations de fonctions décrivent des contrats, pas cette annotation dans l'implémentation.

## Composer les transformations

Si la fonction retournée par une forme curifiée ne déclare pas ses propres génériques, écrire l'appel de configuration directement dans l'étape de `DCommon.pipe` ou `asyncPipe` : son contexte permet l'inférence. Ne pas préparer cette étape dans une variable ni forcer son typage par génériques, annotations ou casts. Lire [Composition](references/composition.md) lors de l'emploi d'une forme curifiée pour distinguer les deux niveaux de génériques.

Écrire chaque argument du pipe sur sa propre ligne, avec virgule finale et fermeture séparée, même pour une donnée et une seule étape. Un appel simple peut rester direct ; préparer séparément les données de sources indépendantes avant de les combiner.

Choisir `DCommon.asyncPipe` pour attendre les étapes, ou `DEither.rightPipe` / `rightAsyncPipe` pour transmettre les valeurs des `Right` et arrêter au premier `Left`. À toute étape produisant des états à sélectionner, composer production et sélection dans un pipe interne à sa callback, avant le déballage par le pipe extérieur. Lire [Composition](references/composition.md) pour ces enchaînements de résultats.

## Remplacer les boucles impératives

Ne pas écrire de `for`, de `while` ni leurs variantes. Utiliser :

- `DArray.reduce` pour parcourir un tableau avec un accumulateur ; `DGenerator.reduce` pour un autre itérable.
- `DGenerator.asyncReduce` pour un parcours asynchrone, y compris sur un tableau.
- `DCommon.loop` pour une répétition conditionnelle ; `DCommon.asyncLoop` en asynchrone.
- `DCommon.loopAccumulator` et `DCommon.asyncLoopAccumulator` pour transporter un accumulateur entre les tours d’une répétition conditionnelle.
- `DGenerator.loop` et `DGenerator.asyncLoop` pour produire une séquence ; leurs variantes `loopAccumulator` transportent aussi un accumulateur.

Dans les variantes `loopAccumulator`, transmettre l'état avec `next(nouvelAccumulateur)` ; `DGenerator.loop` et `DGenerator.asyncLoop` utilisent `next` pour émettre des valeurs. Dans `DCommon.loop` et `DCommon.asyncLoop`, `next` poursuit la boucle sans transmettre son argument au tour suivant. Terminer avec `exit`. Avant de créer ou remplacer une boucle, lire [Itérations](references/iterations.md) pour les contrats de ces callbacks. Pour une simple transformation ou sélection, utiliser directement `DArray.map` ou `DArray.filter`.

## Valider les entrées et conserver les garanties

Valider les données externes avec une `DDataStructure`, via l'intégration du module récepteur lorsqu'elle existe. Décrire les contraintes utiles : bornes, entier, format ou longueur. Une contrainte déclarée ne valide rien au runtime ; dans les traitements internes, réutiliser les garanties établies.

Choisir selon la preuve disponible :

- **Littéral ou garantie compatible** : déclaration sûre ou `DCommon.cast` ; `DCommon.infer` pour conserver aussi le littéral. Ces fonctions calculent une compatibilité statique, sans validation runtime.
- **Valeur runtime sans preuve** : validation ou fabrique sûre, puis traitement du `Either`.
- **Refus du compilateur** : vérifier l'inférence et l'origine de la garantie ; ne pas la fabriquer avec `as`, `!` ou un helper sans preuve.

Lire [Contraintes et validation](references/constraints-and-validation.md) pour construire un contrat, une valeur contrainte ou résoudre un refus de compatibilité. Après chaque transformation, suivre les garanties restantes et exploiter les accès garantis sans garde redondante.

## Représenter les résultats et propager les erreurs

Utiliser `DEither.result` lorsqu'une fonction doit établir des états sans décider de leur caractère favorable ou défavorable. L'information distingue les états ; la valeur porte leur contexte. Tous ces `Result` sont des `Right` : `isRight` ne choisit pas un état particulier.

Lorsque la fonction décide d'une réussite ou d'un refus prévisible, les exprimer en `Right` ou `Left`, y compris pour les absences et refus techniques. Si une branche renvoie un `Either`, toutes en renvoient un ; utiliser `DEither.ok()` pour une réussite sans valeur.

Chez le consommateur, sélectionner les issues qui autorisent la suite avec `keepAsRightByInformation` ; les autres deviennent des `Left` en conservant information et valeur. Utiliser un sélecteur exhaustif comme `keepAsRightSelection` ou `matchInformation` lorsqu'une nouvelle variante doit obliger à réexaminer la décision.

`unwrapRight` extrait les valeurs des `Right` et conserve les `Left` : le pattern sélection → `unwrapRight` → garde `isLeft` permet un retour anticipé sûr. Propager ou adapter les refus dans les fonctions réutilisables. Lire [Résultats et erreurs](references/results-and-errors.md) pour choisir la sélection et l'extraction.

Les exceptions imprévues des dépendances ou du runtime remontent implicitement. Réserver les `throw` explicites et `OrThrow` à la consommation finale du résultat par la frontière d'exécution. Une fonction réutilisable n'ajoute pas de `throw`, même appelée depuis cette frontière. La rareté du refus ou son coût de propagation ne changent pas cette règle.

Avant d'adapter une API qui lève sur un refus prévisible ou d'introduire `OrThrow`, lire [Résultats et erreurs](references/results-and-errors.md). Préférer les déclarations sûres pour les constantes connues.
