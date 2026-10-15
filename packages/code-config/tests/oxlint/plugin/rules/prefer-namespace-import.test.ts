
import { RuleTester } from "oxlint/plugins-dev";
import { DOxlint } from "@scripts";

RuleTester.describe = describe;
RuleTester.it = it;

const options = [
	{
		paths: {
			"path/to": "NomChoisi",
			"path/other": "Other",
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
		messageId: "preferNamespaceImport",
	})),
});

const ruleTester = new RuleTester({
	languageOptions: {
		parserOptions: { lang: "ts" },
	},
});

ruleTester.run(
	"prefer-namespace-import",
	DOxlint.preferNamespaceImport as never,
	{
		valid: [
			{
				name: "ignores imports without configuration",
				code: `import { test } from "path/to";
test();`,
			},
			{
				name: "ignores paths not configured",
				code: `import { test } from "path/else";
test();`,
				options,
			},
			{
				name: "matches exact paths, not prefixes",
				code: `import { test } from "path/to/child";
test();`,
				options,
			},
			{
				name: "ignores parent barrel imports",
				code: `import { NomChoisi } from "path";
NomChoisi.test();`,
				options,
			},
			{
				name: "accepts a correct namespace import",
				code: `import * as NomChoisi from "path/to";
NomChoisi.test();`,
				options,
			},
			{
				name: "accepts a correct type-only namespace import",
				code: `import type * as NomChoisi from "path/to";
type T = NomChoisi.EE;`,
				options,
			},
			{
				name: "accepts default-only imports",
				code: `import value from "path/to";
value();`,
				options,
			},
			{
				name: "accepts side-effect imports",
				code: "import \"path/to\";",
				options,
			},
			{
				name: "ignores direct re-exports",
				code: "export { test } from \"path/to\";",
				options,
			},
			{
				name: "ignores namespace re-exports",
				code: "export * as Alias from \"path/to\";",
				options,
			},
			{
				name: "ignores dynamic imports",
				code: "const module = import(\"path/to\");",
				options,
			},
		],
		invalid: [
			invalid(
				"fixes safe imports alongside an unfixable collision",
				`import { test } from "path/to";
import { other } from "path/other";
const Other = {};
test(other());`,
				`import * as NomChoisi from "path/to";
import { other } from "path/other";
const Other = {};
NomChoisi.test(other());`,
				2,
			),
			invalid(
				"converts named value and type imports",
				`import { test, type EE } from "path/to";
test();
type TT = EE;`,
				`import * as NomChoisi from "path/to";
NomChoisi.test();
type TT = NomChoisi.EE;`,
			),
			invalid(
				"converts multiple named value imports",
				`import { first, second } from "path/to";
first(second());`,
				`import * as NomChoisi from "path/to";
NomChoisi.first(NomChoisi.second());`,
			),
			invalid(
				"uses the imported name rather than its local alias",
				`import { test as renamed, type EE as Alias } from "path/to";
renamed();
type T = Alias;`,
				`import * as NomChoisi from "path/to";
NomChoisi.test();
type T = NomChoisi.EE;`,
			),
			invalid(
				"preserves type-only declarations",
				`import type { EE } from "path/to";
type T = EE;`,
				`import type * as NomChoisi from "path/to";
type T = NomChoisi.EE;`,
			),
			invalid(
				"converts a single inline type import",
				`import { type EE } from "path/to";
type T = EE;`,
				`import type * as NomChoisi from "path/to";
type T = NomChoisi.EE;`,
			),
			invalid(
				"converts multiple inline type imports",
				`import { type EE, type FF } from "path/to";
type T = [EE, FF];`,
				`import type * as NomChoisi from "path/to";
type T = [NomChoisi.EE, NomChoisi.FF];`,
			),
			invalid(
				"preserves a default import alongside named imports",
				`import value, { test } from "path/to";
value(test());`,
				`import value, * as NomChoisi from "path/to";
value(NomChoisi.test());`,
			),
			invalid(
				"converts string-literal exported names",
				`import { "foo-bar" as fooBar } from "path/to";
fooBar();`,
				`import * as NomChoisi from "path/to";
NomChoisi["foo-bar"]();`,
			),
			invalid(
				"converts named default exports",
				`import { default as run } from "path/to";
run();`,
				`import * as NomChoisi from "path/to";
NomChoisi.default();`,
			),
			invalid(
				"updates every reference of the imported binding",
				`import { test } from "path/to";
test();
const f = test;
export default test;`,
				`import * as NomChoisi from "path/to";
NomChoisi.test();
const f = NomChoisi.test;
export default NomChoisi.test;`,
			),
			invalid(
				"preserves object shorthand keys",
				`import { test } from "path/to";
const object = { test };`,
				`import * as NomChoisi from "path/to";
const object = { test: NomChoisi.test };`,
			),
			invalid(
				"does not rewrite shadowed references",
				`import { test } from "path/to";
test();
function run(test: string) {
	return test;
}`,
				`import * as NomChoisi from "path/to";
NomChoisi.test();
function run(test: string) {
	return test;
}`,
			),
			invalid(
				"renames an existing namespace import",
				`import * as Alias from "path/to";
Alias.test();
const object = { Alias };`,
				`import * as NomChoisi from "path/to";
NomChoisi.test();
const object = { Alias: NomChoisi };`,
			),
			invalid(
				"renames a type-only namespace import",
				`import type * as Alias from "path/to";
type T = Alias.EE;`,
				`import type * as NomChoisi from "path/to";
type T = NomChoisi.EE;`,
			),
			invalid(
				"preserves source quote style",
				`import { test } from 'path/to';
test();`,
				`import * as NomChoisi from 'path/to';
NomChoisi.test();`,
			),
			invalid(
				"uses the namespace configured for another path",
				`import { test } from "path/other";
test();`,
				`import * as Other from "path/other";
Other.test();`,
			),
			invalid(
				"converts multiple distinct configured paths",
				`import { test } from "path/to";
import { other } from "path/other";
test(other());`,
				`import * as NomChoisi from "path/to";
import * as Other from "path/other";
NomChoisi.test(Other.other());`,
				2,
			),
			invalid(
				"reuses an existing value namespace import",
				`import * as NomChoisi from "path/to";
import { test } from "path/to";
test();`,
				`import * as NomChoisi from "path/to";

NomChoisi.test();`,
			),
			invalid(
				"reuses an existing type namespace import for types",
				`import type * as NomChoisi from "path/to";
import type { EE } from "path/to";
type T = EE;`,
				`import type * as NomChoisi from "path/to";

type T = NomChoisi.EE;`,
			),
			invalid(
				"reuses value namespace imports for type references",
				`import * as NomChoisi from "path/to";
import { type EE } from "path/to";
type T = EE;`,
				`import * as NomChoisi from "path/to";

type T = NomChoisi.EE;`,
			),
			invalid(
				"reuses a namespace and preserves the default import",
				`import * as NomChoisi from "path/to";
import value, { test } from "path/to";
value(test());`,
				`import * as NomChoisi from "path/to";
import value from "path/to";
value(NomChoisi.test());`,
			),
			invalid(
				"does not fix a top-level namespace collision",
				`import { test } from "path/to";
const NomChoisi = {};
test();`,
				null,
			),
			invalid(
				"does not fix a namespace collision within a function",
				`import { test } from "path/to";
function run(NomChoisi: unknown) {
	test();
}`,
				null,
			),
			invalid(
				"does not fix multiple named imports from the same path",
				`import { first } from "path/to";
import { second } from "path/to";
first(second());`,
				null,
				2,
			),
			invalid(
				"does not reuse a type namespace import for values",
				`import type * as NomChoisi from "path/to";
import { test } from "path/to";
test();`,
				null,
			),
			invalid(
				"does not fix imported bindings re-exported locally",
				`import { test } from "path/to";
export { test };`,
				null,
			),
			invalid(
				"does not fix namespace aliases re-exported locally",
				`import * as Alias from "path/to";
export { Alias };`,
				null,
			),
			invalid(
				"does not discard comments inside import specifiers",
				`import { /* keep */ test } from "path/to";
test();`,
				null,
			),
		],
	},
);

