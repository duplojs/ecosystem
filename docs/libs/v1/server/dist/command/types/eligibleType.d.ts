import type * as DObject from "@duplojs-v1/lang/object";
import type * as DSDataStructure from '../../dataStructure';
import type * as DDataStructure from "@duplojs-v1/lang/dataStructure";
export type EligibleType = (string | DDataStructure.FundamentalTypeValue<DObject.Values<typeof DSDataStructure.codecsString.definition>["fundamentalType"]>);
