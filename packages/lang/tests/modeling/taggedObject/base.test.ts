import { DCommon, DDataStructure, DEither, type DKind, DModeling, type DString, pipe, type ExpectType } from "@scripts";

describe("TaggedObjectStructure", () => {
	it("creates a named tagged object structure from an existing interface", () => {
		interface UserCreated extends DModeling.ObjectTag<"user-created"> {
			readonly name: string & DString.MinCharacters<3>;
			readonly score: number;
		}

		const nameConstraint = DDataStructure.minCharacters(3);
		const name = DDataStructure.string([nameConstraint]);
		const score = DDataStructure.number();
		const structure = DModeling.TaggedObjectStructure<UserCreated>(
			"user-created",
			{
				name,
				score,
			},
		);

		type _CheckStructure = ExpectType<
			typeof structure,
			DModeling.TaggedObjectStructure<UserCreated>,
			"strict"
		>;
		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			UserCreated,
			"strict"
		>;

		expect(DModeling.taggedObjectStructureKind.has(structure)).toBe(true);
		expect(structure.name).toBe("user-created");
		expect(structure.isAsynchronous()).toBe(false);
		expect(structure.definition.inner.definition.shape.value).toEqual([
			{
				key: "name",
				value: name,
			},
			{
				key: "score",
				value: score,
			},
			{
				key: DModeling.objectTagKind.runTimeKey,
				value: expect.any(Object),
			},
		]);
	});

	it("requires the declared property constraints in an existing interface", () => {
		interface UserCreated extends DModeling.ObjectTag<"user-created"> {
			readonly name: string & DString.MinCharacters<3>;
		}

		DModeling.TaggedObjectStructure<UserCreated>(
			"user-created",
			{
				name: DDataStructure.string([DDataStructure.minCharacters(3)]),
			},
		);

		DModeling.TaggedObjectStructure<UserCreated>(
			"user-created",
			{
				// @ts-expect-error The structure does not provide the declared constraint.
				name: DDataStructure.string(),
			},
		);

		DModeling.TaggedObjectStructure<UserCreated>(
			"user-created",
			{
				// @ts-expect-error The structure provides a different constraint.
				name: DDataStructure.string([DDataStructure.minCharacters(2)]),
			},
		);
	});

	it("infers a tagged object type without a prior interface declaration", () => {
		const structure = DModeling.TaggedObjectStructure(
			"metric",
			{
				label: DDataStructure.string(),
				count: DDataStructure.number(),
			},
		);
		const value = DModeling.taggedObject<
			DDataStructure.StructureValue<typeof structure>
		>(
			"metric",
			{
				label: "jobs",
				count: 4,
			},
		);

		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			& DModeling.ObjectTag<"metric">
			& {
				readonly label: string;
				readonly count: number;
			},
			"strict"
		>;
		type _CheckValue = ExpectType<
			typeof value,
			& DModeling.ObjectTag<"metric">
			& {
				readonly label: string;
				readonly count: number;
			},
			"strict"
		>;

		expect(structure.check(value)).toStrictEqual(
			DEither.right("check-success", value),
		);
	});

	it("checks properties and the tag runtime key through its inner object structure", () => {
		const structure = DModeling.TaggedObjectStructure(
			"user-created",
			{
				name: DDataStructure.string([DDataStructure.minCharacters(3)]),
				score: DDataStructure.number(),
			},
		);
		const value = DModeling.taggedObject<
			DDataStructure.StructureValue<typeof structure>
		>(
			"user-created",
			{
				name: DCommon.infer("Jane"),
				score: 12,
			},
		);

		expect(structure.executeCheck(value)).toBe(DDataStructure.SuccessSymbol);
		expect(
			structure.executeCheck({
				name: "Jane",
				score: 12,
			}),
		).toBe(DDataStructure.ErrorSymbol);
		expect(
			structure.executeCheck({
				name: "Jane",
				score: 12,
				[DModeling.objectTagKind.runTimeKey]: "user-deleted",
			}),
		).toBe(DDataStructure.ErrorSymbol);
		expect(
			structure.executeCheck(
				DModeling.taggedObject(
					"user-created",
					{
						name: "Jo",
						score: 12,
					},
				),
			),
		).toBe(DDataStructure.ErrorSymbol);
	});

	it("returns check errors from properties and the tag runtime key", () => {
		const structure = DModeling.TaggedObjectStructure(
			"user-created",
			{
				name: DDataStructure.string([DDataStructure.minCharacters(3)]),
				score: DDataStructure.number(),
			},
		);

		expect(
			DEither.unwrapByInformationOrThrow(
				structure.check(
					DModeling.taggedObject(
						"user-created",
						{
							name: "Jo",
							score: 12,
						},
					),
				),
				"check-error",
			).issues[0],
		).toMatchObject({
			data: "Jo",
			path: "name",
		});
		expect(
			DEither.unwrapByInformationOrThrow(
				structure.check({
					name: "Jane",
					score: 12,
				}),
				"check-error",
			).issues[0],
		).toMatchObject({
			data: undefined,
			path: DModeling.objectTagKind.runTimeKey,
		});
		expect(
			DEither.unwrapByInformationOrThrow(
				structure.check(
					DModeling.taggedObject(
						"user-deleted",
						{
							name: "Jane",
							score: 12,
						},
					),
				),
				"check-error",
			).issues[0],
		).toMatchObject({
			data: "user-deleted",
			path: DModeling.objectTagKind.runTimeKey,
		});
	});

	it("narrows checked values to the tagged object type", () => {
		const structure = DModeling.TaggedObjectStructure(
			"metric",
			{
				label: DDataStructure.string(),
				count: DDataStructure.number(),
			},
		);
		const input: unknown = DModeling.taggedObject(
			"metric",
			{
				label: "jobs",
				count: 4,
			},
		);

		if (structure.is(input)) {
			type _CheckNarrowedInput = ExpectType<
				typeof input,
				& DModeling.ObjectTag<"metric">
				& {
					readonly label: string;
					readonly count: number;
				},
				"strict"
			>;
		}
	});

	it("encodes and decodes properties while preserving the tag runtime key", () => {
		const structure = DModeling.TaggedObjectStructure(
			"profile",
			{
				name: DDataStructure.string(),
				age: DDataStructure.number(),
			},
		);
		const stringCodec = DDataStructure.createCodec(
			DDataStructure.TheString,
			DDataStructure.number().is,
			(data) => data.length,
			(data) => `Jane-${data}`,
		);
		const numberCodec = DDataStructure.createCodec(
			DDataStructure.TheNumber,
			DDataStructure.string().is,
			(data) => `age-${data}`,
			(data) => Number(data.slice(4)),
		);
		const codecs = DDataStructure.createCodecs({
			stringCodec,
			numberCodec,
		});
		const value = DModeling.taggedObject<
			DDataStructure.StructureValue<typeof structure>
		>(
			"profile",
			{
				name: "Jane",
				age: 30,
			},
		);
		const encoded = structure.encode(codecs, value);
		const decoded = structure.decode(codecs, {
			name: 4,
			age: "age-30",
			[DModeling.objectTagKind.runTimeKey]: "profile",
		} as never);

		type _CheckEncoded = ExpectType<
			typeof encoded,
			| DEither.Right<
				"encode-success",
				DDataStructure.EncodedValue<
					DDataStructure.StructureValue<typeof structure>,
					typeof codecs
				>
			>
			| DEither.Left<"async-error", undefined>
			| DEither.Left<"encode-error", DDataStructure.Error>,
			"strict"
		>;
		type _CheckDecoded = ExpectType<
			typeof decoded,
			| DEither.Right<
				"decode-success",
				& DModeling.ObjectTag<"profile">
				& {
					readonly name: string;
					readonly age: number;
				}
			>
			| DEither.Left<"async-error", undefined>
			| DEither.Left<"decode-error", DDataStructure.Error>,
			"strict"
		>;

		expect(encoded).toStrictEqual(
			DEither.right("encode-success", {
				name: 4,
				age: "age-30",
				[DModeling.objectTagKind.runTimeKey]: "profile",
			}),
		);
		expect(decoded).toStrictEqual(
			DEither.right("decode-success", {
				name: "Jane-4",
				age: 30,
				[DModeling.objectTagKind.runTimeKey]: "profile",
			}),
		);
	});

	it("maps raw properties to a tagged object after checking them", () => {
		const structure = DModeling.TaggedObjectStructure(
			"user-created",
			{
				name: DModeling.NewTypeStructure(
					"user-name",
					DDataStructure.string(),
					[DDataStructure.minCharacters(3)],
				),
			},
		);
		const result = structure.map({
			name: "Jane",
		});

		type _CheckInput = ExpectType<
			Parameters<typeof structure.map>[0],
			{
				readonly name: string;
			},
			"strict"
		>;
		type _CheckResult = ExpectType<
			typeof result,
			| DEither.Right<
				"map-success",
				& DModeling.ObjectTag<"user-created">
				& {
					readonly name: string & DModeling.NewType<"user-name", DString.MinCharacters<3>>;
				}
			>
			| DEither.Left<"async-error", undefined>
			| DEither.Left<"map-error", DDataStructure.Error>,
			"strict"
		>;

		expect(result).toStrictEqual(
			DEither.right("map-success", structure.new({ name: "Jane" } as never)),
		);
		expect(DEither.isLeft(structure.map({ name: "Jo" }))).toBe(true);
	});

	it("encodes a typed tagged object in a promise without exposing encoding errors", async() => {
		const structure = DModeling.TaggedObjectStructure(
			"user-created",
			{
				name: DModeling.NewTypeStructure(
					"user-name",
					DDataStructure.string(),
					[DDataStructure.minCharacters(3)],
				),
			},
		);
		const codec = DDataStructure.createCodec(
			DDataStructure.TheString,
			DDataStructure.number().is,
			(data) => data.length,
			(data) => `Jane-${data}`,
		);
		const codecs = DDataStructure.createCodecs({ codec });
		const data = DEither.unwrapByInformationOrThrow(
			structure.map({ name: "Jane" }),
			"map-success",
		);
		const result = structure.encodeTaggedObject(codecs, data);

		type _CheckResult = ExpectType<
			typeof result,
			Promise<{
				readonly name: number;
			}>,
			"strict"
		>;

		expect(result).toBeInstanceOf(Promise);
		await expect(result).resolves.toStrictEqual({
			name: 4,
			[DModeling.objectTagKind.runTimeKey]: "user-created",
		});
	});

	it("asynchronously encodes a typed tagged object when the codec is asynchronous", async() => {
		const structure = DModeling.TaggedObjectStructure(
			"user-created",
			{
				name: DDataStructure.string(),
			},
		);
		const codec = DDataStructure.createCodec(
			DDataStructure.TheString,
			DDataStructure.number().is,
			(data) => Promise.resolve(data.length),
			(data) => `Jane-${data}`,
		);
		const codecs = DDataStructure.createCodecs({ codec });
		const data = structure.new({ name: "Jane" });
		const result = structure.encodeTaggedObject(codecs, data);

		expect(result).toBeInstanceOf(Promise);
		await expect(result).resolves.toStrictEqual({
			name: 4,
			[DModeling.objectTagKind.runTimeKey]: "user-created",
		});
	});

	it("rejects with an EncodeTaggedObjectError when a typed tagged object is bypassed", async() => {
		const structure = DModeling.TaggedObjectStructure(
			"user-created",
			{
				name: DDataStructure.string([DDataStructure.minCharacters(3)]),
			},
		);
		const codecs = DDataStructure.createCodecs({});
		const data = structure.new({ name: "Jo" } as never);
		await expect(
			structure.encodeTaggedObject(codecs, data),
		).rejects.toMatchObject({
			message: "An error occurred while encoding a TaggedObject. This can only happen if you are bypassing the type system.",
			error: {
				issues: [
					expect.objectContaining({
						data: "Jo",
						path: "name",
					}),
				],
			},
		});
		await expect(
			structure.encodeTaggedObject(codecs, data),
		).rejects.toBeInstanceOf(DModeling.EncodeTaggedObjectError);
	});

	it("maps raw properties to a tagged object in pipe", () => {
		const structure = DModeling.TaggedObjectStructure(
			"user-created",
			{
				name: DModeling.NewTypeStructure(
					"user-name",
					DDataStructure.string(),
					[DDataStructure.minCharacters(3)],
				),
			},
		);
		const result = pipe(
			{
				name: "Jane",
			},
			structure.map,
		);

		type _CheckResult = ExpectType<
			typeof result,
			| DEither.Right<
				"map-success",
				& DModeling.ObjectTag<"user-created">
				& {
					readonly name: string & DModeling.NewType<"user-name", DString.MinCharacters<3>>;
				}
			>
			| DEither.Left<"async-error", undefined>
			| DEither.Left<"map-error", DDataStructure.Error>,
			"strict"
		>;

		expect(result).toStrictEqual(
			DEither.right("map-success", structure.new({ name: "Jane" } as never)),
		);
	});

	it("recursively maps nested new type properties", () => {
		const structure = DModeling.TaggedObjectStructure(
			"user-created",
			{
				profile: DDataStructure.object({
					aliases: DDataStructure.array(
						DModeling.NewTypeStructure(
							"user-alias",
							DDataStructure.string(),
							[DDataStructure.minCharacters(3)],
						),
					),
				}),
			},
		);
		const result = structure.map({
			profile: {
				aliases: ["Jane", "Jenny"],
			},
		});

		type _CheckInput = ExpectType<
			Parameters<typeof structure.map>[0],
			{
				readonly profile: {
					readonly aliases: readonly string[];
				};
			},
			"strict"
		>;

		expect(result).toStrictEqual(
			DEither.right(
				"map-success",
				structure.new({
					profile: {
						aliases: ["Jane", "Jenny"],
					},
				} as never),
			),
		);
		expect(DEither.isLeft(structure.map({
			profile: {
				aliases: ["Jo"],
			},
		}))).toBe(true);
	});

	it("maps encoded properties to a tagged object with codecs", () => {
		const structure = DModeling.TaggedObjectStructure(
			"user-created",
			{
				name: DModeling.NewTypeStructure(
					"user-name",
					DDataStructure.string(),
					[DDataStructure.minCharacters(3)],
				),
			},
		);
		const codec = DDataStructure.createCodec(
			DDataStructure.TheString,
			DDataStructure.number().is,
			(data) => data.length,
			(data) => `Jane-${data}`,
		);
		const codecs = DDataStructure.createCodecs({ codec });
		const result = structure.decodeMap(codecs, {
			name: 4,
		});

		type _CheckInput = ExpectType<
			Parameters<typeof structure.decodeMap<typeof codecs>>[1],
			{
				readonly name: number;
			},
			"strict"
		>;
		type _CheckResult = ExpectType<
			typeof result,
			| DEither.Right<
				"map-success",
				& DModeling.ObjectTag<"user-created">
				& {
					readonly name: string & DModeling.NewType<"user-name", DString.MinCharacters<3>>;
				}
			>
			| DEither.Left<"async-error", undefined>
			| DEither.Left<"map-error", DDataStructure.Error>,
			"strict"
		>;

		// @ts-expect-error codec mapping expects the encoded number property, not the raw string property.
		structure.decodeMap(codecs, { name: "Jane" });
		expect(result).toStrictEqual(
			DEither.right("map-success", structure.new({ name: "Jane-4" } as never)),
		);
	});

	it("maps encoded properties to a tagged object with codecs in pipe", () => {
		const structure = DModeling.TaggedObjectStructure(
			"user-created",
			{
				name: DModeling.NewTypeStructure(
					"user-name",
					DDataStructure.string(),
					[DDataStructure.minCharacters(3)],
				),
			},
		);
		const codec = DDataStructure.createCodec(
			DDataStructure.TheString,
			DDataStructure.number().is,
			(data) => data.length,
			(data) => `Jane-${data}`,
		);
		const codecs = DDataStructure.createCodecs({ codec });
		const result = pipe(
			{
				name: 4,
			},
			structure.decodeMap(codecs),
		);

		type _CheckResult = ExpectType<
			typeof result,
			| DEither.Right<
				"map-success",
				& DModeling.ObjectTag<"user-created">
				& {
					readonly name: string & DModeling.NewType<"user-name", DString.MinCharacters<3>>;
				}
			>
			| DEither.Left<"async-error", undefined>
			| DEither.Left<"map-error", DDataStructure.Error>,
			"strict"
		>;

		expect(result).toStrictEqual(
			DEither.right("map-success", structure.new({ name: "Jane-4" } as never)),
		);
	});

	it("returns an async error when synchronously mapping an asynchronous tagged object property", () => {
		const asyncConstraintKind = DDataStructure.createKind("sync-tagged-object-map-async-constraint");
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
		const structure = DModeling.TaggedObjectStructure(
			"user-created",
			{
				name: DDataStructure.string([AsyncConstraint()]),
			},
		);

		expect(structure.map({ name: "Jane" })).toStrictEqual(
			DEither.left("async-error", undefined),
		);
	});

	it("returns an async error when synchronously decoding with an asynchronous codec", () => {
		const structure = DModeling.TaggedObjectStructure(
			"user-created",
			{
				name: DDataStructure.string(),
			},
		);
		const codec = DDataStructure.createCodec(
			DDataStructure.TheString,
			DDataStructure.number().is,
			(data) => data.length,
			(data) => Promise.resolve(`Jane-${data}`),
		);
		const codecs = DDataStructure.createCodecs({ string: codec });

		expect(structure.decodeMap(codecs, { name: 4 })).toStrictEqual(
			DEither.left("async-error", undefined),
		);
	});

	it("returns map errors when runtime mapping receives a non object input", async() => {
		const structure = DModeling.TaggedObjectStructure(
			"user-created",
			{
				name: DDataStructure.string(),
			},
		);
		const codecs = DDataStructure.createCodecs({});

		expect(DEither.isLeft(structure.map(null as never))).toBe(true);
		expect(DEither.isLeft(structure.decodeMap(codecs, null as never))).toBe(true);
		expect(DEither.isLeft(await structure.asyncDecodeMap(codecs, null as never))).toBe(true);
		expect(DEither.isLeft(await structure.asyncMap(null as never))).toBe(true);
	});

	it("asynchronously maps raw properties to a tagged object", async() => {
		const structure = DModeling.TaggedObjectStructure(
			"user-created",
			{
				name: DModeling.NewTypeStructure(
					"user-name",
					DDataStructure.string(),
					[DDataStructure.minCharacters(3)],
				),
			},
		);
		const result = structure.asyncMap({
			name: "Jane",
		});

		type _CheckInput = ExpectType<
			Parameters<typeof structure.asyncMap>[0],
			{
				readonly name: string;
			},
			"strict"
		>;
		type _CheckResult = ExpectType<
			typeof result,
			Promise<
				| DEither.Right<
					"map-success",
					& DModeling.ObjectTag<"user-created">
					& {
						readonly name: string & DModeling.NewType<"user-name", DString.MinCharacters<3>>;
					}
				>
				| DEither.Left<"map-error", DDataStructure.Error>
			>,
			"strict"
		>;

		await expect(result).resolves.toStrictEqual(
			DEither.right("map-success", structure.new({ name: "Jane" } as never)),
		);
		expect(
			DEither.unwrapByInformationOrThrow(
				await structure.asyncMap({ name: "Jo" }),
				"map-error",
			).issues[0],
		).toMatchObject({
			data: "Jo",
			path: "name",
		});
	});

	it("asynchronously maps encoded properties to a tagged object with codecs in pipe", async() => {
		const structure = DModeling.TaggedObjectStructure(
			"user-created",
			{
				name: DModeling.NewTypeStructure(
					"user-name",
					DDataStructure.string(),
					[DDataStructure.minCharacters(3)],
				),
			},
		);
		const codec = DDataStructure.createCodec(
			DDataStructure.TheString,
			DDataStructure.number().is,
			(data) => Promise.resolve(data.length),
			(data) => Promise.resolve(`Jane-${data}`),
		);
		const codecs = DDataStructure.createCodecs({ codec });
		const result = pipe(
			{
				name: 4,
			},
			structure.asyncDecodeMap(codecs),
		);

		type _CheckResult = ExpectType<
			typeof result,
			Promise<
				| DEither.Right<
					"map-success",
					& DModeling.ObjectTag<"user-created">
					& {
						readonly name: string & DModeling.NewType<"user-name", DString.MinCharacters<3>>;
					}
				>
				| DEither.Left<"map-error", DDataStructure.Error>
			>,
			"strict"
		>;

		await expect(result).resolves.toStrictEqual(
			DEither.right("map-success", structure.new({ name: "Jane-4" } as never)),
		);
	});

	it("returns a map error when asynchronously decoding an invalid tagged object", async() => {
		const structure = DModeling.TaggedObjectStructure(
			"user-created",
			{
				name: DModeling.NewTypeStructure(
					"user-name",
					DDataStructure.string(),
					[DDataStructure.minCharacters(3)],
				),
			},
		);
		const codec = DDataStructure.createCodec(
			DDataStructure.TheString,
			DDataStructure.number().is,
			(data) => data.length,
			() => Promise.resolve("Jo"),
		);
		const codecs = DDataStructure.createCodecs({ string: codec });
		const result = await structure.asyncDecodeMap(codecs, { name: 2 });

		expect(
			DEither.unwrapByInformationOrThrow(
				result,
				"map-error",
			).issues[0],
		).toMatchObject({
			data: "Jo",
			path: "name",
		});
	});

	it("updates a tagged object without replacing properties with undefined", () => {
		const structure = DModeling.TaggedObjectStructure(
			"user-created",
			{
				name: DDataStructure.string(),
				age: DDataStructure.number(),
			},
		);
		const input = structure.new({
			name: "Jane",
			age: 30,
		}) as (
			& DModeling.ObjectTag<"user-created">
			& {
				readonly name: "Jane";
				readonly age: 30;
			}
		);
		const result = structure.update(
			input,
			{
				name: "John",
				age: undefined,
			},
		);

		type _CheckResult = ExpectType<
			typeof result,
			& DModeling.ObjectTag<"user-created">
			& {
				readonly name: "John";
				readonly age: 30;
			},
			"strict"
		>;

		expect(result).toStrictEqual(structure.new({
			name: "John",
			age: 30,
		}));
		expect(result).not.toBe(input);
		expect(input).toStrictEqual(structure.new({
			name: "Jane",
			age: 30,
		}));
	});

	it("updates a tagged object in pipe", () => {
		const structure = DModeling.TaggedObjectStructure(
			"user-created",
			{
				name: DDataStructure.string(),
				age: DDataStructure.number(),
			},
		);
		const input = structure.new({
			name: "Jane",
			age: 30,
		}) as (
			& DModeling.ObjectTag<"user-created">
			& {
				readonly name: "Jane";
				readonly age: 30;
			}
		);
		const result = pipe(
			input,
			structure.update({ age: 31 }),
		);

		type _CheckResult = ExpectType<
			typeof result,
			& DModeling.ObjectTag<"user-created">
			& {
				readonly name: "Jane";
				readonly age: 31;
			},
			"strict"
		>;

		expect(result).toStrictEqual(structure.new({
			name: "Jane",
			age: 31,
		}));
	});

	it("supports recursive tagged object structures", () => {
		interface File extends DModeling.ObjectTag<"file"> {
			readonly [key: string]: unknown;
			readonly name: string;
			readonly size: number;
		}

		interface Folder extends DModeling.ObjectTag<"folder"> {
			readonly [key: string]: unknown;
			readonly name: string;
			readonly children: readonly Node[];
		}

		type Node = File | Folder;

		const FileStructure = DModeling.TaggedObjectStructure<File>(
			"file",
			{
				name: DDataStructure.string(),
				size: DDataStructure.number(),
			},
		);
		const FolderStructure: DModeling.TaggedObjectStructure<Folder> = DModeling.TaggedObjectStructure<Folder>(
			"folder",
			{
				name: DDataStructure.string(),
				children: DDataStructure.array(
					DDataStructure.lazy(() => NodeStructure),
				),
			},
		);
		const NodeStructure: DDataStructure.Structure<Node> = DDataStructure.union([
			FolderStructure,
			FileStructure,
		]).contract();
		const input = DModeling.taggedObject<Folder>(
			"folder",
			{
				name: "root",
				children: [
					DModeling.taggedObject<File>(
						"file",
						{
							name: "readme",
							size: 42,
						},
					),
					DModeling.taggedObject<Folder>(
						"folder",
						{
							name: "docs",
							children: [],
						},
					),
				],
			},
		);

		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof NodeStructure>,
			Node,
			"strict"
		>;

		expect(NodeStructure.check(input)).toStrictEqual(
			DEither.right("check-success", input),
		);
		expect(NodeStructure.is(input)).toBe(true);
		expect(
			DEither.unwrapByInformationOrThrow(
				NodeStructure.check(
					DModeling.taggedObject<Folder>(
						"folder",
						{
							name: "root",
							children: [
								DModeling.taggedObject(
									"file",
									{
										name: "readme",
										size: "big" as never,
									},
								),
							],
						},
					),
				),
				"check-error",
			).issues,
		).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					data: "big",
				}),
			]),
		);
	});
});
