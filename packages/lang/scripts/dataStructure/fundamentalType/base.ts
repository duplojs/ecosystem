import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import { createKind } from "../kind";
import { type SuccessSymbol, type ErrorSymbol } from "../common";

export const fundamentalTypeKind = createKind("fundamental-type");

export interface FundamentalType<
	IncludedType extends unknown = unknown,
> extends DKind.Kind<
	typeof fundamentalTypeKind,
	IncludedType
	> {
	executeCheck(
		data: unknown,
	): DCommon.MaybePromise<
		| SuccessSymbol
		| ErrorSymbol
	>;
}

export function createFundamentalType<
	GenericFundamentalType extends FundamentalType,
>(
	kindHandler: Exclude<
		DKind.GetHandler<GenericFundamentalType>,
		typeof fundamentalTypeKind
	>,
	executeCheck: (
		self: GenericFundamentalType,
		data: unknown,
	) => DCommon.MaybePromise<
		| SuccessSymbol
		| ErrorSymbol
	>,
): GenericFundamentalType {
	const self: DKind.Remove<FundamentalType> = {
		executeCheck: (data) => executeCheck(self as never, data),
		[kindHandler.runTimeKey]: null,
		[fundamentalTypeKind.runTimeKey]: null,
	};

	return self as never;
}
