#!/usr/bin/env node

import * as DSCommand from "@duplojs/server/command";
import { installCommand } from "./install";
import { createDocRouterCommand } from "./createDocRouter";

await DSCommand.exec(
	{
		subjects: [installCommand, createDocRouterCommand],
	},
	() => {},
);

