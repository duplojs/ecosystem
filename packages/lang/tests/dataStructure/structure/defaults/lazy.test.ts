import { DDataStructure, DEither, type DCommon, type DKind, type ExpectType } from "@scripts";

describe("LazyStructure", () => {
	it("checks values through a memoized deferred structure and narrows with is", async() => {
		const getStructure = vi.fn(
			() => DDataStructure.TypeStructure(DDataStructure.StringType(), []),
		);
		const structure = DDataStructure.LazyStructure(getStructure, []);
		const success = structure.check("value");
		const asyncSuccess = await structure.asyncCheck("value");
		const failure = structure.check(123);

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
		expect(getStructure).toHaveBeenCalledTimes(1);
	});

	it("flattens nested lazy structures to the terminal deferred structure", () => {
		const stringStructure = DDataStructure.TypeStructure(DDataStructure.StringType(), []);
		const getStringStructure = vi.fn(
			() => stringStructure,
		);
		const innerLazyStructure = DDataStructure.LazyStructure(
			getStringStructure,
			[],
		);
		const getInnerLazyStructure = vi.fn(
			() => innerLazyStructure,
		);
		const structure = DDataStructure.LazyStructure(
			getInnerLazyStructure,
			[],
		);

		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			string,
			"strict"
		>;

		expect(getInnerLazyStructure).not.toHaveBeenCalled();
		expect(getStringStructure).not.toHaveBeenCalled();
		expect(structure.definition.getter.value).toBe(stringStructure);
		expect(structure.definition.getter.value).toBe(stringStructure);
		expect(getInnerLazyStructure).toHaveBeenCalledTimes(1);
		expect(getStringStructure).toHaveBeenCalledTimes(1);
		expect(structure.check("value")).toStrictEqual(
			DEither.right("check-success", "value"),
		);
		expect(
			DEither.unwrapByInformationOrThrow(
				structure.check(123),
				"check-error",
			).issues[0],
		).toMatchObject({
			data: 123,
			path: "",
		});
	});

	it("can be nested inside object, array and union structures", () => {
		const lazyName = DDataStructure.LazyStructure(
			() => DDataStructure.TypeStructure(DDataStructure.StringType(), []),
			[],
		);
		const structure = DDataStructure.ObjectStructure({
			id: DDataStructure.UnionStructure([
				DDataStructure.TypeStructure(DDataStructure.NumberType(), []),
				DDataStructure.LazyStructure(
					() => DDataStructure.TypeStructure(DDataStructure.StringLiteralType("anonymous"), []),
					[],
				),
			], []),
			names: DDataStructure.ArrayStructure(lazyName, []),
		}, []);
		const input = {
			id: "anonymous",
			names: ["Jane", "John"],
		};

		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			{
				readonly id: number | "anonymous";
				readonly names: readonly string[];
			},
			"strict"
		>;

		expect(structure.check(input)).toStrictEqual(
			DEither.right("check-success", input),
		);
		expect(
			DEither.unwrapByInformationOrThrow(
				structure.check({
					id: "unknown",
					names: ["Jane"],
				}),
				"check-error",
			).issues,
		).toMatchObject([
			{
				data: "unknown",
				path: "id.(union: 0)",
			},
			{
				data: "unknown",
				path: "id.(union: 1)",
			},
			{
				data: "unknown",
				path: "id",
			},
		]);
		expect(
			DEither.unwrapByInformationOrThrow(
				structure.check({
					id: 1,
					names: ["Jane", 123],
				}),
				"check-error",
			).issues[0],
		).toMatchObject({
			data: 123,
			path: "names.[array: 1]",
		});
	});

	it("encodes and decodes through the deferred structure", async() => {
		const structure = DDataStructure.LazyStructure(
			() => DDataStructure.ObjectStructure({
				name: DDataStructure.TypeStructure(DDataStructure.StringType(), []),
			}, []),
			[],
		);
		const codec = DDataStructure.createCodec(
			DDataStructure.TheString,
			DDataStructure.TypeStructure(DDataStructure.NumberType(), []).is,
			(data) => data.length,
			(data) => `name-${data}`,
		);
		const encoded = structure.encode(DDataStructure.createCodecs({ codec }), { name: "Jane" });
		const asyncEncoded = await structure.asyncEncode(DDataStructure.createCodecs({ codec }), { name: "Jane" });
		const decoded = structure.decode(DDataStructure.createCodecs({ codec }), { name: 4 });
		const asyncDecoded = await structure.asyncDecode(DDataStructure.createCodecs({ codec }), { name: 4 });

		type _CheckEncoded = ExpectType<
			typeof encoded,
			| DEither.Right<"encode-success", { readonly name: number }>
			| DEither.Left<"async-error", undefined>
			| DEither.Left<"encode-error", DDataStructure.Error>,
			"strict"
		>;
		type _CheckAsyncEncoded = ExpectType<
			typeof asyncEncoded,
			| DEither.Right<"encode-success", { readonly name: number }>
			| DEither.Left<"encode-error", DDataStructure.Error>,
			"strict"
		>;
		type _CheckDecoded = ExpectType<
			typeof decoded,
			| DEither.Right<"decode-success", { readonly name: string }>
			| DEither.Left<"async-error", undefined>
			| DEither.Left<"decode-error", DDataStructure.Error>,
			"strict"
		>;
		type _CheckAsyncDecoded = ExpectType<
			typeof asyncDecoded,
			| DEither.Right<"decode-success", { readonly name: string }>
			| DEither.Left<"decode-error", DDataStructure.Error>,
			"strict"
		>;

		expect(encoded).toStrictEqual(
			DEither.right("encode-success", { name: 4 }),
		);
		expect(asyncEncoded).toStrictEqual(
			DEither.right("encode-success", { name: 4 }),
		);
		expect(decoded).toStrictEqual(
			DEither.right("decode-success", { name: "name-4" }),
		);
		expect(asyncDecoded).toStrictEqual(
			DEither.right("decode-success", { name: "name-4" }),
		);
	});

	it("returns encode errors from the deferred structure", () => {
		const structure = DDataStructure.LazyStructure(
			() => DDataStructure.TypeStructure(DDataStructure.StringType(), []),
			[],
		);
		const codec = DDataStructure.createCodec(
			DDataStructure.TheString,
			DDataStructure.TypeStructure(DDataStructure.NumberType(), []).is,
			() => "invalid" as never,
			(data) => `value-${data}`,
		);
		const encoded = structure.encode(
			DDataStructure.createCodecs({ codec }),
			"value",
		);

		expect(
			DEither.unwrapByInformationOrThrow(encoded, "encode-error").issues[0],
		).toMatchObject({
			data: "invalid",
			path: "",
		});
	});

	it("returns encode errors from lazy constraints after deferred encoding", () => {
		const constraint = DDataStructure.refine(
			(data: string): data is `user:${string}` => data.startsWith("user:"),
		);
		const structure = DDataStructure.LazyStructure(
			() => DDataStructure.TypeStructure(DDataStructure.StringType(), []),
			[constraint],
		);
		const encoded = structure.encode(
			DDataStructure.createCodecs({}),
			"guest:1" as never,
		);

		expect(
			DEither.unwrapByInformationOrThrow(encoded, "encode-error").issues[0],
		).toMatchObject({
			data: "guest:1",
			path: "",
		});
		expect(
			(
				DEither.unwrapByInformationOrThrow(
					encoded,
					"encode-error",
				).issues[0] as DDataStructure.Issue | undefined
			)?.getSubSource?.(),
		).toBe(constraint);
	});

	it("returns decode errors from the deferred structure", () => {
		const structure = DDataStructure.LazyStructure(
			() => DDataStructure.TypeStructure(DDataStructure.StringType(), []),
			[],
		);
		const codec = DDataStructure.createCodec(
			DDataStructure.TheString,
			DDataStructure.TypeStructure(DDataStructure.NumberType(), []).is,
			(data) => data.length,
			() => 123 as never,
		);
		const decoded = structure.decode(
			DDataStructure.createCodecs({ codec }),
			4,
		);

		expect(
			DEither.unwrapByInformationOrThrow(decoded, "decode-error").issues[0],
		).toMatchObject({
			data: 123,
			path: "",
		});
	});

	it("returns decode errors from lazy constraints after deferred decoding", () => {
		const constraint = DDataStructure.refine(
			(data: string): data is `user:${string}` => data.startsWith("user:"),
		);
		const structure = DDataStructure.LazyStructure(
			() => DDataStructure.TypeStructure(DDataStructure.StringType(), []),
			[constraint],
		);
		const decoded = structure.decode(
			DDataStructure.createCodecs({}),
			"guest:1" as never,
		);

		expect(
			DEither.unwrapByInformationOrThrow(decoded, "decode-error").issues[0],
		).toMatchObject({
			data: "guest:1",
			path: "",
		});
		expect(
			(
				DEither.unwrapByInformationOrThrow(
					decoded,
					"decode-error",
				).issues[0] as DDataStructure.Issue | undefined
			)?.getSubSource?.(),
		).toBe(constraint);
	});

	it("supports recursive structures", () => {
		interface Tree {
			readonly value: string;
			readonly children: readonly Tree[];
		}

		const TreeStructure: DDataStructure.Structure<Tree> = DDataStructure.ObjectStructure({
			value: DDataStructure.TypeStructure(DDataStructure.StringType(), []),
			children: DDataStructure.ArrayStructure(
				DDataStructure.LazyStructure(() => TreeStructure, []),
				[],
			),
		}, []).contract();

		const input: Tree = {
			value: "root",
			children: [
				{
					value: "child",
					children: [],
				},
			],
		};

		expect(TreeStructure.check(input)).toStrictEqual(
			DEither.right("check-success", input),
		);
		expect(TreeStructure.is(input)).toBe(true);
		expect(
			DEither.unwrapByInformationOrThrow(
				TreeStructure.check({
					value: "root",
					children: [
						{
							value: 123,
							children: [],
						},
					],
				}),
				"check-error",
			).issues[0],
		).toMatchObject({
			data: 123,
			path: "children.[array: 0].value",
		});
	});

	it("reports async errors in synchronous APIs when the deferred structure is asynchronous", async() => {
		const asyncTypeKind = DDataStructure.createKind("test-public-async-lazy-type");

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
		const structure = DDataStructure.LazyStructure(
			() => DDataStructure.TypeStructure(AsyncType(), []),
			[],
		);

		expect(structure.isAsynchronous()).toBe(true);
		expect(structure.check("value")).toStrictEqual(
			DEither.left("async-error", undefined),
		);
		expect(await structure.asyncCheck("value")).toStrictEqual(
			DEither.right("check-success", "value"),
		);
		expect(structure.is("value")).toBe(false);
		expect(structure.encode(DDataStructure.createCodecs({}), "value")).toStrictEqual(
			DEither.left("async-error", undefined),
		);
		expect(structure.decode(DDataStructure.createCodecs({}), "value")).toStrictEqual(
			DEither.left("async-error", undefined),
		);
	});
});
