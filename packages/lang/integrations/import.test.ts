import { createRequire } from "node:module";
import * as DArray from "@duplojs/lang/array";
import * as DChrono from "@duplojs/lang/chrono";
import * as DCommon from "@duplojs/lang/common";
import * as DContainer from "@duplojs/lang/container";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import * as DGenerator from "@duplojs/lang/generator";
import * as DInvocation from "@duplojs/lang/invocation";
import * as DKind from "@duplojs/lang/kind";
import * as DModeling from "@duplojs/lang/modeling";
import * as DNumber from "@duplojs/lang/number";
import * as DObject from "@duplojs/lang/object";
import * as DPath from "@duplojs/lang/path";
import * as DPattern from "@duplojs/lang/pattern";
import * as DPrinter from "@duplojs/lang/printer";
import * as DString from "@duplojs/lang/string";
import * as DTuple from "@duplojs/lang/tuple";

describe("package imports", () => {
	const domains = [
		{
			path: "@duplojs/lang/array",
			namespace: "DArray",
			module: DArray,
		},
		{
			path: "@duplojs/lang/chrono",
			namespace: "DChrono",
			module: DChrono,
		},
		{
			path: "@duplojs/lang/common",
			namespace: "DCommon",
			module: DCommon,
		},
		{
			path: "@duplojs/lang/container",
			namespace: "DContainer",
			module: DContainer,
		},
		{
			path: "@duplojs/lang/dataStructure",
			namespace: "DDataStructure",
			module: DDataStructure,
		},
		{
			path: "@duplojs/lang/either",
			namespace: "DEither",
			module: DEither,
		},
		{
			path: "@duplojs/lang/generator",
			namespace: "DGenerator",
			module: DGenerator,
		},
		{
			path: "@duplojs/lang/invocation",
			namespace: "DInvocation",
			module: DInvocation,
		},
		{
			path: "@duplojs/lang/kind",
			namespace: "DKind",
			module: DKind,
		},
		{
			path: "@duplojs/lang/modeling",
			namespace: "DModeling",
			module: DModeling,
		},
		{
			path: "@duplojs/lang/number",
			namespace: "DNumber",
			module: DNumber,
		},
		{
			path: "@duplojs/lang/object",
			namespace: "DObject",
			module: DObject,
		},
		{
			path: "@duplojs/lang/path",
			namespace: "DPath",
			module: DPath,
		},
		{
			path: "@duplojs/lang/pattern",
			namespace: "DPattern",
			module: DPattern,
		},
		{
			path: "@duplojs/lang/printer",
			namespace: "DPrinter",
			module: DPrinter,
		},
		{
			path: "@duplojs/lang/string",
			namespace: "DString",
			module: DString,
		},
		{
			path: "@duplojs/lang/tuple",
			namespace: "DTuple",
			module: DTuple,
		},
	];

	it.each(domains)("imports $path and exposes $namespace at the root", async({ module, namespace }) => {
		const root = await import("@duplojs/lang");

		expect(module).toBeDefined();
		expect(root).toHaveProperty(namespace, expect.anything());
	});

	it.each(domains)("requires $path and exposes $namespace at the root", ({ path, namespace }) => {
		const require = createRequire(import.meta.url);

		expect(require(path)).toBeDefined();
		expect(require("@duplojs/lang")).toHaveProperty(namespace, expect.anything());
	});
});
