import * as DPath from "@duplojs/lang/path";
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import { DSDataStructure, DSFile } from "@scripts";

describe("codecsJson", () => {
	const codecs = DSDataStructure.codecsJson;

	it("preserves the language codecs", () => {
		expect(codecs.definition).toMatchObject(DDataStructure.codecsJson.definition);
	});

	describe("file", () => {
		it("accepts strings and normalizes paths when decoding", async() => {
			const codec = codecs.definition.file;

			type _CheckCodec = DCommon.ExpectType<
				typeof codec,
				DDataStructure.Codec<DSDataStructure.TheFile, string>,
				"strict"
			>;

			type _CheckEncoded = DCommon.ExpectType<
				DDataStructure.EncodedValue<DSFile.FileInterface, typeof codecs>,
				string,
				"strict"
			>;

			for (const [input, expected] of [
				["/tmp/example", "/tmp/example"],
				["./tmp//nested/../example/", "tmp/example"],
				["", "."],
			] as const) {
				expect(codec.predicateEncode(input)).toBe(true);
				const decoded = await codec.decode(input);
				expect(DSFile.isFileInterface(decoded)).toBe(true);
				expect(decoded).toMatchObject({ path: expected });
			}
		});

		it("encodes interfaces as strings", async() => {
			const codec = codecs.definition.file;
			const entry = DSFile.createFileInterface(DPath.declarePath("/tmp/example"));

			expect(codec.fundamentalType).toBe(DSDataStructure.TheFile);
			expect(await codec.encode(entry)).toBe("/tmp/example");
		});

		it("rejects nonstrings and paths that cannot be normalized", async() => {
			const codec = codecs.definition.file;

			expect(codec.predicateEncode(42)).toBe(false);
			expect(codec.predicateEncode(null)).toBe(false);
			expect(codec.predicateEncode("tmp\0example")).toBe(true);
			expect(await codec.decode("tmp\0example")).toBe(DDataStructure.ErrorSymbol);
		});

		it("preserves types through structure encoding and decoding", async() => {
			const structure = DSDataStructure.file();
			const decoded = await structure.asyncDecode(codecs, "tmp//example");
			const entry = DEither.unwrapByInformationOrThrow(decoded, "decode-success");

			type _CheckDecoded = DCommon.ExpectType<
				typeof entry,
				DSFile.FileInterface,
				"strict"
			>;

			const encoded = await structure.asyncEncode(codecs, entry);

			type _CheckEncodedResult = DCommon.ExpectType<
				typeof encoded,
				| DEither.Right<"encode-success", string>
				| DEither.Left<"encode-error", DDataStructure.Error>,
				"strict"
			>;

			expect(entry.path).toBe("tmp/example");
			expect(DEither.unwrapRight(encoded)).toBe("tmp/example");
		});
	});

	describe("folder", () => {
		it("accepts strings and normalizes paths when decoding", async() => {
			const codec = codecs.definition.folder;

			type _CheckCodec = DCommon.ExpectType<
				typeof codec,
				DDataStructure.Codec<DSDataStructure.TheFolder, string>,
				"strict"
			>;

			type _CheckEncoded = DCommon.ExpectType<
				DDataStructure.EncodedValue<DSFile.FolderInterface, typeof codecs>,
				string,
				"strict"
			>;

			for (const [input, expected] of [
				["/tmp/example", "/tmp/example"],
				["./tmp//nested/../example/", "tmp/example"],
				["", "."],
			] as const) {
				expect(codec.predicateEncode(input)).toBe(true);
				const decoded = await codec.decode(input);
				expect(DSFile.isFolderInterface(decoded)).toBe(true);
				expect(decoded).toMatchObject({ path: expected });
			}
		});

		it("encodes interfaces as strings", async() => {
			const codec = codecs.definition.folder;
			const entry = DSFile.createFolderInterface(DPath.declarePath("/tmp/example"));

			expect(codec.fundamentalType).toBe(DSDataStructure.TheFolder);
			expect(await codec.encode(entry)).toBe("/tmp/example");
		});

		it("rejects nonstrings and paths that cannot be normalized", async() => {
			const codec = codecs.definition.folder;

			expect(codec.predicateEncode(42)).toBe(false);
			expect(codec.predicateEncode(null)).toBe(false);
			expect(codec.predicateEncode("tmp\0example")).toBe(true);
			expect(await codec.decode("tmp\0example")).toBe(DDataStructure.ErrorSymbol);
		});

		it("preserves types through structure encoding and decoding", async() => {
			const structure = DSDataStructure.folder();
			const decoded = await structure.asyncDecode(codecs, "tmp//example");
			const entry = DEither.unwrapByInformationOrThrow(decoded, "decode-success");

			type _CheckDecoded = DCommon.ExpectType<
				typeof entry,
				DSFile.FolderInterface,
				"strict"
			>;

			const encoded = await structure.asyncEncode(codecs, entry);

			type _CheckEncodedResult = DCommon.ExpectType<
				typeof encoded,
				| DEither.Right<"encode-success", string>
				| DEither.Left<"encode-error", DDataStructure.Error>,
				"strict"
			>;

			expect(entry.path).toBe("tmp/example");
			expect(DEither.unwrapRight(encoded)).toBe("tmp/example");
		});
	});
});
