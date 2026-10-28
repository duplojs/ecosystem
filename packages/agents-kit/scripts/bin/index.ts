#!/usr/bin/env node

import * as DSCommand from "@duplojs/server/command";
import { installSkillCommand } from "./installSkill";
import { setupCommand } from "./setup";

await DSCommand.exec(
	{
		subjects: [installSkillCommand, setupCommand],
	},
	() => {},
);

