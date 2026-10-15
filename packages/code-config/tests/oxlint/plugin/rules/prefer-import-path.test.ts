import { RuleTester } from "oxlint/plugins-dev";
import { Linter } from "eslint";
import { DOxlint } from "@scripts";

RuleTester.describe = describe;
RuleTester.it = it;

const options = [
	{
		paths: {
			"old/barrel": {
				replacement: "new/barrel",
				exceptions: ["keep", "Domain", "foo-bar"],
			},
			"old/all": { replacement: "new/all" },
			"old/default": {
				replacement: "new/default",
				exceptions: ["default"],
			},
			unchanged: { replacement: "unchanged" },
		},
	},
];

const invalid = (name: string, code: string, output: string | null) => ({
	name,
	code,
	output,
	options,
	errors: [{ messageId: "preferImportPath" }],
});

const ruleTester = new RuleTester({
	languageOptions: {
		parserOptions: { lang: "ts" },
	},
});

ruleTester.run("prefer-import-path", DOxlint.preferImportPath as never, {
	valid: [
		{
			name: "ignores missing configuration",
			code: "import { run } from \"old/barrel\";",
		},
		{
			code: "import { run } from \"elsewhere\";",
			options,
		},
		{
			code: "import { run } from \"old/barrel/child\";",
			options,
		},
		{
			code: "import { run } from \"toString\";",
			options,
		},
		{
			code: "import { keep, Domain } from \"old/barrel\";",
			options,
		},
		{
			code: "import { keep as alias } from \"old/barrel\";",
			options,
		},
		{
			code: "import { \"foo-bar\" as alias } from \"old/barrel\";",
			options,
		},
		{
			code: "import type { Domain } from \"old/barrel\";",
			options,
		},
		{
			code: "import root from \"old/default\";",
			options,
		},
		{
			code: "import { default as root } from \"old/default\";",
			options,
		},
		{
			code: "import * as Root from \"old/barrel\";",
			options,
		},
		{
			code: "import root, * as Root from \"old/default\";",
			options,
		},
		{
			code: "import { run } from \"unchanged\";",
			options,
		},
		{
			code: "export { run } from \"old/barrel\";",
			options,
		},
		{
			code: "const module = import(\"old/barrel\");",
			options,
		},
	],
	invalid: [
		invalid("moves all non-exempt imports", "import { run, type Entity } from \"old/barrel\";", "import { run, type Entity } from \"new/barrel\";"),
		invalid("moves aliased imports using their exported names", "import { run as keep } from \"old/barrel\";", "import { run as keep } from \"new/barrel\";"),
		invalid("moves string-literal exports", "import { \"other-name\" as run } from \"old/barrel\";", "import { \"other-name\" as run } from \"new/barrel\";"),
		invalid("splits mixed imports", "import { keep, run } from \"old/barrel\";", "import { keep } from \"old/barrel\";\nimport { run } from \"new/barrel\";"),
		invalid("preserves aliases and local uses", "import { keep as alias, run as execute } from \"old/barrel\";\nexecute(alias);", "import { keep as alias } from \"old/barrel\";\nimport { run as execute } from \"new/barrel\";\nexecute(alias);"),
		invalid("preserves multiple exceptions", "import { keep, run, Domain } from \"old/barrel\";", "import { keep, Domain } from \"old/barrel\";\nimport { run } from \"new/barrel\";"),
		invalid("preserves type-only declarations", "import type { Domain, Entity } from \"old/barrel\";", "import type { Domain } from \"old/barrel\";\nimport type { Entity } from \"new/barrel\";"),
		invalid("preserves inline type specifiers", "import { type Domain, type Entity, run } from \"old/barrel\";", "import { type Domain } from \"old/barrel\";\nimport { type Entity, run } from \"new/barrel\";"),
		invalid("moves the default import with named imports", "import root, { keep, run } from \"old/barrel\";", "import { keep } from \"old/barrel\";\nimport root, { run } from \"new/barrel\";"),
		invalid("moves the default import on its own", "import root, { keep } from \"old/barrel\";", "import { keep } from \"old/barrel\";\nimport root from \"new/barrel\";"),
		invalid("preserves an exempt default import", "import root, { run } from \"old/default\";", "import root from \"old/default\";\nimport { run } from \"new/default\";"),
		invalid("preserves a named default exception", "import { default as root, run } from \"old/default\";", "import { default as root } from \"old/default\";\nimport { run } from \"new/default\";"),
		invalid("preserves string-literal exceptions", "import { \"foo-bar\" as alias, run } from \"old/barrel\";", "import { \"foo-bar\" as alias } from \"old/barrel\";\nimport { run } from \"new/barrel\";"),
		invalid("moves namespace imports without exceptions", "import * as Root from \"old/all\";", "import * as Root from \"new/all\";"),
		invalid("moves default imports without exceptions", "import root from \"old/all\";", "import root from \"new/all\";"),
		invalid("moves side-effect imports", "import \"old/all\";", "import \"new/all\";"),
		invalid("moves non-exempt defaults alongside an exempt namespace", "import root, * as Root from \"old/barrel\";", null),
		invalid("preserves comments when changing the entire path", "import { /* keep comment */ run } from \"old/barrel\";", "import { /* keep comment */ run } from \"new/barrel\";"),
		invalid("does not discard comments when splitting", "import { /* keep comment */ keep, run } from \"old/barrel\";", null),
		invalid("preserves attributes when changing the entire path", "import { run } from \"old/barrel\" with { type: \"json\" };", "import { run } from \"new/barrel\" with { type: \"json\" };"),
		invalid("does not duplicate attributes when splitting", "import { keep, run } from \"old/barrel\" with { type: \"json\" };", null),
		invalid("preserves indentation and missing semicolons", "\timport { keep, run } from \"old/barrel\"\nrun(keep)", "\timport { keep } from \"old/barrel\"\n\timport { run } from \"new/barrel\"\nrun(keep)"),
		invalid("does not copy preceding statements into the indentation", "const value = 1; import { keep, run } from \"old/barrel\";", "const value = 1; import { keep } from \"old/barrel\";\nimport { run } from \"new/barrel\";"),
		invalid("preserves single quotes", "import { keep, run } from 'old/barrel';", "import { keep } from 'old/barrel';\nimport { run } from 'new/barrel';"),
	],
});

