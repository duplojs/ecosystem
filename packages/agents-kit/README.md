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
pnpm exec duplojs-agents-kit install http-server --type codex
pnpm exec duplojs-agents-kit install http-client --copy
pnpm exec duplojs-agents-kit install command --type codex
pnpm exec duplojs-agents-kit install server --type codex
pnpm exec duplojs-agents-kit install modeling --type codex
pnpm exec duplojs-agents-kit install test --type codex
```

Two independently installable skills cover HTTP:

- `http-server` (`duplojs-http-server`) guides server setup, routes, reusable flows, and contract and schema generation.
- `http-client` (`duplojs-http-client`) guides typed calls to DuploJS or external APIs, response expectations, hooks, Predicted mode, SSE, and streams. It accepts generated or handwritten route types.

The `server` skill (`duplojs-server`) guides filesystem operations, typed I/O errors, file and folder structures, environment configuration, and process capabilities through `@duplojs/server`. It prioritizes the package's runtime abstractions and distinguishes the process working directory from the module directory.

The `modeling` skill (`duplojs-modeling`) guides business system modeling and implementation with Type-Driven Design: understanding the existing domain, entity lifecycles, flags, facts, evidence, aggregates, repositories, use cases, and infrastructure boundaries. It starts with architecture boundaries and the affected domain contracts, then selects conceptual reading according to the responsibility being changed, including for application or infrastructure work.

The `test` skill (`duplojs-test`) guides testing DuploJS results and type contracts, selecting expected Either information, monitoring new result variants with exhaustive selectors, and isolating server dependencies through `TESTImplementation`. It also points to the concepts for organizing E2E tests with `@duplojs/playwright`.

The `command` skill guides the creation of typed CLI commands with `@duplojs/server/command`, including arguments, options, subcommands, help, and executable entry points. Running `install` without a skill installs all supported skills. References and checked TypeScript examples are included in both copied and linked installations.

The `setup` command creates `AGENTS.md` by default, or `CLAUDE.md` with `--type claude`, in the current project if needed and synchronizes a marked coding conventions block while preserving the surrounding content:

```sh
pnpm exec duplojs-agents-kit setup
pnpm exec duplojs-agents-kit setup --type default
pnpm exec duplojs-agents-kit setup --type claude
```

The block comes from `instructions/coding-conventions.md`, included in the published package. Every `{{packagePath}}` placeholder is replaced with the path to the installed AgentKit package relative to the directory containing the selected instructions file (the current working directory). Running `setup` again replaces the block between `<!-- duplojs-agents-kit:coding-conventions:start -->` and `<!-- duplojs-agents-kit:coding-conventions:stop -->`. Incomplete or duplicate markers cause an error before writing. The supported setup types are `default` and `claude`.

For AgentKit development, the local `bin/generateLlms/index.ts` script generates a Markdown router from an AI documentation directory. It preserves introductory content and links to detailed pages and examples. It is not included in the published package. From the package root:

```sh
pnpm run generate-llms --input docs/concepts --output docs/concepts.llms.md
```

In the monorepo, `pnpm --filter @duplojs/agents-kit build` builds the package, then regenerates this router using the local script. `pnpm --filter @duplojs/agents-kit test:types` also checks examples and fixtures under `docs/` and `skills/` through `tsconfig.doc.json`, and `pnpm --filter @duplojs/agents-kit test:lint` includes them in the package's lint checks. Skill references link directly to their TypeScript examples under `references/examples/`; these files are included when the skill is copied or linked during installation.

This package follows the configuration of server-oriented DuploJS packages and can run on Node.js, Bun, and Deno.
