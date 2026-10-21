import * as DArray from "@duplojs-v1/lang/array";
import * as DCommon from "@duplojs-v1/lang/common";
import * as DString from "@duplojs-v1/lang/string";

const fields = DString.split("red,green,blue", ",");
//    ^?



const firstTwoFields = DString.split("red,green,blue", ",", { limit: 2 });
//    ^?



const colors = DCommon.pipe(
	" red, green, blue ",
	DString.split(","),
	DArray.map(DString.trim),
);

const mixedSeparators = DString.split("red,green;blue", /[,;]/);
//    ^?
