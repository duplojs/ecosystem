import type * as DCommon from "@duplojs/lang/common";
import type * as DKind from "@duplojs/lang/kind";
import { DSCommand } from "@scripts";

describe("isOptionToken", () => {
	it.each([
		{
			input: "--port",
			expected: true,
		},
		{
			input: "--port=80",
			expected: true,
		},
		{
			input: "-p",
			expected: true,
		},
		{
			input: "-p=80",
			expected: true,
		},
		{
			input: "--some_option-name=",
			expected: true,
		},
		{
			input: "-42",
			expected: true,
		},
		{
			input: "port",
			expected: false,
		},
		{
			input: "80",
			expected: false,
		},
		{
			input: "-",
			expected: false,
		},
		{
			input: "--",
			expected: false,
		},
		{
			input: "---port",
			expected: false,
		},
		{
			input: "--_port",
			expected: false,
		},
	])("recognizes $input as an option token: $expected", ({ input, expected }) => {
		expect(DSCommand.isOptionToken(input)).toBe(expected);
	});
});

describe("findOptionToken", () => {
	it.each([
		{
			args: [],
			expected: null,
		},
		{
			args: ["app", "--other", "---verbose"],
			expected: null,
		},
		{
			args: ["--v"],
			expected: null,
		},
		{
			args: ["--verbose"],
			expected: {
				key: "verbose",
				value: undefined,
				index: 0,
			},
		},
		{
			args: ["-verbose"],
			expected: {
				key: "verbose",
				value: undefined,
				index: 0,
			},
		},
		{
			args: ["app", "-v"],
			expected: {
				key: "v",
				value: undefined,
				index: 1,
			},
		},
		{
			args: ["--other", "--verbose=true"],
			expected: {
				key: "verbose",
				value: "true",
				index: 1,
			},
		},
		{
			args: ["--verbose="],
			expected: {
				key: "verbose",
				value: "",
				index: 0,
			},
		},
		{
			args: ["-v=a=b"],
			expected: {
				key: "v",
				value: "a=b",
				index: 0,
			},
		},
		{
			args: ["-v", "--verbose=true"],
			expected: {
				key: "v",
				value: undefined,
				index: 0,
			},
		},
	])("finds the first matching option in $args", ({ args, expected }) => {
		const result = DSCommand.findOptionToken(args, {
			name: "verbose",
			aliases: ["v"],
		});

		expect(result).toEqual(expected);
	});
});

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
