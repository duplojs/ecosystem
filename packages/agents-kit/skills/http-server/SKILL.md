---
name: duplojs-http-server
description: "Créer ou modifier une API HTTP DuploJS : routes, validation des requêtes, vérifications réutilisables et configuration du serveur."
---

# Serveur HTTP DuploJS

## Trouver les concepts

Appliquer la démarche du skill et lire les ressources indiquées lorsque leur condition est rencontrée. Pour rechercher un concept ou un mécanisme non couvert, consulter `docs/concepts.llms.md` du package `@duplojs/agents-kit`.

Le setup indique ce chemin dans `AGENTS.md` ou `CLAUDE.md`, relativement à leur dossier. Les chemins `docs/` partent du package installé, même avec `--copy`. Les références du skill partent de son dossier ; les liens d'un document se résolvent depuis ce document.

Si le chemin du routeur manque, le retrouver depuis le projet consommateur :

```sh
node --input-type=module -e 'import { fileURLToPath } from "node:url"; console.log(fileURLToPath(import.meta.resolve("@duplojs/agents-kit/docs/concepts.llms.md")))'
```

## Construire le flux d'une route

Partir de la route concernée, de ses entrées et de ses réponses attendues. Reprendre le builder de sa famille dans le projet : il peut déjà porter des préconditions communes. Pour une route sans politique commune, utiliser `useRouteBuilder`.

Une route enchaîne des étapes qui enrichissent un contexte typé, le **floor**. Chaque étape reçoit les données garanties par les précédentes. Une réponse termine le flux ; dans un `cut`, `output(...)` enrichit le floor et permet de continuer.

1. Déclarer les entrées avec `.extract` et les data structures du contrat. L'extraction les valide avant de poursuivre.
2. Préparer les préconditions et traiter les refus dans les étapes précédant le handler. Un `.cut` convient à une adaptation propre au scénario courant ; reprendre les traitements réutilisables existants lorsqu'ils portent la même responsabilité.
3. Terminer avec `.handler`. Son callback retourne la réponse HTTP avec l'outil `response` disponible dans son second argument.

Pour créer une route ou modifier ses extractions et étapes, lire [Routes et floor](references/routes-and-floor.md). La [route minimale](references/examples/minimal-route.ts) montre validation et réponse sans dépendance applicative ; la [route de modification](references/examples/rename-user-route.ts) adapte un résultat applicatif en amont du handler.

## Raccorder l'application

La route est un point d'entrée d'infrastructure : elle adapte les données validées aux capacités de l'application, appelle les traitements prévus et traduit leurs résultats vers HTTP. Elle peut établir une précondition avec une qualification du domaine. L'orchestration métier et les transitions restent dans leurs couches ; ne pas les réimplémenter dans les steps.

Traduire les résultats attendus en réponses HTTP avec les outils `Either`. Les fonctions réutilisables conservent leurs échecs typés ; la route choisit la réponse à envoyer au client.

Si la tâche raccorde un domaine existant ou modifie une responsabilité métier, appliquer le skill `duplojs-modeling` lorsqu'il est installé, ou lire `docs/concepts/05-type-driven-design/01-architecture/10-boundaries.md`.

## Réutiliser au niveau approprié

| Ce qui doit être réutilisé | Mécanisme |
| --- | --- |
| Une opération avec plusieurs résultats, interprétés différemment selon la route | Checker créé par `useCheckerBuilder`, appelé avec `.check`. |
| La sélection d'un résultat de checker et sa réponse HTTP d'échec | Preset créé par `createPresetChecker`, appelé avec `.presetCheck`. |
| Une séquence d'étapes et les données qu'elle garantit | Process créé par `useProcessBuilder`, appelé avec `.exec`. |
| Des processus appliqués avant chaque route d'une famille | `usePreflightBuilder`, puis sa fonction `useRouteBuilder`. |

Quand l'un de ces besoins apparaît, lire [Checkers, processus et builders communs](references/reusable-flows.md) avant de l'assembler. Éviter de recopier des `cut` portant la même opération et la même réponse. L'[exemple de preflight](references/examples/authentication.ts) et la [route protégée](references/examples/protected-route.ts) montrent comment transmettre les garanties d'une séquence commune.

## Assembler et démarrer le serveur

Le `Hub` rassemble les routes, les plugins et leur cycle de vie indépendamment du runtime. Créer le Hub avec `createHub`, ajouter les plugins avec `.plug` et les routes avec `.register`, puis appeler le connecteur de l'environnement. Sur Node, utiliser `createHttpServer` depuis `@duplojs/http/node`.

Au démarrage, valider la configuration avec `DSCommon.environmentVariableOrThrow` depuis `@duplojs/server/common`, puis fournir les valeurs au Hub et au connecteur. Pour les sources d'environnement et les interactions système, consulter `duplojs-server` ou les concepts serveur du routeur.

Si la tâche touche le démarrage ou l'enregistrement des routes, lire [Initialisation et enregistrement](references/initialization.md) et l'[exemple minimal](references/examples/initialize.ts). Avec `routeStore.getAll()`, importer d'abord les modules de routes : le store collecte les déclarations finalisées par `.handler`, sans découvrir ni importer leurs fichiers.

## Vérifier le flux exposé

Exécuter le typage et les vérifications du projet. Vérifier que la route est effectivement enregistrée, qu'une entrée invalide est refusée et que chaque issue concernée produit le statut, l'information et le body attendus. Vérifier aussi qu'un refus arrête les étapes dépendantes.
