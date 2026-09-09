import { DDataStructure, DEither, type DCommon, type DKind, type ExpectType } from "@scripts";

describe("RecordStructure", () => {
	it("checks string keyed records and narrows with is", async() => {
		const structure = DDataStructure.RecordStructure(
			DDataStructure.TypeStructure(DDataStructure.StringType(), []),
			DDataStructure.TypeStructure(DDataStructure.NumberType(), []),
			[],
		);
		const input: unknown = {
			first: 1,
			second: 2,
		};
		const success = structure.check(input);
		const asyncSuccess = await structure.asyncCheck(input);

		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			Partial<{ readonly [Prop in string]: number }>,
			"strict"
		>;
		type _CheckSuccess = ExpectType<
			typeof success,
			| DEither.Right<"check-success", Partial<{ readonly [Prop in string]: number }>>
			| DEither.Left<"async-error", undefined>
			| DEither.Left<"check-error", DDataStructure.Error>,
			"strict"
		>;
		type _CheckAsyncSuccess = ExpectType<
			typeof asyncSuccess,
			| DEither.Right<"check-success", Partial<{ readonly [Prop in string]: number }>>
			| DEither.Left<"check-error", DDataStructure.Error>,
			"strict"
		>;

		expect(success).toStrictEqual(DEither.right("check-success", input));
		expect(asyncSuccess).toStrictEqual(DEither.right("check-success", input));
		expect(structure.is(input)).toBe(true);
		if (structure.is(input)) {
			type _CheckNarrowedInput = ExpectType<
				typeof input,
				Partial<{ readonly [Prop in string]: number }>,
				"strict"
			>;
		}
	});

	it("checks literal key records and exposes required keys in the output type", () => {
		const structure = DDataStructure.RecordStructure(
			DDataStructure.UnionStructure([
				DDataStructure.TypeStructure(DDataStructure.StringLiteralType("name"), []),
				DDataStructure.TypeStructure(DDataStructure.StringLiteralType("role"), []),
			], []),
			DDataStructure.TypeStructure(DDataStructure.StringType(), []),
			[],
		);
		const input = {
			name: "Jane",
			role: "admin",
		};

		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			{
				readonly name: string;
				readonly role: string;
			},
			"strict"
		>;

		expect(structure.definition.requiredKeys.value).toStrictEqual(["name", "role"]);
		expect(structure.check(input)).toStrictEqual(
			DEither.right("check-success", input),
		);
		expect(structure.is(input)).toBe(true);
	});

	it("keeps required keys open when a key union contains the string type", () => {
		const structure = DDataStructure.RecordStructure(
			DDataStructure.UnionStructure([
				DDataStructure.TypeStructure(DDataStructure.StringLiteralType("name"), []),
				DDataStructure.TypeStructure(DDataStructure.StringType(), []),
			], []),
			DDataStructure.TypeStructure(DDataStructure.StringType(), []),
			[],
		);
		const input = {
			name: "Jane",
			extra: "value",
		};

		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			Partial<{ readonly [Prop in string]: string }>,
			"strict"
		>;

		expect(structure.definition.requiredKeys.value).toBeNull();
		expect(structure.check(input)).toStrictEqual(
			DEither.right("check-success", input),
		);
	});

	it("ignores non literal key branches when computing required keys", () => {
		const structure = DDataStructure.RecordStructure(
			DDataStructure.UnionStructure([
				DDataStructure.TypeStructure(DDataStructure.StringLiteralType("name"), []),
				DDataStructure.object({}) as never,
			], []) as never,
			DDataStructure.TypeStructure(DDataStructure.StringType(), []),
			[],
		);

		expect(structure.definition.requiredKeys.value).toStrictEqual(["name"]);
		expect(structure.check({ name: "Jane" })).toStrictEqual(
			DEither.right("check-success", { name: "Jane" }),
		);
	});

	it("allows partial literal key records when the value structure accepts undefined", () => {
		const structure = DDataStructure.RecordStructure(
			DDataStructure.TypeStructure(DDataStructure.StringLiteralType("deletedAt"), []),
			DDataStructure.TypeStructure(DDataStructure.UndefinedType(), []),
			[],
		);
		const input = {};

		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			{
				readonly deletedAt?: undefined;
			},
			"strict"
		>;

		expect(structure.definition.requiredKeys.value).toStrictEqual(["deletedAt"]);
		expect(structure.check(input)).toStrictEqual(
			DEither.right("check-success", input),
		);
	});

	it("returns check errors for invalid records, keys and values", () => {
		const structure = DDataStructure.RecordStructure(
			DDataStructure.UnionStructure([
				DDataStructure.TypeStructure(DDataStructure.StringLiteralType("name"), []),
				DDataStructure.TypeStructure(DDataStructure.StringLiteralType("role"), []),
			], []),
			DDataStructure.TypeStructure(DDataStructure.StringType(), []),
			[],
		);
		const invalidKind = structure.check(null);
		const invalidUnknownKey = structure.check({
			name: "Jane",
			role: "admin",
			extra: "value",
		});
		const invalidMissingValue = structure.check({
			name: "Jane",
		});
		const invalidValue = structure.check({
			name: "Jane",
			role: 123,
		});

		expect(
			DEither.unwrapByInformationOrThrow(invalidKind, "check-error").issues[0],
		).toMatchObject({
			data: null,
			path: "",
		});
		expect(
			DEither.unwrapByInformationOrThrow(
				invalidUnknownKey,
				"check-error",
			).issues[0],
		).toMatchObject({
			data: {
				name: "Jane",
				role: "admin",
				extra: "value",
			},
			path: "",
		});
		expect(
			DEither.unwrapByInformationOrThrow(
				invalidMissingValue,
				"check-error",
			).issues[0],
		).toMatchObject({
			data: undefined,
			path: "{record value: role}",
		});
		expect(
			DEither.unwrapByInformationOrThrow(
				invalidValue,
				"check-error",
			).issues[0],
		).toMatchObject({
			data: 123,
			path: "{record value: role}",
		});
		expect(structure.check(new Date())).toStrictEqual(
			DEither.left("check-error", expect.anything()),
		);
		expect(structure.check({
			name: "Jane",
			role: "admin",
			[Symbol("private")]: true,
		})).toStrictEqual(DEither.left("check-error", expect.anything()));
		expect(structure.is({
			name: "Jane",
			role: 123,
		})).toBe(false);
		expect(structure.is(null)).toBe(false);
	});

	it("encodes and decodes record values with matching codecs", async() => {
		const structure = DDataStructure.RecordStructure(
			DDataStructure.UnionStructure([
				DDataStructure.TypeStructure(DDataStructure.StringLiteralType("first"), []),
				DDataStructure.TypeStructure(DDataStructure.StringLiteralType("second"), []),
			], []),
			DDataStructure.TypeStructure(DDataStructure.StringType(), []),
			[],
		);
		const codec = DDataStructure.createCodec(
			DDataStructure.TheString,
			DDataStructure.TypeStructure(DDataStructure.NumberType(), []).is,
			(data) => data.length,
			(data) => `name-${data}`,
		);
		const codecs = DDataStructure.createCodecs({ codec });
		const encoded = structure.encode(codecs, {
			first: "Jane",
			second: "John",
		});
		const asyncEncoded = await structure.asyncEncode(codecs, {
			first: "Jane",
			second: "John",
		});
		const decoded = structure.decode(codecs, {
			first: 4,
			second: 5,
		});
		const asyncDecoded = await structure.asyncDecode(codecs, {
			first: 4,
			second: 5,
		});

		type EncodedRecord = DDataStructure.EncodedValue<
			DDataStructure.StructureValue<typeof structure>,
			typeof codecs
		>;
		type _CheckEncodedRecord = ExpectType<
			EncodedRecord,
			{
				readonly first: number;
				readonly second: number;
			},
			"strict"
		>;
		type _CheckEncoded = ExpectType<
			typeof encoded,
			| DEither.Right<
				"encode-success",
				EncodedRecord
			>
			| DEither.Left<"async-error", undefined>
			| DEither.Left<"encode-error", DDataStructure.Error>,
			"strict"
		>;
		type _CheckAsyncEncoded = ExpectType<
			typeof asyncEncoded,
			| DEither.Right<
				"encode-success",
				EncodedRecord
			>
			| DEither.Left<"encode-error", DDataStructure.Error>,
			"strict"
		>;
		type _CheckDecoded = ExpectType<
			typeof decoded,
			| DEither.Right<
				"decode-success",
				{
					readonly first: string;
					readonly second: string;
				}
			>
			| DEither.Left<"async-error", undefined>
			| DEither.Left<"decode-error", DDataStructure.Error>,
			"strict"
		>;
		type _CheckAsyncDecoded = ExpectType<
			typeof asyncDecoded,
			| DEither.Right<
				"decode-success",
				{
					readonly first: string;
					readonly second: string;
				}
			>
			| DEither.Left<"decode-error", DDataStructure.Error>,
			"strict"
		>;

		expect(encoded).toStrictEqual(DEither.right("encode-success", {
			first: 4,
			second: 4,
		}));
		expect(asyncEncoded).toStrictEqual(DEither.right("encode-success", {
			first: 4,
			second: 4,
		}));
		expect(decoded).toStrictEqual(DEither.right("decode-success", {
			first: "name-4",
			second: "name-5",
		}));
		expect(asyncDecoded).toStrictEqual(DEither.right("decode-success", {
			first: "name-4",
			second: "name-5",
		}));
	});

	it("returns encode and decode errors for invalid records or invalid values", () => {
		const structure = DDataStructure.RecordStructure(
			DDataStructure.TypeStructure(DDataStructure.StringLiteralType("name"), []),
			DDataStructure.TypeStructure(DDataStructure.StringType(), []),
			[],
		);
		const invalidEncodeKind = structure.encode(DDataStructure.createCodecs({}), null as never);
		const invalidEncodeKey = structure.encode(DDataStructure.createCodecs({}), {
			name: "Jane",
			extra: "value",
		} as never);
		const invalidEncodeValue = structure.encode(DDataStructure.createCodecs({}), {
			name: 123,
		} as never);
		const invalidDecodeKind = structure.decode(DDataStructure.createCodecs({}), null as never);
		const invalidDecodeKey = structure.decode(DDataStructure.createCodecs({}), {
			name: "Jane",
			extra: "value",
		} as never);
		const invalidDecodeValue = structure.decode(DDataStructure.createCodecs({}), {
			name: 123,
		} as never);

		expect(
			DEither.unwrapByInformationOrThrow(
				invalidEncodeKind,
				"encode-error",
			).issues[0],
		).toMatchObject({
			data: null,
			path: "",
		});
		expect(
			DEither.unwrapByInformationOrThrow(
				invalidEncodeKey,
				"encode-error",
			).issues[0],
		).toMatchObject({
			path: "",
		});
		expect(
			DEither.unwrapByInformationOrThrow(
				invalidEncodeValue,
				"encode-error",
			).issues[0],
		).toMatchObject({
			data: 123,
			path: "{record value: name}",
		});
		expect(
			DEither.unwrapByInformationOrThrow(
				invalidDecodeKind,
				"decode-error",
			).issues[0],
		).toMatchObject({
			data: null,
			path: "",
		});
		expect(
			DEither.unwrapByInformationOrThrow(
				invalidDecodeKey,
				"decode-error",
			).issues[0],
		).toMatchObject({
			path: "",
		});
		expect(
			DEither.unwrapByInformationOrThrow(
				invalidDecodeValue,
				"decode-error",
			).issues[0],
		).toMatchObject({
			data: 123,
			path: "{record value: name}",
		});
	});

	it("returns encode and decode errors when constraints fail after conversion", () => {
		const structure = DDataStructure.RecordStructure(
			DDataStructure.TypeStructure(DDataStructure.StringLiteralType("name"), []),
			DDataStructure.TypeStructure(DDataStructure.StringType(), []),
			[DDataStructure.refine(() => false)],
		);
		const encoded = structure.encode(DDataStructure.createCodecs({}), { name: "Jane" });
		const decoded = structure.decode(DDataStructure.createCodecs({}), { name: "Jane" });

		expect(
			DEither.unwrapByInformationOrThrow(encoded, "encode-error").issues,
		).toHaveLength(1);
		expect(
			DEither.unwrapByInformationOrThrow(decoded, "decode-error").issues,
		).toHaveLength(1);
	});

	it("returns async errors for asynchronous key or value structures in synchronous APIs", () => {
		const asyncTypeKind = DDataStructure.createKind("test-public-async-record-type");

		interface AsyncType extends DCommon.Forward<
			& DDataStructure.Type<DDataStructure.TheString>
			& DKind.Kind<typeof asyncTypeKind>
		> {}

		const AsyncType = DDataStructure.createType(
			DDataStructure.TheString,
			asyncTypeKind,
			({ init }) => () => init<AsyncType>(
				{},
				{
					executeCheck: () => Promise.resolve(DDataStructure.SuccessSymbol),
					isAsynchronous: () => true,
				},
			),
		);
		const structure = DDataStructure.RecordStructure(
			DDataStructure.TypeStructure(DDataStructure.StringType(), []),
			DDataStructure.TypeStructure(AsyncType(), []),
			[],
		);

		expect(structure.isAsynchronous()).toBe(true);
		expect(structure.check({ name: "Jane" })).toStrictEqual(
			DEither.left("async-error", undefined),
		);
		expect(structure.encode(DDataStructure.createCodecs({}), { name: "Jane" })).toStrictEqual(
			DEither.left("async-error", undefined),
		);
		expect(structure.decode(DDataStructure.createCodecs({}), { name: "Jane" })).toStrictEqual(
			DEither.left("async-error", undefined),
		);
	});
});
