# Conventions d'implémentation

## Conventions spécifiques au package

Un package peut définir des règles supplémentaires dans :

```text
.agents/implementation.md
```

Avant toute implémentation, vérifier si ce fichier existe dans le package courant.

Lorsqu'il est présent, ses instructions complètent les conventions générales et sont prioritaires lorsqu'elles spécialisent une règle.

Les conventions observées dans un package ne doivent pas être généralisées aux autres packages.

## Dépendances entre packages

Un package ne peut importer un autre package DuploJS que si celui-ci est déclaré dans ses dépendances.

Dans le monorepo, une dépendance vers un package DuploJS utilise toujours le workspace PNPM :

```json
{
  "peerDependencies": {
    "@duplojs/lang": "workspace:*"
  }
}
```

La section utilisée (`dependencies`, `peerDependencies` ou `devDependencies`) dépend du rôle de la dépendance dans le package.

Ne jamais utiliser directement une version publiée d'un package DuploJS à l'intérieur du monorepo.

## Imports entre packages

Les imports entre packages doivent respecter les exports déclarés dans le `package.json` du package consommé.

Toujours utiliser le sous-export le plus précis disponible et importer le domaine sous forme de namespace :

```ts
import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";
```

Ne pas importer un domaine depuis l'index racine lorsque son sous-export existe :

```ts
// À éviter
import { DEither, DCommon } from "@duplojs/lang";
```

Ne jamais importer les sources, le `dist` ou un chemin interne non déclaré dans les exports du package.

Les règles détaillées d'import entre packages sont documentées dans [`.agents/importations.md`](../../../importations.md) et doivent impérativement être consultées avant toute modification de code.

## Domaines

Les packages peuvent organiser leurs sources en domaines.

Lorsqu'un package utilise cette architecture, les domaines correspondent aux dossiers de premier niveau de `scripts/` :

```text
scripts/
├── common/
├── file/
├── command/
└── dataStructure/
```

Un dossier situé à l'intérieur d'un domaine sert à organiser ce domaine et ne constitue pas automatiquement un nouveau domaine.

La manière dont les domaines sont exposés depuis l'index racine dépend du package et doit suivre ses conventions locales.

## Imports entre domaines

Lorsqu'une implémentation utilise un autre domaine du même package, elle doit passer par l'index du domaine avec `@scripts/<domain>` :

```ts
import * as DServerCommon from "@scripts/common";
```

Ne pas traverser l'arborescence avec un chemin relatif pour atteindre directement l'implémentation d'un autre domaine.

Les imports internes à un même domaine peuvent suivre son organisation locale.

## Index des dossiers

Chaque nouveau dossier de sources doit posséder un `index.ts`.

Cet index expose le contenu destiné à être utilisé par le niveau supérieur :

```ts
export * from "./create";
export * from "./parse";
export * from "./utils";
```

Lorsqu'un nouveau fichier doit être accessible depuis l'extérieur de son dossier, mettre à jour son `index.ts`.

Lorsqu'un nouveau domaine doit être accessible depuis le package, mettre également à jour les niveaux d'index nécessaires.

Si ce domaine fait partie de l'API publique du package, vérifier également les `exports` de son `package.json`.

## Réutilisation avant création

Avant d'ajouter une fonction :

1. rechercher une fonction équivalente dans le domaine courant ;
2. rechercher dans le reste du package ;
3. rechercher dans les packages dont le package courant dépend déjà ;
4. vérifier particulièrement `@duplojs/lang` pour les utilitaires génériques.

Éviter de créer localement une primitive générique déjà fournie par l'écosystème.

Lorsqu'une fonction :

* manipule uniquement des données ;
* ne dépend pas du contexte du package courant ;
* ne dépend pas d'une API spécifique à une plateforme ;
* peut être utile à plusieurs packages ;

elle doit être considérée comme une candidate pour `@duplojs/lang`.

## Référence au code existant

Utiliser les implémentations voisines comme référence pour comprendre :

* le découpage des fichiers ;
* le nommage ;
* les patterns du domaine ;
* la forme des exports ;
* la manière de composer les primitives existantes.

Cependant, une convention explicitement documentée reste prioritaire sur une pratique historique observée dans le code.
