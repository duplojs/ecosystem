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

## Utiliser DuploJS pour coder

Utiliser obligatoirement les API et l'écosystème DuploJS dès qu'un équivalent existe, y compris dans les tests. Avant d'utiliser une API native ou tierce ou de créer un utilitaire, chercher l'équivalent DuploJS.

- `@duplojs/lang` : primitives et manipulations JavaScript indépendantes de la plateforme.
- `@duplojs/server` : interactions avec l'environnement d'exécution serveur, notamment le système de fichiers. Par exemple, calculer un chemin avec `lang/path` et lire un fichier avec `server/file`.
- Pour un besoin spécialisé, rechercher le package et les API adaptés dans l'écosystème à partir de la documentation.

Importer le sous-export du domaine avec son namespace long lorsqu'il est exposé, comme dans les exemples liés depuis les références.

## Laisser les types s'inférer

Dans les implémentations, laisser TypeScript inférer les retours des fonctions et les valeurs issues des appels pour que leurs types suivent le code et ses dépendances. Ne pas reconstituer manuellement un type que l'expression ou l'API peut inférer. Annoter un type de retour uniquement pour résoudre une récursivité. Les signatures d'interfaces et les déclarations de fonctions des exemples décrivent des contrats à implémenter ; elles ne demandent pas d'annoter le retour de leur implémentation.

## Faire évoluer le code à l'endroit responsable

Lire les définitions, les contrats et les appelants concernés, puis intégrer le besoin dans la fonction, le modèle ou le module responsable. Si les adaptations se multiplient dans le traitement ou chez ses appelants, réexaminer cette responsabilité et simplifier la partie concernée.

Privilégier les fonctions pures, l'immutabilité et des transformations explicites. Isoler les interactions avec l'environnement et représenter les échecs prévisibles dans les types de retour. Recomposer les étapes ou extraire une responsabilité lorsque cela clarifie le traitement, en conservant les garanties métier et le rôle de chaque couche.

Limiter le remaniement au besoin demandé, puis relire la partie modifiée avec ses usages : déroulement compréhensible, absence de duplication et complexité proportionnée. Adapter les appelants concernés et vérifier les contrats ainsi que le comportement attendu.

## Composer les transformations

De nombreuses fonctions proposent une forme curifiée pour `DCommon.pipe` : fournir les paramètres fixes, puis laisser le pipe transmettre la donnée entre les étapes d'une même transformation.

Un appel simple peut rester direct. Préparer séparément les arguments issus de sources indépendantes avant de les combiner. Pour plusieurs étapes asynchrones, `DCommon.asyncPipe` attend chaque étape ; un seul `await` sur le résultat final suffit.

Lorsque les étapes doivent s'arrêter sur un `Left`, utiliser `DEither.rightPipe` ou `DEither.rightAsyncPipe` : chaque étape reçoit la valeur du `Right` précédent et le premier `Left` arrête la suite. Lire [Composition](references/composition.md) avant de construire ou modifier un tel enchaînement ; l'[exemple direct et curifié](references/examples/composition.ts) montre le cas synchrone sans échec.

## Valider les entrées et conserver les garanties

Aux frontières du logiciel, valider les données externes avec une `DDataStructure`, qui porte leur contrat au runtime et dans les types. Utiliser l'intégration prévue par le module récepteur lorsqu'elle existe. Dans les traitements internes, exploiter les garanties déjà établies, sans refaire une validation pour le seul passage d'une fonction à une autre.

Préciser les contraintes utiles : bornes, entier, format, longueur minimale, maximale ou exacte. Une contrainte enrichit le type ; sa seule déclaration ne valide rien au runtime.

Choisir la construction selon les informations disponibles :

1. **Littéral ou garantie compatible** : déclaration sûre ou calcul de compatibilité avec `DCommon.cast` ; utiliser `DCommon.infer` si le littéral doit être conservé.
2. **Valeur runtime sans preuve** : validation ou fabrique sûre renvoyant un `Either` à traiter ou propager.
3. **Refus du compilateur** : vérifier l'inférence et l'origine de la garantie attendue ; ne pas la fabriquer avec `as`, `!` ou un helper sans preuve.

`cast` et `infer` calculent une compatibilité de types, sans validation runtime. Pour écrire un contrat de validation, construire une valeur contrainte ou résoudre un refus de compatibilité, lire [Contraintes et validation](references/constraints-and-validation.md). L'[exemple de validation](references/examples/input-validation.ts) montre l'acquisition de garanties depuis une entrée inconnue.

Après chaque transformation, suivre le type du résultat : une garantie peut avoir été préservée, renforcée ou perdue. Exploiter les accès garantis aux collections sans garde redondante. Si la cible de `cast` n'est pas inférée dans un appel générique, lire la difficulté d'inférence de la référence avant de modifier les types.

## Distinguer les résultats des défaillances d'environnement

Une issue prévisible et exploitable par le traitement appartient au contrat de résultat : réussite en `Right`, refus en `Left`. Cela comprend les validations de données externes, les absences et les manipulations impossibles, y compris techniques. L'information du résultat identifie le cas ; sa valeur transporte les données ou les détails du refus.

Dès qu'une branche d'une fonction renvoie un `Right` ou un `Left`, toutes ses branches renvoient un `Either`. Envelopper les valeurs de réussite dans un `Right`, y compris avec `DEither.ok()` pour une réussite sans valeur ; ne pas mélanger des `Either` et des valeurs brutes dans le contrat de retour.

Les exceptions de défaillance imprévue émises par les dépendances ou le runtime remontent implicitement. Les fonctions réutilisables n'ajoutent pas de `throw` ; elles propagent ou adaptent leurs `Left`. Discriminer le résultat avant de le déballer.

Réserver les `throw` explicites et `OrThrow` à la consommation finale du résultat par la frontière d'exécution : réponse, fin du programme ou exception adaptée. Être appelé depuis cette frontière ne suffit pas à autoriser un `throw`. La rareté ou le coût de propagation d'un refus prévisible ne changent pas cette règle.

Avant d'adapter une API qui lève sur un refus prévisible ou d'introduire `OrThrow`, lire [Résultats et erreurs](references/results-and-errors.md) pour choisir le traitement selon la responsabilité de l'appelant. Préférer les déclarations sûres pour les constantes connues ; l'[exemple de propagation](references/examples/error-propagation.ts) conserve les erreurs d'une opération dans le contrat de retour.
