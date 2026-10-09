import * as DArray from "@duplojs-v1/lang/array";
import * as DCommon from "@duplojs-v1/lang/common";
import * as DString from "@duplojs-v1/lang/string";

const labels = ["alpha", "beta"] as const;

const directResult = DArray.map(labels, (label, { index }) => `${index + 1}-${label}`);
//    ^?

const composedResult = DCommon.pipe(
	labels,
	DArray.map((label) => DString.toUpperCase(label)),
);

// @ts-expect-error map conserve le type des elements recus par la fonction.
DArray.map(labels, (label: number) => label + 1);
