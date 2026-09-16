import type * as DCommon from "@duplojs/lang/common";
import type * as DKind from "@duplojs/lang/kind";
import { DSCommand } from "@scripts";

describe("constructOption", () => {
	it("binds function properties to the created option", () => {
		interface CustomOption extends DCommon.Forward<
			& DSCommand.Option<"target", "value">
			& DKind.Kind<typeof DSCommand.booleanOptionKind>
		> {
			format(prefix: string): string;
			readonly readonlyValue: string;
		}

		const createCustomOption = DSCommand.constructOption(
			DSCommand.booleanOptionKind,
			({ init }) => () => init<CustomOption>(
				"target",
				() => "value",
				{
					description: null,
					aliases: [],
				},
				{
					format: (self, prefix: string) => `${prefix}${self.name}`,
					readonlyValue: "static",
				},
			),
		);

		const option = createCustomOption();

		expect(option.format("option:")).toBe("option:target");
		expect(option.readonlyValue).toBe("static");
		expect(DSCommand.optionKind.has(option)).toBe(true);
		expect(DSCommand.booleanOptionKind.has(option)).toBe(true);
	});

	it("uses default metadata when params are missing", () => {
		interface CustomOption extends DCommon.Forward<
			& DSCommand.Option<"target", "value">
			& DKind.Kind<typeof DSCommand.booleanOptionKind>
		> {}

		const createCustomOption = DSCommand.constructOption(
			DSCommand.booleanOptionKind,
			({ init }) => () => init<CustomOption>(
				"target",
				() => "value",
				null as never,
			),
		);

		const option = createCustomOption();

		expect(option.aliases).toEqual([]);
		expect(option.description).toBeNull();
	});
});
