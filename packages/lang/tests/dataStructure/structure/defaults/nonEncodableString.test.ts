// oxlint-disable typescript/no-wrapper-object-types
import { DDataStructure, DEither, type ExpectType } from "@scripts";

describe("NonEncodableStringStructure", () => {
	it("checks one literal string and narrows with is", async() => {
		const structure = DDataStructure.NonEncodableStringStructure("secret");
		const input: unknown = "secret";
		const success = structure.check(input);
		const asyncSuccess = await structure.asyncCheck(input);

		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			String,
			"strict"
		>;
		type _CheckSuccess = ExpectType<
			typeof success,
			| DEither.Right<"check-success", String>
			| DEither.Left<"async-error", undefined>
			| DEither.Left<"check-error", DDataStructure.Error>,
			"strict"
		>;
		type _CheckAsyncSuccess = ExpectType<
			typeof asyncSuccess,
			| DEither.Right<"check-success", String>
			| DEither.Left<"check-error", DDataStructure.Error>,
			"strict"
		>;

		expect(DDataStructure.nonEncodableStringStructureKind.has(structure)).toBe(true);
		expect(structure.definition.value).toBe("secret");
		expect(success).toStrictEqual(DEither.right("check-success", "secret"));
		expect(asyncSuccess).toStrictEqual(DEither.right("check-success", "secret"));
		expect(structure.is(input)).toBe(true);
		expect(structure.isAsynchronous()).toBe(false);
		if (structure.is(input)) {
			type _CheckNarrowedInput = ExpectType<
				typeof input,
				String,
				"strict"
			>;
		}
	});

	it("returns errors for other values", async() => {
		const structure = DDataStructure.NonEncodableStringStructure("secret");
		const invalidLiteral = structure.check("other");
		const invalidKind = structure.check(123);
		const asyncInvalidLiteral = await structure.asyncCheck("other");
		const invalidEncode = structure.encode(DDataStructure.createCodecs({}), "other");
		const invalidDecode = structure.decode(DDataStructure.createCodecs({}), "other");

		expect(
			DEither.unwrapByInformationOrThrow(invalidLiteral, "check-error").issues[0],
		).toMatchObject({
			data: "other",
			path: "",
		});
		expect(
			DEither.unwrapByInformationOrThrow(invalidKind, "check-error").issues[0],
		).toMatchObject({
			data: 123,
			path: "",
		});
		expect(
			DEither.unwrapByInformationOrThrow(
				asyncInvalidLiteral,
				"check-error",
			).issues[0],
		).toMatchObject({
			data: "other",
			path: "",
		});
		expect(
			DEither.unwrapByInformationOrThrow(invalidEncode, "encode-error").issues[0],
		).toMatchObject({
			data: "other",
			path: "",
		});
		expect(
			DEither.unwrapByInformationOrThrow(invalidDecode, "decode-error").issues[0],
		).toMatchObject({
			data: "other",
			path: "",
		});
		expect(structure.is("other")).toBe(false);
		expect(structure.is(123)).toBe(false);
	});

	it("keeps the literal string unchanged while string codecs exist", async() => {
		const structure = DDataStructure.NonEncodableStringStructure("secret");
		const checkedValue = DEither.unwrapByInformationOrThrow(
			structure.check("secret"),
			"check-success",
		);
		const encode = vi.fn((data: string) => data.length);
		const decode = vi.fn((data: number) => `decoded-${data}`);
		const codec = DDataStructure.createCodec(
			DDataStructure.TheString,
			DDataStructure.number().is,
			encode,
			decode,
		);
		const codecs = DDataStructure.createCodecs({ codec });
		const encoded = structure.encode(codecs, checkedValue);
		const asyncEncoded = await structure.asyncEncode(codecs, checkedValue);
		const decoded = structure.decode(codecs, "secret");
		const asyncDecoded = await structure.asyncDecode(codecs, "secret");

		type _CheckEncodedValue = ExpectType<
			DDataStructure.EncodedValue<
				DDataStructure.StructureValue<typeof structure>,
				typeof codecs
			>,
			String,
			"strict"
		>;
		type _CheckEncoded = ExpectType<
			typeof encoded,
			| DEither.Right<"encode-success", String>
			| DEither.Left<"async-error", undefined>
			| DEither.Left<"encode-error", DDataStructure.Error>,
			"strict"
		>;
		type _CheckAsyncEncoded = ExpectType<
			typeof asyncEncoded,
			| DEither.Right<"encode-success", String>
			| DEither.Left<"encode-error", DDataStructure.Error>,
			"strict"
		>;
		type _CheckDecoded = ExpectType<
			typeof decoded,
			| DEither.Right<"decode-success", String>
			| DEither.Left<"async-error", undefined>
			| DEither.Left<"decode-error", DDataStructure.Error>,
			"strict"
		>;
		type _CheckAsyncDecoded = ExpectType<
			typeof asyncDecoded,
			| DEither.Right<"decode-success", String>
			| DEither.Left<"decode-error", DDataStructure.Error>,
			"strict"
		>;

		expect(encoded).toStrictEqual(DEither.right("encode-success", "secret"));
		expect(asyncEncoded).toStrictEqual(DEither.right("encode-success", "secret"));
		expect(decoded).toStrictEqual(DEither.right("decode-success", "secret"));
		expect(asyncDecoded).toStrictEqual(DEither.right("decode-success", "secret"));
		expect(encode).not.toHaveBeenCalled();
		expect(decode).not.toHaveBeenCalled();
	});

	it("keeps only non encodable strings unchanged inside object structures", () => {
		const structure = DDataStructure.ObjectStructure({
			name: DDataStructure.string(),
			privateKey: DDataStructure.NonEncodableStringStructure("secret"),
		}, []);
		const checkedValue = DEither.unwrapByInformationOrThrow(
			structure.check({
				name: "Jane",
				privateKey: "secret",
			}),
			"check-success",
		);
		const encode = vi.fn((data: string) => data.length);
		const decode = vi.fn((data: number) => `decoded-${data}`);
		const codec = DDataStructure.createCodec(
			DDataStructure.TheString,
			DDataStructure.number().is,
			encode,
			decode,
		);
		const codecs = DDataStructure.createCodecs({ codec });
		const encoded = structure.encode(codecs, checkedValue);

		type _CheckEncoded = ExpectType<
			typeof encoded,
			| DEither.Right<
				"encode-success",
				{
					readonly name: number;
					readonly privateKey: String;
				}
			>
			| DEither.Left<"async-error", undefined>
			| DEither.Left<"encode-error", DDataStructure.Error>,
			"strict"
		>;

		expect(encoded).toStrictEqual(
			DEither.right("encode-success", {
				name: 4,
				privateKey: "secret",
			}),
		);
		expect(encode).toHaveBeenCalledTimes(1);
		expect(encode).toHaveBeenCalledWith("Jane", codec, expect.any(Function));
		expect(decode).not.toHaveBeenCalled();
	});
});
