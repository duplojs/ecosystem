import * as DCommon from "@scripts/common";

describe("print", () => {
	it("logs with info by default and returns the input unchanged", () => {
		const info = vi.spyOn(console, "info").mockImplementation(() => undefined);
		const input = { value: "test" } as const;

		try {
			const result = DCommon.print(input);

			type _CheckResult = DCommon.ExpectType<
				typeof result,
				typeof input,
				"strict"
			>;

			expect(result).toBe(input);
			expect(info).toHaveBeenCalledWith(input);
		} finally {
			info.mockRestore();
		}
	});

	it.each(["info", "warn", "error"] as const)("uses console.%s", (level) => {
		const log = vi.spyOn(console, level).mockImplementation(() => undefined);
		const input = "message";

		try {
			expect(DCommon.print(input, level)).toBe(input);
			expect(log).toHaveBeenCalledWith(input);
		} finally {
			log.mockRestore();
		}
	});

	it("prints selected columns as a table and returns the input unchanged", () => {
		const table = vi.spyOn(console, "table").mockImplementation(() => undefined);
		const input = [
			{
				name: "Ada",
				age: 36,
			},
		];
		const columns = ["name"];

		try {
			expect(DCommon.print(input, { columns })).toBe(input);
			expect(table).toHaveBeenCalledWith(input, columns);
		} finally {
			table.mockRestore();
		}
	});

	it.each([2, null])("prints with depth %s and returns the input unchanged", (depth) => {
		const dir = vi.spyOn(console, "dir").mockImplementation(() => undefined);
		const input = { nested: { value: "test" } };

		try {
			expect(DCommon.print(input, { depth })).toBe(input);
			expect(dir).toHaveBeenCalledWith(input, { depth });
		} finally {
			dir.mockRestore();
		}
	});
});
