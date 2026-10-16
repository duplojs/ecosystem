---
name: duplojs-server
description: "Lire ou modifier des fichiers, charger la configuration et agir sur le processus avec les abstractions portables de @duplojs/server. Utiliser ce skill pour les interactions système côté serveur."
---

# Interactions serveur DuploJS

## Trouver les concepts

Appliquer la démarche du skill et lire les ressources indiquées lorsque leur condition est rencontrée. Pour rechercher un concept ou un mécanisme non couvert, consulter `docs/concepts.llms.md` du package `@duplojs/agents-kit`.

Le setup indique ce chemin dans `AGENTS.md` ou `CLAUDE.md`, relativement à leur dossier. Les chemins `docs/` partent du package installé, même avec `--copy`. Les références du skill partent de son dossier ; les liens d'un document se résolvent depuis ce document.

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

Les capacités serveur sélectionnent leur implémentation selon l'environnement détecté. Utiliser cette abstraction sans ajouter de branchement par runtime lorsqu'elle couvre le besoin ; elle permet aussi de remplacer les capacités dans les tests.

La construction d'une CLI relève du skill `duplojs-command`. La création de routes et le démarrage d'un serveur HTTP relèvent de `duplojs-http-server`. Consulter ces skills lorsque la tâche atteint ces points d'entrée.

## Manipuler les ressources et leurs erreurs

Valider les chemins externes avec `DPath.create` ou la contrainte plus précise nécessaire, puis les composer avec les fonctions de chemin. Un chemin valide ne prouve ni l'existence ni la nature de la ressource. Choisir une opération directe pour une action précise, ou une `FileInterface` / `FolderInterface` pour transporter une référence avec ses opérations.

Conserver les résultats `Either` des I/O dans les fonctions réutilisables. Sélectionner leur branche avec `DEither`, puis discriminer l'erreur contenue par son identifiant. Une permission refusée et une absence demandent des décisions différentes. Traiter le résultat de l'opération effective, même après une vérification d'existence ; propager ou adapter le refus sans ajouter de `throw`.

Pour écrire ou modifier un traitement de fichiers, lire [Fichiers, chemins et erreurs](references/files.md). L'[exemple de lecture et d'écriture](references/examples/files.ts) montre une absence explicitement tolérée et l'arrêt des opérations dépendantes sur échec.

## Contrôler l'environnement et le processus

Déclarer le contrat des variables avec les data structures. Utiliser `DSCommon.environmentVariable` pour transmettre le résultat du chargement ; au démarrage, `environmentVariableOrThrow` convient lorsque le point d'entrée décide qu'une configuration invalide arrête le programme. Choisir les sources et leur priorité lorsque des fichiers d'environnement participent à la configuration.

Distinguer le dossier de travail du processus, obtenu avec `getCurrentWorkDirectory`, du dossier du module, obtenu avec `getCurrentDirectoryName(import.meta)`. Utiliser les fonctions communes pour accéder aux arguments, changer de dossier ou terminer le processus, afin de conserver l'abstraction d'environnement.

Si la tâche charge l'environnement ou agit sur les dossiers, les arguments ou la fin du processus, lire [Configuration et capacités du processus](references/environment.md). L'[exemple d'environnement](references/examples/environment.ts) distingue les origines des chemins et fixe la priorité des sources.

## Valider les fichiers dans un contrat

Les structures `file` et `folder` portent des `FileInterface` et `FolderInterface`, pas des fichiers JavaScript natifs ni de simples strings. Décoder les chemins textuels avec les codecs serveur. Ajouter les contraintes d'existence ou de taille lorsque le contrat les exige ; ces vérifications d'I/O demandent une validation asynchrone. Une validation du fichier ne valide pas automatiquement son contenu.

Si un contrat reçoit un fichier, un dossier ou leur chemin, lire [Structures et contraintes de ressources](references/structures.md) pour choisir le décodage et les validations nécessaires. L'[exemple de structure de fichier](references/examples/file-structure.ts) applique des contraintes d'existence et de taille.
