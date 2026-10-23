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
				name: "ignores unconfigured paths, subpaths and parent barrels",
				code: `import { test } from "path/else";
import { other } from "path/to/child";
import { NomChoisi } from "path";
test(other(), NomChoisi);`,
				options,
			},
			{
				name: "accepts configured value and type namespace imports",
				code: `import * as NomChoisi from "path/to";
import type * as Other from "path/other";
NomChoisi.test();
type T = Other.EE;`,
				options,
			},
			{
				name: "ignores default-only and side-effect imports",
				code: `import value from "path/to";
import "path/to";
value();`,
				options,
			},
			{
				name: "ignores re-exports and dynamic imports",
				code: `export { test } from "path/to";
export * as Alias from "path/to";
const module = import("path/to");`,
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
				"converts multiple named imports using their exported names",
				`import { first as renamed, second, type EE as Alias } from "path/to";
renamed(second());
type T = Alias;`,
				`import * as NomChoisi from "path/to";
NomChoisi.first(NomChoisi.second());
type T = NomChoisi.EE;`,
			),
			invalid(
				"converts type-only declarations to ordinary namespace imports",
				`import type { EE, FF } from "path/to";
type T = [EE, FF];`,
				`import * as NomChoisi from "path/to";
type T = [NomChoisi.EE, NomChoisi.FF];`,
			),
			invalid(
				"converts multiple inline type imports",
				`import { type EE, type FF } from "path/to";
type T = [EE, FF];`,
				`import * as NomChoisi from "path/to";
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
				"updates every reference while preserving object shorthand keys",
				`import { test } from "path/to";
test();
const reference = test;
const object = { test };
export default test;`,
				`import * as NomChoisi from "path/to";
NomChoisi.test();
const reference = NomChoisi.test;
const object = { test: NomChoisi.test };
export default NomChoisi.test;`,
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
				`import * as NomChoisi from "path/to";
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
				"reuses a value namespace while preserving the default import",
				`import * as NomChoisi from "path/to";
import value, { test, type EE } from "path/to";
value(test());
type T = EE;`,
				`import * as NomChoisi from "path/to";
import value from "path/to";
value(NomChoisi.test());
type T = NomChoisi.EE;`,
			),
			invalid(
				"does not fix a top-level namespace collision",
				`import { test } from "path/to";
const NomChoisi = {};
test();`,
				null,
			),
			invalid(
				"does not reuse a namespace shadowed at a reference",
				`import type * as NomChoisi from "path/to";
import { test } from "path/to";
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
				"merges imports before and after a shared type namespace without retaining type modifiers",
				`import { first, type EE } from "path/to";
import type * as NomChoisi from "path/to";
import type { FF } from "path/to";
import { second } from "path/to";

first(second());
type T = [EE, FF, NomChoisi.EE];`,
				`import * as NomChoisi from "path/to";

NomChoisi.first(NomChoisi.second());
type T = [NomChoisi.EE, NomChoisi.FF, NomChoisi.EE];`,
				3,
			),
			invalid(
				"preserves block, line and trailing comments when rewriting a namespace",
				`import /* before */ type // after
* as NomChoisi from "path/to" /* trailing */;
import { test } from "path/to"; // keep this comment
test();`,
				`import /* before */ // after
* as NomChoisi from "path/to" /* trailing */;
 // keep this comment
NomChoisi.test();`,
			),
			invalid(
				"removes indented import lines with CRLF and at the end of the file",
				[
					"import * as NomChoisi from \"path/to\";",
					"\timport { first } from \"path/to\"; ",
					"first(second());",
					"  import { second } from \"path/to\";",
				].join("\r\n"),
				"import * as NomChoisi from \"path/to\";\r\nNomChoisi.first(NomChoisi.second());\r\n",
				2,
			),
			invalid(
				"preserves surrounding code when an import shares its line",
				`import * as NomChoisi from "path/to";
const value = 1; import { test } from "path/to"; test(value);`,
				`import * as NomChoisi from "path/to";
const value = 1;  NomChoisi.test(value);`,
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
