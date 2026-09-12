# Architecture du monorepo

## Dépendances entre packages

Le projet est un monorepo PNPM. Pendant le développement, les dépendances internes utilisent les workspaces PNPM.

Les packages n'exposent pas directement leurs sources TypeScript aux autres packages. Chaque package produit son propre `dist`, qui est consommé par les autres packages du monorepo.

Cette organisation permet à chaque package de rester un projet TypeScript indépendant et évite :

* une configuration TypeScript globale ;
* le partage de `paths` entre packages ;
* les contraintes de résolution propres au monorepo.

Les `dist` doivent donc être générés et à jour pour que les packages de l'écosystème puissent fonctionner ensemble.

## Dépendances externes

Les packages destinés à être exécutés en production doivent tendre vers **zéro dépendance runtime externe à l'écosystème DuploJS**.

Une dépendance externe n'est autorisée que lorsqu'elle répond à un besoin explicite.

### Dépendances de développement

Les outils utilisés uniquement pendant le développement peuvent dépendre de packages externes.

`@duplojs/code-config` appartient notamment à cette catégorie.

### Peer dependencies

Lorsqu'un package doit s'intégrer à un écosystème externe important, comme Vue, cette dépendance peut être déclarée en `peerDependencies`.

La plage déclarée représente alors explicitement les versions externes supportées.

### Dépendances externes maîtrisées

Certaines dépendances utilisées par les outils peuvent nécessiter une version précise.

Dans ce cas :

* la version est fixée exactement ;
* sa mise à jour est volontaire ;
* aucune plage de versions n'est utilisée ;
* lorsque nécessaire, la dépendance est exposée afin que les consommateurs utilisent exactement l'implémentation embarquée par le package.

`@duplojs/tools` applique notamment ce principe à TypeScript.

Cette stratégie limite les changements de comportement non maîtrisés et l'exposition aux mises à jour inattendues de la chaîne de dépendances.

## Versionnement de l'écosystème

Les packages DuploJS suivent un versionnement synchronisé.

Une version représente un ensemble de packages conçus et validés pour fonctionner ensemble :

```text
@duplojs/lang@1
@duplojs/server@1
@duplojs/tools@1
@duplojs/json-web-token@1
@duplojs/code-config@1
```

Après publication, les dépendances internes utilisent des **versions exactes** :

```text
@duplojs/server@1
└── @duplojs/lang@1
```

Aucune plage de compatibilité (`^`, `~`, etc.) n'est utilisée entre les packages de l'écosystème.

La mise à jour d'un package implique donc la mise à jour de l'écosystème vers la version correspondante.

Cette contrainte garantit qu'une combinaison de versions correspond toujours à un ensemble explicitement supporté et évite les incompatibilités silencieuses entre packages.

## Graphe des dépendances

```text
@duplojs/lang
└── dev -> @duplojs/code-config

@duplojs/server
├── peer -> @duplojs/lang
└── dev -> @duplojs/code-config

@duplojs/tools
├── peer -> @duplojs/lang
└── dev -> @duplojs/code-config

@duplojs/json-web-token
├── peer -> @duplojs/lang
└── dev -> @duplojs/code-config

@duplojs/code-config
└── aucune dépendance vers un autre package DuploJS
```

`@duplojs/code-config` est transversal et intervient uniquement dans l'environnement de développement.

## Frontières d'import entre packages

Un package ne peut consommer un autre package de l'écosystème qu'à travers son API publique.

Les imports inter-packages utilisent les exports déclarés dans le `package.json` du package consommé :

```ts
import * as DEither from "@duplojs/lang/either";
```

Les sources internes et les chemins non exportés d'un autre package ne doivent jamais être importés directement :

```ts
// Interdit
import { ... } from "../lang/scripts/either";
```

Les dépendances locales utilisent ainsi les mêmes frontières que les packages publiés et passent réellement par les `dist` générés.

## Structure d'un package

Chaque package constitue un projet indépendant avec sa propre configuration, son propre build et ses propres frontières publiques.

```text
packages/<package>/
├── scripts/              # Sources TypeScript
├── tests/                # Tests directs des sources
├── integrations/         # Workspace de tests d'intégration
├── .commands/            # Commandes internes de développement
├── AGENTS.md             # Navigation et contexte du package
├── package.json          # API publique, dépendances et métadonnées
├── rolldown.config.ts    # Génération du dist
├── oxlint.config.ts      # Configuration du lint
├── vitest.config.ts      # Configuration des tests
└── tsconfig.*.json       # Contextes TypeScript
```

Tous les packages ne sont pas obligés de posséder chacun de ces éléments lorsqu'ils n'en ont pas besoin.

Les choix d'architecture spécifiques à un package sont documentés localement.

## Workspaces d'intégration

Les dossiers `packages/*/integrations` sont des workspaces PNPM A part entière.

Ils représentent des projets consommateurs du package et utilisent son API publique ainsi que les fichiers générés dans `dist`, sans consommer directement les sources présentes dans `scripts/`.

Ils permettent notamment de vérifier :

* la consommation réelle du package généré ;
* ses exports publics ;
* la résolution de ses dépendances ;
* son comportement dans un contexte proche d'un véritable projet utilisateur.

```text
tests/
└── teste directement les sources du package

integrations/
└── teste le package généré comme un consommateur externe
```

## Isolation TypeScript

Chaque package constitue un projet TypeScript indépendant.

Le monorepo ne repose pas sur une configuration TypeScript globale ni sur des `paths` partagés entre packages. Chaque package possède ses propres contextes TypeScript et consomme les autres packages à travers leurs `dist`.

Le fonctionnement détaillé des configurations TypeScript est documenté dans `.agents/typescript-config.md`.