describe("preferred import paths in the base preset", () => {
	it("converges with both namespace rules on mixed barrel imports", () => {
		const linter = new Linter();
		const config = {
			plugins: { duplojs: DOxlint.plugin },
			rules: {
				"duplojs/prefer-import-path": ["error", { paths: DOxlint.defaultPreferImportPaths }],
				"duplojs/prefer-namespace-from-barrel": [
					"error",
					{
						sources: ["@duplojs/lang"],
						namespaces: { DEither: "@duplojs/lang/either" },
					},
				],
				"duplojs/prefer-namespace-import": ["error", { paths: DOxlint.defaultPreferNamespaceImportPaths }],
			},
		} satisfies Linter.Config;
		const result = linter.verifyAndFix(
			"import { pipe, DEither } from \"@duplojs/lang\";\nconst result = pipe(DEither.left(\"value\"));",
			config,
		);
		const repeated = linter.verifyAndFix(result.output, config);

		expect(result.messages).toEqual([]);
		expect(result.output).toContain("import * as DEither from \"@duplojs/lang/either\";");
		expect(result.output).toContain("import * as DCommon from \"@duplojs/lang/common\";");
		expect(result.output).toContain("const result = DCommon.pipe(DEither.left(\"value\"));");
		expect(repeated.fixed).toBe(false);
		expect(repeated.messages).toEqual([]);
	});
	const tester = new RuleTester({ languageOptions: { parserOptions: { lang: "ts" } } });
	tester.run("prefer-import-path with defaults", DOxlint.preferImportPath as never, {
		valid: [
			{
				code: "import { setEnvironment, TESTImplementation, DSFile } from \"@duplojs/server\";",
				options: [{ paths: DOxlint.defaultPreferImportPaths }],
			},
		],
		invalid: [
			{
				code: "import { setEnvironment, TESTImplementation, DSFile, getProcessArguments } from \"@duplojs/server\";",
				output: "import { setEnvironment, TESTImplementation, DSFile } from \"@duplojs/server\";\nimport { getProcessArguments } from \"@duplojs/server/common\";",
				options: [{ paths: DOxlint.defaultPreferImportPaths }],
				errors: [{ messageId: "preferImportPath" }],
			},
			{
				code: "import { DArray, A, pipe, type ExpectType } from \"@duplojs/lang\";",
				output: "import { DArray, A } from \"@duplojs/lang\";\nimport { pipe, type ExpectType } from \"@duplojs/lang/common\";",
				options: [{ paths: DOxlint.defaultPreferImportPaths }],
				errors: [{ messageId: "preferImportPath" }],
			},
		],
	});
});
