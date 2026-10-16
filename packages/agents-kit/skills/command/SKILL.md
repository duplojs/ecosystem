---
name: duplojs-command
description: "Créer, modifier ou corriger une interface en ligne de commande avec @duplojs/server/command : arguments et options typés, sous-commandes, aide et point d'entrée exécutable."
---

# Commandes DuploJS

## Trouver les concepts

Pour rechercher un concept ou une façon de faire, consulter en priorité `docs/concepts.llms.md` dans le package `@duplojs/agents-kit` et lire uniquement les pages et exemples pertinents pour la tâche. Le setup indique son chemin dans `AGENTS.md` ou `CLAUDE.md` : le résoudre depuis le dossier de ce fichier. Les chemins `docs/` partent de la racine du package installé ; les liens de chaque document se résolvent depuis son dossier. Même avec `--copy`, la documentation reste dans le package installé ; les références propres au skill se résolvent depuis son `SKILL.md`.

Si le chemin du routeur manque, le retrouver depuis le projet consommateur :

```sh
node --input-type=module -e 'import { fileURLToPath } from "node:url"; console.log(fileURLToPath(import.meta.resolve("@duplojs/agents-kit/docs/concepts.llms.md")))'
```

## Choisir la forme de la commande

Importer le domaine sous le namespace `DSCommand` depuis `@duplojs/server/command`, et les schémas sous `DDataStructure` depuis `@duplojs/lang/dataStructure`.

| Besoin | Construction |
| --- | --- |
| Définir une commande nommée à composer | `DSCommand.create` |
| Lire les arguments du processus et lancer la commande racine | `DSCommand.exec` |
| Recevoir une valeur positionnelle | `createArgument` dans `subjects` |
| Recevoir une option avec une valeur | `createOption` dans `options` |
| Recevoir un flag de présence | `createBooleanOption` |
| Recevoir une liste de valeurs | `createArrayOption` |
| Lire uniquement les options d'un script | `DSCommand.execOptions` |

Pour créer une commande, identifier les entrées et leurs contraintes, déclarer leur contrat, puis écrire le callback avec les `args` et `options` inférés. Pour plusieurs actions, créer les commandes nommées et les assembler dans les `subjects` du parent. Exécuter la racine une seule fois au point d'entrée.

## Déclarer les entrées

Les entrées du terminal sont externes : les faire décoder et valider par les data structures intégrées aux déclarations. Décrire les contraintes utiles, comme un entier borné ou un choix de littéraux ; ne pas remplacer cette validation par un cast ou une conversion manuelle dans le callback.

- Les arguments sont obligatoires par défaut. Mettre les arguments facultatifs, déclarés avec `optional: true`, après les arguments obligatoires.
- Les options à valeur et les listes sont facultatives par défaut : leur absence produit `undefined`. Utiliser `required: true` lorsqu'elles sont nécessaires. Une option présente sans valeur reste invalide.
- Un flag booléen vaut `false` lorsqu'il est absent, `true` lorsqu'il est présent ; il ne reçoit pas de valeur.
- Les noms doivent être uniques dans chaque ensemble d'options ou de sujets. Choisir aussi des alias sans collision et conserver `help` / `h` pour l'aide intégrée.

Lire [Entrées et garanties](references/inputs.md) pour la syntaxe, les listes bornées et l'[exemple de commande typée](references/examples/preview-command.ts).

## Assembler et exécuter

Un même `subjects` contient soit des arguments, soit des sous-commandes. Le premier argument sélectionne la sous-commande ; le callback du parent ne s'exécute pas comme une étape préalable. Déclarer les options nécessaires sur chaque commande qui les consomme ; celles du parent ne sont pas héritées.

Décrire les commandes et leurs entrées pour alimenter l'aide intégrée `--help` / `-h`. Choisir `displayName` sur la racine pour identifier le programme dans l'aide et les diagnostics.

Lire [Arbre, aide et résultat d'exécution](references/execution.md) pour le point d'entrée, le binaire et le traitement des erreurs. Les exemples [CLI avec sous-commande](references/examples/cli.ts) et [script à options seules](references/examples/options-only.ts) montrent les deux formes d'exécution.

## Raccorder l'application et vérifier

Le callback est un point d'entrée d'infrastructure : il adapte les données validées, appelle les capacités de l'application et interprète leurs résultats pour le terminal. Garder l'orchestration métier dans l'application et les échecs des fonctions réutilisables dans leurs `Either`.

Pour les opérations sur les fichiers, la configuration d'environnement et les capacités du processus appelées depuis une commande, consulter le skill `duplojs-server`.

Vérifier le typage du projet, puis exercer l'aide, un appel valide, une entrée invalide et l'absence d'une entrée obligatoire. Pour un arbre, vérifier aussi le chemin complet vers la sous-commande. Utiliser des opérations sans effet ou des dépendances de test lorsque la commande agit sur l'environnement ; vérifier le code de sortie attendu en cas d'échec.
