# @duplojs/agents-kit

Skills et documentation conceptuelle de l'écosystème DuploJS pour les agents.

Les sources documentaires, exemples TypeScript et fixtures sont conservés dans [`docs/concepts`](docs/concepts). Le build génère `docs/concepts.llms.md`, un routeur vers les concepts fondamentaux, le serveur, les clients, les tests et le Type-Driven Design. Les documents et le routeur sont inclus dans le package publié.

Depuis un projet consommateur, retrouver le routeur installé avec :

```sh
node --input-type=module -e 'import { fileURLToPath } from "node:url"; console.log(fileURLToPath(import.meta.resolve("@duplojs/agents-kit/docs/concepts.llms.md")))'
```

Lire les pages pertinentes en résolvant leurs liens relativement au routeur. Avant le premier build du monorepo, consulter les `index.md` des domaines dans `docs/concepts`.

La commande `install` crée par défaut des liens symboliques vers les skills du package.
L’option booléenne `--copy` copie les skills à la place.
À chaque installation, la destination du skill est supprimée puis remplacée par la copie ou le lien demandé. La cible d’un ancien lien symbolique est conservée.

```sh
pnpm exec duplojs-agents-kit install
pnpm exec duplojs-agents-kit install http --type codex
pnpm exec duplojs-agents-kit install http --copy
```

La sous-commande `generate-llms` génère un routeur Markdown à partir d’un dossier de documentation IA. Elle conserve les contenus introductifs et crée les liens vers les pages et exemples détaillés.

```sh
pnpm exec duplojs-agents-kit generate-llms --input docs/concepts --output docs/concepts.llms.md
```

Dans le monorepo, `pnpm --filter @duplojs/agents-kit build` construit la commande puis régénère ce routeur. `pnpm --filter @duplojs/agents-kit test:types` vérifie aussi les exemples et fixtures via `tsconfig.doc.json`, et `pnpm --filter @duplojs/agents-kit test:lint` les inclut dans le lint du package.

Ce package suit la configuration des packages DuploJS orientés serveur et peut être exécuté dans Node.js, Bun et Deno.
