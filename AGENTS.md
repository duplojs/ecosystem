# Écosystème DuploJS

Ce projet est un monorepo pnpm regroupant les librairies de l'écosystème DuploJS.

L'écosystème vise à rendre le développement TypeScript plus robuste en s'appuyant sur la programmation fonctionnelle et le Type-Driven Development.

## Prérequis obligatoires avant toute action

Avant toute action dans un workspace, un package ou un domaine, commencer par consulter les consignes destinées aux agents. Cette étape est obligatoire, y compris pour une analyse, une revue, une modification de documentation, de code ou de tests, ou l'exécution d'une commande.

1. Identifier les workspaces, packages et domaines concernés par la demande.
2. Consulter en priorité le dossier [`.agents`](./.agents) à la racine, puis les dossiers `.agents` présents dans les périmètres concernés et leurs répertoires parents. Lire les consignes applicables ainsi que les `AGENTS.md` locaux lorsqu'ils existent.
3. Recenser les skills de chacun de ces dossiers `.agents` et lire l'en-tête de chaque fichier `SKILL.md`, notamment son nom et sa description, pour déterminer lesquels peuvent enrichir le traitement de la demande. Cette vérification est obligatoire ; la lecture intégrale de tous les skills ne l'est pas.
4. Charger individuellement et lire intégralement uniquement les skills pertinents, puis appliquer leurs instructions et consulter les ressources qu'ils demandent de lire avant de poursuivre l'action. Plusieurs skills peuvent s'appliquer à une même demande. Si aucun ne correspond, poursuivre seulement après avoir vérifié leurs en-têtes.
5. Avant toute modification de code ou de test, consulter impérativement [les règles d'importation](./.agents/importations.md), même si les conventions semblent pouvoir être déduites des fichiers voisins.

Les `AGENTS.md` et dossiers `.agents` locaux complètent les règles générales de l'écosystème avec le contexte, les concepts et les conventions propres à leur périmètre. Refaire cette vérification lorsque l'action concerne un nouveau package ou domaine, ou lorsque la nature du travail change.

## Workspace

* `packages/lang`: package fondamental de l'écosystème. Fournit les primitives fonctionnelles communes. Son exécution ne dépend d'aucune librairie externe et repose uniquement sur les API du langage JavaScript.
* `packages/server`: abstrait les API serveur de Node.js, Bun et Deno afin de proposer une interface cohérente entre les différentes plateformes et avec les paradigmes définis par `lang`.
* `packages/json-web-token`: fournit les outils nécessaires à la gestion des JSON Web Tokens selon les paradigmes de l'écosystème.
* `packages/playwright`: ajoute une fine couche d'organisation au-dessus de Playwright pour structurer les tests sous forme de hiérarchies Site web/Page/Composant, avec des actions nommées et lisibles.
* `packages/tools`: regroupe des outils de génération et de transformation de code utilisés pendant le développement d'un projet DuploJS, mais pas au runtime.
* `packages/code-config`: regroupe les configurations et règles partagées liées notamment au linting, au formatage et aux autres outils de qualité de code.
* `packages/agents-kit`: fournit les skills et la documentation conceptuelle destinés aux agents, ainsi que les commandes d'installation des skills et de génération du routeur documentaire.

## Ressources du projet

* Documentation conceptuelle de l'écosystème : [`packages/agents-kit/docs/concepts`](./packages/agents-kit/docs/concepts). Le build d'AgentKit génère le routeur `packages/agents-kit/docs/concepts.llms.md`. Le consulter pour retrouver les pages et exemples pertinents ; avant le build, parcourir les `index.md` des domaines dans les sources.
* Architecture et relations entre les packages : `.agents/architecture.md`
* Configuration TypeScript des différents packages : `.agents/typescript-config.md`
* Différentes commandes du projet : `.agents/commands.md`
* Règle des importations de packages de l'écosystème : `.agents/importations.md`
* convention des fonctions curifiées, principalement conçues pour être composées avec `pipe` : `.agents/curried-functions.md`
