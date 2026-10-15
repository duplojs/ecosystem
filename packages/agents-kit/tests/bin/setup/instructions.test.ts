import { synchronizeInstructions, type InvalidInstructionsMarkersError } from "@scripts/bin/setup";
import * as DPath from "@duplojs/lang/path";
import * as DEither from "@duplojs/lang/either";
import type * as DCommon from "@duplojs/lang/common";

const packagePath = DPath.declarePath("../AgentKit $& with spaces");
const start = "<!-- duplojs-agents-kit:coding-conventions:start -->";
const stop = "<!-- duplojs-agents-kit:coding-conventions:stop -->";

describe("synchronizeInstructions", () => {
	it.each([
		{
			name: "an empty file",
			content: "",
		},
		{
			name: "project instructions without a final newline",
			content: "# Project",
		},
		{
			name: "project instructions with a final newline",
			content: "# Project\n",
		},
		{
			name: "project instructions with a blank line",
			content: "# Project\n\n",
		},
		{
			name: "an obsolete block",
			content: `${start}\nObsolete\n${stop}`,
		},
		{
			name: "an obsolete block surrounded by project instructions",
			content: `Before\n${start}\nObsolete\n${stop}\nAfter`,
		},
	])("synchronizes $name", ({ content }) => {
		const result = synchronizeInstructions(content, "Conventions", packagePath);

		type _CheckResult = DCommon.ExpectType<typeof result, DEither.Success<string> | DEither.Left<"agents-kit-invalid-instructions-markers", InvalidInstructionsMarkersError>, "strict">;

		const synchronizedContent = DEither.unwrapByInformationOrThrow(result, "success");

		expect(synchronizedContent).toMatchSnapshot();
	});

	it("replaces every package path placeholder", () => {
		const result = synchronizeInstructions("", "Read {{packagePath}}/docs and {{packagePath}}/skills.", packagePath);

		const content = DEither.unwrapByInformationOrThrow(result, "success");

		expect(content).toMatchSnapshot();
	});

	it("keeps repeated setups identical", () => {
		const initial = DEither.unwrapByInformationOrThrow(synchronizeInstructions("# Project", "Conventions", packagePath), "success");
		const result = synchronizeInstructions(initial, "Conventions", packagePath);

		const content = DEither.unwrapByInformationOrThrow(result, "success");

		expect(content).toBe(initial);
		expect(content).toMatchSnapshot();
	});

	it("supports the initially empty instructions template", () => {
		const result = synchronizeInstructions("", "", packagePath);

		const content = DEither.unwrapByInformationOrThrow(result, "success");

		expect(content).toMatchSnapshot();
	});

	it.each([
		`${start}\nMissing stop`,
		`Missing start\n${stop}`,
		`${stop}\nReversed\n${start}`,
		`${start}\n${start}\n${stop}`,
		`${start}\n${stop}\n${stop}`,
		`${start}\n${stop}\n${start}\n${stop}`,
	])("rejects malformed or ambiguous markers in %j", (content) => {
		const result = synchronizeInstructions(content, "Conventions", packagePath);
		const error = DEither.unwrapByInformationOrThrow(result, "agents-kit-invalid-instructions-markers");

		expect(error.message).toContain("invalid markers");
	});
});
