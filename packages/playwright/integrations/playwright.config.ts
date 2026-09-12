import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";
import * as DServerCommon from "@duplojs/server/common";
import { defineConfig, devices } from "playwright/test";

const envs = await DServerCommon.environmentVariableOrThrow(
	{
		CI: DDataStructure.boolean(),
		RETRIES: DDataStructure.number([DDataStructure.integer()]),
		WORKERS: DDataStructure.number([DDataStructure.integer()]),
	},
	{
		justRead: true,
		includedEnvironmentFiles: [DCommon.infer(".env")],
	},
);

export default defineConfig({
	testDir: "./",
	testMatch: ["index.test.ts"],
	fullyParallel: true,
	forbidOnly: envs.CI,
	retries: envs.RETRIES,
	workers: envs.WORKERS,
	reporter: [
		[
			"html",
			{
				open: "never",
				outputFolder: "playwright-report",
			},
		],
		["list"],
	],
	use: {
		headless: true,
		trace: "retain-on-failure",
		screenshot: "only-on-failure",
	},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
	],
});
