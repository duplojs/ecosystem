import { DDataStructure, DEither, type DCommon, type DKind, type ExpectType } from "@scripts";

describe("UnionStructure", () => {
	it("checks values against the first matching structure and narrows with is", async() => {
		const structure = DDataStructure.UnionStructure([
			DDataStructure.TypeStructure(DDataStructure.StringType(), []),
			DDataStructure.TypeStructure(DDataStructure.NumberType(), []),
		], []);
		const input: unknown = "value";
		const success = structure.check(input);
		const numberSuccess = await structure.asyncCheck(42);
		const failure = structure.check(true);

		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			string | number,
			"strict"
		>;
		type _CheckSuccess = ExpectType<
			typeof success,
			| DEither.Right<"check-success", string | number>
			| DEither.Left<"async-error", undefined>
			| DEither.Left<"check-error", DDataStructure.Error>,
			"strict"
		>;
		type _CheckNumberSuccess = ExpectType<
			typeof numberSuccess,
			| DEither.Right<"check-success", string | number>
			| DEither.Left<"check-error", DDataStructure.Error>,
			"strict"
		>;

		expect(success).toStrictEqual(DEither.right("check-success", input));
		expect(numberSuccess).toStrictEqual(DEither.right("check-success", 42));
		expect(structure.is(input)).toBe(true);
		if (structure.is(input)) {
			type _CheckNarrowedInput = ExpectType<
				typeof input,
				string | number,
				"strict"
			>;
		}
		expect(structure.is(true)).toBe(false);
		expect(
			DEither.unwrapByInformationOrThrow(failure, "check-error").issues,
		).toMatchObject([
			{
				data: true,
				path: "(union: 0)",
			},
			{
				data: true,
				path: "(union: 1)",
			},
			{
				data: true,
				path: "",
			},
		]);
	});

	it("flattens nested union structures", () => {
		const stringStructure = DDataStructure.TypeStructure(DDataStructure.StringType(), []);
		const numberStructure = DDataStructure.TypeStructure(DDataStructure.NumberType(), []);
		const bigintStructure = DDataStructure.TypeStructure(DDataStructure.BigintType(), []);
		const nestedUnion = DDataStructure.UnionStructure([
			numberStructure,
			bigintStructure,
		], []);
		const structure = DDataStructure.UnionStructure([
			stringStructure,
			nestedUnion,
		], []);

		const flattenedValues = structure.definition.values.value;

		expect(flattenedValues).toStrictEqual([
			stringStructure,
			numberStructure,
			bigintStructure,
		]);
		expect(structure.definition.values.value).toBe(flattenedValues);
		expect(structure.check(1n)).toStrictEqual(
			DEither.right("check-success", 1n),
		);
	});

	it("flattens lazy structures and nested unions to terminal branches", () => {
		const stringStructure = DDataStructure.TypeStructure(DDataStructure.StringType(), []);
		const numberStructure = DDataStructure.TypeStructure(DDataStructure.NumberType(), []);
		const booleanStructure = DDataStructure.TypeStructure(DDataStructure.BooleanType(), []);
		const bigintStructure = DDataStructure.TypeStructure(DDataStructure.BigintType(), []);
		const getNumberStructure = vi.fn(
			() => numberStructure,
		);
		const getNestedUnion = vi.fn(
			() => DDataStructure.UnionStructure([
				DDataStructure.LazyStructure(getNumberStructure, []),
				DDataStructure.UnionStructure([
					booleanStructure,
					bigintStructure,
				], []),
			], []),
		);
		const structure = DDataStructure.UnionStructure([
			stringStructure,
			DDataStructure.LazyStructure(getNestedUnion, []),
		], []);

		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			string | number | boolean | bigint,
			"strict"
		>;

		expect(getNestedUnion).not.toHaveBeenCalled();
		expect(getNumberStructure).not.toHaveBeenCalled();
		expect(structure.definition.values.value).toStrictEqual([
			stringStructure,
			numberStructure,
			booleanStructure,
			bigintStructure,
		]);
		expect(getNestedUnion).toHaveBeenCalledTimes(1);
		expect(getNumberStructure).toHaveBeenCalledTimes(1);
		expect(structure.check(true)).toStrictEqual(
			DEither.right("check-success", true),
		);
		expect(
			DEither.unwrapByInformationOrThrow(
				structure.check(null),
				"check-error",
			).issues,
		).toMatchObject([
			{
				data: null,
				path: "(union: 0)",
			},
			{
				data: null,
				path: "(union: 1)",
			},
			{
				data: null,
				path: "(union: 2)",
			},
			{
				data: null,
				path: "(union: 3)",
			},
			{
				data: null,
				path: "",
			},
		]);
	});

	it("encodes and decodes values with the first matching branch", async() => {
		const structure = DDataStructure.UnionStructure([
			DDataStructure.TypeStructure(DDataStructure.StringType(), []),
			DDataStructure.TypeStructure(DDataStructure.NumberType(), []),
		], []);
		const stringCodec = DDataStructure.createCodec(
			DDataStructure.TheString,
			DDataStructure.TypeStructure(DDataStructure.NumberType(), []).is,
			(data) => data.length,
			(data) => `value-${data}`,
		);
		const numberCodec = DDataStructure.createCodec(
			DDataStructure.TheNumber,
			DDataStructure.TypeStructure(DDataStructure.StringType(), []).is,
			(data) => `number-${data}`,
			(data) => Number(data.slice(7)),
		);
		const codecs = DDataStructure.createCodecs({
			stringCodec,
			numberCodec,
		});
		const encodedString = structure.encode(codecs, "Jane");
		const encodedNumber = await structure.asyncEncode(codecs, 42);
		const decodedString = structure.decode(codecs, 4);
		const decodedNumber = await structure.asyncDecode(codecs, "number-42");

		type _CheckEncodedString = ExpectType<
			typeof encodedString,
			| DEither.Right<"encode-success", string | number>
			| DEither.Left<"async-error", undefined>
			| DEither.Left<"encode-error", DDataStructure.Error>,
			"strict"
		>;
		type _CheckEncodedNumber = ExpectType<
			typeof encodedNumber,
			| DEither.Right<"encode-success", string | number>
			| DEither.Left<"encode-error", DDataStructure.Error>,
			"strict"
		>;
		type _CheckDecodedString = ExpectType<
			typeof decodedString,
			| DEither.Right<"decode-success", string | number>
			| DEither.Left<"async-error", undefined>
			| DEither.Left<"decode-error", DDataStructure.Error>,
			"strict"
		>;
		type _CheckDecodedNumber = ExpectType<
			typeof decodedNumber,
			| DEither.Right<"decode-success", string | number>
			| DEither.Left<"decode-error", DDataStructure.Error>,
			"strict"
		>;

		expect(encodedString).toStrictEqual(DEither.right("encode-success", 4));
		expect(encodedNumber).toStrictEqual(
			DEither.right("encode-success", "number-42"),
		);
		expect(decodedString).toStrictEqual(
			DEither.right("decode-success", "value-4"),
		);
		expect(decodedNumber).toStrictEqual(
			DEither.right("decode-success", 42),
		);
	});

	it("imports branch errors when no structure matches during encode or decode", () => {
		const structure = DDataStructure.UnionStructure([
			DDataStructure.TypeStructure(DDataStructure.StringType(), []),
			DDataStructure.ArrayStructure(DDataStructure.TypeStructure(DDataStructure.NumberType(), []), []),
		], []);
		const encodeFailure = structure.encode(DDataStructure.createCodecs({}), true as never);
		const decodeFailure = structure.decode(DDataStructure.createCodecs({}), ["value"] as never);

		expect(
			DEither.unwrapByInformationOrThrow(
				encodeFailure,
				"encode-error",
			).issues,
		).toMatchObject([
			{
				data: true,
				path: "(union: 0)",
			},
			{
				data: true,
				path: "(union: 1)",
			},
			{
				data: true,
				path: "",
			},
		]);
		expect(
			DEither.unwrapByInformationOrThrow(
				decodeFailure,
				"decode-error",
			).issues,
		).toMatchObject([
			{
				data: ["value"],
				path: "(union: 0)",
			},
			{
				data: "value",
				path: "(union: 1).[array: 0]",
			},
			{
				data: ["value"],
				path: "",
			},
		]);
	});

	it("keeps union branch paths isolated inside parent structure paths", () => {
		const structure = DDataStructure.ObjectStructure({
			value: DDataStructure.UnionStructure([
				DDataStructure.TypeStructure(DDataStructure.StringType(), []),
				DDataStructure.ArrayStructure(DDataStructure.TypeStructure(DDataStructure.NumberType(), []), []),
			], []),
		}, []);
		const failure = structure.check({ value: ["invalid"] });

		expect(
			DEither.unwrapByInformationOrThrow(failure, "check-error").issues,
		).toMatchObject([
			{
				data: ["invalid"],
				path: "value.(union: 0)",
			},
			{
				data: "invalid",
				path: "value.(union: 1).[array: 0]",
			},
			{
				data: ["invalid"],
				path: "value",
			},
		]);
	});

	it("does not leak a successful union branch path to sibling properties", () => {
		const structure = DDataStructure.ObjectStructure({
			first: DDataStructure.UnionStructure([
				DDataStructure.TypeStructure(DDataStructure.StringType(), []),
				DDataStructure.TypeStructure(DDataStructure.NumberType(), []),
			], []),
			second: DDataStructure.TypeStructure(DDataStructure.StringType(), []),
		}, []);
		const failure = structure.check({
			first: "value",
			second: 123,
		});

		expect(
			DEither.unwrapByInformationOrThrow(failure, "check-error").issues,
		).toMatchObject([
			{
				data: 123,
				path: "second",
			},
		]);
	});

	it("checks constraints against source data after encoding and decoded data after decoding", async() => {
		const constraintKind = DDataStructure.createKind("test-public-union-constraint");
		const executeCheck = vi.fn(
			(
				self: UnionConstraint,
				data: any,
			) => typeof data === "string" && data.length === 0
				? DDataStructure.ErrorSymbol
				: DDataStructure.SuccessSymbol,
		);

		interface UnionConstraint extends DCommon.Forward<
			& DDataStructure.Constraint<number | string>
			& DKind.Kind<typeof constraintKind>
		> {}

		const UnionConstraint = DDataStructure.createConstraint(
			constraintKind,
			({ init }) => () => init<UnionConstraint>(
				{},
				{
					executeCheck,
					isAsynchronous: () => false,
				},
			),
		);
		const unionConstraint = UnionConstraint();
		const stringStructure = DDataStructure.TypeStructure(DDataStructure.StringType(), []);
		const numberStructure = DDataStructure.TypeStructure(DDataStructure.NumberType(), []);
		const structure = DDataStructure.UnionStructure([
			stringStructure,
			numberStructure,
		], [unionConstraint]);
		const codec = DDataStructure.createCodec(
			DDataStructure.TheString,
			DDataStructure.TypeStructure(DDataStructure.NumberType(), []).is,
			(data) => data.length,
			(data) => String(data),
		);
		const encoded = structure.encode(DDataStructure.createCodecs({ codec }), "Jane");
		const decoded = await structure.asyncDecode(DDataStructure.createCodecs({ codec }), 4 as never);
		const encodeFailure = structure.encode(DDataStructure.createCodecs({ codec }), "");
		const emptyStringCodec = DDataStructure.createCodec(
			DDataStructure.TheString,
			DDataStructure.TypeStructure(DDataStructure.NumberType(), []).is,
			(data) => data.length,
			() => "",
		);
		const decodeFailure = await structure.asyncDecode(
			DDataStructure.createCodecs({ emptyStringCodec }),
			0 as never,
		);

		expect(encoded).toStrictEqual(DEither.right("encode-success", 4));
		expect(decoded).toStrictEqual(DEither.right("decode-success", "4"));
		expect(
			DEither.unwrapByInformationOrThrow(
				encodeFailure,
				"encode-error",
			).issues[0]?.getSource(),
		).toBe(structure);
		expect(
			(DEither.unwrapByInformationOrThrow(
				encodeFailure,
				"encode-error",
			).issues[0] as DDataStructure.Issue | undefined)?.getSubSource?.(),
		).toBe(unionConstraint);
		expect(
			DEither.unwrapByInformationOrThrow(
				decodeFailure,
				"decode-error",
			).issues[0]?.getSource(),
		).toBe(structure);
		expect(
			(DEither.unwrapByInformationOrThrow(
				decodeFailure,
				"decode-error",
			).issues[0] as DDataStructure.Issue | undefined)?.getSubSource?.(),
		).toBe(unionConstraint);
		expect(executeCheck).toHaveBeenCalledWith(
			unionConstraint,
			"Jane",
		);
		expect(executeCheck).toHaveBeenCalledWith(
			unionConstraint,
			"4",
		);
		expect(executeCheck).toHaveBeenCalledWith(
			unionConstraint,
			"",
		);
		expect(executeCheck).toHaveBeenCalledWith(
			unionConstraint,
			"",
		);
	});

	it("returns execution symbols without collecting issues when no error handler is provided", () => {
		const structure = DDataStructure.UnionStructure([
			DDataStructure.TypeStructure(DDataStructure.StringType(), []),
			DDataStructure.ArrayStructure(DDataStructure.TypeStructure(DDataStructure.NumberType(), []), []),
		], []);

		expect(structure.executeCheck(true)).toBe(DDataStructure.ErrorSymbol);
		expect(structure.executeEncode(new Map(), true)).toBe(DDataStructure.ErrorSymbol);
		expect(structure.executeDecode(new Map(), ["value"])).toBe(DDataStructure.ErrorSymbol);
	});

	it("returns async errors for asynchronous branches in synchronous APIs", async() => {
		const asyncStructureKind = DDataStructure.createKind("test-public-union-async-structure");

		interface AsyncStructure extends DCommon.Forward<
			& DDataStructure.Structure<string>
			& DKind.Kind<typeof asyncStructureKind>
		> {}

		const AsyncStructure = DDataStructure.createStructure(
			asyncStructureKind,
			({ init }) => () => init<AsyncStructure>(
				{
					constraints: [],
				},
				{
					executeCheck: () => Promise.resolve(DDataStructure.SuccessSymbol),
					executeEncode: (_self, _codec, data) => Promise.resolve(data),
					executeDecode: (_self, _codec, data) => Promise.resolve(data),
					isAsynchronous: () => true,
				},
			),
		);
		const structure = DDataStructure.UnionStructure([
			AsyncStructure(),
			DDataStructure.TypeStructure(DDataStructure.NumberType(), []),
		], []);

		expect(structure.check("value")).toStrictEqual(
			DEither.left("async-error", undefined),
		);
		expect(await structure.asyncCheck("value")).toStrictEqual(
			DEither.right("check-success", "value"),
		);
		expect(structure.encode(DDataStructure.createCodecs({}), "value")).toStrictEqual(
			DEither.left("async-error", undefined),
		);
		expect(await structure.asyncEncode(DDataStructure.createCodecs({}), "value")).toStrictEqual(
			DEither.right("encode-success", "value"),
		);
		expect(structure.decode(DDataStructure.createCodecs({}), "value")).toStrictEqual(
			DEither.left("async-error", undefined),
		);
		expect(await structure.asyncDecode(DDataStructure.createCodecs({}), "value")).toStrictEqual(
			DEither.right("decode-success", "value"),
		);
		expect(structure.is("value")).toBe(false);
		expect(structure.isAsynchronous()).toBe(true);
	});

	it("infers union constraint inputs and rejects narrower constraints", () => {
		const structure = DDataStructure.UnionStructure(
			[
				DDataStructure.TypeStructure(DDataStructure.StringType(), []),
				DDataStructure.TypeStructure(DDataStructure.NumberType(), []),
			],
			[
				DDataStructure.refine(
					(data): data is string => {
						type check = ExpectType<
							typeof data,
							string | number,
							"strict"
						>;

						return typeof data === "string";
					},
				),
			],
		);

		const struct = structure.addConstraint(
			DDataStructure.RefineConstraint(
				(value) => {
					type check = ExpectType<
						typeof value,
						string | number,
						"strict"
					>;
					return true;
				},
			),
		);

		type _CheckStructValue = ExpectType<
			DDataStructure.StructureValue<typeof struct>,
			string,
			"strict"
		>;

		structure.addConstraint(
			// @ts-expect-error wrong refine type
			DDataStructure.RefineConstraint(
				(value: number) => true,
			),
		);

		structure.addConstraint(
			// @ts-expect-error wrong refine type
			DDataStructure.RefineConstraint(
				(value: string) => true,
			),
		);

		const dataStructureContract: DDataStructure.Structure<string | number> =
			DDataStructure
				.TypeStructure(DDataStructure.StringType(), [])
				.addConstraint(
					DDataStructure.RefineConstraint(
						(value) => true,
					),
				);

		type _CheckDataStructureContractValue = ExpectType<
			DDataStructure.StructureValue<typeof dataStructureContract>,
			string | number,
			"strict"
		>;

		dataStructureContract.addConstraint(
			DDataStructure.RefineConstraint(
				(value) => {
					type _CheckValue = ExpectType<
						typeof value,
						string | number,
						"strict"
					>;
					return true;
				},
			),
		);

		dataStructureContract.addConstraint(
			// @ts-expect-error a string-only constraint cannot handle the full contract
			DDataStructure.RefineConstraint(
				(value: string) => true,
			),
		);

		expect(struct.is("value")).toBe(true);
		expect(dataStructureContract.is("value")).toBe(true);
	});
});
