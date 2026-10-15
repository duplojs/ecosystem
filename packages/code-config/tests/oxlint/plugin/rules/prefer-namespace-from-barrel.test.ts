
import { RuleTester } from "oxlint/plugins-dev";
import { DOxlint } from "@scripts";

RuleTester.describe = describe;
RuleTester.it = it;

const options = [
	{
		sources: ["path/to", "other/barrel"],
		namespaces: {
			Domain: "path/to/domain",
			Other: "path/to/other",
		},
	},
];

const invalid = (
	name: string,
	code: string,
	output: string | null,
	errorCount = 1,
) => ({
	name,
	code,
	output,
	options,
	errors: Array.from({ length: errorCount }, () => ({
		messageId: "preferNamespaceFromBarrel",
	})),
});

const ruleTester = new RuleTester({
	languageOptions: {
		parserOptions: { lang: "ts" },
	},
});

ruleTester.run(
	"prefer-namespace-from-barrel",
	DOxlint.preferNamespaceFromBarrel as never,
	{
		valid: [
			{
				name: "ignores imports without configuration",
				code: `import { Domain } from "path/to";
Domain.run();`,
			},
			{
				name: "ignores unconfigured source paths",
				code: `import { Domain } from "another/path";
Domain.run();`,
				options,
			},
			{
				name: "matches source paths exactly",
				code: `import { Domain } from "path/to/child";
Domain.run();`,
				options,
			},
			{
				name: "ignores unconfigured namespaces",
				code: `import { helper } from "path/to";
helper();`,
				options,
			},
			{
				name: "accepts direct namespace imports",
				code: `import * as Domain from "path/to/domain";
Domain.run();`,
				options,
			},
			{
				name: "accepts direct type namespace imports",
				code: `import type * as Domain from "path/to/domain";
type T = Domain.Entity;`,
				options,
			},
			{
				name: "ignores default imports",
				code: `import Domain from "path/to";
Domain.run();`,
				options,
			},
			{
				name: "ignores side-effect imports",
				code: "import \"path/to\";",
				options,
			},
			{
				name: "ignores dynamic imports",
				code: "const module = import(\"path/to\");",
				options,
			},
			{
				name: "ignores direct re-exports",
				code: "export { Domain } from \"path/to\";",
				options,
			},
			{
				name: "ignores namespace re-exports",
				code: "export * as Domain from \"path/to\";",
				options,
			},
			{
				name: "ignores imports of a similarly named namespace",
				code: `import { DomainExtra } from "path/to";
DomainExtra.run();`,
				options,
			},
			{
				name: "ignores an empty namespaces mapping",
				code: `import { Domain } from "path/to";
Domain.run();`,
				options: [
					{
						sources: ["path/to"],
						namespaces: {},
					},
				],
			},
		],

		invalid: [
			invalid(
				"converts a direct domain import",
				`import { Domain } from "path/to";
Domain.run();`,
				`import * as Domain from "path/to/domain";
Domain.run();`,
			),
			invalid(
				"converts an import from another configured source",
				`import { Domain } from "other/barrel";
Domain.run();`,
				`import * as Domain from "path/to/domain";
Domain.run();`,
			),
			invalid(
				"converts multiple domains from the same barrel",
				`import { Domain, Other } from "path/to";
Domain.run();
Other.run();`,
				`import * as Domain from "path/to/domain";
import * as Other from "path/to/other";
Domain.run();
Other.run();`,
			),
			invalid(
				"does not duplicate a statement preceding the import on the same line",
				`const value = 1; import { Domain, Other } from "path/to";
Domain.run(value);
Other.run(value);`,
				`const value = 1; import * as Domain from "path/to/domain";
import * as Other from "path/to/other";
Domain.run(value);
Other.run(value);`,
			),
			invalid(
				"preserves indentation when splitting an import into multiple domains",
				`\timport { Domain, Other } from "path/to";
Domain.run();
Other.run();`,
				`\timport * as Domain from "path/to/domain";
\timport * as Other from "path/to/other";
Domain.run();
Other.run();`,
			),
			invalid(
				"preserves unrelated named imports",
				`import { helper, Domain } from "path/to";
helper(Domain.run());`,
				`import { helper } from "path/to";
import * as Domain from "path/to/domain";
helper(Domain.run());`,
			),
			invalid(
				"preserves multiple unrelated imports",
				`import { first, Domain, second } from "path/to";
first(Domain.run(), second());`,
				`import { first, second } from "path/to";
import * as Domain from "path/to/domain";
first(Domain.run(), second());`,
			),
			invalid(
				"preserves a default import",
				`import root, { Domain } from "path/to";
root(Domain.run());`,
				`import root from "path/to";
import * as Domain from "path/to/domain";
root(Domain.run());`,
			),
			invalid(
				"preserves default and named imports",
				`import root, { Domain, helper } from "path/to";
root(helper(Domain.run()));`,
				`import root, { helper } from "path/to";
import * as Domain from "path/to/domain";
root(helper(Domain.run()));`,
			),
			invalid(
				"rewrites an aliased namespace",
				`import { Domain as Alias } from "path/to";
Alias.run();
const value = Alias;`,
				`import * as Domain from "path/to/domain";
Domain.run();
const value = Domain;`,
			),
			invalid(
				"preserves object shorthand keys when rewriting aliases",
				`import { Domain as Alias } from "path/to";
const object = { Alias };`,
				`import * as Domain from "path/to/domain";
const object = { Alias: Domain };`,
			),
			invalid(
				"does not rewrite shadowed aliases",
				`import { Domain as Alias } from "path/to";
Alias.run();
function run(Alias: string) {
	return Alias;
}`,
				`import * as Domain from "path/to/domain";
Domain.run();
function run(Alias: string) {
	return Alias;
}`,
			),
			invalid(
				"preserves type-only import declarations",
				`import type { Domain } from "path/to";
type T = Domain.Entity;`,
				`import type * as Domain from "path/to/domain";
type T = Domain.Entity;`,
			),
			invalid(
				"converts an inline type-only import",
				`import { type Domain } from "path/to";
type T = Domain.Entity;`,
				`import type * as Domain from "path/to/domain";
type T = Domain.Entity;`,
			),
			invalid(
				"preserves unrelated imports alongside type-only domains",
				`import { type Domain, helper } from "path/to";
type T = Domain.Entity;
helper();`,
				`import { helper } from "path/to";
import type * as Domain from "path/to/domain";
type T = Domain.Entity;
helper();`,
			),
			invalid(
				"converts mixed type-only and value domains",
				`import { type Domain, Other } from "path/to";
type T = Domain.Entity;
Other.run();`,
				`import type * as Domain from "path/to/domain";
import * as Other from "path/to/other";
type T = Domain.Entity;
Other.run();`,
			),
			invalid(
				"converts multiple type-only domains",
				`import type { Domain, Other } from "path/to";
type T = Domain.Entity | Other.Entity;`,
				`import type * as Domain from "path/to/domain";
import type * as Other from "path/to/other";
type T = Domain.Entity | Other.Entity;`,
			),
			invalid(
				"supports string-literal domain imports",
				`import { "Domain" as Alias } from "path/to";
Alias.run();`,
				`import * as Domain from "path/to/domain";
Domain.run();`,
			),
			invalid(
				"preserves single quotes",
				`import { Domain } from 'path/to';
Domain.run();`,
				`import * as Domain from 'path/to/domain';
Domain.run();`,
			),
			invalid(
				"preserves missing semicolons",
				`import { Domain } from "path/to"
Domain.run()`,
				`import * as Domain from "path/to/domain"
Domain.run()`,
			),
			invalid(
				"supports local re-exports of unchanged domain names",
				`import { Domain } from "path/to";
export { Domain };`,
				`import * as Domain from "path/to/domain";
export { Domain };`,
			),
			invalid(
				"reuses an existing namespace import",
				`import * as Domain from "path/to/domain";
import { Domain as Alias } from "path/to";
Alias.run();`,
				`import * as Domain from "path/to/domain";

Domain.run();`,
			),
			invalid(
				"reuses an existing type-only namespace",
				`import type * as Domain from "path/to/domain";
import type { Domain as Alias } from "path/to";
type T = Alias.Entity;`,
				`import type * as Domain from "path/to/domain";

type T = Domain.Entity;`,
			),
			invalid(
				"reuses a value namespace for type-only imports",
				`import * as Domain from "path/to/domain";
import { type Domain as Alias } from "path/to";
type T = Alias.Entity;`,
				`import * as Domain from "path/to/domain";

type T = Domain.Entity;`,
			),
			invalid(
				"reuses an existing namespace and preserves unrelated imports",
				`import * as Domain from "path/to/domain";
import { Domain as Alias, helper } from "path/to";
helper(Alias.run());`,
				`import * as Domain from "path/to/domain";
import { helper } from "path/to";
helper(Domain.run());`,
			),
			invalid(
				"converts several configured imports independently",
				`import { Domain } from "path/to";
import { Other } from "other/barrel";
Domain.run();
Other.run();`,
				`import * as Domain from "path/to/domain";
import * as Other from "path/to/other";
Domain.run();
Other.run();`,
				2,
			),
			invalid(
				"does not fix a top-level namespace collision",
				`import { Domain as Alias } from "path/to";
const Domain = {};
Alias.run();`,
				null,
			),
			invalid(
				"does not fix a namespace collision in a function",
				`import { Domain as Alias } from "path/to";
function run(Domain: unknown) {
	Alias.run();
}`,
				null,
			),
			invalid(
				"does not reuse a type-only namespace for a value",
				`import type * as Domain from "path/to/domain";
import { Domain as Alias } from "path/to";
Alias.run();`,
				null,
			),
			invalid(
				"does not fix duplicated domain imports",
				`import { Domain as First } from "path/to";
import { Domain as Second } from "path/to";
First.run();
Second.run();`,
				null,
				2,
			),
			invalid(
				"does not fix aliased local re-exports",
				`import { Domain as Alias } from "path/to";
export { Alias };`,
				null,
			),
			invalid(
				"does not discard comments inside imports",
				`import { /* keep */ Domain } from "path/to";
Domain.run();`,
				null,
			),
		],
	},
);

describe("prefer-namespace-from-barrel defensive branches", () => {
	it("reports without fixing when binding metadata is missing", () => {
		const report = vi.fn();
		const listeners = DOxlint.preferNamespaceFromBarrel.create({
			options,
			report,
			sourceCode: {
				getDeclaredVariables: () => [],
				getScope: () => ({
					set: new Map(),
					upper: null,
				}),
				getTokenBefore: () => ({ value: "{" }),
				getTokenAfter: () => ({ value: "}" }),
				getCommentsInside: () => [],
			},
		} as never);

		listeners.ImportDeclaration?.({
			type: "ImportDeclaration",
			source: { value: "path/to" },
			specifiers: [
				{
					type: "ImportSpecifier",
					imported: {
						type: "Identifier",
						name: "Domain",
					},
					local: {
						type: "Identifier",
						name: "Domain",
					},
				},
			],
		} as never);

		expect(report).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({
			messageId: "preferNamespaceFromBarrel",
			fix: undefined,
		}));
	});
});
