import { DDataStructure, DEither, type DCommon, type DKind, type ExpectType } from "@scripts";

describe("TypeStructure", () => {
	it("checks values with the wrapped type", async() => {
		const structure = DDataStructure.TypeStructure(DDataStructure.StringType(), []);
		const success = structure.check("value");
		const failure = structure.check(123);
		const asyncSuccess = await structure.asyncCheck("value");

		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			string,
			"strict"
		>;
		type _CheckSuccess = ExpectType<
			typeof success,
			| DEither.Right<"check-success", string>
			| DEither.Left<"async-error", undefined>
			| DEither.Left<"check-error", DDataStructure.Error>,
			"strict"
		>;
		type _CheckAsyncSuccess = ExpectType<
			typeof asyncSuccess,
			| DEither.Right<"check-success", string>
			| DEither.Left<"check-error", DDataStructure.Error>,
			"strict"
		>;

		expect(success).toStrictEqual(DEither.right("check-success", "value"));
		expect(asyncSuccess).toStrictEqual(DEither.right("check-success", "value"));
		expect(
			DEither.unwrapByInformationOrThrow(failure, "check-error").issues[0],
		).toMatchObject({
			data: 123,
			path: "",
		});
		expect(structure.is("value")).toBe(true);
		expect(structure.is(123)).toBe(false);
	});

	it("returns async check errors for asynchronous types in synchronous APIs", async() => {
		const asyncTypeKind = DDataStructure.createKind("test-public-async-type-structure-type");

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

		const structure = DDataStructure.TypeStructure(AsyncType(), []);

		expect(structure.check("value")).toStrictEqual(
			DEither.left("async-error", undefined),
		);
		expect(await structure.asyncCheck("value")).toStrictEqual(
			DEither.right("check-success", "value"),
		);
		expect(structure.is("value")).toBe(false);
		expect(structure.isAsynchronous()).toBe(true);
	});

	it("encodes values with the matching codec", async() => {
		const structure = DDataStructure.TypeStructure(DDataStructure.StringType(), []);
		const codec = DDataStructure.createCodec(
			DDataStructure.TheString,
			DDataStructure.TypeStructure(DDataStructure.NumberType(), []).is,
			(data) => data.length,
			(data) => `value-${data}`,
		);
		const success = structure.encode(DDataStructure.createCodecs({ codec }), "abcd");
		const asyncSuccess = await structure.asyncEncode(DDataStructure.createCodecs({ codec }), "abcd");
		const fallbackSuccess = structure.encode(DDataStructure.createCodecs({}), "abcd");
		const failure = structure.encode(DDataStructure.createCodecs({ codec }), 123 as never);

		type _CheckSuccess = ExpectType<
			typeof success,
			| DEither.Right<"encode-success", number>
			| DEither.Left<"async-error", undefined>
			| DEither.Left<"encode-error", DDataStructure.Error>,
			"strict"
		>;
		type _CheckAsyncSuccess = ExpectType<
			typeof asyncSuccess,
			| DEither.Right<"encode-success", number>
			| DEither.Left<"encode-error", DDataStructure.Error>,
			"strict"
		>;

		expect(success).toStrictEqual(DEither.right("encode-success", 4));
		expect(asyncSuccess).toStrictEqual(DEither.right("encode-success", 4));
		expect(fallbackSuccess).toStrictEqual(
			DEither.right("encode-success", "abcd"),
		);
		expect(
			DEither.unwrapByInformationOrThrow(failure, "encode-error").issues[0],
		).toMatchObject({
			data: 123,
			path: "",
		});
	});

	it("returns async encode errors for asynchronous encoders in synchronous APIs", async() => {
		const structure = DDataStructure.TypeStructure(DDataStructure.StringType(), []);
		const codec = DDataStructure.createCodec(
			DDataStructure.TheString,
			DDataStructure.TypeStructure(DDataStructure.NumberType(), []).is,
			(data) => Promise.resolve(data.length),
			(data) => `value-${data}`,
		);

		expect(structure.encode(DDataStructure.createCodecs({ codec }), "abcd")).toStrictEqual(
			DEither.left("async-error", undefined),
		);
		expect(await structure.asyncEncode(DDataStructure.createCodecs({ codec }), "abcd")).toStrictEqual(
			DEither.right("encode-success", 4),
		);
	});

	it("returns encode errors from matching codecs", async() => {
		const structure = DDataStructure.TypeStructure(DDataStructure.StringType(), []);
		const codec = DDataStructure.createCodec(
			DDataStructure.TheString,
			DDataStructure.TypeStructure(DDataStructure.NumberType(), []).is,
			(data, self, errorHandler) => {
				errorHandler?.().addEncodeIssue(self, "external", data, "encoded-error");
				return DDataStructure.ErrorSymbol;
			},
			(data) => `value-${data}`,
		);
		const failure = structure.encode(DDataStructure.createCodecs({ codec }), "abcd");
		const asyncFailure = await structure.asyncEncode(DDataStructure.createCodecs({ codec }), "abcd");

		expect(
			DEither.unwrapByInformationOrThrow(failure, "encode-error").issues[0],
		).toMatchObject({
			data: "abcd",
			from: "external",
			message: "encoded-error",
		});
		expect(
			DEither.unwrapByInformationOrThrow(failure, "encode-error").issues[0]?.getSource(),
		).toBe(codec);
		expect(
			DEither.unwrapByInformationOrThrow(
				asyncFailure,
				"encode-error",
			).issues[0],
		).toMatchObject({
			data: "abcd",
			from: "external",
			message: "encoded-error",
		});
		expect(
			DEither.unwrapByInformationOrThrow(asyncFailure, "encode-error").issues[0]?.getSource(),
		).toBe(codec);
	});

	it("decodes values with the matching codec", async() => {
		const structure = DDataStructure.TypeStructure(DDataStructure.StringType(), []);
		const codec = DDataStructure.createCodec(
			DDataStructure.TheString,
			DDataStructure.TypeStructure(DDataStructure.NumberType(), []).is,
			(data) => data.length,
			(data) => `value-${data}`,
		);
		const success = structure.decode(DDataStructure.createCodecs({ codec }), 4);
		const asyncSuccess = await structure.asyncDecode(DDataStructure.createCodecs({ codec }), 4);
		const fallbackSuccess = structure.decode(DDataStructure.createCodecs({}), "value");
		const failure = structure.decode(DDataStructure.createCodecs({}), 123 as never);

		type _CheckSuccess = ExpectType<
			typeof success,
			| DEither.Right<"decode-success", string>
			| DEither.Left<"async-error", undefined>
			| DEither.Left<"decode-error", DDataStructure.Error>,
			"strict"
		>;
		type _CheckAsyncSuccess = ExpectType<
			typeof asyncSuccess,
			| DEither.Right<"decode-success", string>
			| DEither.Left<"decode-error", DDataStructure.Error>,
			"strict"
		>;

		expect(success).toStrictEqual(DEither.right("decode-success", "value-4"));
		expect(asyncSuccess).toStrictEqual(
			DEither.right("decode-success", "value-4"),
		);
		expect(fallbackSuccess).toStrictEqual(
			DEither.right("decode-success", "value"),
		);
		expect(
			DEither.unwrapByInformationOrThrow(failure, "decode-error").issues[0],
		).toMatchObject({
			data: 123,
			path: "",
		});
	});

	it("returns async decode errors for asynchronous decoders in synchronous APIs", async() => {
		const structure = DDataStructure.TypeStructure(DDataStructure.StringType(), []);
		const codec = DDataStructure.createCodec(
			DDataStructure.TheString,
			DDataStructure.TypeStructure(DDataStructure.NumberType(), []).is,
			(data) => data.length,
			(data) => Promise.resolve(`value-${data}`),
		);

		expect(structure.decode(DDataStructure.createCodecs({ codec }), 4)).toStrictEqual(
			DEither.left("async-error", undefined),
		);
		expect(await structure.asyncDecode(DDataStructure.createCodecs({ codec }), 4)).toStrictEqual(
			DEither.right("decode-success", "value-4"),
		);
	});

	it("returns decode errors from matching codecs", async() => {
		const structure = DDataStructure.TypeStructure(DDataStructure.StringType(), []);
		const codec = DDataStructure.createCodec(
			DDataStructure.TheString,
			DDataStructure.TypeStructure(DDataStructure.NumberType(), []).is,
			(data) => data.length,
			(data, self, errorHandler) => {
				errorHandler?.().addDecodeIssue(self, "external", data, "decoded-error");
				return DDataStructure.ErrorSymbol;
			},
		);
		const failure = structure.decode(DDataStructure.createCodecs({ codec }), 4);
		const asyncFailure = await structure.asyncDecode(DDataStructure.createCodecs({ codec }), 4);

		expect(
			DEither.unwrapByInformationOrThrow(failure, "decode-error").issues[0],
		).toMatchObject({
			data: 4,
			from: "external",
			message: "decoded-error",
		});
		expect(
			DEither.unwrapByInformationOrThrow(failure, "decode-error").issues[0]?.getSource(),
		).toBe(codec);
		expect(
			DEither.unwrapByInformationOrThrow(
				asyncFailure,
				"decode-error",
			).issues[0],
		).toMatchObject({
			data: 4,
			from: "external",
			message: "decoded-error",
		});
		expect(
			DEither.unwrapByInformationOrThrow(asyncFailure, "decode-error").issues[0]?.getSource(),
		).toBe(codec);
	});
});
