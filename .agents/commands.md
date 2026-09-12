# Workflows

## Toolchain

* Build : Rolldown.
* Type checking : TypeScript 7.
* Lint : Oxlint.
* Tests unitaires : Vitest.

## Ordre de validation

Les opérations suivent cet ordre :

```text
Build
  ↓
Type checking + Lint
  ↓
Tests unitaires
```

Le type checking et le lint nécessitent donc un `dist` à jour. Les tests unitaires ne doivent être lancés qu'après validation du type checking et du lint.

## Build

Pour construire l'ensemble du monorepo :

```bash
pnpm build
```

Le build respecte l'ordre des dépendances internes :

```text
@duplojs/code-config
@duplojs/lang
@duplojs/server
@duplojs/tools
@duplojs/json-web-token
```

Pour reconstruire uniquement un package lorsque ses dépendances sont déjà à jour :

```bash
pnpm --filter <package> build
```

## Type checking

Prérequis : le build doit être à jour.

Tous les packages :

```bash
pnpm test:types
```

Un package :

```bash
pnpm --filter <package> test:types
```

Un fichier précis :

```bash
pnpm --filter <package> test:types:target <file-path>
```

## Lint

Prérequis : le build doit être à jour.

Tous les packages :

```bash
pnpm test:lint
```

Un package :

```bash
pnpm --filter <package> test:lint
```

Un fichier précis :

```bash
pnpm --filter <package> test:lint <file-path>
```

## Tests unitaires

Prérequis : le type checking et le lint doivent être valides.

Les tests utilisent les projets Vitest déclarés par les packages.

Tous les projets :

```bash
pnpm test:ut
```

Un package :

```bash
pnpm test:ut -- --project <package>
```

Un fichier précis :

```bash
pnpm test:ut -- --project <package> <file-path>
```
