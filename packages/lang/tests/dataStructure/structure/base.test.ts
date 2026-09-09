import { DDataStructure, type DCommon, type DKind, DEither, type ExpectType } from "@scripts";

declare module "@scripts/dataStructure" {
	interface Structure {
		getPrototypeOverrideLabel?(prefix: string): `${string}:${number}`;
		testedValue?: string;
	}
}

describe("createStructure", () => {
	it("creates a structure that checks its implementation before its constraints", () => {
		const testStructureKind = DDataStructure.createKind("test-structure");

		const testConstraintKind = DDataStructure.createKind("test-passing-constraint");
		const constraintExecuteCheck = vi.fn(
			(): DDataStructure.SuccessSymbol => DDataStructure.SuccessSymbol,
		);
		const structureExecuteCheck = vi.fn(
			(_self: TestStructure, data: unknown) => typeof data === "string"
				? DDataStructure.SuccessSymbol
				: DDataStructure.ErrorSymbol,
		);

		interface StringConstraint extends DCommon.Forward<
			& DDataStructure.Constraint<string>
			& DKind.Kind<typeof testConstraintKind>
		> {}

		const TestConstraint = DDataStructure.createConstraint(
			testConstraintKind,
			({ init }) => () => init<StringConstraint>(
				{},
				{
					executeCheck: constraintExecuteCheck,
					isAsynchronous: () => false,
				},
			),
		);

		const passingConstraint = TestConstraint();

		interface TestStructure extends DCommon.Forward<
			& DDataStructure.Structure<
				string,
				DDataStructure.StructureDefinition<readonly [StringConstraint]>
			>
			& DKind.Kind<typeof testStructureKind>
		> {}

		const TestStructure = DDataStructure.createStructure(
			testStructureKind,
			({ init }) => () => init<TestStructure>(
				{ constraints: [passingConstraint] },
				{
					executeCheck: structureExecuteCheck,
					executeEncode: (_self, _codecContext, data) => data,
					executeDecode: (_self, _codecContext, data) => data,
					isAsynchronous: () => false,
				},
			),
		);

		const structure = TestStructure();

		type _CheckStructure = ExpectType<
			typeof structure,
			TestStructure,
			"strict"
		>;
		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			string,
			"strict"
		>;

		expect(structure.executeCheck("value")).toBe(DDataStructure.SuccessSymbol);
		expect(structureExecuteCheck).toHaveBeenCalledWith(
			structure,
			"value",
			undefined,
		);
		expect(constraintExecuteCheck).toHaveBeenCalledWith(
			passingConstraint,
			"value",
		);
		expect(structureExecuteCheck.mock.invocationCallOrder[0]).toBeLessThan(
			constraintExecuteCheck.mock.invocationCallOrder[0]!,
		);

		structureExecuteCheck.mockClear();
		constraintExecuteCheck.mockClear();
		expect(structure.executeCheck(123)).toBe(DDataStructure.ErrorSymbol);
		expect(structureExecuteCheck).toHaveBeenCalledOnce();
		expect(constraintExecuteCheck).not.toHaveBeenCalled();
	});

	it("adds constraints immutably and stops after the first failing constraint", () => {
		const testStructureKind = DDataStructure.createKind("test-structure-add-constraint");

		const testConstraintKind = DDataStructure.createKind("test-named-constraint");
		const executeCheck = vi.fn((self: TestConstraint) => self.definition.result);

		interface TestConstraintDefinition extends DDataStructure.ConstraintDefinition {
			readonly name: string;
			readonly result: DDataStructure.SuccessSymbol | DDataStructure.ErrorSymbol;
		}

		interface TestConstraint extends DCommon.Forward<
			& DDataStructure.Constraint<
				string,
				string,
				TestConstraintDefinition
			>
			& DKind.Kind<typeof testConstraintKind>
		> {
			readonly name: string;
		}

		const TestConstraint = DDataStructure.createConstraint(
			testConstraintKind,
			({ init }) => (
				name: string,
				result: DDataStructure.SuccessSymbol | DDataStructure.ErrorSymbol,
			) => init<TestConstraint>(
				{
					name,
					result,
				},
				{
					executeCheck,
					isAsynchronous: () => false,
				},
			),
		);

		const passingConstraint = TestConstraint("passing", DDataStructure.SuccessSymbol);
		const failingConstraint = TestConstraint("failing", DDataStructure.ErrorSymbol);
		const skippedConstraint = TestConstraint("skipped", DDataStructure.SuccessSymbol);

		const TestStructure = DDataStructure.createStructure(
			testStructureKind,
			({ init }) => () => init(
				{ constraints: [passingConstraint] },
				{
					executeCheck: () => DDataStructure.SuccessSymbol,
					executeEncode: (_self, _codecContext, data) => data,
					executeDecode: (_self, _codecContext, data) => data,
					isAsynchronous: () => false,
				},
			),
		);

		const structure = TestStructure();
		const constrainedStructure = structure.addConstraint(
			failingConstraint,
			skippedConstraint,
		);

		expect(structure.definition.constraints).toEqual([passingConstraint]);
		expect(constrainedStructure.definition.constraints).toEqual([
			passingConstraint,
			failingConstraint,
			skippedConstraint,
		]);
		expect(constrainedStructure.executeConstraints("value")).toBe(DDataStructure.ErrorSymbol);
		expect(executeCheck).toHaveBeenNthCalledWith(
			1,
			passingConstraint,
			"value",
		);
		expect(executeCheck).toHaveBeenNthCalledWith(
			2,
			failingConstraint,
			"value",
		);
		expect(executeCheck).not.toHaveBeenCalledWith(
			skippedConstraint,
			"value",
		);
	});

	it("caches asynchronous detection after checking constraints and structure implementation", () => {
		const testStructureKind = DDataStructure.createKind("test-structure-async-cache");
		const constraintIsAsynchronous = vi.fn(() => false);
		const structureIsAsynchronous = vi.fn(() => true);

		const testConstraintKind = DDataStructure.createKind("test-sync-constraint");
		const SyncConstraint = DDataStructure.createConstraint(
			testConstraintKind,
			({ init }) => () => init<
				DCommon.UnionToIntersection<
					& DDataStructure.Constraint<string>
					& DKind.Kind<typeof testConstraintKind>
				>
			>(
				{},
				{
					executeCheck: () => DDataStructure.SuccessSymbol,
					isAsynchronous: constraintIsAsynchronous,
				},
			),
		);
		const syncConstraint = SyncConstraint();

		const TestStructure = DDataStructure.createStructure(
			testStructureKind,
			({ init }) => () => init(
				{ constraints: [syncConstraint] },
				{
					executeCheck: () => DDataStructure.SuccessSymbol,
					executeEncode: (_self, _codecContext, data) => data,
					executeDecode: (_self, _codecContext, data) => data,
					isAsynchronous: structureIsAsynchronous,
				},
			),
		);

		const structure = TestStructure();

		expect(structure.isAsynchronous()).toBe(true);
		expect(structure.isAsynchronous()).toBe(true);
		expect(constraintIsAsynchronous).toHaveBeenCalledOnce();
		expect(structureIsAsynchronous).toHaveBeenCalledOnce();
	});

	it("detects asynchronous structures from constraints before checking the implementation", () => {
		const testStructureKind = DDataStructure.createKind("test-constraint-async-structure");
		const testConstraintKind = DDataStructure.createKind("test-async-constraint");
		const structureIsAsynchronous = vi.fn(() => false);

		const AsyncConstraint = DDataStructure.createConstraint(
			testConstraintKind,
			({ init }) => () => init<
				& DDataStructure.Constraint<string>
				& DKind.Kind<typeof testConstraintKind>
			>(
				{},
				{
					executeCheck: () => DDataStructure.SuccessSymbol,
					isAsynchronous: () => true,
				},
			),
		);

		const TestStructure = DDataStructure.createStructure(
			testStructureKind,
			({ init }) => () => init(
				{ constraints: [AsyncConstraint()] },
				{
					executeCheck: () => DDataStructure.SuccessSymbol,
					executeEncode: (_self, _codecContext, data) => data,
					executeDecode: (_self, _codecContext, data) => data,
					isAsynchronous: structureIsAsynchronous,
				},
			),
		);

		expect(TestStructure().isAsynchronous()).toBe(true);
		expect(structureIsAsynchronous).not.toHaveBeenCalled();
	});

	it("preserves asynchronous constraint execution order", async() => {
		const testStructureKind = DDataStructure.createKind("test-async-constraint-chain");
		const testConstraintKind = DDataStructure.createKind("test-async-chain-constraint");
		const executeCheck = vi.fn(
			(self: TestConstraint) => Promise.resolve(self.definition.result),
		);

		interface TestConstraintDefinition extends DDataStructure.ConstraintDefinition {
			readonly result: DDataStructure.SuccessSymbol | DDataStructure.ErrorSymbol;
		}

		interface TestConstraint extends DCommon.Forward<
			& DDataStructure.Constraint<string, string, TestConstraintDefinition>
			& DKind.Kind<typeof testConstraintKind>
		> {}

		const TestConstraint = DDataStructure.createConstraint(
			testConstraintKind,
			({ init }) => (
				result: DDataStructure.SuccessSymbol | DDataStructure.ErrorSymbol,
			) => init<TestConstraint>(
				{ result },
				{
					executeCheck,
					isAsynchronous: () => true,
				},
			),
		);

		const passingConstraint = TestConstraint(DDataStructure.SuccessSymbol);
		const failingConstraint = TestConstraint(DDataStructure.ErrorSymbol);
		const skippedConstraint = TestConstraint(DDataStructure.SuccessSymbol);
		const TestStructure = DDataStructure.createStructure(
			testStructureKind,
			({ init }) => () => init(
				{
					constraints: [
						passingConstraint,
						failingConstraint,
						skippedConstraint,
					],
				},
				{
					executeCheck: () => DDataStructure.SuccessSymbol,
					executeEncode: (_self, _codecContext, data) => data,
					executeDecode: (_self, _codecContext, data) => data,
					isAsynchronous: () => true,
				},
			),
		);

		const structure = TestStructure();

		await expect(structure.executeConstraints("value")).resolves.toBe(
			DDataStructure.ErrorSymbol,
		);
		expect(executeCheck).toHaveBeenNthCalledWith(
			1,
			passingConstraint,
			"value",
		);
		expect(executeCheck).toHaveBeenNthCalledWith(
			2,
			failingConstraint,
			"value",
		);
		expect(executeCheck).not.toHaveBeenCalledWith(
			skippedConstraint,
			"value",
		);
	});

	it("adds methods to the structure prototype", () => {
		const prototype = DDataStructure.StructureClass.prototype as DDataStructure.Structure;

		try {
			DDataStructure.StructureClass.addToPrototype(
				"contract",
				(() => "prototype-contract") as never,
			);

			expect(prototype.contract()).toBe("prototype-contract");
		} finally {
			delete (prototype as Partial<DDataStructure.Structure>).contract;
		}
	});

	it("adds module-augmented methods to the structure prototype", () => {
		const prototype = DDataStructure.StructureClass.prototype as DDataStructure.Structure;

		try {
			DDataStructure.StructureClass.addToPrototype(
				"getPrototypeOverrideLabel",
				(self, prefix) => `${prefix}:${self.definition.constraints.length}`,
			);
			DDataStructure.StructureClass.addToPrototype(
				"testedValue",
				"test",
			);

			const structure = DDataStructure.string([DDataStructure.notEmpty()]);
			const getPrototypeOverrideLabel = structure.getPrototypeOverrideLabel!;
			const result = getPrototypeOverrideLabel("constraints");

			expect(result).toBe("constraints:1");
			expect(structure.testedValue).toBe("test");

			type _CheckResult = ExpectType<
				typeof result,
				`${string}:${number}`,
				"strict"
			>;
		} finally {
			delete (prototype as Partial<DDataStructure.Structure>).getPrototypeOverrideLabel;
		}
	});

	it("returns check results for synchronous, asynchronous and predicate usages", async() => {
		const syncStructureKind = DDataStructure.createKind("test-sync-check-structure");
		const asyncStructureKind = DDataStructure.createKind("test-async-check-structure");

		const SyncStructure = DDataStructure.createStructure(
			syncStructureKind,
			({ init }) => () => init(
				{ constraints: [] },
				{
					executeCheck: (_self, data, errorHandler) => typeof data === "string"
						? DDataStructure.SuccessSymbol
						: errorHandler?.().addIssue(_self, data) ?? DDataStructure.ErrorSymbol,
					executeEncode: (_self, _codecContext, data) => data,
					executeDecode: (_self, _codecContext, data) => data,
					isAsynchronous: () => false,
				},
			),
		);
		const AsyncStructure = DDataStructure.createStructure(
			asyncStructureKind,
			({ init }) => () => init(
				{ constraints: [] },
				{
					executeCheck: () => Promise.resolve(DDataStructure.SuccessSymbol),
					executeEncode: (_self, _codecContext, data) => data,
					executeDecode: (_self, _codecContext, data) => data,
					isAsynchronous: () => true,
				},
			),
		);
		const AsyncErrorStructure = DDataStructure.createStructure(
			DDataStructure.createKind("test-async-check-error-structure"),
			({ init }) => () => init(
				{ constraints: [] },
				{
					executeCheck: (self, data, errorHandler) => Promise.resolve(
						errorHandler?.().addIssue(self, data) ?? DDataStructure.ErrorSymbol,
					),
					executeEncode: (_self, _codecContext, data) => data,
					executeDecode: (_self, _codecContext, data) => data,
					isAsynchronous: () => true,
				},
			),
		);

		const syncStructure = SyncStructure();
		const asyncStructure = AsyncStructure();
		const asyncErrorStructure = AsyncErrorStructure();

		const success = syncStructure.check("value");
		const failure = syncStructure.check(123);
		const asyncFailure = asyncStructure.check("value");
		const asyncSuccess = await asyncStructure.asyncCheck("value");
		const asyncCheckFailure = await asyncErrorStructure.asyncCheck("value");

		expect(success).toStrictEqual(DEither.right("check-success", "value"));
		expect(
			DEither.unwrapByInformationOrThrow(failure, "check-error").issues,
		).toHaveLength(1);
		expect(asyncFailure).toStrictEqual(DEither.left("async-error", undefined));
		expect(asyncSuccess).toStrictEqual(DEither.right("check-success", "value"));
		expect(
			DEither.unwrapByInformationOrThrow(
				asyncCheckFailure,
				"check-error",
			).issues,
		).toHaveLength(1);
		expect(syncStructure.is("value")).toBe(true);
		expect(syncStructure.is(123)).toBe(false);
		expect(asyncStructure.is("value")).toBe(false);
	});

	it("clones a structure with the same behavior", () => {
		const testStructureKind = DDataStructure.createKind("test-clone-structure");
		const executeCheck = vi.fn(
			(): DDataStructure.SuccessSymbol => DDataStructure.SuccessSymbol,
		);

		const TestStructure = DDataStructure.createStructure(
			testStructureKind,
			({ init }) => () => init(
				{ constraints: [] },
				{
					executeCheck,
					executeEncode: (_self, _codecContext, data) => data,
					executeDecode: (_self, _codecContext, data) => data,
					isAsynchronous: () => false,
				},
			),
		);

		const structure = TestStructure();
		const clonedStructure = structure.clone();

		expect(clonedStructure).not.toBe(structure);
		expect(clonedStructure.definition).toStrictEqual(structure.definition);
		expect(clonedStructure.check("value")).toStrictEqual(
			DEither.right("check-success", "value"),
		);
		expect(executeCheck).toHaveBeenCalledWith(
			clonedStructure,
			"value",
			expect.any(Function),
		);
	});

	it("sets messages directly and on cloned structures", () => {
		const testStructureKind = DDataStructure.createKind("test-message-structure");

		const TestStructure = DDataStructure.createStructure(
			testStructureKind,
			({ init }) => () => init(
				{ constraints: [] },
				{
					executeCheck: () => DDataStructure.SuccessSymbol,
					executeEncode: (_self, _codecContext, data) => data,
					executeDecode: (_self, _codecContext, data) => data,
					isAsynchronous: () => false,
				},
			),
		);

		const structure = TestStructure();
		const sameStructure = structure.setMessage("Direct message");

		expect(sameStructure).toBe(structure);
		expect(structure.definition.message).toBe("Direct message");

		const clonedStructure = structure.addMessage("Cloned message");

		expect(structure.definition.message).toBe("Direct message");
		expect(clonedStructure).not.toBe(structure);
		expect(clonedStructure.definition.message).toBe("Cloned message");
		expect(clonedStructure.check("value")).toStrictEqual(
			DEither.right("check-success", "value"),
		);
	});

	it("wraps synchronous and asynchronous encode results", async() => {
		const testStructureKind = DDataStructure.createKind("test-encode-structure");
		const testFundamentalTypeKind = DDataStructure.createKind("test-encode-string-fundamental-type");

		interface TestFundamentalType extends DCommon.Forward<
			& DDataStructure.FundamentalType<string>
			& DKind.Kind<typeof testFundamentalTypeKind>
		> {}

		const fundamentalType = DDataStructure.createFundamentalType<
			TestFundamentalType
		>(
			testFundamentalTypeKind,
			() => DDataStructure.SuccessSymbol,
		);
		const encodedStructure = DDataStructure.TypeStructure(DDataStructure.StringType(), []);
		const codec = DDataStructure.createCodec(
			fundamentalType,
			encodedStructure.is,
			(data) => data.toUpperCase(),
			(data) => String(data),
		);

		const TestStructure = DDataStructure.createStructure(
			testStructureKind,
			({ init }) => () => init(
				{ constraints: [] },
				{
					executeCheck: () => DDataStructure.SuccessSymbol,
					executeEncode: (_self, codecContext, data) => {
						const selectedCodec = codecContext.get(fundamentalType);
						return selectedCodec?.encode(data as never) ?? data;
					},
					executeDecode: (_self, _codecContext, data) => data,
					isAsynchronous: () => false,
				},
			),
		);
		const AsyncEncodeStructure = DDataStructure.createStructure(
			DDataStructure.createKind("test-async-encode-structure"),
			({ init }) => () => init(
				{ constraints: [] },
				{
					executeCheck: () => DDataStructure.SuccessSymbol,
					executeEncode: () => Promise.resolve("encoded"),
					executeDecode: (_self, _codecContext, data) => data,
					isAsynchronous: () => true,
				},
			),
		);

		const structure = TestStructure();
		const asyncStructure = AsyncEncodeStructure();
		const success = structure.encode(DDataStructure.createCodecs({ codec }), "abcd");
		const fallbackSuccess = structure.unsafeEncode(DDataStructure.createCodecs({}), "value");
		const asyncFailure = asyncStructure.encode(DDataStructure.createCodecs({}), "value");
		const asyncSuccess = await asyncStructure.asyncEncode(DDataStructure.createCodecs({ codec }), "value");
		const asyncUnsafeSuccess = await asyncStructure.asyncUnsafeEncode(
			DDataStructure.createCodecs({ codec }),
			"value",
		);

		expect(success).toStrictEqual(DEither.right("encode-success", "ABCD"));
		expect(fallbackSuccess).toStrictEqual(DEither.right("encode-success", "value"));
		expect(asyncFailure).toStrictEqual(DEither.left("async-error", undefined));
		expect(asyncSuccess).toStrictEqual(DEither.right("encode-success", "encoded"));
		expect(asyncUnsafeSuccess).toStrictEqual(DEither.right("encode-success", "encoded"));
	});

	it("wraps encode errors with collected issues", async() => {
		const testStructureKind = DDataStructure.createKind("test-encode-error-structure");

		const TestStructure = DDataStructure.createStructure(
			testStructureKind,
			({ init }) => () => init(
				{ constraints: [] },
				{
					executeCheck: () => DDataStructure.SuccessSymbol,
					executeEncode: (self, _codecContext, data, errorHandler) => (
						errorHandler?.().addIssue(self, data) ?? DDataStructure.ErrorSymbol
					),
					executeDecode: (_self, _codecContext, data) => data,
					isAsynchronous: () => false,
				},
			),
		);

		const structure = TestStructure();
		const failure = structure.encode(DDataStructure.createCodecs({}), "value");
		const asyncFailure = await structure.asyncEncode(DDataStructure.createCodecs({}), "value");
		const unsafeAsyncFailure = await structure.asyncUnsafeEncode(DDataStructure.createCodecs({}), "value");

		expect(
			DEither.unwrapByInformationOrThrow(failure, "encode-error").issues,
		).toHaveLength(1);
		expect(
			DEither.unwrapByInformationOrThrow(
				asyncFailure,
				"encode-error",
			).issues,
		).toHaveLength(1);
		expect(
			DEither.unwrapByInformationOrThrow(
				unsafeAsyncFailure,
				"encode-error",
			).issues,
		).toHaveLength(1);
	});

	it("wraps synchronous and asynchronous decode results", async() => {
		const testStructureKind = DDataStructure.createKind("test-decode-structure");
		const testFundamentalTypeKind = DDataStructure.createKind("test-decode-string-fundamental-type");

		interface TestFundamentalType extends DCommon.Forward<
			& DDataStructure.FundamentalType<string>
			& DKind.Kind<typeof testFundamentalTypeKind>
		> {}

		const fundamentalType = DDataStructure.createFundamentalType<
			TestFundamentalType
		>(
			testFundamentalTypeKind,
			() => DDataStructure.SuccessSymbol,
		);
		const encodedStructure = DDataStructure.TypeStructure(DDataStructure.StringType(), []);
		const codec = DDataStructure.createCodec(
			fundamentalType,
			encodedStructure.is,
			(data) => data,
			(data) => data,
		);

		const TestStructure = DDataStructure.createStructure(
			testStructureKind,
			({ init }) => () => init(
				{ constraints: [] },
				{
					executeCheck: () => DDataStructure.SuccessSymbol,
					executeEncode: (_self, _codecContext, data) => data,
					executeDecode: (_self, _codecContext, data) => String(data),
					isAsynchronous: () => false,
				},
			),
		);
		const AsyncDecodeStructure = DDataStructure.createStructure(
			DDataStructure.createKind("test-async-decode-structure"),
			({ init }) => () => init(
				{ constraints: [] },
				{
					executeCheck: () => DDataStructure.SuccessSymbol,
					executeEncode: (_self, _codecContext, data) => data,
					executeDecode: () => Promise.resolve("decoded"),
					isAsynchronous: () => true,
				},
			),
		);

		const structure = TestStructure();
		const asyncStructure = AsyncDecodeStructure();
		const success = structure.decode(DDataStructure.createCodecs({ codec }), 123 as never);
		const asyncFailure = asyncStructure.decode(DDataStructure.createCodecs({ codec }), "value");
		const asyncSuccess = await asyncStructure.asyncDecode(DDataStructure.createCodecs({ codec }), "value");
		const asyncUnsafeSuccess = await asyncStructure.asyncUnsafeDecode(
			DDataStructure.createCodecs({ codec }),
			"value",
		);

		expect(success).toStrictEqual(DEither.right("decode-success", "123"));
		expect(asyncFailure).toStrictEqual(DEither.left("async-error", undefined));
		expect(asyncSuccess).toStrictEqual(DEither.right("decode-success", "decoded"));
		expect(asyncUnsafeSuccess).toStrictEqual(DEither.right("decode-success", "decoded"));
	});

	it("wraps decode errors with collected issues", async() => {
		const testStructureKind = DDataStructure.createKind("test-decode-error-structure");

		const TestStructure = DDataStructure.createStructure(
			testStructureKind,
			({ init }) => () => init(
				{ constraints: [] },
				{
					executeCheck: () => DDataStructure.SuccessSymbol,
					executeEncode: (_self, _codecContext, data) => data,
					executeDecode: (self, _codecContext, data, errorHandler) => (
						errorHandler?.().addIssue(self, data) ?? DDataStructure.ErrorSymbol
					),
					isAsynchronous: () => false,
				},
			),
		);

		const structure = TestStructure();
		const failure = structure.decode(DDataStructure.createCodecs({}), "value");
		const asyncFailure = await structure.asyncDecode(DDataStructure.createCodecs({}), "value");
		const unsafeAsyncFailure = await structure.asyncUnsafeDecode(DDataStructure.createCodecs({}), "value");

		expect(
			DEither.unwrapByInformationOrThrow(failure, "decode-error").issues,
		).toHaveLength(1);
		expect(
			DEither.unwrapByInformationOrThrow(
				asyncFailure,
				"decode-error",
			).issues,
		).toHaveLength(1);
		expect(
			DEither.unwrapByInformationOrThrow(
				unsafeAsyncFailure,
				"decode-error",
			).issues,
		).toHaveLength(1);
	});
});
