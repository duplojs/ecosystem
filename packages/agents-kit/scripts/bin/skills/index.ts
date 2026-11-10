import * as DSCommand from "@duplojs/server/command";
import { installSkillCommand } from "./install";
import { updateSkillsCommand } from "./update";

export * from "./install";
export * from "./update";
export * from "./skill";

export const skillsCommand = DSCommand.create(
	"skills",
	{
		description: "Install or update DuploJS skills",
		subjects: [installSkillCommand, updateSkillsCommand],
	},
	() => {},
);
