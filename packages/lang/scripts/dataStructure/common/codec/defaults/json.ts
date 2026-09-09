import * as DCommon from "@scripts/common";
import * as DString from "@scripts/string";
import * as DChrono from "@scripts/chrono";
import * as DEither from "@scripts/either";
import { createCodec, createCodecs } from "../base";
import * as FundamentalType from "../../../fundamentalType";
import { ErrorSymbol } from "../../resultSymbol";

export const codecsJson = createCodecs({
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
});
