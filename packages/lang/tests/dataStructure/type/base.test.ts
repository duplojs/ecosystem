import { DDataStructure, type DCommon, type DKind, type ExpectType } from "@scripts";

describe("createType", () => {
	it("checks the fundamental type before delegating to the type implementation", () => {
		const testFundamentalTypeKind = DDataStructure.createKind("test-string-fundamental-type");
		const testTypeKind = DDataStructure.createKind("test-type");

		interface TestFundamentalType extends DCommon.Forward<
			& DDataStructure.FundamentalType<string>
			& DKind.Kind<typeof testFundamentalTypeKind>
		> {}

		const fundamentalTypeExecuteCheck = vi.fn(
			(
				self: TestFundamentalType,
				data: unknown,
			) => typeof data === "string"
				? DDataStructure.SuccessSymbol
				: DDataStructure.ErrorSymbol,
		);
		const fundamentalType = DDataStructure.createFundamentalType<TestFundamentalType>(
			testFundamentalTypeKind,
			fundamentalTypeExecuteCheck,
		);

		interface TestTypeDefinition extends DDataStructure.TypeDefinition {
			readonly literal: "valid";
		}

		interface TestType extends DCommon.Forward<
			& DDataStructure.Type<
				typeof fundamentalType,
				"valid",
				TestTypeDefinition
			>
			& DKind.Kind<typeof testTypeKind>
		> {}

		const executeCheck = vi.fn(
			(
				self: TestType,
				data: string,
			) => data === self.definition.literal
				? DDataStructure.SuccessSymbol
				: DDataStructure.ErrorSymbol,
		);
		const isAsynchronous = vi.fn(() => false);

		const TestType = DDataStructure.createType(
			fundamentalType,
			testTypeKind,
			({ init }) => () => init<TestType>(
				{ literal: "valid" },
				{
					executeCheck,
					isAsynchronous,
				},
			),
		);

		const type = TestType();

		type _CheckType = ExpectType<
			typeof type,
			TestType,
			"strict"
		>;
		type _CheckTypeValue = ExpectType<
			DDataStructure.TypeValue<typeof type>,
			"valid",
			"strict"
		>;

		expect(type.fundamentalType).toBe(fundamentalType);
		expect(type.definition).toEqual({ literal: "valid" });
		expect(type.executeCheck("valid")).toBe(DDataStructure.SuccessSymbol);
		expect(type.executeCheck("invalid")).toBe(DDataStructure.ErrorSymbol);
		expect(type.executeCheck(123 as never)).toBe(DDataStructure.ErrorSymbol);
		expect(type.isAsynchronous()).toBe(false);
		expect(fundamentalTypeExecuteCheck).toHaveBeenNthCalledWith(
			1,
			fundamentalType,
			"valid",
		);
		expect(executeCheck).toHaveBeenNthCalledWith(
			1,
			type,
			"valid",
		);
		expect(executeCheck).toHaveBeenNthCalledWith(
			2,
			type,
			"invalid",
		);
		expect(executeCheck).not.toHaveBeenCalledWith(
			type,
			123,
		);
		expect(isAsynchronous).toHaveBeenCalledWith(type);
	});

	it("delegates to the fundamental type and the type implementation without collecting issues", () => {
		const testFundamentalTypeKind = DDataStructure.createKind("test-string-error-handler-fundamental-type");
		const testTypeKind = DDataStructure.createKind("test-type-error-handler");

		interface TestFundamentalType extends DCommon.Forward<
			& DDataStructure.FundamentalType<string>
			& DKind.Kind<typeof testFundamentalTypeKind>
		> {}

		const fundamentalTypeExecuteCheck = vi.fn(
			(): DDataStructure.SuccessSymbol => DDataStructure.SuccessSymbol,
		);
		const fundamentalType = DDataStructure.createFundamentalType<TestFundamentalType>(
			testFundamentalTypeKind,
			fundamentalTypeExecuteCheck,
		);

		interface TestType extends DCommon.Forward<
			& DDataStructure.Type<typeof fundamentalType>
			& DKind.Kind<typeof testTypeKind>
		> {}

		const executeCheck = vi.fn(
			(): DDataStructure.SuccessSymbol => DDataStructure.SuccessSymbol,
		);
		const TestType = DDataStructure.createType(
			fundamentalType,
			testTypeKind,
			({ init }) => () => init<TestType>(
				{},
				{
					executeCheck,
					isAsynchronous: () => false,
				},
			),
		);

		const type = TestType();

		expect(type.executeCheck("valid")).toBe(DDataStructure.SuccessSymbol);
		expect(fundamentalTypeExecuteCheck).toHaveBeenCalledWith(
			fundamentalType,
			"valid",
		);
		expect(executeCheck).toHaveBeenCalledWith(
			type,
			"valid",
		);
	});

	it("clones a type with the same behavior", () => {
		const testTypeKind = DDataStructure.createKind("test-clone-type");

		interface TestTypeDefinition extends DDataStructure.TypeDefinition {
			readonly literal: "valid";
		}

		interface TestType extends DCommon.Forward<
			& DDataStructure.Type<
				typeof DDataStructure.TheString,
				"valid",
				TestTypeDefinition
			>
			& DKind.Kind<typeof testTypeKind>
		> {}

		const executeCheck = vi.fn(
			(
				self: TestType,
				data: string,
			) => data === self.definition.literal
				? DDataStructure.SuccessSymbol
				: DDataStructure.ErrorSymbol,
		);
		const TestType = DDataStructure.createType(
			DDataStructure.TheString,
			testTypeKind,
			({ init }) => () => init<TestType>(
				{ literal: "valid" },
				{
					executeCheck,
					isAsynchronous: () => false,
				},
			),
		);

		const type = TestType();
		const clonedType = type.clone();

		type _CheckClonedType = ExpectType<
			typeof clonedType,
			TestType,
			"strict"
		>;

		expect(clonedType).not.toBe(type);
		expect(clonedType.definition).toStrictEqual(type.definition);
		expect(clonedType.definition).not.toBe(type.definition);
		expect(DDataStructure.typeKind.has(clonedType)).toBe(true);
		expect(testTypeKind.has(clonedType)).toBe(true);
		expect(clonedType.executeCheck("valid")).toBe(DDataStructure.SuccessSymbol);
		expect(executeCheck).toHaveBeenCalledWith(
			clonedType,
			"valid",
		);
	});

	it("sets messages directly and on cloned types", () => {
		const testTypeKind = DDataStructure.createKind("test-message-type");

		interface TestType extends DCommon.Forward<
			& DDataStructure.Type<typeof DDataStructure.TheString>
			& DKind.Kind<typeof testTypeKind>
		> {}

		const TestType = DDataStructure.createType(
			DDataStructure.TheString,
			testTypeKind,
			({ init }) => () => init<TestType>(
				{},
				{
					executeCheck: () => DDataStructure.SuccessSymbol,
					isAsynchronous: () => false,
				},
			),
		);

		const type = TestType();
		const sameType = type.setMessage("Direct message");

		type _CheckSameType = ExpectType<
			typeof sameType,
			TestType,
			"strict"
		>;

		expect(sameType).toBe(type);
		expect(type.definition.message).toBe("Direct message");

		const clonedType = type.addMessage("Cloned message");

		type _CheckClonedType = ExpectType<
			typeof clonedType,
			TestType,
			"strict"
		>;

		expect(type.definition.message).toBe("Direct message");
		expect(clonedType).not.toBe(type);
		expect(clonedType.definition).not.toBe(type.definition);
		expect(clonedType.definition.message).toBe("Cloned message");
		expect(clonedType.executeCheck("value")).toBe(DDataStructure.SuccessSymbol);
	});

	it("preserves asynchronous checks through the fundamental type and implementation", async() => {
		const testFundamentalTypeKind = DDataStructure.createKind("test-async-string-fundamental-type");
		const testTypeKind = DDataStructure.createKind("test-async-type");

		interface TestFundamentalType extends DCommon.Forward<
			& DDataStructure.FundamentalType<string>
			& DKind.Kind<typeof testFundamentalTypeKind>
		> {}

		const fundamentalTypeExecuteCheck = vi.fn(
			(
				self: TestFundamentalType,
				data: unknown,
			) => Promise.resolve(typeof data === "string"
				? DDataStructure.SuccessSymbol
				: DDataStructure.ErrorSymbol),
		);
		const fundamentalType = DDataStructure.createFundamentalType<TestFundamentalType>(
			testFundamentalTypeKind,
			fundamentalTypeExecuteCheck,
		);

		interface TestType extends DCommon.Forward<
			& DDataStructure.Type<typeof fundamentalType>
			& DKind.Kind<typeof testTypeKind>
		> {}

		const executeCheck = vi.fn(
			(
				self: TestType,
				data: string,
			) => Promise.resolve(data === "valid"
				? DDataStructure.SuccessSymbol
				: DDataStructure.ErrorSymbol),
		);
		const TestType = DDataStructure.createType(
			fundamentalType,
			testTypeKind,
			({ init }) => () => init<TestType>(
				{},
				{
					executeCheck,
					isAsynchronous: () => true,
				},
			),
		);

		const type = TestType();

		await expect(type.executeCheck("valid")).resolves.toBe(
			DDataStructure.SuccessSymbol,
		);
		await expect(type.executeCheck("invalid")).resolves.toBe(
			DDataStructure.ErrorSymbol,
		);
		await expect(type.executeCheck(123)).resolves.toBe(
			DDataStructure.ErrorSymbol,
		);
		expect(fundamentalTypeExecuteCheck).toHaveBeenNthCalledWith(
			1,
			fundamentalType,
			"valid",
		);
		expect(executeCheck).toHaveBeenNthCalledWith(
			1,
			type,
			"valid",
		);
		expect(executeCheck).toHaveBeenNthCalledWith(
			2,
			type,
			"invalid",
		);
		expect(executeCheck).not.toHaveBeenCalledWith(
			type,
			123,
		);
	});
});
