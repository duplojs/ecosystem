import { type FundamentalType } from "../base";
import type {
	TheBigint,
	TheBoolean,
	TheDate,
	TheNull,
	TheNumber,
	TheString,
	TheTime,
	TheUndefined,
} from "../defaults";

export interface FundamentalTypesStore {
	bigint: TheBigint;
	boolean: TheBoolean;
	date: TheDate;
	null: TheNull;
	number: TheNumber;
	string: TheString;
	time: TheTime;
	undefined: TheUndefined;
}

export type FundamentalTypes = Extract<
	FundamentalTypesStore[keyof FundamentalTypesStore],
	FundamentalType
>;
