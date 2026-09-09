import * as DCommon from "@scripts/common";
import * as DString from "@scripts/string";
import * as DChrono from "@scripts/chrono";
import * as DEither from "@scripts/either";
import { createCodec, createCodecs } from "../base";
import * as FundamentalType from "../../../fundamentalType";
import { ErrorSymbol } from "../../resultSymbol";

export const codecsString = createCodecs({
	bigint: createCodec(
		FundamentalType.TheBigint,
		(data) => typeof data === "string",
		DString.to,
		(data) => {
			try {
				return BigInt(data);
			} catch {
				return ErrorSymbol;
			}
		},
	),
	boolean: createCodec(
		FundamentalType.TheBoolean,
		(data) => (
			data === "true"
			|| data === "false"
		),
		DString.to,
		(data) => {
			if (data === "true") {
				return true;
			}

			return false;
		},
	),
	date: createCodec(
		FundamentalType.TheDate,
		(data) => typeof data === "string",
		DString.to,
		DCommon.innerPipe(
			(value) => DChrono.createDate({ value }),
			DEither.whenHasInformationOtherwise(
				"date-created",
				DCommon.forward,
				DCommon.justReturn(ErrorSymbol),
			),
		),
	),
	null: createCodec(
		FundamentalType.TheNull,
		(data) => data === "null",
		DString.to,
		DCommon.justReturn(null),
	),
	number: createCodec(
		FundamentalType.TheNumber,
		(data) => (
			typeof data === "string"
			&& DString.isNumber(data)
		),
		DString.to,
		(data) => {
			try {
				return Number(data);
			} catch {
				return ErrorSymbol;
			}
		},
	),
	time: createCodec(
		FundamentalType.TheTime,
		(data) => typeof data === "string",
		DString.to,
		DCommon.innerPipe(
			(value) => DChrono.createTime({ value }),
			DEither.whenHasInformationOtherwise(
				"time-created",
				DCommon.forward,
				DCommon.justReturn(ErrorSymbol),
			),
		),
	),
	undefined: createCodec(
		FundamentalType.TheUndefined,
		(data) => data === "undefined",
		DString.to,
		DCommon.justReturn(undefined),
	),
});
