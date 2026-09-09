import { DDataStructure, type ExpectType } from "@scripts";

describe("createCodec and createCodecs", () => {
	it("creates a codec kind and delegates its encoded value predicate without error context", () => {
		const encodedStructure = DDataStructure.TypeStructure(DDataStructure.NumberType(), []);
		const predicateEncode = vi.fn();
		const codec = DDataStructure.createCodec(
			DDataStructure.TheString,
			(data): data is number => {
				predicateEncode(data);
				return encodedStructure.is(data);
			},
			(data) => data.length,
			(data) => `value-${data}`,
		);

		type _CheckCodec = ExpectType<
			typeof codec,
			DDataStructure.Codec<
				typeof DDataStructure.TheString,
				DDataStructure.StructureValue<typeof encodedStructure>
			>,
			"strict"
		>;

		expect(DDataStructure.codecKind.has(codec)).toBe(true);
		expect(codec.fundamentalType).toBe(DDataStructure.TheString);
		expect(codec.predicateEncode(12)).toBe(true);
		expect(codec.predicateEncode("12")).toBe(false);
		expect(predicateEncode).toHaveBeenNthCalledWith(1, 12);
		expect(predicateEncode).toHaveBeenNthCalledWith(2, "12");
	});

	it("creates codecs with their definition and memoized context", () => {
		const stringCodec = DDataStructure.createCodec(
			DDataStructure.TheString,
			DDataStructure.TypeStructure(DDataStructure.NumberType(), []).is,
			(data) => data.length,
			(data) => `value-${data}`,
		);
		const numberCodec = DDataStructure.createCodec(
			DDataStructure.TheNumber,
			DDataStructure.TypeStructure(DDataStructure.StringType(), []).is,
			(data) => String(data),
			(data) => Number(data),
		);
		const codecs = DDataStructure.createCodecs({
			stringCodec,
			numberCodec,
		});

		type _CheckCodecs = ExpectType<
			typeof codecs,
			DDataStructure.Codecs<{
				stringCodec: typeof stringCodec;
				numberCodec: typeof numberCodec;
			}>,
			"strict"
		>;

		expect(DDataStructure.codecsKind.has(codecs)).toBe(true);
		expect(codecs.definition).toEqual({
			stringCodec,
			numberCodec,
		});
		expect(codecs.context.value.get(DDataStructure.TheString)).toBe(stringCodec);
		expect(codecs.context.value.get(DDataStructure.TheNumber)).toBe(numberCodec);
		expect(codecs.context.value).toBe(codecs.context.value);
	});

	it("encodes and validates encoded data", () => {
		const codec = DDataStructure.createCodec(
			DDataStructure.TheString,
			DDataStructure.TypeStructure(DDataStructure.NumberType(), []).is,
			(data) => data.length,
			(data) => `value-${data}`,
		);

		expect(codec.encode("abcd")).toBe(4);
	});

	it("adds an encode issue when the encoder returns an error", () => {
		const getErrorHandler = DDataStructure.createGetErrorHandler();
		const codec = DDataStructure.createCodec(
			DDataStructure.TheString,
			DDataStructure.TypeStructure(DDataStructure.NumberType(), []).is,
			() => DDataStructure.ErrorSymbol,
			(data) => `value-${data}`,
		);

		expect(codec.encode("abcd", getErrorHandler)).toBe(DDataStructure.ErrorSymbol);
		expect(getErrorHandler().issues[0]).toMatchObject({
			data: "abcd",
			from: "encoding",
			path: "",
		});
		expect(getErrorHandler().issues).toHaveLength(1);
		expect(DDataStructure.encodeIssueKind.has(getErrorHandler().issues[0])).toBe(true);
		expect(getErrorHandler().issues[0]?.getSource()).toBe(codec);
	});

	it("returns encode errors when encoded data does not match the encoded structure", () => {
		const getErrorHandler = DDataStructure.createGetErrorHandler();
		const codec = DDataStructure.createCodec(
			DDataStructure.TheString,
			DDataStructure.TypeStructure(DDataStructure.NumberType(), []).is,
			() => "invalid" as never,
			(data) => `value-${data}`,
		);

		expect(codec.encode("abcd", getErrorHandler)).toBe(DDataStructure.ErrorSymbol);
		expect(getErrorHandler().issues[0]).toMatchObject({
			data: "invalid",
			from: "predicate",
			path: "",
		});
		expect(DDataStructure.encodeIssueKind.has(getErrorHandler().issues[0])).toBe(true);
		expect(getErrorHandler().issues[0]?.getSource()).toBe(codec);
	});

	it("decodes checked encoded data", () => {
		const codec = DDataStructure.createCodec(
			DDataStructure.TheString,
			DDataStructure.TypeStructure(DDataStructure.NumberType(), []).is,
			(data) => data.length,
			(data) => `value-${data}`,
		);

		expect(codec.decode(4)).toBe("value-4");
	});

	it("returns decode errors when encoded data does not match the encoded structure", () => {
		const getErrorHandler = DDataStructure.createGetErrorHandler();
		const codec = DDataStructure.createCodec(
			DDataStructure.TheString,
			DDataStructure.TypeStructure(DDataStructure.NumberType(), []).is,
			(data) => data.length,
			(data) => `value-${data}`,
		);

		expect(codec.decode("invalid" as never, getErrorHandler)).toBe(DDataStructure.ErrorSymbol);
		expect(getErrorHandler().issues[0]).toMatchObject({
			data: "invalid",
			from: "predicate",
			path: "",
		});
		expect(DDataStructure.decodeIssueKind.has(getErrorHandler().issues[0])).toBe(true);
		expect(getErrorHandler().issues[0]?.getSource()).toBe(codec);
	});

	it("adds a decode issue when the decoder returns an error", () => {
		const getErrorHandler = DDataStructure.createGetErrorHandler();
		const codec = DDataStructure.createCodec(
			DDataStructure.TheString,
			DDataStructure.TypeStructure(DDataStructure.NumberType(), []).is,
			(data) => data.length,
			() => DDataStructure.ErrorSymbol,
		);

		expect(codec.decode(4, getErrorHandler)).toBe(DDataStructure.ErrorSymbol);
		expect(getErrorHandler().issues[0]).toMatchObject({
			data: 4,
			from: "decoding",
			path: "",
		});
		expect(getErrorHandler().issues).toHaveLength(1);
		expect(DDataStructure.decodeIssueKind.has(getErrorHandler().issues[0])).toBe(true);
		expect(getErrorHandler().issues[0]?.getSource()).toBe(codec);
	});

	it("supports asynchronous encoders and decoders", async() => {
		const codec = DDataStructure.createCodec(
			DDataStructure.TheString,
			DDataStructure.TypeStructure(DDataStructure.NumberType(), []).is,
			(data) => Promise.resolve(data.length),
			(data) => Promise.resolve(`value-${data}`),
		);

		await expect(codec.encode("abcd")).resolves.toBe(4);
		await expect(codec.decode(4)).resolves.toBe("value-4");
	});

	it("infers encoded values for matching codecs and falls back otherwise", () => {
		const codec = DDataStructure.createCodec(
			DDataStructure.TheString,
			DDataStructure.TypeStructure(DDataStructure.NumberType(), []).is,
			(data) => data.length,
			(data) => `value-${data}`,
		);
		const codecs = DDataStructure.createCodecs({ codec });

		type _CheckEncodedValue = ExpectType<
			DDataStructure.EncodedValue<string, typeof codecs>,
			number,
			"strict"
		>;
		type _CheckFallbackValue = ExpectType<
			DDataStructure.EncodedValue<boolean, typeof codecs>,
			boolean,
			"strict"
		>;

		expect(codec.encode("abcd")).toBe(4);
	});
});
