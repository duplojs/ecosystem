---
name: duplojs-http-server
description: "Créer, modifier ou corriger un serveur HTTP DuploJS : Hub, routes, extraction, checkers, processus, builders avec preflight et génération des contrats et schémas partagés."
---

# Serveur HTTP DuploJS

## Trouver les concepts

Pour rechercher un concept ou une façon de faire, consulter en priorité `docs/concepts.llms.md` dans le package `@duplojs/agents-kit` et lire uniquement les pages et exemples pertinents pour la tâche. Le setup indique son chemin dans `AGENTS.md` ou `CLAUDE.md` : le résoudre depuis le dossier de ce fichier. Les chemins `docs/` partent de la racine du package installé ; les liens de chaque document se résolvent depuis son dossier. Même avec `--copy`, la documentation reste dans le package installé ; les références propres au skill se résolvent depuis son `SKILL.md`.

Si le chemin du routeur manque, le retrouver depuis le projet consommateur :

```sh
node --input-type=module -e 'import { fileURLToPath } from "node:url"; console.log(fileURLToPath(import.meta.resolve("@duplojs/agents-kit/docs/concepts.llms.md")))'
```

## Assembler le serveur

Le `Hub` orchestre les routes, les plugins et leur cycle de vie indépendamment du runtime. Créer le Hub avec `createHub`, ajouter les plugins avec `.plug` et les routes avec `.register`, puis utiliser le connecteur de l'environnement. Sur Node, la fonction publique est `createHttpServer`, importée depuis `@duplojs/http/node`.

Au démarrage, récupérer la configuration avec `DSCommon.environmentVariableOrThrow` depuis `@duplojs/server/common`, puis fournir les valeurs validées au Hub et au connecteur.

Pour les options de chargement de l'environnement et les opérations sur les fichiers ou le processus, consulter le skill `duplojs-server`.

Pour enregistrer les routes avec `routeStore.getAll()`, exécuter d'abord les imports des modules qui les déclarent. Le store collecte les routes finalisées par `.handler` ; il ne découvre pas les fichiers et ne les importe pas. Lire [Initialisation et enregistrement](references/initialization.md) pour assembler un point d'entrée.

## Construire le flux d'une route

Une route enchaîne des étapes qui enrichissent un contexte typé, le **floor**. Chaque étape reçoit les données garanties par les étapes précédentes. Une réponse termine le flux ; une sortie de données permet de continuer.

| Besoin | Mécanisme |
| --- | --- |
| Recevoir et valider une donnée externe | `.extract` avec les data structures du contrat |
| Exécuter une opération réutilisable et choisir son interprétation ici | Checker créé par `useCheckerBuilder`, puis `.check` |
| Réutiliser le même résultat attendu et la même réponse d'échec | `createPresetChecker`, puis `.presetCheck` |
| Réaliser une adaptation spécifique au scénario courant | `.cut` : `response` arrête, `output` enrichit le floor |
| Réutiliser une séquence d'étapes | Process créé par `useProcessBuilder`, puis `.exec` |
| Appliquer des processus avant chaque route d'une famille | `usePreflightBuilder`, puis sa fonction `useRouteBuilder` |
| Terminer le chemin de réussite | `.handler` avec son `ResponseContract` |

Pour une route, identifier les entrées et le résultat attendu, reprendre le builder approprié du projet, valider les entrées, résoudre les vérifications et les échecs attendus, puis produire la réponse positive dans le handler. Déclarer chaque réponse avec son contrat : statut, `information` discriminante et schéma du body éventuel.

Lire [Routes et floor](references/routes-and-floor.md) pour construire ce flux. Si une opération se répète, utiliser le mécanisme réutilisable adapté ; ne pas recopier des `cut` portant la même vérification et la même réponse. Lire [Checkers, processus et builders communs](references/reusable-flows.md) pour choisir et composer ces mécanismes.

## Raccorder l'application

La route est un point d'entrée d'infrastructure : elle adapte les données validées aux capacités de l'application, appelle les traitements prévus et traduit leurs résultats vers HTTP. Elle peut établir une précondition avec une qualification du domaine. L'orchestration métier et les transitions restent dans leurs couches ; ne pas les réimplémenter dans les steps.

Traiter les résultats attendus avec les outils `Either` et les réponses contractuelles. Les fonctions réutilisables conservent leurs échecs typés ; une réponse HTTP relève du flux HTTP qui les consomme.

## Partager les contrats et les schémas

Utiliser `codeGeneratorPlugin` pour générer les types des routes et, si nécessaire, les data structures réutilisables dans un package consommateur ou un SDK. Le serveur génère du typage, pas une instance de client. La configuration du plugin seule ne lance pas la génération : elle dépend du cycle de vie du Hub. Lire [Génération et consommation des contrats](references/code-generation.md) pour les identifiants de schémas, le mode `BUILD` et la distribution des ressources générées. Pour consommer une API, utiliser le skill `duplojs-http-client`.
