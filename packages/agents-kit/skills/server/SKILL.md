---
name: duplojs-server
description: "Manipuler les fichiers, dossiers, variables d'environnement et capacités du processus avec @duplojs/server : opérations portables, chemins typés, erreurs Either et data structures de fichiers. Consulter en priorité ce skill pour les interactions système côté serveur."
---

# Interactions serveur DuploJS

## Trouver les concepts

Pour rechercher un concept ou une façon de faire, consulter en priorité `docs/concepts.llms.md` dans le package `@duplojs/agents-kit` et lire uniquement les pages et exemples pertinents pour la tâche. Le setup indique son chemin dans `AGENTS.md` ou `CLAUDE.md` : le résoudre depuis le dossier de ce fichier. Les chemins `docs/` partent de la racine du package installé ; les liens de chaque document se résolvent depuis son dossier. Même avec `--copy`, la documentation reste dans le package installé ; les références propres au skill se résolvent depuis son `SKILL.md`.

Si le chemin du routeur manque, le retrouver depuis le projet consommateur :

```sh
node --input-type=module -e 'import { fileURLToPath } from "node:url"; console.log(fileURLToPath(import.meta.resolve("@duplojs/agents-kit/docs/concepts.llms.md")))'
```

## Choisir la capacité serveur

Pour une opération sur le système de fichiers ou l'environnement d'exécution, rechercher en priorité la fonction correspondante dans `@duplojs/server`. Le package expose les interactions avec le runtime selon les paradigmes de l'écosystème : chemins typés, résultats `Either` et erreurs identifiables. Utiliser l'API publique adaptée avant de recourir directement aux API Node.js, Bun ou Deno ; conserver une API native seulement lorsque la capacité recherchée n'est pas couverte.

| Besoin | Domaine à consulter |
| --- | --- |
| Lire, écrire, créer, parcourir, déplacer ou supprimer une ressource | `DSFile` depuis `@duplojs/server/file` |
| Charger et valider la configuration, lire les arguments, agir sur le processus ou ses dossiers | `DSCommon` depuis `@duplojs/server/common` |
| Valider une interface de fichier ou de dossier et ses contraintes | `DSDataStructure` depuis `@duplojs/server/dataStructure` |
| Construire et valider un chemin sans accès au système de fichiers | `DPath` depuis `@duplojs/lang/path` |

Les capacités serveur sélectionnent leur implémentation selon l'environnement détecté. Une fonction peut avoir une implémentation dédiée à Bun ou Deno, ou réutiliser l'implémentation Node compatible. Ne pas ajouter de branchement par runtime dans le code applicatif lorsqu'une fonction du package couvre déjà le besoin. Ces points d'accès maintiennent aussi une indirection remplaçable entre l'application et le runtime.

La construction d'une CLI relève du skill `duplojs-command`. La création de routes et le démarrage d'un serveur HTTP relèvent de `duplojs-http-server`. Consulter ces skills lorsque la tâche atteint ces points d'entrée.

## Manipuler les ressources et leurs erreurs

Valider les chemins externes avec `DPath.create` ou la contrainte plus précise nécessaire, puis les composer avec les fonctions de chemin. Un chemin valide ne prouve ni l'existence ni la nature de la ressource. Choisir une opération directe pour une action précise, ou une `FileInterface` / `FolderInterface` pour transporter une référence avec ses opérations.

Conserver les résultats `Either` des opérations d'I/O. Sélectionner d'abord la branche du résultat avec `DEither`, puis discriminer l'erreur contenue avec les outils d'erreur de l'écosystème. Ne pas traiter tout échec comme une absence : une permission refusée et une ressource inexistante ne demandent pas la même réaction. Propager les échecs des fonctions réutilisables ; décider de leur adaptation au point d'entrée. Réserver les variantes `OrThrow` et les unwrap qui lèvent une erreur aux endroits où l'échec doit interrompre le flux.

Lire [Fichiers, chemins et erreurs](references/files.md) pour choisir les opérations, distinguer les références des vérifications et composer les I/O sans perdre leurs échecs.

## Contrôler l'environnement et le processus

Déclarer le contrat des variables avec les data structures, puis charger la configuration avec `DSCommon.environmentVariable` ou `environmentVariableOrThrow` selon le traitement voulu de l'échec. Choisir explicitement les sources et leur priorité lorsque des fichiers d'environnement participent à la configuration.

Distinguer le dossier de travail du processus, obtenu avec `getCurrentWorkDirectory`, du dossier du module, obtenu avec `getCurrentDirectoryName(import.meta)`. Utiliser les fonctions communes pour accéder aux arguments, changer de dossier ou terminer le processus, afin de conserver l'abstraction d'environnement.

Lire [Configuration et capacités du processus](references/environment.md) pour les options de chargement, les chemins relatifs au module et les effets sur le processus.

## Valider les fichiers dans un contrat

Les structures `file` et `folder` portent des `FileInterface` et `FolderInterface`, pas des fichiers JavaScript natifs ni de simples strings. Décoder les chemins textuels avec les codecs serveur. Ajouter les contraintes d'existence ou de taille lorsque le contrat les exige ; ces vérifications d'I/O demandent une validation asynchrone. Une validation du fichier ne valide pas automatiquement son contenu.

Lire [Structures et contraintes de ressources](references/structures.md) pour choisir entre décodage de chemin, vérification d'une interface et validation du contenu lu.
