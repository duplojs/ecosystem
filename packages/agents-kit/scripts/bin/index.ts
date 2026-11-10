#!/usr/bin/env node

import * as DSCommand from "@duplojs/server/command";
import { skillsCommand } from "./skills";
import { setupCommand } from "./setup";

await DSCommand.exec(
	{
		subjects: [skillsCommand, setupCommand],
	},
	() => {},
);