describe("prefer-namespace-import defensive branches", () => {
	it("reports without fixing when binding metadata is missing", () => {
		const report = vi.fn();
		const listeners = DOxlint.preferNamespaceImport.create({
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
						name: "test",
					},
					local: {
						type: "Identifier",
						name: "test",
					},
				},
			],
		} as never);
		listeners["Program:exit"]?.({} as never);

		expect(report).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({
			messageId: "preferNamespaceImport",
			fix: undefined,
		}));
	});

	it("does not remove a default import when its separator token is invalid", () => {
		const report = vi.fn();
		const binding = { references: [] };
		const namespaceImport = {
			type: "ImportDeclaration",
			source: { value: "path/to" },
			specifiers: [
				{
					type: "ImportNamespaceSpecifier",
					local: { name: "NomChoisi" },
				},
			],
		};
		const importNode = {
			type: "ImportDeclaration",
			source: { value: "path/to" },
			specifiers: [
				{
					type: "ImportDefaultSpecifier",
					local: { name: "value" },
				},
				{
					type: "ImportSpecifier",
					imported: {
						type: "Identifier",
						name: "test",
					},
					local: {
						type: "Identifier",
						name: "test",
					},
				},
			],
		};
		const getTokenBefore = vi.fn()
			.mockReturnValueOnce({
				value: "{",
				range: [10, 11],
			})
			.mockReturnValueOnce({ value: ";" });
		const listeners = DOxlint.preferNamespaceImport.create({
			options,
			report,
			sourceCode: {
				getDeclaredVariables: () => [binding],
				getScope: () => ({
					set: new Map(),
					upper: null,
				}),
				getTokenBefore,
				getTokenAfter: () => ({
					value: "}",
					range: [20, 21],
				}),
				getCommentsInside: () => [],
			},
		} as never);

		listeners.Program?.({ body: [namespaceImport, importNode] } as never);
		listeners.ImportDeclaration?.(importNode as never);
		listeners["Program:exit"]?.({} as never);
		const [{ fix }] = report.mock.calls[0]!;
		const result = fix({});

		expect(result).toEqual([]);
	});
});
