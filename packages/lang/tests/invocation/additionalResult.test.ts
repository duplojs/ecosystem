import type * as DCommon from "@scripts/common";
import * as DEither from "@scripts/either";
import * as DGenerator from "@scripts/generator";
import * as DInvocation from "@scripts/invocation";

describe("withAdditionalResult", () => {
	it("accepts both synchronous results and keeps the implementation unchanged", () => {
		type Method = DInvocation.AddAdditionalResultOnFunction<(id: string, fallback: number) => string, number>;
		const implementation = vi.fn((id: string, fallback: number) => id === "" ? fallback : id);
		const method: Method = DInvocation.withAdditionalResult(implementation);
		const success = method("book", 42);
		const additionalResult = method("", 42);

		expect(method).toBe(implementation);
		expect(success).toBe("book");
		expect(additionalResult).toBe(42);
		expect(implementation).toHaveBeenNthCalledWith(1, "book", 42);
		expect(implementation).toHaveBeenNthCalledWith(2, "", 42);

		type _CheckSuccess = DCommon.ExpectType<typeof success, string | number, "strict">;
		type _CheckAdditionalResult = DCommon.ExpectType<typeof additionalResult, string | number, "strict">;
		type _CheckParameters = DCommon.ExpectType<
			Parameters<typeof method>,
			[id: string, fallback: number] | [],
			"strict"
		>;
	});

	it("accepts a promise containing either asynchronous result", async() => {
		type Method = DInvocation.AddAdditionalResultOnFunction<(id: string) => Promise<string>, DEither.Left<"unavailable">>;
		const method: Method = DInvocation.withAdditionalResult((id) => Promise.resolve(id === ""
			? DEither.left("unavailable")
			: id));
		const success = await method("book");
		const additionalResult = await method("");

		expect(success).toBe("book");
		expect(additionalResult).toStrictEqual(DEither.left("unavailable"));

		type _CheckSuccess = DCommon.ExpectType<typeof success, string | DEither.Left<"unavailable">, "strict">;
		type _CheckAdditionalResult = DCommon.ExpectType<
			typeof additionalResult,
			string | DEither.Left<"unavailable">,
			"strict"
		>;
	});

	it("accepts a stream or an acquisition refusal", async() => {
		type Method = DInvocation.AddAdditionalResultOnFunction<
			(id: string) => AsyncGenerator<string>,
			DEither.Left<"unavailable">
		>;
		const method: Method = DInvocation.withAdditionalResult((id) => id === ""
			? Promise.resolve(DEither.left("unavailable"))
			: DGenerator.asyncLoop(({ exit }) => exit(id)));
		const stream = await method("book");
		const additionalResult = await method("");

		expect(DEither.isLeft(stream)).toBe(false);
		if (!DEither.isLeft(stream)) {
			expect(await stream.next()).toStrictEqual({
				value: "book",
				done: false,
			});
		}
		expect(additionalResult).toStrictEqual(DEither.left("unavailable"));

		type _CheckStream = DCommon.ExpectType<typeof stream, AsyncGenerator<string> | DEither.Left<"unavailable">, "strict">;
	});

	it("keeps generic call results while explicitly rebuilding the implementation", async() => {
		interface Entity {
			id: string;
		}
		interface Repository {
			save<GenericEntity extends Entity>(entity: GenericEntity): Promise<GenericEntity>;
			find(id: string): string;
		}
		type Port = DInvocation.AddAdditionalResultOnMethods<Repository, { save: DEither.Left<"unavailable"> }>;
		const Port = DInvocation.createPort<Port>();
		const repository = Port.createImplementation({
			save: DInvocation.withAdditionalResult((entity) => {
				type _CheckInput = DCommon.ExpectType<typeof entity, Entity, "strict">;

				return Promise.resolve(entity.id === ""
					? DEither.left("unavailable")
					: entity);
			}),
			find: (id) => id,
		});
		const entity = {
			id: "book",
			title: "Title",
		};
		const saved = await repository.save(entity);
		const additionalResult = await repository.save({ id: "" });

		expect(saved).toBe(entity);
		expect(additionalResult).toStrictEqual(DEither.left("unavailable"));
		expect(repository.find("book")).toBe("book");

		type _CheckSaved = DCommon.ExpectType<typeof saved, typeof entity | DEither.Left<"unavailable">, "strict">;
		type _CheckUnchangedMethod = DCommon.ExpectType<typeof repository.find, Repository["find"], "strict">;
	});

	it("preserves optional parameters in the reconstructed implementation", () => {
		type Method = DInvocation.AddAdditionalResultOnFunction<(id?: string) => string, number>;
		const method: Method = DInvocation.withAdditionalResult((id) => {
			type _CheckInput = DCommon.ExpectType<typeof id, string | undefined, "strict">;

			return id === undefined ? 42 : id;
		});

		expect(method()).toBe(42);
		expect(method("book")).toBe("book");
	});

	it("supports methods without parameters and rejects incompatible implementations", () => {
		interface Repository {
			find(id: string): string;
		}
		type Method = DInvocation.AddAdditionalResultOnFunction<() => string, number>;
		const method: Method = DInvocation.withAdditionalResult(() => 42);

		expect(method()).toBe(42);

		// @ts-expect-error A boolean is not a declared result.
		DInvocation.withAdditionalResult<Method>(() => true);
		// @ts-expect-error Additional results can only target existing methods.
		type _InvalidMethod = DInvocation.AddAdditionalResultOnMethods<Repository, { missing: number }>;
	});
});
