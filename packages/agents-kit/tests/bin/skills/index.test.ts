import { skillsCommand } from "@scripts/bin/skills";
import type * as DCommon from "@duplojs/lang/common";
import * as DSCommand from "@duplojs/server/command";

describe("skillsCommand", () => {
	it("exposes the skills command group", async() => {
		const error = DSCommand.createError("skills");

		const result = await skillsCommand.execute([], error);

		type _CheckCommand = DCommon.ExpectType<typeof skillsCommand, DSCommand.Command<"skills">, "strict">;

		expect(result).toBeUndefined();
		expect(error.issues).toEqual([]);
	});
});
