import { createMainIndex } from "@plugin-codeGenerator";
import * as DCommon from "@duplojs/lang/common";
import * as DArray from "@duplojs/lang/array";
import { TypescriptNativeAPI } from "@duplojs/tools";

describe("createMainIndex", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it.each([
		{
			names: [],
			expected: "",
		},
		{
			names: ["models"],
			expected: "export * as Models from \"./models.ts\";",
		},
		{
			names: ["userModels", "DTO", "contracts", "alpha"],
			expected: "export * as UserModels from \"./userModels.ts\";\nexport * as DTO from \"./DTO.ts\";\nexport * as Contracts from \"./contracts.ts\";\nexport * as Alpha from \"./alpha.ts\";",
		},
	] as const)("generates namespace exports for $names", async({ names, expected }) => {
		const input: readonly Parameters<typeof createMainIndex>[0][number][] = DArray.map(
			names,
			(name) => DCommon.cast(name),
		);
		const original = DArray.from(input);
		const close = vi.spyOn(TypescriptNativeAPI.API.prototype, "close");
		const resultPromise = createMainIndex(input);

		type _CheckPromise = DCommon.ExpectType<
			typeof resultPromise,
			Promise<string>,
			"strict"
		>;
		const result = await resultPromise;

		expect(result).toBe(expected);
		expect(input).toStrictEqual(original);
		expect(close).toHaveBeenCalledOnce();
	});
});
