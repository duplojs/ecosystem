import { DDataStructure, DEither, type DCommon, type DKind, type ExpectType } from "@scripts";

describe("ObjectStructure", () => {
	it("checks shaped objects and narrows with is", async() => {
		const shape = {
			name: DDataStructure.TypeStructure(DDataStructure.StringType(), []),
			age: DDataStructure.TypeStructure(DDataStructure.NumberType(), []),
		};
		const structure = DDataStructure.ObjectStructure(shape, []);
		const input: unknown = {
			name: "Jane",
			age: 30,
		};
		const success = structure.check(input);
		const asyncSuccess = await structure.asyncCheck(input);

		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			{
				readonly name: string;
				readonly age: number;
			},
			"strict"
		>;
		type _CheckSuccess = ExpectType<
			typeof success,
			| DEither.Right<
				"check-success",
				{
					readonly name: string;
					readonly age: number;
				}
			>
			| DEither.Left<"async-error", undefined>
			| DEither.Left<"check-error", DDataStructure.Error>,
			"strict"
		>;
		type _CheckAsyncSuccess = ExpectType<
			typeof asyncSuccess,
			| DEither.Right<
				"check-success",
				{
					readonly name: string;
					readonly age: number;
				}
			>
			| DEither.Left<"check-error", DDataStructure.Error>,
			"strict"
		>;

		expect(success).toStrictEqual(DEither.right("check-success", input));
		expect(asyncSuccess).toStrictEqual(DEither.right("check-success", input));
		expect(structure.is(input)).toBe(true);
		if (structure.is(input)) {
			type _CheckNarrowedInput = ExpectType<
				typeof input,
				{
					readonly name: string;
					readonly age: number;
				},
				"strict"
			>;
		}
	});

	it("returns check errors for invalid object shapes", async() => {
		const structure = DDataStructure.ObjectStructure({
			name: DDataStructure.TypeStructure(DDataStructure.StringType(), []),
			age: DDataStructure.TypeStructure(DDataStructure.NumberType(), []),
		}, []);
		const invalidKind = structure.check(null);
		const invalidMissingProperty = structure.check({ name: "Jane" });
		const invalidUnknownProperty = structure.check({
			name: "Jane",
			age: 30,
			extra: true,
		});
		const invalidProperty = structure.check({
			name: 123,
			age: 30,
		});
		const asyncInvalidProperty = await structure.asyncCheck({
			name: 123,
			age: 30,
		});

		expect(
			DEither.unwrapByInformationOrThrow(invalidKind, "check-error").issues[0],
		).toMatchObject({
			data: null,
			path: "",
		});
		expect(
			DEither.unwrapByInformationOrThrow(
				invalidMissingProperty,
				"check-error",
			).issues[0],
		).toMatchObject({
			data: undefined,
			path: "age",
		});
		expect(
			DEither.unwrapByInformationOrThrow(
				invalidUnknownProperty,
				"check-error",
			).issues[0],
		).toMatchObject({
			data: {
				name: "Jane",
				age: 30,
				extra: true,
			},
			path: "",
		});
		expect(
			DEither.unwrapByInformationOrThrow(
				structure.check(new Date()),
				"check-error",
			).issues[0]?.path,
		).toBe("");
		expect(structure.check({
			name: "Jane",
			age: 30,
			[Symbol("private")]: true,
		})).not.toStrictEqual(DEither.right("check-success", undefined));
		expect(
			DEither.unwrapByInformationOrThrow(
				invalidProperty,
				"check-error",
			).issues,
		).toHaveLength(1);
		expect(
			DEither.unwrapByInformationOrThrow(
				invalidProperty,
				"check-error",
			).issues[0],
		).toMatchObject({
			data: 123,
			path: "name",
		});
		expect(
			DEither.unwrapByInformationOrThrow(
				asyncInvalidProperty,
				"check-error",
			).issues[0],
		).toMatchObject({
			data: 123,
			path: "name",
		});
		expect(structure.is({
			name: 123,
			age: 30,
		})).toBe(false);
		expect(structure.is({ name: "Jane" })).toBe(false);
		expect(structure.is(null)).toBe(false);
	});

	it("accepts missing properties when their structure accepts undefined", () => {
		const structure = DDataStructure.ObjectStructure({
			name: DDataStructure.TypeStructure(DDataStructure.StringType(), []),
			deletedAt: DDataStructure.TypeStructure(DDataStructure.UndefinedType(), []),
		}, []);
		const input = {
			name: "Jane",
		};
		const invalidUnknownProperty = {
			name: "Jane",
			deletedAt: undefined,
			extra: true,
		};

		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			{
				readonly name: string;
				readonly deletedAt?: undefined;
			},
			"strict"
		>;

		expect(structure.check(input)).toStrictEqual(
			DEither.right("check-success", input),
		);
		expect(structure.is(input)).toBe(true);
		expect(
			DEither.unwrapByInformationOrThrow(
				structure.check(invalidUnknownProperty),
				"check-error",
			).issues[0],
		).toMatchObject({
			data: invalidUnknownProperty,
			path: "",
		});
	});

	it("returns async check errors for asynchronous shaped structures in synchronous APIs", async() => {
		const asyncTypeKind = DDataStructure.createKind("test-public-async-object-type");

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
		const structure = DDataStructure.ObjectStructure({
			name: DDataStructure.TypeStructure(AsyncType(), []),
		}, []);

		expect(structure.check({ name: "Jane" })).toStrictEqual(
			DEither.left("async-error", undefined),
		);
		expect(await structure.asyncCheck({ name: "Jane" })).toStrictEqual(
			DEither.right("check-success", { name: "Jane" }),
		);
		expect(structure.is({ name: "Jane" })).toBe(false);
		expect(structure.isAsynchronous()).toBe(true);
	});

	it("encodes shaped objects with matching codecs", async() => {
		const structure = DDataStructure.ObjectStructure({
			name: DDataStructure.TypeStructure(DDataStructure.StringType(), []),
			age: DDataStructure.TypeStructure(DDataStructure.NumberType(), []),
		}, []);
		const stringCodec = DDataStructure.createCodec(
			DDataStructure.TheString,
			DDataStructure.TypeStructure(DDataStructure.NumberType(), []).is,
			(data) => data.length,
			(data) => `name-${data}`,
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
		const success = structure.encode(
			codecs,
			{
				name: "Jane",
				age: 30,
			},
		);
		const asyncSuccess = await structure.asyncEncode(
			codecs,
			{
				name: "Jane",
				age: 30,
			},
		);

		type _CheckSuccess = ExpectType<
			typeof success,
			| DEither.Right<
				"encode-success",
				{
					readonly name: number;
					readonly age: string;
				}
			>
			| DEither.Left<"async-error", undefined>
			| DEither.Left<"encode-error", DDataStructure.Error>,
			"strict"
		>;
		type _CheckAsyncSuccess = ExpectType<
			typeof asyncSuccess,
			| DEither.Right<
				"encode-success",
				{
					readonly name: number;
					readonly age: string;
				}
			>
			| DEither.Left<"encode-error", DDataStructure.Error>,
			"strict"
		>;

		expect(success).toStrictEqual(
			DEither.right("encode-success", {
				name: 4,
				age: "30",
			}),
		);
		expect(asyncSuccess).toStrictEqual(
			DEither.right("encode-success", {
				name: 4,
				age: "30",
			}),
		);
	});

	it("checks object constraints against source data after encoding", async() => {
		const constraintKind = DDataStructure.createKind("test-public-object-source-constraint");
		const executeCheck = vi.fn(
			(
				self: SourceConstraint,
				data: { readonly name: string },
			) => typeof data.name === "string"
				? DDataStructure.SuccessSymbol
				: DDataStructure.ErrorSymbol,
		);

		interface SourceConstraint extends DCommon.Forward<
			& DDataStructure.Constraint<{ readonly name: string }>
			& DKind.Kind<typeof constraintKind>
		> {}

		const SourceConstraint = DDataStructure.createConstraint(
			constraintKind,
			({ init }) => () => init<SourceConstraint>(
				{},
				{
					executeCheck,
					isAsynchronous: () => false,
				},
			),
		);
		const sourceConstraint = SourceConstraint();
		const structure = DDataStructure.ObjectStructure(
			{
				name: DDataStructure.TypeStructure(DDataStructure.StringType(), []),
			},
			[sourceConstraint],
		);
		const codec = DDataStructure.createCodec(
			DDataStructure.TheString,
			DDataStructure.TypeStructure(DDataStructure.NumberType(), []).is,
			(data) => data.length,
			(data) => String(data),
		);
		const success = structure.encode(DDataStructure.createCodecs({ codec }), { name: "Jane" });
		const asyncSuccess = await structure.asyncEncode(DDataStructure.createCodecs({ codec }), { name: "Jane" });

		expect(success).toStrictEqual(
			DEither.right("encode-success", {
				name: 4,
			}),
		);
		expect(asyncSuccess).toStrictEqual(
			DEither.right("encode-success", {
				name: 4,
			}),
		);
		expect(executeCheck).toHaveBeenCalledWith(
			sourceConstraint,
			{ name: "Jane" },
		);
	});

	it("returns encode errors for invalid object shapes", () => {
		const structure = DDataStructure.ObjectStructure({
			name: DDataStructure.TypeStructure(DDataStructure.StringType(), []),
			age: DDataStructure.TypeStructure(DDataStructure.NumberType(), []),
		}, []);
		const invalidKind = structure.encode(DDataStructure.createCodecs({}), null as never);
		const invalidMissingProperty = structure.encode(DDataStructure.createCodecs({}), { name: "Jane" } as never);
		const invalidUnknownProperty = structure.encode(DDataStructure.createCodecs({}), {
			name: "Jane",
			age: 30,
			extra: true,
		} as never);
		const invalidProperty = structure.encode(
			DDataStructure.createCodecs({}),
			{
				name: 123,
				age: 30,
			} as never,
		);

		expect(
			DEither.unwrapByInformationOrThrow(invalidKind, "encode-error").issues[0],
		).toMatchObject({
			data: null,
			path: "",
		});
		expect(
			DEither.unwrapByInformationOrThrow(
				invalidMissingProperty,
				"encode-error",
			).issues[0],
		).toMatchObject({
			data: undefined,
			path: "age",
		});
		expect(
			DEither.unwrapByInformationOrThrow(
				invalidUnknownProperty,
				"encode-error",
			).issues[0],
		).toMatchObject({
			data: {
				name: "Jane",
				age: 30,
				extra: true,
			},
			path: "",
		});
		expect(
			DEither.unwrapByInformationOrThrow(
				structure.encode(DDataStructure.createCodecs({}), new Date() as never),
				"encode-error",
			).issues[0]?.path,
		).toBe("");
		expect(structure.encode(DDataStructure.createCodecs({}), {
			name: "Jane",
			age: 30,
			[Symbol("private")]: true,
		} as never)).not.toStrictEqual(DEither.right("encode-success", undefined));
		expect(
			DEither.unwrapByInformationOrThrow(
				invalidProperty,
				"encode-error",
			).issues,
		).toHaveLength(1);
		expect(
			DEither.unwrapByInformationOrThrow(
				invalidProperty,
				"encode-error",
			).issues[0],
		).toMatchObject({
			data: 123,
			path: "name",
		});
	});

	it("returns encode errors when source constraints fail after shaped properties are encoded", async() => {
		const constraintKind = DDataStructure.createKind("test-public-object-encode-error");
		const encode = vi.fn((data: string) => data.length);

		interface FailingConstraint extends DCommon.Forward<
			& DDataStructure.Constraint<{ readonly name: string }>
			& DKind.Kind<typeof constraintKind>
		> {}

		const FailingConstraint = DDataStructure.createConstraint(
			constraintKind,
			({ init }) => () => init<FailingConstraint>(
				{},
				{
					executeCheck: () => DDataStructure.ErrorSymbol,
					isAsynchronous: () => false,
				},
			),
		);
		const failingConstraint = FailingConstraint();
		const structure = DDataStructure.ObjectStructure(
			{
				name: DDataStructure.TypeStructure(DDataStructure.StringType(), []),
			},
			[failingConstraint],
		);
		const codec = DDataStructure.createCodec(
			DDataStructure.TheString,
			DDataStructure.TypeStructure(DDataStructure.NumberType(), []).is,
			encode,
			(data) => String(data),
		);
		const failure = structure.encode(DDataStructure.createCodecs({ codec }), { name: "Jane" });
		const asyncFailure = await structure.asyncEncode(DDataStructure.createCodecs({ codec }), { name: "Jane" });

		expect(
			DEither.unwrapByInformationOrThrow(failure, "encode-error").issues[0]
				?.getSource(),
		).toBe(structure);
		expect(
			(DEither.unwrapByInformationOrThrow(
				failure,
				"encode-error",
			).issues[0] as DDataStructure.Issue | undefined)
				?.getSubSource?.(),
		).toBe(failingConstraint);
		expect(encode).toHaveBeenCalledWith("Jane", codec, expect.any(Function));
		expect(
			DEither.unwrapByInformationOrThrow(
				asyncFailure,
				"encode-error",
			).issues[0]?.getSource(),
		).toBe(structure);
		expect(
			(DEither.unwrapByInformationOrThrow(
				asyncFailure,
				"encode-error",
			).issues[0] as DDataStructure.Issue | undefined)?.getSubSource?.(),
		).toBe(failingConstraint);
		expect(encode).toHaveBeenCalledTimes(2);
	});

	it("returns async encode errors for asynchronous shaped encoders in synchronous APIs", async() => {
		const structure = DDataStructure.ObjectStructure({
			name: DDataStructure.TypeStructure(DDataStructure.StringType(), []),
		}, []);
		const codec = DDataStructure.createCodec(
			DDataStructure.TheString,
			DDataStructure.TypeStructure(DDataStructure.NumberType(), []).is,
			(data) => Promise.resolve(data.length),
			(data) => String(data),
		);

		expect(structure.encode(DDataStructure.createCodecs({ codec }), { name: "Jane" })).toStrictEqual(
			DEither.left("async-error", undefined),
		);
		expect(await structure.asyncEncode(DDataStructure.createCodecs({ codec }), { name: "Jane" })).toStrictEqual(
			DEither.right("encode-success", { name: 4 }),
		);
	});

	it("decodes shaped objects with matching codecs", async() => {
		const structure = DDataStructure.ObjectStructure({
			name: DDataStructure.TypeStructure(DDataStructure.StringType(), []),
			age: DDataStructure.TypeStructure(DDataStructure.NumberType(), []),
		}, []);
		const stringCodec = DDataStructure.createCodec(
			DDataStructure.TheString,
			DDataStructure.TypeStructure(DDataStructure.NumberType(), []).is,
			(data) => data.length,
			(data) => `name-${data}`,
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
		const success = structure.decode(
			codecs,
			{
				name: 4,
				age: "30",
			},
		);
		const asyncSuccess = await structure.asyncDecode(
			codecs,
			{
				name: 4,
				age: "30",
			},
		);

		type _CheckSuccess = ExpectType<
			typeof success,
			| DEither.Right<
				"decode-success",
				{
					readonly name: string;
					readonly age: number;
				}
			>
			| DEither.Left<"async-error", undefined>
			| DEither.Left<"decode-error", DDataStructure.Error>,
			"strict"
		>;
		type _CheckAsyncSuccess = ExpectType<
			typeof asyncSuccess,
			| DEither.Right<
				"decode-success",
				{
					readonly name: string;
					readonly age: number;
				}
			>
			| DEither.Left<"decode-error", DDataStructure.Error>,
			"strict"
		>;

		expect(success).toStrictEqual(
			DEither.right("decode-success", {
				name: "name-4",
				age: 30,
			}),
		);
		expect(asyncSuccess).toStrictEqual(
			DEither.right("decode-success", {
				name: "name-4",
				age: 30,
			}),
		);
	});

	it("returns decode errors for invalid object shapes", () => {
		const structure = DDataStructure.ObjectStructure({
			name: DDataStructure.TypeStructure(DDataStructure.StringType(), []),
			age: DDataStructure.TypeStructure(DDataStructure.NumberType(), []),
		}, []);
		const invalidKind = structure.decode(DDataStructure.createCodecs({}), null as never);
		const invalidMissingProperty = structure.decode(DDataStructure.createCodecs({}), { name: "Jane" } as never);
		const invalidUnknownProperty = structure.decode(DDataStructure.createCodecs({}), {
			name: "Jane",
			age: 30,
			extra: true,
		} as never);
		const invalidProperty = structure.decode(
			DDataStructure.createCodecs({}),
			{
				name: 123,
				age: 30,
			} as never,
		);

		expect(
			DEither.unwrapByInformationOrThrow(invalidKind, "decode-error").issues[0],
		).toMatchObject({
			data: null,
			path: "",
		});
		expect(
			DEither.unwrapByInformationOrThrow(
				invalidMissingProperty,
				"decode-error",
			).issues[0],
		).toMatchObject({
			data: undefined,
			path: "age",
		});
		expect(
			DEither.unwrapByInformationOrThrow(
				invalidUnknownProperty,
				"decode-error",
			).issues[0],
		).toMatchObject({
			data: {
				name: "Jane",
				age: 30,
				extra: true,
			},
			path: "",
		});
		expect(
			DEither.unwrapByInformationOrThrow(
				structure.decode(DDataStructure.createCodecs({}), new Date() as never),
				"decode-error",
			).issues[0]?.path,
		).toBe("");
		expect(structure.decode(DDataStructure.createCodecs({}), {
			name: "Jane",
			age: 30,
			[Symbol("private")]: true,
		} as never)).not.toStrictEqual(DEither.right("decode-success", undefined));
		expect(
			DEither.unwrapByInformationOrThrow(
				invalidProperty,
				"decode-error",
			).issues,
		).toHaveLength(1);
		expect(
			DEither.unwrapByInformationOrThrow(
				invalidProperty,
				"decode-error",
			).issues[0],
		).toMatchObject({
			data: 123,
			path: "name",
		});
	});

	it("returns decode errors when decoded constraints fail", async() => {
		const constraintKind = DDataStructure.createKind("test-public-object-decode-error");

		interface FailingConstraint extends DCommon.Forward<
			& DDataStructure.Constraint<{ readonly name: string }>
			& DKind.Kind<typeof constraintKind>
		> {}

		const FailingConstraint = DDataStructure.createConstraint(
			constraintKind,
			({ init }) => () => init<FailingConstraint>(
				{},
				{
					executeCheck: () => DDataStructure.ErrorSymbol,
					isAsynchronous: () => false,
				},
			),
		);
		const failingConstraint = FailingConstraint();
		const structure = DDataStructure.ObjectStructure(
			{
				name: DDataStructure.TypeStructure(DDataStructure.StringType(), []),
			},
			[failingConstraint],
		);
		const failure = structure.decode(DDataStructure.createCodecs({}), { name: "Jane" });
		const asyncFailure = await structure.asyncDecode(DDataStructure.createCodecs({}), { name: "Jane" });

		expect(
			DEither.unwrapByInformationOrThrow(failure, "decode-error").issues[0]
				?.getSource(),
		).toBe(structure);
		expect(
			(DEither.unwrapByInformationOrThrow(
				failure,
				"decode-error",
			).issues[0] as DDataStructure.Issue | undefined)
				?.getSubSource?.(),
		).toBe(failingConstraint);
		expect(
			DEither.unwrapByInformationOrThrow(
				asyncFailure,
				"decode-error",
			).issues[0]?.getSource(),
		).toBe(structure);
		expect(
			(DEither.unwrapByInformationOrThrow(
				asyncFailure,
				"decode-error",
			).issues[0] as DDataStructure.Issue | undefined)?.getSubSource?.(),
		).toBe(failingConstraint);
	});

	it("returns async decode errors for asynchronous shaped decoders in synchronous APIs", async() => {
		const structure = DDataStructure.ObjectStructure({
			name: DDataStructure.TypeStructure(DDataStructure.StringType(), []),
		}, []);
		const codec = DDataStructure.createCodec(
			DDataStructure.TheString,
			DDataStructure.TypeStructure(DDataStructure.NumberType(), []).is,
			(data) => data.length,
			(data) => Promise.resolve(`name-${data}`),
		);

		expect(structure.decode(DDataStructure.createCodecs({ codec }), { name: 4 })).toStrictEqual(
			DEither.left("async-error", undefined),
		);
		expect(await structure.asyncDecode(DDataStructure.createCodecs({ codec }), { name: 4 })).toStrictEqual(
			DEither.right("decode-success", { name: "name-4" }),
		);
	});
});
