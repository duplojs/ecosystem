import * as DCommon from "@duplojs/lang/common";
import * as DArray from "@duplojs/lang/array";
import * as DObject from "@duplojs/lang/object";
import * as DPattern from "@duplojs/lang/pattern";

export const omitFunctions: ((input: DCommon.AnyValue) => DCommon.AnyValue) = DCommon.innerPipe(
	DPattern.when(
		DCommon.isType("function"),
		DCommon.justReturn(undefined),
	),
	DPattern.when(
		DCommon.isType("array"),
		DCommon.innerPipe(
			DArray.map((value) => omitFunctions(value)),
			DArray.filter((value) => value !== undefined),
		),
	),
	DPattern.when(
		DCommon.isType("object"),
		DCommon.innerPipe(
			DObject.entries,
			DArray.map(
				([key, value]) => DObject.entry(
					key,
					omitFunctions(value),
				),
			),
			DArray.filter(([, value]) => value !== undefined),
			DObject.fromEntries,
		),
	),
	DPattern.otherwise(DCommon.forward),
);
