#!/usr/bin/env node

import * as DSCommand from "@duplojs/server/command";
import { generateRoutesTypes } from "./generate-routes-types";

await DSCommand.exec(
	{
		subjects: [generateRoutesTypes],
	},
	() => {},
);
