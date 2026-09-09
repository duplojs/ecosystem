import { DDataStructure, type DCommon, type DKind, type ExpectType } from "@scripts";

describe("createFundamentalType", () => {
	it("creates a discriminable fundamental type that delegates checks with itself", () => {
		const testFundamentalTypeKind = DDataStructure.createKind("test-fundamental-type");
		const executeCheck = vi.fn(
			(
				self: TestFundamentalType,
				data: unknown,
			) => data === "valid"
				? DDataStructure.SuccessSymbol
				: DDataStructure.ErrorSymbol,
		);

		interface TestFundamentalType extends DCommon.Forward<
			& DDataStructure.FundamentalType<string>
			& DKind.Kind<typeof testFundamentalTypeKind>
		> {}

		const fundamentalType = DDataStructure.createFundamentalType<TestFundamentalType>(
			testFundamentalTypeKind,
			executeCheck,
		);

		type _CheckFundamentalType = ExpectType<
			typeof fundamentalType,
			TestFundamentalType,
			"strict"
		>;
		type _CheckFundamentalValue = ExpectType<
			DDataStructure.FundamentalTypeValue<typeof fundamentalType>,
			string,
			"strict"
		>;

		expect(testFundamentalTypeKind.has(fundamentalType)).toBe(true);
		expect(fundamentalType.executeCheck("valid")).toBe(DDataStructure.SuccessSymbol);
		expect(fundamentalType.executeCheck("invalid")).toBe(DDataStructure.ErrorSymbol);
		expect(executeCheck).toHaveBeenNthCalledWith(
			1,
			fundamentalType,
			"valid",
		);
		expect(executeCheck).toHaveBeenNthCalledWith(
			2,
			fundamentalType,
			"invalid",
		);
	});

	it("preserves asynchronous checks", async() => {
		const testFundamentalTypeKind = DDataStructure.createKind("test-async-fundamental-type");
		const executeCheck = vi.fn(
			(
				self: TestFundamentalType,
				data: unknown,
			) => Promise.resolve(
				data === "valid"
					? DDataStructure.SuccessSymbol
					: DDataStructure.ErrorSymbol,
			),
		);

		interface TestFundamentalType extends DCommon.Forward<
			& DDataStructure.FundamentalType<string>
			& DKind.Kind<typeof testFundamentalTypeKind>
		> {}

		const fundamentalType = DDataStructure.createFundamentalType<TestFundamentalType>(
			testFundamentalTypeKind,
			executeCheck,
		);

		await expect(
			fundamentalType.executeCheck("invalid"),
		).resolves.toBe(DDataStructure.ErrorSymbol);
		expect(executeCheck).toHaveBeenCalledWith(
			fundamentalType,
			"invalid",
		);
	});
});
