# Écosystème DuploJS

Ce projet est un monorepo pnpm regroupant les librairies de l'écosystème DuploJS.

L'écosystème vise à rendre le développement TypeScript plus robuste en s'appuyant sur la programmation fonctionnelle et le Type-Driven Development.

## Workspace

* `packages/lang`: package fondamental de l'écosystème. Fournit les primitives fonctionnelles communes. Son exécution ne dépend d'aucune librairie externe et repose uniquement sur les API du langage JavaScript.
* `packages/server`: abstrait les API serveur de Node.js, Bun et Deno afin de proposer une interface cohérente entre les différentes plateformes et avec les paradigmes définis par `lang`.
* `packages/json-web-token`: fournit les outils nécessaires à la gestion des JSON Web Tokens selon les paradigmes de l'écosystème.
* `packages/tools`: regroupe des outils de génération et de transformation de code utilisés pendant le développement d'un projet DuploJS, mais pas au runtime.
* `packages/code-config`: regroupe les configurations et règles partagées liées notamment au linting, au formatage et aux autres outils de qualité de code.

## Ressources du projet

* Architecture et relations entre les packages : `.agents/architecture.md`
* Configuration TypeScript des différents packages : `.agents/typescript-config.md`
* Différentes commandes du projet : `.agents/commands.md`
* Règle des importations de packages de l'écosystème : `.agents/importations.md`
