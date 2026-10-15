#!/usr/bin/env node

import * as DSCommand from "@duplojs/server/command";
import { installCommand } from "./install";
import { generateLlmsCommand } from "./generateLlms";

await DSCommand.exec(
	{
		subjects: [installCommand, generateLlmsCommand],
	},
	() => {},
);

