---
name: duplojs-command
description: "Créer, modifier ou corriger une interface en ligne de commande avec @duplojs/server/command : arguments et options typés, sous-commandes, aide et point d'entrée exécutable."
---

# Commandes DuploJS

## Trouver les concepts

Appliquer la démarche du skill et lire les ressources indiquées lorsque leur condition est rencontrée. Pour rechercher un concept ou un mécanisme non couvert, consulter `docs/concepts.llms.md` du package `@duplojs/agents-kit`.

Le setup indique ce chemin dans `AGENTS.md` ou `CLAUDE.md`, relativement à leur dossier. Les chemins `docs/` partent du package installé, même avec `--copy`. Les références du skill partent de son dossier ; les liens d'un document se résolvent depuis ce document.

Si le chemin du routeur manque, le retrouver depuis le projet consommateur :

```sh
node --input-type=module -e 'import { fileURLToPath } from "node:url"; console.log(fileURLToPath(import.meta.resolve("@duplojs/agents-kit/docs/concepts.llms.md")))'
```

## Choisir la forme de la commande

Importer le domaine sous le namespace `DSCommand` depuis `@duplojs/server/command`, et les schémas sous `DDataStructure` depuis `@duplojs/lang/dataStructure`.

| Besoin | Construction |
| --- | --- |
| Exécuter une commande racine avec ses entrées | `DSCommand.exec` lit les arguments du processus et appelle le callback après validation. |
| Assembler plusieurs actions nommées | `DSCommand.create` définit les sous-commandes, placées dans les `subjects` du parent exécuté avec `exec`. |
| Lire uniquement les options d'un script | `DSCommand.execOptions` retourne le résultat du parsing ; le script décide ensuite de lancer le traitement. |

Identifier les entrées et leurs contraintes, déclarer leur contrat, puis écrire le callback avec les `args` et `options` inférés. Exécuter la racine une seule fois au point d'entrée. Pour une racine simple, lire la première déclaration de `docs/concepts/02-server/40-command/10-use.ts` ; pour un script sans arguments positionnels, suivre l'[exemple à options seules](references/examples/options-only.ts).

## Déclarer les entrées

Les entrées du terminal sont externes : les faire décoder et valider par les data structures intégrées aux déclarations. Décrire les contraintes utiles, comme un entier borné ou un choix de littéraux ; ne pas remplacer cette validation par un cast ou une conversion manuelle dans le callback.

| Entrée | Déclaration et garantie |
| --- | --- |
| Valeur positionnelle | `createArgument` dans `subjects`, obligatoire par défaut. Placer les arguments `optional: true` après les obligatoires. |
| Option à valeur | `createOption` dans `options`, facultative par défaut : absence en `undefined`. `required: true` la rend obligatoire ; une présence sans valeur reste invalide. |
| Flag de présence | `createBooleanOption`, `false` si absent et `true` si présent ; ne reçoit pas de valeur. |
| Liste | `createArrayOption`, facultative par défaut ; son schéma décrit un élément. Les bornes ne rendent pas la liste obligatoire. |

Les noms doivent être uniques dans chaque ensemble d'options ou de sujets. Choisir aussi des alias sans collision et conserver `help` / `h` pour l'aide intégrée.

Pour créer ou modifier une entrée, lire [Entrées et garanties](references/inputs.md) avant de choisir sa syntaxe et son schéma. L'[exemple complet](references/examples/preview-command.ts) combine arguments, options, flag et liste bornée ; reprendre les constructions nécessaires au contrat de la commande.

## Assembler et exécuter

Un même `subjects` contient soit des arguments, soit des sous-commandes. Le premier argument sélectionne la sous-commande ; le callback du parent ne s'exécute pas comme une étape préalable. Déclarer les options nécessaires sur chaque commande qui les consomme ; celles du parent ne sont pas héritées.

Décrire les commandes et leurs entrées pour alimenter l'aide intégrée `--help` / `-h`. Choisir `displayName` sur la racine pour identifier le programme dans l'aide et les diagnostics.

Si la tâche ajoute un arbre, modifie l'exécution ou expose un binaire, lire [Arbre, aide et résultat d'exécution](references/execution.md). L'[exemple avec sous-commande](references/examples/cli.ts) montre l'assemblage et le code de sortie sur erreur de validation.

## Raccorder l'application et vérifier

Le callback est un point d'entrée d'infrastructure : il adapte les données validées, appelle l'application et interprète ses résultats pour le terminal. Il retourne `void` ou une promesse de `void` ; lui retourner un `Either` métier ne propage pas cet échec à `exec`. Garder l'orchestration métier dans l'application et choisir le diagnostic et la conséquence finale dans le callback.

Une erreur de validation empêche l'appel du callback ; `exec` retourne cette erreur après son affichage, sans fixer à lui seul un code de sortie d'échec. Avec `execOptions`, sélectionner l'information `success` avant de lancer le travail : l'aide est aussi un `Right`, sous `log-help`.

Pour les opérations sur les fichiers, la configuration d'environnement et les capacités du processus appelées depuis une commande, consulter le skill `duplojs-server`.

Vérifier le typage du projet, puis exercer l'aide, un appel valide, une entrée invalide et l'absence d'une entrée obligatoire. Pour un arbre, vérifier aussi le chemin complet vers la sous-commande. Utiliser des opérations sans effet ou des dépendances de test lorsque la commande agit sur l'environnement ; vérifier le code de sortie attendu en cas d'échec.
