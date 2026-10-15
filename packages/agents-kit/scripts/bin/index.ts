#!/usr/bin/env node

import * as DSCommand from "@duplojs/server/command";
import { installCommand } from "./install";
import { setupCommand } from "./setup";

await DSCommand.exec(
	{
		subjects: [installCommand, setupCommand],
	},
	() => {},
);

