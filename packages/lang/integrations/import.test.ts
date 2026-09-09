import * as DArray from "@duplojs/lang/array";
import * as DChrono from "@duplojs/lang/chrono";
import * as DCommon from "@duplojs/lang/common";
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

it("imports the package and each domain", async() => {
	const modules = [
		await import("@duplojs/lang"),
		DArray,
		DChrono,
		DCommon,
		DDataStructure,
		DEither,
		DGenerator,
		DInvocation,
		DKind,
		DModeling,
		DNumber,
		DObject,
		DPath,
		DPattern,
		DPrinter,
		DString,
		DTuple,
	];

	expect(modules.every(Boolean)).toBe(true);
});
