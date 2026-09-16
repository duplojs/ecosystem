import type * as DObject from "@duplojs/lang/object";
import type * as DSDataStructure from "@scripts/dataStructure";
import type * as DDataStructure from "@duplojs/lang/dataStructure";

export type EligibleType = (
	| string
	| DDataStructure.FundamentalTypeValue<
		DObject.Values<
		typeof DSDataStructure.codecsString.definition
		>["fundamentalType"]
	>
);
