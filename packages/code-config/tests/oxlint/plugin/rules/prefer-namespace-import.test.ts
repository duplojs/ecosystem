import { RuleTester } from "oxlint/plugins-dev";
import { DOxlint } from "@scripts";

RuleTester.describe = describe;
RuleTester.it = it;

const options = [
	{
		paths: {
			"@duplojs/lang/array": "DArray",
		},
	},
];

const ruleTester = new RuleTester({
	languageOptions: {
		parserOptions: {
			lang: "ts",
		},
	},
});

ruleTester.run(
	"prefer-namespace-import",
	DOxlint.preferNamespaceImport as never,
	{
		valid: [
			{
				name: "ignores when no path is configured",
				code: `
					import { MinElement } from "@duplojs/lang/array";
					type TT = MinElement;
				`,
			},
			{
				name: "ignores unconfigured paths",
				code: `
					import { MinElement } from "@duplojs/lang/object";
					type TT = MinElement;
				`,
				options,
			},
			{
				name: "accepts namespace import",
				code: `
					import * as DArray from "@duplojs/lang/array";
					type TT = DArray.MinElement;
				`,
				options,
			},
			{
				name: "accepts default import",
				code: `
					import array from "@duplojs/lang/array";
					array();
				`,
				options,
			},
			{
				name: "accepts side effect import",
				code: `
					import "@duplojs/lang/array";
				`,
				options,
			},
		],

		invalid: [
			{
				name: "converts named imports and their references",
				code: `
					import { MinElement, chunk as chunkArray } from "@duplojs/lang/array";

					type TT = MinElement;
					const result = chunkArray(values);
					const object = { chunkArray };

					function test(MinElement: string) {
						return MinElement;
					}
				`,
				output: `
					import * as DArray from "@duplojs/lang/array";

					type TT = DArray.MinElement;
					const result = DArray.chunk(values);
					const object = { chunkArray: DArray.chunk };

					function test(MinElement: string) {
						return MinElement;
					}
				`,
				options,
				errors: [
					{
						messageId: "preferNamespaceImport",
					},
				],
			},
			{
				name: "uses imported name instead of local alias",
				code: `
					import { MinElement as Min } from "@duplojs/lang/array";
					type TT = Min;
				`,
				output: `
					import * as DArray from "@duplojs/lang/array";
					type TT = DArray.MinElement;
				`,
				options,
				errors: [
					{
						messageId: "preferNamespaceImport",
					},
				],
			},
			{
				name: "supports string named exports",
				code: `
					import { "foo-bar" as fooBar } from "@duplojs/lang/array";
					fooBar();
				`,
				output: `
					import * as DArray from "@duplojs/lang/array";
					DArray["foo-bar"]();
				`,
				options,
				errors: [
					{
						messageId: "preferNamespaceImport",
					},
				],
			},
			{
				name: "preserves type-only declaration",
				code: `
					import type { MinElement } from "@duplojs/lang/array";
					type TT = MinElement;
				`,
				output: `
					import type * as DArray from "@duplojs/lang/array";
					type TT = DArray.MinElement;
				`,
				options,
				errors: [
					{
						messageId: "preferNamespaceImport",
					},
				],
			},
			{
				name: "converts type-only specifier",
				code: `
					import { type MinElement } from "@duplojs/lang/array";
					type TT = MinElement;
				`,
				output: `
					import type * as DArray from "@duplojs/lang/array";
					type TT = DArray.MinElement;
				`,
				options,
				errors: [
					{
						messageId: "preferNamespaceImport",
					},
				],
			},
			{
				name: "converts mixed type and value imports",
				code: `
					import { type MinElement, chunk } from "@duplojs/lang/array";

					type TT = MinElement;
					const result = chunk(values);
				`,
				output: `
					import * as DArray from "@duplojs/lang/array";

					type TT = DArray.MinElement;
					const result = DArray.chunk(values);
				`,
				options,
				errors: [
					{
						messageId: "preferNamespaceImport",
					},
				],
			},
			{
				name: "preserves default import",
				code: `
					import array, { MinElement } from "@duplojs/lang/array";

					array();
					type TT = MinElement;
				`,
				output: `
					import array, * as DArray from "@duplojs/lang/array";

					array();
					type TT = DArray.MinElement;
				`,
				options,
				errors: [
					{
						messageId: "preferNamespaceImport",
					},
				],
			},
			{
				name: "does not fix namespace collision",
				code: `
					import { MinElement } from "@duplojs/lang/array";

					const DArray = {};
					type TT = MinElement;
				`,
				output: null,
				options,
				errors: [
					{
						messageId: "preferNamespaceImport",
					},
				],
			},
			{
				name: "does not fix multiple imports from the same path",
				code: `
					import { MinElement } from "@duplojs/lang/array";
					import { chunk } from "@duplojs/lang/array";

					type TT = MinElement;
					chunk(values);
				`,
				output: null,
				options,
				errors: [
					{
						messageId: "preferNamespaceImport",
					},
					{
						messageId: "preferNamespaceImport",
					},
				],
			},
			{
				name: "does not fix re-exported bindings",
				code: `
					import { MinElement } from "@duplojs/lang/array";
					export { MinElement };
				`,
				output: null,
				options,
				errors: [
					{
						messageId: "preferNamespaceImport",
					},
				],
			},
		],
	},
);

describe("prefer-namespace-import defensive branches", () => {
	it("does not produce a fix when import tokens are invalid", () => {
		const invalidTokens = [
			[null, null],
			[
				{
					value: "{",
					range: [0, 1],
				},
				null,
			],
			[
				{
					value: "(",
					range: [0, 1],
				},
				{
					value: "}",
					range: [2, 3],
				},
			],
			[
				{
					value: "{",
					range: [0, 1],
				},
				{
					value: ")",
					range: [2, 3],
				},
			],
		];

		for (const [openingBrace, closingBrace] of invalidTokens) {
			let reportDescriptor = undefined as | {
				fix(fixer: unknown): unknown;
			}
				| undefined;

			const sourceCode = {
				getDeclaredVariables: () => [],
				getTokenBefore: () => openingBrace,
				getTokenAfter: () => closingBrace,
			};

			const context = {
				options,
				sourceCode,
				report(descriptor: unknown) {
					reportDescriptor = descriptor as typeof reportDescriptor;
				},
			};

			const importNode = {
				type: "ImportDeclaration",
				source: {
					value: "@duplojs/lang/array",
				},
				specifiers: [
					{
						type: "ImportSpecifier",
						imported: {
							type: "Identifier",
							name: "MinElement",
						},
						local: {
							type: "Identifier",
							name: "MinElement",
						},
					},
				],
			};

			const listeners = DOxlint.preferNamespaceImport.create(
				context as never,
			);

			listeners.Program?.(
				{
					type: "Program",
					body: [importNode],
				} as never,
			);

			listeners.ImportDeclaration?.(
				importNode as never,
			);

			expect(reportDescriptor).toBeDefined();
			expect(
				reportDescriptor?.fix?.({}),
			).toBeNull();
		}
	});
});
