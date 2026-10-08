import * as DCommon from "@scripts/common";
import * as DChrono from "@scripts/chrono";
import * as DEither from "@scripts/either";
import { createCodec, createCodecs } from "../base";
import * as FundamentalType from "../../../fundamentalType";
import { ErrorSymbol } from "../../resultSymbol";

export const codecsNativeChrono = createCodecs({
	date: createCodec(
		FundamentalType.TheDate,
		(data) => data instanceof Date,
		(data) => data.toNative(),
		DCommon.innerPipe(
			(value) => DChrono.createDate(value),
			DEither.whenHasInformationOtherwise(
				"date-created",
				DCommon.forward,
				DCommon.justReturn(ErrorSymbol),
			),
		),
	),
	time: createCodec(
		FundamentalType.TheTime,
		(data) => typeof data === "number",
		(data) => data.toNative(),
		DCommon.innerPipe(
			(value) => DChrono.createTime(value),
			DEither.whenHasInformationOtherwise(
				"time-created",
				DCommon.forward,
				DCommon.justReturn(ErrorSymbol),
			),
		),
	),
});
