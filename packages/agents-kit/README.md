# @duplojs/agents-kit

Skills and conceptual documentation for agents working with the DuploJS ecosystem.

Documentation sources, TypeScript examples, and fixtures are stored in [`docs/concepts`](docs/concepts). The build generates `docs/concepts.llms.md`, a documentation router covering core concepts, the server, clients, testing, and Type-Driven Design. The documentation and router are included in the published package.

From a consuming project, locate the installed router with:

```sh
node --input-type=module -e 'import { fileURLToPath } from "node:url"; console.log(fileURLToPath(import.meta.resolve("@duplojs/agents-kit/docs/concepts.llms.md")))'
```

Read the relevant pages by resolving their links relative to the router. Before the first monorepo build, consult each domain's `index.md` in `docs/concepts`.

The `install` command creates symbolic links to the package's skills by default.
The boolean `--copy` option copies the skills instead.
Each installation removes the skill's destination and replaces it with the requested copy or link. The target of any existing symbolic link is preserved.

```sh
pnpm exec duplojs-agents-kit install
pnpm exec duplojs-agents-kit install http --type codex
pnpm exec duplojs-agents-kit install http --copy
```

For AgentKit development, the local `bin/generateLlms/index.ts` script generates a Markdown router from an AI documentation directory. It preserves introductory content and links to detailed pages and examples. It is not included in the published package. From the package root:

```sh
pnpm run generate-llms --input docs/concepts --output docs/concepts.llms.md
```

In the monorepo, `pnpm --filter @duplojs/agents-kit build` builds the package, then regenerates this router using the local script. `pnpm --filter @duplojs/agents-kit test:types` also checks examples and fixtures through `tsconfig.doc.json`, and `pnpm --filter @duplojs/agents-kit test:lint` includes them in the package's lint checks.

This package follows the configuration of server-oriented DuploJS packages and can run on Node.js, Bun, and Deno.
