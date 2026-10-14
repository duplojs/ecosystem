#!/usr/bin/env node

import * as DSCommand from "@duplojs/server/command";
import { installCommand } from "./install";

await DSCommand.exec(
	{
		subjects: [installCommand],
	},
	() => {},
);

