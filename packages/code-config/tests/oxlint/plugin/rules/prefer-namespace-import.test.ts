import { RuleTester } from "oxlint/plugins-dev";
import { DOxlint } from "@scripts";

RuleTester.describe = describe;
RuleTester.it = it;

const options = [
	{
		paths: {
			"@duplojs/lang/array": "DArray",
			"@duplojs/lang/either": "DEither",
		},
	},
];

const ambiguousOptions = [
	{
		paths: {
			"@duplojs/lang/either": "DEither",
			"@duplojs/lang/other-either": "DEither",
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
			{
				name: "ignores regular imports from parent barrel",
				code: `
					import { pipe } from "@duplojs/lang";
					pipe(value);
				`,
				options,
			},
			{
				name: "ignores string exports from parent barrel",
				code: `
					import { "DEither" as Either } from "@duplojs/lang";
					Either;
				`,
				options,
			},
			{
				name: "ignores ambiguous barrel namespaces",
				code: `
					import { DEither } from "@duplojs/lang";
					DEither.left("value");
				`,
				options: ambiguousOptions,
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

			{
				name: "converts namespace exported from parent barrel",
				code: `
					import { DEither } from "@duplojs/lang";

					const result = DEither.left("value");
				`,
				output: `
					import * as DEither from "@duplojs/lang/either";

					const result = DEither.left("value");
				`,
				options,
				errors: [
					{
						messageId: "preferNamespaceImport",
					},
				],
			},
			{
				name: "converts multiple namespaces exported from parent barrel",
				code: `
					import { DEither, DArray } from "@duplojs/lang";

					DEither.left("value");
					DArray.first([]);
				`,
				output: `
					import * as DEither from "@duplojs/lang/either";
					import * as DArray from "@duplojs/lang/array";

					DEither.left("value");
					DArray.first([]);
				`,
				options,
				errors: [
					{
						messageId: "preferNamespaceImport",
					},
				],
			},
			{
				name: "preserves named imports from parent barrel",
				code: `
					import { pipe, DEither } from "@duplojs/lang";

					pipe(DEither.left("value"));
				`,
				output: `
					import { pipe } from "@duplojs/lang";
					import * as DEither from "@duplojs/lang/either";

					pipe(DEither.left("value"));
				`,
				options,
				errors: [
					{
						messageId: "preferNamespaceImport",
					},
				],
			},
			{
				name: "preserves default and named imports from parent barrel",
				code: `
					import lang, { pipe, DEither } from "@duplojs/lang";

					lang();
					pipe(DEither.left("value"));
				`,
				output: `
					import lang, { pipe } from "@duplojs/lang";
					import * as DEither from "@duplojs/lang/either";

					lang();
					pipe(DEither.left("value"));
				`,
				options,
				errors: [
					{
						messageId: "preferNamespaceImport",
					},
				],
			},
			{
				name: "rewrites aliased barrel namespace",
				code: `
					import { DEither as Either } from "@duplojs/lang";

					const result = Either.left("value");
				`,
				output: `
					import * as DEither from "@duplojs/lang/either";

					const result = DEither.left("value");
				`,
				options,
				errors: [
					{
						messageId: "preferNamespaceImport",
					},
				],
			},
			{
				name: "rewrites aliased barrel namespace shorthand",
				code: `
					import { DEither as Either } from "@duplojs/lang";

					const object = { Either };
				`,
				output: `
					import * as DEither from "@duplojs/lang/either";

					const object = { Either: DEither };
				`,
				options,
				errors: [
					{
						messageId: "preferNamespaceImport",
					},
				],
			},
			{
				name: "preserves barrel namespace references when name already matches",
				code: `
					import { DEither } from "@duplojs/lang";

					export { DEither };
				`,
				output: `
					import * as DEither from "@duplojs/lang/either";

					export { DEither };
				`,
				options,
				errors: [
					{
						messageId: "preferNamespaceImport",
					},
				],
			},
			{
				name: "does not fix aliased re-exported barrel namespace",
				code: `
					import { DEither as Either } from "@duplojs/lang";

					export { Either };
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
				name: "does not fix barrel namespace collision",
				code: `
					import { DEither as Either } from "@duplojs/lang";

					const DEither = {};
					Either.left("value");
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
				name: "converts type-only namespace from parent barrel",
				code: `
					import type { DEither } from "@duplojs/lang";

					type TT = DEither.Left<string>;
				`,
				output: `
					import type * as DEither from "@duplojs/lang/either";

					type TT = DEither.Left<string>;
				`,
				options,
				errors: [
					{
						messageId: "preferNamespaceImport",
					},
				],
			},
			{
				name: "converts type-only namespace specifier from parent barrel",
				code: `
					import { type DEither, pipe } from "@duplojs/lang";

					type TT = DEither.Left<string>;
					pipe(value);
				`,
				output: `
					import { pipe } from "@duplojs/lang";
					import type * as DEither from "@duplojs/lang/either";

					type TT = DEither.Left<string>;
					pipe(value);
				`,
				options,
				errors: [
					{
						messageId: "preferNamespaceImport",
					},
				],
			},
			{
				name: "does not match similarly prefixed packages",
				code: `
					import { DEither } from "@duplojs/lang";

					DEither.left("value");
				`,
				output: `
					import * as DEither from "@duplojs/lang/either";

					DEither.left("value");
				`,
				options: [
					{
						paths: {
							"@duplojs/lang-extra/either": "DEither",
							"@duplojs/lang/either": "DEither",
						},
					},
				],
				errors: [
					{
						messageId: "preferNamespaceImport",
					},
				],
			},
			{
				name: "preserves only default import from parent barrel",
				code: `
					import lang, { DEither } from "@duplojs/lang";

					lang();
					DEither.left("value");
				`,
				output: `
					import lang from "@duplojs/lang";
					import * as DEither from "@duplojs/lang/either";

					lang();
					DEither.left("value");
				`,
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
			let reportDescriptor = undefined as
				| {
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
