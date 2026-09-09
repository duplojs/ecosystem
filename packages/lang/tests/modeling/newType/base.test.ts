import { DDataStructure, type DCommon, DEither, type DKind, DModeling, type DString, pipe, type ExpectType } from "@scripts";

describe("NewTypeStructure", () => {
	it("creates a named structure that preserves its inner structure and new type constraints", () => {
		const stringMinConstraint = DDataStructure.minCharacters(3);
		const inner = DDataStructure.string();
		const structure = DModeling.NewTypeStructure(
			"user-name",
			inner,
			[stringMinConstraint],
		);

		type _CheckStructure = ExpectType<
			typeof structure,
			DModeling.NewTypeStructure<
				"user-name",
				string,
				readonly [DDataStructure.MinCharactersConstraint<3>]
			>,
			"strict"
		>;
		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			string & DModeling.NewType<"user-name", DString.MinCharacters<3>>,
			"strict"
		>;

		expect(DModeling.newTypeStructureKind.has(structure)).toBe(true);
		expect(structure.name).toBe("user-name");
		expect(structure.definition.inner).toBe(inner);
		expect(structure.definition.newTypeConstraints).toEqual([stringMinConstraint]);
	});

	it("checks the inner structure before applying new type constraints", () => {
		const constraintExecuteCheck = vi.fn(
			(data: string) => (
				data.length >= 3
					? DDataStructure.SuccessSymbol
					: DDataStructure.ErrorSymbol
			),
		);
		const constraint = {
			...DDataStructure.minCharacters(3),
			executeCheck: constraintExecuteCheck,
		};
		const structure = DModeling.NewTypeStructure(
			"user-name",
			DDataStructure.string(),
			[constraint],
		);

		expect(structure.executeCheck("Jane")).toBe(DDataStructure.SuccessSymbol);
		expect(constraintExecuteCheck).toHaveBeenCalledWith("Jane");

		constraintExecuteCheck.mockClear();
		expect(structure.executeCheck(123)).toBe(DDataStructure.ErrorSymbol);
		expect(constraintExecuteCheck).not.toHaveBeenCalled();

		constraintExecuteCheck.mockClear();
		expect(structure.executeCheck("Jo")).toBe(DDataStructure.ErrorSymbol);
		expect(constraintExecuteCheck).toHaveBeenCalledOnce();
	});

	it("returns check errors from the new type constraint", () => {
		const constraint = DDataStructure.minCharacters(3);
		const structure = DModeling.NewTypeStructure(
			"user-name",
			DDataStructure.string(),
			[constraint],
		);
		const failure = DEither.unwrapByInformationOrThrow(
			structure.check("Jo"),
			"check-error",
		);

		expect(structure.check("Jane")).toStrictEqual(
			DEither.right("check-success", "Jane"),
		);
		expect(failure.issues[0]).toMatchObject({
			data: "Jo",
		});
		expect(failure.issues[0]?.getSource()).toBe(structure);
		expect(
			(failure.issues[0] as DDataStructure.Issue | undefined)
				?.getSubSource?.(),
		).toBe(constraint);
	});

	it("stops checking when a previous new type constraint fails", () => {
		const nextConstraintExecuteCheck = vi.fn(
			(): DDataStructure.SuccessSymbol => DDataStructure.SuccessSymbol,
		);
		const nextConstraint = {
			...DDataStructure.minCharacters(2),
			executeCheck: nextConstraintExecuteCheck,
		} as DDataStructure.MinCharactersConstraint<2>;
		const structure = DModeling.NewTypeStructure(
			"user-name",
			DDataStructure.string(),
			[
				DDataStructure.minCharacters(3),
				nextConstraint,
			],
		);

		expect(structure.executeCheck("Jo")).toBe(DDataStructure.ErrorSymbol);
		expect(nextConstraintExecuteCheck).not.toHaveBeenCalled();
	});

	it("narrows checked values to the unique new type", () => {
		const structure = DModeling.NewTypeStructure(
			"user-name",
			DDataStructure.string(),
			[DDataStructure.minCharacters(3)],
		);
		const input: unknown = "Jane";

		if (structure.is(input)) {
			type _CheckNarrowedInput = ExpectType<
				typeof input,
				string & DModeling.NewType<"user-name", DString.MinCharacters<3>>,
				"strict"
			>;
		}
	});

	it("encodes the inner structure before checking new type and structure constraints", () => {
		type UserName = string & DModeling.NewType<"user-name", DString.MinCharacters<3>>;
		const newTypeConstraintExecuteCheck = vi.fn(
			(): DDataStructure.SuccessSymbol => DDataStructure.SuccessSymbol,
		);
		const structureConstraintExecuteCheck = vi.fn(
			(): DDataStructure.SuccessSymbol => DDataStructure.SuccessSymbol,
		);
		const newTypeConstraint = {
			...DDataStructure.minCharacters(3),
			executeCheck: newTypeConstraintExecuteCheck,
		};
		const structureConstraint = {
			...DDataStructure.minCharacters(2),
			executeCheck: structureConstraintExecuteCheck,
		};
		const structure = DModeling.NewTypeStructure(
			"user-name",
			DDataStructure.string(),
			[newTypeConstraint],
		).addConstraint(structureConstraint);
		const codec = DDataStructure.createCodec(
			DDataStructure.TheString,
			DDataStructure.number().is,
			(data) => data.length,
			(data) => `decoded-${data}`,
		);
		const codecs = DDataStructure.createCodecs({ string: codec });
		const data = "Jane" as DDataStructure.StructureValue<typeof structure>;

		expect(structure.encode(codecs, data)).toStrictEqual(
			DEither.right("encode-success", 4),
		);
		expect(newTypeConstraintExecuteCheck).toHaveBeenCalledWith("Jane");
		expect(structureConstraintExecuteCheck).toHaveBeenCalledWith("Jane");
		expect(newTypeConstraintExecuteCheck.mock.invocationCallOrder[0]).toBeLessThan(
			structureConstraintExecuteCheck.mock.invocationCallOrder[0]!,
		);
	});

	it("stops encoding when a new type constraint fails", () => {
		type UserName = string & DModeling.NewType<"user-name", DString.MinCharacters<3>>;
		const newTypeConstraint = DDataStructure.minCharacters(3);
		const structureConstraintExecuteCheck = vi.fn(
			(): DDataStructure.SuccessSymbol => DDataStructure.SuccessSymbol,
		);
		const structureConstraint = {
			...DDataStructure.minCharacters(2),
			executeCheck: structureConstraintExecuteCheck,
		} as unknown as DDataStructure.Constraint<UserName>;
		const structure = DModeling.NewTypeStructure(
			"user-name",
			DDataStructure.string(),
			[newTypeConstraint],
		).addConstraint(structureConstraint);
		const codec = DDataStructure.createCodec(
			DDataStructure.TheString,
			DDataStructure.number().is,
			(data) => data.length,
			(data) => `decoded-${data}`,
		);
		const codecs = DDataStructure.createCodecs({ string: codec });

		const failure = DEither.unwrapByInformationOrThrow(
			structure.unsafeEncode(codecs, "Jo"),
			"encode-error",
		);

		expect(failure.issues[0]).toMatchObject({
			data: "Jo",
		});
		expect(failure.issues[0]?.getSource()).toBe(structure);
		expect(
			(failure.issues[0] as DDataStructure.Issue | undefined)
				?.getSubSource?.(),
		).toBe(newTypeConstraint);
		expect(structureConstraintExecuteCheck).not.toHaveBeenCalled();
	});

	it("encodes a typed new type value in a promise without exposing encoding errors", async() => {
		const structure = DModeling.NewTypeStructure(
			"user-name",
			DDataStructure.string(),
			[DDataStructure.minCharacters(3)],
		);
		const codec = DDataStructure.createCodec(
			DDataStructure.TheString,
			DDataStructure.number().is,
			(data) => data.length,
			(data) => `decoded-${data}`,
		);
		const codecs = DDataStructure.createCodecs({ codec });
		const data = DEither.unwrapByInformationOrThrow(
			structure.map("Jane"),
			"map-success",
		);
		const result = structure.encodeNewType(codecs, data);

		type _CheckResult = ExpectType<
			typeof result,
			Promise<number>,
			"strict"
		>;

		expect(result).toBeInstanceOf(Promise);
		await expect(result).resolves.toBe(4);
	});

	it("asynchronously encodes a typed new type value when the codec is asynchronous", async() => {
		const structure = DModeling.NewTypeStructure(
			"user-name",
			DDataStructure.string(),
			[DDataStructure.minCharacters(3)],
		);
		const codec = DDataStructure.createCodec(
			DDataStructure.TheString,
			DDataStructure.number().is,
			(data) => Promise.resolve(data.length),
			(data) => `decoded-${data}`,
		);
		const codecs = DDataStructure.createCodecs({ codec });
		const data = DEither.unwrapByInformationOrThrow(
			structure.map("Jane"),
			"map-success",
		);
		const result = structure.encodeNewType(codecs, data);

		expect(result).toBeInstanceOf(Promise);
		await expect(result).resolves.toBe(4);
	});

	it("rejects with an EncodeNewTypeError when a typed new type value is bypassed", async() => {
		const structure = DModeling.NewTypeStructure(
			"user-name",
			DDataStructure.string(),
			[DDataStructure.minCharacters(3)],
		);
		const codecs = DDataStructure.createCodecs({});
		await expect(
			structure.encodeNewType(codecs, "Jo" as never),
		).rejects.toMatchObject({
			message: "An error occurred while encoding a NewType. This can only happen if you are bypassing the type system.",
			error: {
				issues: [expect.objectContaining({ data: "Jo" })],
			},
		});
		await expect(
			structure.encodeNewType(codecs, "Jo" as never),
		).rejects.toBeInstanceOf(DModeling.EncodeNewTypeError);
	});

	it("stops encoding when the inner structure rejects the value", () => {
		const structure = DModeling.NewTypeStructure(
			"user-name",
			DDataStructure.string(),
			[DDataStructure.minCharacters(3)],
		);
		const codec = DDataStructure.createCodec(
			DDataStructure.TheString,
			DDataStructure.number().is,
			(data) => data.length,
			(data) => `decoded-${data}`,
		);
		const codecs = DDataStructure.createCodecs({ string: codec });

		expect(
			DEither.unwrapByInformationOrThrow(
				structure.unsafeEncode(codecs, 123 as never),
				"encode-error",
			).issues[0],
		).toMatchObject({
			data: 123,
		});
	});

	it("stops encoding when a previous new type constraint fails", () => {
		const nextConstraintExecuteCheck = vi.fn(
			(): DDataStructure.SuccessSymbol => DDataStructure.SuccessSymbol,
		);
		const nextConstraint = {
			...DDataStructure.minCharacters(2),
			executeCheck: nextConstraintExecuteCheck,
		} as DDataStructure.MinCharactersConstraint<2>;
		const structure = DModeling.NewTypeStructure(
			"user-name",
			DDataStructure.string(),
			[
				DDataStructure.minCharacters(3),
				nextConstraint,
			],
		);
		const codec = DDataStructure.createCodec(
			DDataStructure.TheString,
			DDataStructure.number().is,
			(data) => data.length,
			(data) => `decoded-${data}`,
		);
		const codecs = DDataStructure.createCodecs({ string: codec });

		expect(
			DEither.unwrapByInformationOrThrow(
				structure.unsafeEncode(codecs, "Jo"),
				"encode-error",
			).issues[0],
		).toMatchObject({
			data: "Jo",
		});
		expect(nextConstraintExecuteCheck).not.toHaveBeenCalled();
	});

	it("stops encoding when a structure constraint fails", () => {
		type UserName = string & DModeling.NewType<"user-name", DString.MinCharacters<3>>;
		const structureConstraint = DDataStructure.minCharacters(5) as unknown as DDataStructure.Constraint<UserName>;
		const structure = DModeling.NewTypeStructure(
			"user-name",
			DDataStructure.string(),
			[DDataStructure.minCharacters(3)],
		).addConstraint(structureConstraint);
		const codec = DDataStructure.createCodec(
			DDataStructure.TheString,
			DDataStructure.number().is,
			(data) => data.length,
			(data) => `decoded-${data}`,
		);
		const codecs = DDataStructure.createCodecs({ string: codec });

		expect(
			DEither.unwrapByInformationOrThrow(
				structure.unsafeEncode(codecs, "Jane"),
				"encode-error",
			).issues[0],
		).toMatchObject({
			data: "Jane",
		});
	});

	it("decodes the inner structure before checking new type and structure constraints", () => {
		type UserName = string & DModeling.NewType<"user-name", DString.MinCharacters<3>>;
		const newTypeConstraintExecuteCheck = vi.fn(
			(): DDataStructure.SuccessSymbol => DDataStructure.SuccessSymbol,
		);
		const structureConstraintExecuteCheck = vi.fn(
			(): DDataStructure.SuccessSymbol => DDataStructure.SuccessSymbol,
		);
		const newTypeConstraint = {
			...DDataStructure.minCharacters(3),
			executeCheck: newTypeConstraintExecuteCheck,
		} as DDataStructure.MinCharactersConstraint<3>;
		const structureConstraint = {
			...DDataStructure.minCharacters(2),
			executeCheck: structureConstraintExecuteCheck,
		} as unknown as DDataStructure.Constraint<UserName>;
		const structure = DModeling.NewTypeStructure(
			"user-name",
			DDataStructure.string(),
			[newTypeConstraint],
		).addConstraint(structureConstraint);
		const codec = DDataStructure.createCodec(
			DDataStructure.TheString,
			DDataStructure.number().is,
			(data) => data.length,
			(data) => `decoded-${data}`,
		);
		const codecs = DDataStructure.createCodecs({ string: codec });

		expect(structure.decode(codecs, 4)).toStrictEqual(
			DEither.right("decode-success", "decoded-4"),
		);
		expect(newTypeConstraintExecuteCheck).toHaveBeenCalledWith("decoded-4");
		expect(structureConstraintExecuteCheck).toHaveBeenCalledWith("decoded-4");
		expect(newTypeConstraintExecuteCheck.mock.invocationCallOrder[0]).toBeLessThan(
			structureConstraintExecuteCheck.mock.invocationCallOrder[0]!,
		);
	});

	it("stops decoding when a new type constraint fails", () => {
		type UserName = string & DModeling.NewType<"user-name", DString.MinCharacters<3>>;
		const newTypeConstraint = DDataStructure.minCharacters(3);
		const structureConstraintExecuteCheck = vi.fn(
			(): DDataStructure.SuccessSymbol => DDataStructure.SuccessSymbol,
		);
		const structureConstraint = {
			...DDataStructure.minCharacters(2),
			executeCheck: structureConstraintExecuteCheck,
		} as unknown as DDataStructure.Constraint<UserName>;
		const structure = DModeling.NewTypeStructure(
			"user-name",
			DDataStructure.string(),
			[newTypeConstraint],
		).addConstraint(structureConstraint);
		const codec = DDataStructure.createCodec(
			DDataStructure.TheString,
			DDataStructure.number().is,
			(data) => data.length,
			() => "Jo",
		);
		const codecs = DDataStructure.createCodecs({ string: codec });

		const failure = DEither.unwrapByInformationOrThrow(
			structure.unsafeDecode(codecs, 2),
			"decode-error",
		);

		expect(failure.issues[0]).toMatchObject({
			data: "Jo",
		});
		expect(failure.issues[0]?.getSource()).toBe(structure);
		expect(
			(failure.issues[0] as DDataStructure.Issue | undefined)
				?.getSubSource?.(),
		).toBe(newTypeConstraint);
		expect(structureConstraintExecuteCheck).not.toHaveBeenCalled();
	});

	it("stops decoding when a previous new type constraint fails", () => {
		const nextConstraintExecuteCheck = vi.fn(
			(): DDataStructure.SuccessSymbol => DDataStructure.SuccessSymbol,
		);
		const nextConstraint = {
			...DDataStructure.minCharacters(2),
			executeCheck: nextConstraintExecuteCheck,
		} as DDataStructure.MinCharactersConstraint<2>;
		const structure = DModeling.NewTypeStructure(
			"user-name",
			DDataStructure.string(),
			[
				DDataStructure.minCharacters(3),
				nextConstraint,
			],
		);
		const codec = DDataStructure.createCodec(
			DDataStructure.TheString,
			DDataStructure.number().is,
			(data) => data.length,
			() => "Jo",
		);
		const codecs = DDataStructure.createCodecs({ string: codec });

		expect(
			DEither.unwrapByInformationOrThrow(
				structure.unsafeDecode(codecs, 2),
				"decode-error",
			).issues[0],
		).toMatchObject({
			data: "Jo",
		});
		expect(nextConstraintExecuteCheck).not.toHaveBeenCalled();
	});

	it("stops decoding when a structure constraint fails", () => {
		type UserName = string & DModeling.NewType<"user-name", DString.MinCharacters<3>>;
		const structureConstraint = DDataStructure.minCharacters(5) as unknown as DDataStructure.Constraint<UserName>;
		const structure = DModeling.NewTypeStructure(
			"user-name",
			DDataStructure.string(),
			[DDataStructure.minCharacters(3)],
		).addConstraint(structureConstraint);
		const codec = DDataStructure.createCodec(
			DDataStructure.TheString,
			DDataStructure.number().is,
			(data) => data.length,
			() => "Jane",
		);
		const codecs = DDataStructure.createCodecs({ string: codec });

		expect(
			DEither.unwrapByInformationOrThrow(
				structure.unsafeDecode(codecs, 4),
				"decode-error",
			).issues[0],
		).toMatchObject({
			data: "Jane",
		});
	});

	it("maps a raw value to the new type after checking it", () => {
		const structure = DModeling.NewTypeStructure(
			"user-name",
			DDataStructure.string(),
			[DDataStructure.minCharacters(3)],
		);
		const result = structure.map("Jane");

		type _CheckInput = ExpectType<
			Parameters<typeof structure.map>[0],
			string,
			"strict"
		>;
		type _CheckResult = ExpectType<
			typeof result,
			| DEither.Right<
				"map-success",
				string & DModeling.NewType<"user-name", DString.MinCharacters<3>>
			>
			| DEither.Left<"async-error", undefined>
			| DEither.Left<"map-error", DDataStructure.Error>,
			"strict"
		>;

		const invalidInput = "Jo";

		expect(result).toStrictEqual(
			DEither.right("map-success", "Jane"),
		);
		expect(DEither.isLeft(structure.map(invalidInput))).toBe(true);
	});

	it("maps a raw value to the new type in pipe", () => {
		const structure = DModeling.NewTypeStructure(
			"user-name",
			DDataStructure.string(),
			[DDataStructure.minCharacters(3)],
		);
		const result = pipe(
			"Jane",
			structure.map,
		);

		type _CheckResult = ExpectType<
			typeof result,
			| DEither.Right<
				"map-success",
				string & DModeling.NewType<"user-name", DString.MinCharacters<3>>
			>
			| DEither.Left<"async-error", undefined>
			| DEither.Left<"map-error", DDataStructure.Error>,
			"strict"
		>;

		expect(result).toStrictEqual(
			DEither.right("map-success", "Jane"),
		);
	});

	it("maps an encoded value to the new type with codecs", () => {
		const structure = DModeling.NewTypeStructure(
			"user-name",
			DDataStructure.string(),
			[DDataStructure.minCharacters(3)],
		);
		const codec = DDataStructure.createCodec(
			DDataStructure.TheString,
			DDataStructure.number().is,
			(data) => data.length,
			(data) => `Jane-${data}`,
		);
		const codecs = DDataStructure.createCodecs({ string: codec });
		const result = structure.decodeMap(codecs, 4);

		type _CheckInput = ExpectType<
			Parameters<typeof structure.decodeMap<typeof codecs>>[1],
			number,
			"strict"
		>;
		type _CheckResult = ExpectType<
			typeof result,
			| DEither.Right<
				"map-success",
				string & DModeling.NewType<"user-name", DString.MinCharacters<3>>
			>
			| DEither.Left<"async-error", undefined>
			| DEither.Left<"map-error", DDataStructure.Error>,
			"strict"
		>;

		// @ts-expect-error codec mapping expects the encoded number input, not the raw string input.
		structure.decodeMap(codecs, "Jane");
		// @ts-expect-error map is only for raw values; codec mapping uses decodeMap.
		structure.map(codecs, 4);
		expect(result).toStrictEqual(
			DEither.right("map-success", "Jane-4"),
		);
	});

	it("maps an encoded value to the new type with codecs in pipe", () => {
		const structure = DModeling.NewTypeStructure(
			"user-name",
			DDataStructure.string(),
			[DDataStructure.minCharacters(3)],
		);
		const codec = DDataStructure.createCodec(
			DDataStructure.TheString,
			DDataStructure.number().is,
			(data) => data.length,
			(data) => `Jane-${data}`,
		);
		const codecs = DDataStructure.createCodecs({ string: codec });
		const result = pipe(
			4,
			structure.decodeMap(codecs),
		);

		type _CheckResult = ExpectType<
			typeof result,
			| DEither.Right<
				"map-success",
				string & DModeling.NewType<"user-name", DString.MinCharacters<3>>
			>
			| DEither.Left<"async-error", undefined>
			| DEither.Left<"map-error", DDataStructure.Error>,
			"strict"
		>;

		expect(result).toStrictEqual(
			DEither.right("map-success", "Jane-4"),
		);
	});

	it("returns an async error when synchronously mapping an asynchronous new type", () => {
		const asyncConstraintKind = DDataStructure.createKind("sync-new-type-map-async-constraint");
		interface AsyncConstraint extends DCommon.Forward<
			& DDataStructure.Constraint<string>
			& DKind.Kind<typeof asyncConstraintKind>
		> {}
		const AsyncConstraint = DDataStructure.createConstraint(
			asyncConstraintKind,
			({ init }) => () => init<AsyncConstraint>(
				{},
				{
					executeCheck: () => Promise.resolve(DDataStructure.SuccessSymbol),
					isAsynchronous: () => true,
				},
			),
		);
		const structure = DModeling.NewTypeStructure(
			"user-name",
			DDataStructure.string([AsyncConstraint()]),
			[],
		);

		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			string & DModeling.NewType<"user-name", never>,
			"strict"
		>;

		expect(structure.map("Jane")).toStrictEqual(
			DEither.left("async-error", undefined),
		);
	});

	it("returns an async error when synchronously decoding with an asynchronous codec", () => {
		const structure = DModeling.NewTypeStructure(
			"user-name",
			DDataStructure.string(),
			[DDataStructure.minCharacters(3)],
		);
		const codec = DDataStructure.createCodec(
			DDataStructure.TheString,
			DDataStructure.number().is,
			(data) => data.length,
			(data) => Promise.resolve(`Jane-${data}`),
		);
		const codecs = DDataStructure.createCodecs({ string: codec });

		expect(structure.decodeMap(codecs, 4)).toStrictEqual(
			DEither.left("async-error", undefined),
		);
	});

	it("asynchronously maps a raw value to the new type", async() => {
		const structure = DModeling.NewTypeStructure(
			"user-name",
			DDataStructure.string(),
			[DDataStructure.minCharacters(3)],
		);
		const result = structure.asyncMap("Jane");

		type _CheckInput = ExpectType<
			Parameters<typeof structure.asyncMap>[0],
			string,
			"strict"
		>;
		type _CheckResult = ExpectType<
			typeof result,
			Promise<
				| DEither.Right<
					"map-success",
					string & DModeling.NewType<"user-name", DString.MinCharacters<3>>
				>
				| DEither.Left<"map-error", DDataStructure.Error>
			>,
			"strict"
		>;

		const invalidInput = "Jo";
		const invalidResult = await structure.asyncMap(invalidInput);

		await expect(result).resolves.toStrictEqual(
			DEither.right("map-success", "Jane"),
		);
		expect(
			DEither.unwrapByInformationOrThrow(
				invalidResult,
				"map-error",
			).issues[0],
		).toMatchObject({
			data: "Jo",
		});
	});

	it("asynchronously maps an encoded value to the new type with codecs in pipe", async() => {
		const structure = DModeling.NewTypeStructure(
			"user-name",
			DDataStructure.string(),
			[DDataStructure.minCharacters(3)],
		);
		const codec = DDataStructure.createCodec(
			DDataStructure.TheString,
			DDataStructure.number().is,
			(data) => Promise.resolve(data.length),
			(data) => Promise.resolve(`Jane-${data}`),
		);
		const codecs = DDataStructure.createCodecs({ string: codec });
		const result = pipe(
			4,
			structure.asyncDecodeMap(codecs),
		);

		type _CheckResult = ExpectType<
			typeof result,
			Promise<
				| DEither.Right<
					"map-success",
					string & DModeling.NewType<"user-name", DString.MinCharacters<3>>
				>
				| DEither.Left<"map-error", DDataStructure.Error>
			>,
			"strict"
		>;

		await expect(result).resolves.toStrictEqual(
			DEither.right("map-success", "Jane-4"),
		);
		// @ts-expect-error asyncMap is only for raw values; codec mapping uses asyncDecodeMap.
		void structure.asyncMap(codecs, 4);
	});

	it("returns a map error when asynchronously decoding an invalid new type", async() => {
		const structure = DModeling.NewTypeStructure(
			"user-name",
			DDataStructure.string(),
			[DDataStructure.minCharacters(3)],
		);
		const codec = DDataStructure.createCodec(
			DDataStructure.TheString,
			DDataStructure.number().is,
			(data) => data.length,
			() => Promise.resolve("Jo"),
		);
		const codecs = DDataStructure.createCodecs({ string: codec });
		const result = await structure.asyncDecodeMap(codecs, 2);

		expect(
			DEither.unwrapByInformationOrThrow(
				result,
				"map-error",
			).issues[0],
		).toMatchObject({
			data: "Jo",
		});
	});

	it("is asynchronous when its inner structure or a new type constraint is asynchronous", () => {
		const asyncConstraintKind = DDataStructure.createKind("async-new-type-constraint");
		const innerAsyncConstraintKind = DDataStructure.createKind("async-inner-constraint");
		const asyncConstraintIsAsynchronous = vi.fn(() => true);
		interface InnerAsyncConstraint extends DCommon.Forward<
			& DDataStructure.Constraint<string>
			& DKind.Kind<typeof innerAsyncConstraintKind>
		> {}
		interface AsyncConstraint extends DCommon.Forward<
			& DDataStructure.Constraint<string>
			& DKind.Kind<typeof asyncConstraintKind>
		> {}
		const innerAsyncConstraint = DDataStructure.createConstraint(
			innerAsyncConstraintKind,
			({ init }) => () => init<InnerAsyncConstraint>(
				{},
				{
					executeCheck: () => Promise.resolve(DDataStructure.SuccessSymbol),
					isAsynchronous: () => true,
				},
			),
		)();
		const AsyncConstraint = DDataStructure.createConstraint(
			asyncConstraintKind,
			({ init }) => () => init<AsyncConstraint>(
				{},
				{
					executeCheck: () => Promise.resolve(DDataStructure.SuccessSymbol),
					isAsynchronous: asyncConstraintIsAsynchronous,
				},
			),
		);

		const innerAsyncStructure = DModeling.NewTypeStructure(
			"user-name",
			DDataStructure.string([innerAsyncConstraint]),
			[],
		);
		const newTypeAsyncStructure = DModeling.NewTypeStructure(
			"user-name",
			DDataStructure.string(),
			[AsyncConstraint()],
		);

		expect(innerAsyncStructure.isAsynchronous()).toBe(true);
		expect(newTypeAsyncStructure.isAsynchronous()).toBe(true);
		expect(asyncConstraintIsAsynchronous).toHaveBeenCalledOnce();
	});
});
