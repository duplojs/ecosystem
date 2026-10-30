import type * as DCommon from "@scripts/common";
import * as DEither from "@scripts/either";

describe("RequireInformationCombination", () => {
	it("requires one finite tuple while allowing unions of elements", () => {
		const input = [DEither.success(42)] as const;
		const validated: DEither.RequireInformationCombination<typeof input> = input;

		type _CheckReadonly = DCommon.ExpectType<
			DEither.RequireInformationCombination<typeof input>,
			unknown,
			"strict"
		>;
		type _CheckMutable = DCommon.ExpectType<
			DEither.RequireInformationCombination<[DEither.Success<42>]>,
			unknown,
			"strict"
		>;
		type _CheckUnionElements = DCommon.ExpectType<
			DEither.RequireInformationCombination<readonly [DEither.Success<42> | DEither.Error<"message">]>,
			unknown,
			"strict"
		>;
		type _CheckSpread = DCommon.ExpectType<
			DEither.RequireInformationCombination<readonly [DEither.Success<42>, ...DEither.Error<"message">[]]>,
			DCommon.ComputedTypeError<"Information combinations must be finite tuples.">,
			"strict"
		>;
		type _CheckUnion = DCommon.ExpectType<
			DEither.RequireInformationCombination<readonly [DEither.Success<42>] | readonly [DEither.Error<"message">]>,
			DCommon.ComputedTypeError<"Union value is forbidden.">,
			"strict"
		>;
		type _CheckUnionLengths = DCommon.ExpectType<
			DEither.RequireInformationCombination<
				| readonly [DEither.Success<42>]
				| readonly [DEither.Success<42>, DEither.Error<"message">]
			>,
			DCommon.ComputedTypeError<"Union value is forbidden.">,
			"strict"
		>;

		expect(validated).toBe(input);
	});
});
