import { DDataStructure, type DCommon, DEither, type DKind, DModeling, type DString, pipe, type ExpectType } from "@scripts";

describe("EntityStructure", () => {
	it("creates a named entity structure from new type properties", () => {
		const name = DModeling.NewTypeStructure(
			"user-name",
			DDataStructure.string(),
			[DDataStructure.minCharacters(3)],
		);
		const age = DModeling.NewTypeStructure(
			"user-age",
			DDataStructure.number(),
			[],
		);
		const structure = DModeling.EntityStructure(
			"user",
			() => ({
				name,
				age,
			}),
		);

		type _CheckStructure = ExpectType<
			typeof structure,
			DModeling.EntityStructure<
				"user",
				{
					readonly name: string & DModeling.NewType<"user-name", DString.MinCharacters<3>>;
					readonly age: number & DModeling.NewType<"user-age">;
				}
			>,
			"strict"
		>;
		type _CheckStructureValue = ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			& DModeling.Entity<"user">
			& {
				readonly name: string & DModeling.NewType<"user-name", DString.MinCharacters<3>>;
				readonly age: number & DModeling.NewType<"user-age">;
			},
			"strict"
		>;

		expect(DModeling.entityStructureKind.has(structure)).toBe(true);
		expect(structure.name).toBe("user");
		expect(structure.definition.inner.value.definition.shape.value).toEqual([
			{
				key: "name",
				value: name,
			},
			{
				key: "age",
				value: age,
			},
			{
				key: DModeling.entityKind.runTimeKey,
				value: expect.any(Object),
			},
		]);
	});

	it("creates an entity value with its runtime kind", () => {
		const name = DModeling.NewTypeStructure(
			"user-name",
			DDataStructure.string(),
			[DDataStructure.minCharacters(3)],
		);
		const structure = DModeling.EntityStructure(
			"user",
			() => ({
				name,
			}),
		);

		const entity = structure.new({
			name: DEither.unwrapByInformationOrThrow(
				name.map("Jane"),
				"map-success",
			),
		});

		expect(DModeling.entityKind.has(entity)).toBe(true);
		expect(DModeling.entityKind.getValue(entity)).toBe("user");
		expect(entity).toStrictEqual({
			name: "Jane",
			[DModeling.entityKind.runTimeKey]: "user",
		});
	});

	it("checks properties and the entity runtime kind through its inner data structure", () => {
		const nameConstraintExecuteCheck = vi.fn(
			(data: string) => (
				data.length >= 3
					? DDataStructure.SuccessSymbol
					: DDataStructure.ErrorSymbol
			),
		);
		const nameConstraint = {
			...DDataStructure.minCharacters(3),
			executeCheck: nameConstraintExecuteCheck,
		};
		const name = DModeling.NewTypeStructure(
			"user-name",
			DDataStructure.string(),
			[nameConstraint],
		);
		const structure = DModeling.EntityStructure(
			"user",
			() => ({
				name,
			}),
		);
		const entity = structure.new({
			name: DEither.unwrapByInformationOrThrow(
				name.map("Jane"),
				"map-success",
			),
		});

		nameConstraintExecuteCheck.mockClear();
		expect(structure.executeCheck(entity)).toBe(DDataStructure.SuccessSymbol);
		expect(nameConstraintExecuteCheck).toHaveBeenCalledWith(
			"Jane",
		);

		nameConstraintExecuteCheck.mockClear();
		expect(structure.executeCheck({ name: "Jane" })).toBe(DDataStructure.ErrorSymbol);
		expect(nameConstraintExecuteCheck).toHaveBeenCalledOnce();

		nameConstraintExecuteCheck.mockClear();
		expect(structure.executeCheck(structure.new({ name: "Jo" } as never))).toBe(DDataStructure.ErrorSymbol);
		expect(nameConstraintExecuteCheck).toHaveBeenCalledOnce();
	});

	it("returns check errors from the inner entity shape", () => {
		const structure = DModeling.EntityStructure(
			"user",
			() => ({
				name: DModeling.NewTypeStructure(
					"user-name",
					DDataStructure.string(),
					[DDataStructure.minCharacters(3)],
				),
			}),
		);

		expect(structure.check(structure.new({ name: "Jane" } as never))).toStrictEqual(
			DEither.right("check-success", structure.new({ name: "Jane" } as never)),
		);
		expect(
			DEither.unwrapByInformationOrThrow(
				structure.check(structure.new({ name: "Jo" } as never)),
				"check-error",
			).issues[0],
		).toMatchObject({
			data: "Jo",
			path: "name",
		});
		expect(
			DEither.unwrapByInformationOrThrow(
				structure.check({ name: "Jane" }),
				"check-error",
			).issues[0],
		).toMatchObject({
			data: undefined,
			path: DModeling.entityKind.runTimeKey,
		});
	});

	it("narrows checked values to the unique entity type", () => {
		const structure = DModeling.EntityStructure(
			"user",
			() => ({
				name: DModeling.NewTypeStructure(
					"user-name",
					DDataStructure.string(),
					[DDataStructure.minCharacters(3)],
				),
			}),
		);
		const input: unknown = structure.new({
			name: "Jane",
		} as never);

		if (structure.is(input)) {
			type _CheckNarrowedInput = ExpectType<
				typeof input,
				& DModeling.Entity<"user">
				& {
					readonly name: string & DModeling.NewType<"user-name", DString.MinCharacters<3>>;
				},
				"strict"
			>;
		}
	});

	it("encodes and decodes entity properties with data structure codecs", () => {
		const structure = DModeling.EntityStructure(
			"user",
			() => ({
				name: DModeling.NewTypeStructure(
					"user-name",
					DDataStructure.string(),
					[DDataStructure.minCharacters(3)],
				),
				age: DModeling.NewTypeStructure(
					"user-age",
					DDataStructure.number(),
					[],
				),
			}),
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
		const entity = structure.new({
			name: "Jane",
			age: 30,
		} as never);

		expect(structure.encode(codecs, entity)).toStrictEqual(
			DEither.right("encode-success", {
				name: 4,
				age: "age-30",
				[DModeling.entityKind.runTimeKey]: "user",
			}),
		);
		expect(structure.decode(codecs, {
			name: 4,
			age: "age-30",
			[DModeling.entityKind.runTimeKey]: "user",
		} as never)).toStrictEqual(
			DEither.right("decode-success", {
				name: "Jane-4",
				age: 30,
				[DModeling.entityKind.runTimeKey]: "user",
			}),
		);
	});

	it("maps a raw property object to an entity after checking it", () => {
		const structure = DModeling.EntityStructure(
			"user",
			() => ({
				name: DModeling.NewTypeStructure(
					"user-name",
					DDataStructure.string(),
					[DDataStructure.minCharacters(3)],
				),
			}),
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
				& DModeling.Entity<"user">
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

	it("encodes a typed entity in a promise without exposing encoding errors", async() => {
		const structure = DModeling.EntityStructure(
			"user",
			() => ({
				name: DModeling.NewTypeStructure(
					"user-name",
					DDataStructure.string(),
					[DDataStructure.minCharacters(3)],
				),
			}),
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
		const result = structure.encodeEntity(codecs, data);

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
			[DModeling.entityKind.runTimeKey]: "user",
		});
	});

	it("asynchronously encodes a typed entity when the codec is asynchronous", async() => {
		const structure = DModeling.EntityStructure(
			"user",
			() => ({
				name: DDataStructure.string(),
			}),
		);
		const codec = DDataStructure.createCodec(
			DDataStructure.TheString,
			DDataStructure.number().is,
			(data) => Promise.resolve(data.length),
			(data) => `Jane-${data}`,
		);
		const codecs = DDataStructure.createCodecs({ codec });
		const data = structure.new({ name: "Jane" });
		const result = structure.encodeEntity(codecs, data);

		expect(result).toBeInstanceOf(Promise);
		await expect(result).resolves.toStrictEqual({
			name: 4,
			[DModeling.entityKind.runTimeKey]: "user",
		});
	});

	it("rejects with an EncodeEntityError when a typed entity is bypassed", async() => {
		const structure = DModeling.EntityStructure(
			"user",
			() => ({
				name: DDataStructure.string([DDataStructure.minCharacters(3)]),
			}),
		);
		const codecs = DDataStructure.createCodecs({});
		const data = structure.new({ name: "Jo" } as never);
		await expect(
			structure.encodeEntity(codecs, data),
		).rejects.toMatchObject({
			message: "An error occurred while encoding an Entity. This can only happen if you are bypassing the type system.",
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
			structure.encodeEntity(codecs, data),
		).rejects.toBeInstanceOf(DModeling.EncodeEntityError);
	});

	it("maps a raw property object to an entity in pipe", () => {
		const structure = DModeling.EntityStructure(
			"user",
			() => ({
				name: DModeling.NewTypeStructure(
					"user-name",
					DDataStructure.string(),
					[DDataStructure.minCharacters(3)],
				),
			}),
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
				& DModeling.Entity<"user">
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

	it("maps an encoded property object to an entity with codecs", () => {
		const structure = DModeling.EntityStructure(
			"user",
			() => ({
				name: DModeling.NewTypeStructure(
					"user-name",
					DDataStructure.string(),
					[DDataStructure.minCharacters(3)],
				),
			}),
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
				& DModeling.Entity<"user">
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

	it("maps an encoded property object to an entity with codecs in pipe", () => {
		const structure = DModeling.EntityStructure(
			"user",
			() => ({
				name: DModeling.NewTypeStructure(
					"user-name",
					DDataStructure.string(),
					[DDataStructure.minCharacters(3)],
				),
			}),
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
				& DModeling.Entity<"user">
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

	it("returns an async error when synchronously mapping an asynchronous entity property", () => {
		const asyncConstraintKind = DDataStructure.createKind("sync-entity-map-async-constraint");
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
		const structure = DModeling.EntityStructure(
			"user",
			() => ({
				name: DModeling.NewTypeStructure(
					"user-name",
					DDataStructure.string([AsyncConstraint()]),
					[],
				),
			}),
		);

		expect(structure.map({ name: "Jane" })).toStrictEqual(
			DEither.left("async-error", undefined),
		);
	});

	it("returns an async error when synchronously decoding an entity with an asynchronous codec", () => {
		const structure = DModeling.EntityStructure(
			"user",
			() => ({
				name: DModeling.NewTypeStructure(
					"user-name",
					DDataStructure.string(),
					[DDataStructure.minCharacters(3)],
				),
			}),
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
		const structure = DModeling.EntityStructure(
			"user",
			() => ({
				name: DModeling.NewTypeStructure(
					"user-name",
					DDataStructure.string(),
					[DDataStructure.minCharacters(3)],
				),
			}),
		);
		const codecs = DDataStructure.createCodecs({});

		expect(DEither.isLeft(structure.map(null as never))).toBe(true);
		expect(DEither.isLeft(structure.decodeMap(codecs, null as never))).toBe(true);
		expect(DEither.isLeft(await structure.asyncDecodeMap(codecs, null as never))).toBe(true);
		expect(DEither.isLeft(await structure.asyncMap(null as never))).toBe(true);
	});

	it("asynchronously maps a raw property object to an entity", async() => {
		const structure = DModeling.EntityStructure(
			"user",
			() => ({
				name: DModeling.NewTypeStructure(
					"user-name",
					DDataStructure.string(),
					[DDataStructure.minCharacters(3)],
				),
			}),
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
					& DModeling.Entity<"user">
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

	it("asynchronously maps an encoded property object to an entity with codecs in pipe", async() => {
		const structure = DModeling.EntityStructure(
			"user",
			() => ({
				name: DModeling.NewTypeStructure(
					"user-name",
					DDataStructure.string(),
					[DDataStructure.minCharacters(3)],
				),
			}),
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
					& DModeling.Entity<"user">
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

	it("returns a map error when asynchronously decoding an invalid entity", async() => {
		const structure = DModeling.EntityStructure(
			"user",
			() => ({
				name: DModeling.NewTypeStructure(
					"user-name",
					DDataStructure.string(),
					[DDataStructure.minCharacters(3)],
				),
			}),
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

	it("updates an entity without replacing properties with undefined", () => {
		const structure = DModeling.EntityStructure(
			"user",
			() => ({
				name: DDataStructure.string(),
				age: DDataStructure.number(),
			}),
		);
		const input = structure.new({
			name: "Jane",
			age: 30,
		} as const);
		const result = structure.update(
			input,
			{
				name: "John",
				age: undefined,
			},
		);

		type _CheckResult = ExpectType<
			typeof result,
			& DModeling.Entity<"user">
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

	it("updates an entity in pipe", () => {
		const structure = DModeling.EntityStructure(
			"user",
			() => ({
				name: DDataStructure.string(),
				age: DDataStructure.number(),
			}),
		);
		const input = structure.new({
			name: "Jane",
			age: 30,
		} as const);
		const result = pipe(
			input,
			structure.update({ age: 31 }),
		);

		type _CheckResult = ExpectType<
			typeof result,
			& DModeling.Entity<"user">
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

	it("is asynchronous when one of its properties is asynchronous", () => {
		const asyncConstraintKind = DDataStructure.createKind("async-entity-property-constraint");
		const asyncConstraintIsAsynchronous = vi.fn(() => true);
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
					isAsynchronous: asyncConstraintIsAsynchronous,
				},
			),
		);
		const structure = DModeling.EntityStructure(
			"user",
			() => ({
				name: DModeling.NewTypeStructure(
					"user-name",
					DDataStructure.string([AsyncConstraint()]),
					[],
				),
			}),
		);

		expect(structure.isAsynchronous()).toBe(true);
		expect(asyncConstraintIsAsynchronous).toHaveBeenCalledOnce();
	});
});
