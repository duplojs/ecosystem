# typescript-config.

Chaque package possède plusieurs configurations TypeScript correspondant à des contextes distincts.

```text
tsconfig.json
├── tsconfig.app.json
├── tsconfig.build.json
├── tsconfig.config.json
├── tsconfig.test.json
└── tsconfig.lib.json
```

| Configuration          | Rôle                                                    |
| ---------------------- | ------------------------------------------------------- |
| `tsconfig.app.json`    | Développement des sources du package                    |
| `tsconfig.build.json`  | Build et génération du `dist`                           |
| `tsconfig.config.json` | Fichiers de configuration situés à la racine du package |
| `tsconfig.test.json`   | Contexte de développement enrichi pour les tests        |
| `tsconfig.lib.json`    | Vérification du typage réellement exposé par le `dist`  |
| `tsconfig.json`        | Références vers les différents contextes TypeScript     |

## `tsconfig.app.json`

Configuration principale utilisée pendant le développement.

Elle décrit le contexte TypeScript des sources présentes dans `scripts/`.

## `tsconfig.build.json`

Configuration utilisée pendant la phase de build.

Elle définit le contexte TypeScript des sources utilisées pour générer le `dist`.

## `tsconfig.config.json`

Configuration dédiée aux fichiers de configuration situés à la racine du package.

Elle permet de les isoler du contexte TypeScript de la librairie elle-même.

## `tsconfig.test.json`

Configuration utilisée pour les tests.

Elle reprend le contexte de développement de `tsconfig.app.json` et l'enrichit avec les fichiers et types nécessaires à l'environnement de test.

## `tsconfig.lib.json`

Configuration utilisée pour vérifier le typage réellement exposé par le package généré.

Contrairement au contexte de développement, les références aux sources du package sont remplacées par les déclarations générées dans `dist`.

Elle permet ainsi de vérifier que l'API typée exposée après le build correspond à celle attendue pendant le développement.

```text
Développement
scripts/*.ts
    ↓
tsconfig.app.json

Build
scripts/*.ts
    ↓
dist/*

Validation de la librairie générée
dist/*.d.ts
    ↓
tsconfig.lib.json
```

## `tsconfig.json`

Configuration racine du package.

Elle ne représente pas directement un contexte de compilation. Elle regroupe les différentes configurations TypeScript du package à travers leurs références.

Cette organisation permet à chaque contexte d'être vérifié indépendamment tout en conservant un point d'entrée TypeScript commun au package.
