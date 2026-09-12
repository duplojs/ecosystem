import { mkdir, rm } from "node:fs/promises";
import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import * as DPath from "@duplojs/lang/path";
import { environmentVariable, getCurrentWorkDirectory, getProcessArguments, setCurrentWorkingDirectory } from "@duplojs/server";

const initialWorkingDirectory = process.cwd();
const initialProcessEnv = { ...process.env };
const rootPath = DPath.createOrThrow(`${initialWorkingDirectory}/.tmp-common-node`);
const applicationEnvPath = DPath.createOrThrow(`${initialWorkingDirectory}/fixtures/env/application.env`);
const serviceEnvPath = DPath.createOrThrow(`${initialWorkingDirectory}/fixtures/env/service.env`);
const runtimeEnvPath = DPath.createOrThrow(`${initialWorkingDirectory}/fixtures/env/runtime.env`);

void describe("common feature on node", () => {
	beforeEach(async() => {
		process.chdir(initialWorkingDirectory);
		process.env = { ...initialProcessEnv };
		process.argv = ["node", "integration.ts", "--runtime", "node"];
		await rm(rootPath, {
			force: true,
			recursive: true,
		});
	});

	afterEach(async() => {
		process.chdir(initialWorkingDirectory);
		process.env = { ...initialProcessEnv };
		await rm(rootPath, {
			force: true,
			recursive: true,
		});
	});

	void it("reads environment files with override and expansion", async() => {
		process.env = {
			APP_NAME: "process-app",
			TOKEN: "secret",
		};

		const result = await environmentVariable(
			{
				APP_NAME: DDataStructure.string(),
				BASE_NAME: DDataStructure.string(),
				API_HOST: DDataStructure.string(),
				API_PREFIX: DDataStructure.string(),
				API_URL: DDataStructure.string(),
				FEATURE_FLAG: DDataStructure.boolean(),
				LOG_LABEL: DDataStructure.string(),
				MULTILINE: DDataStructure.string(),
				ESCAPED: DDataStructure.string(),
				COMPOSED: DDataStructure.string(),
				NEW_KEY: DDataStructure.string(),
				TOKEN: DDataStructure.string(),
			},
			{
				includedEnvironmentFiles: [applicationEnvPath, serviceEnvPath, runtimeEnvPath],
				override: true,
				justRead: true,
			},
		);

		DCommon.asserts(result, DEither.isRight);

		const env = DEither.unwrapRight(result);
		assert.deepEqual(env, {
			APP_NAME: "runtime-app",
			BASE_NAME: "service",
			API_HOST: "api.duplo.local",
			API_PREFIX: "/v2",
			API_URL: "https://api.duplo.local/v2",
			FEATURE_FLAG: true,
			LOG_LABEL: "[service]",
			MULTILINE: "line1\nline2\r",
			ESCAPED: "$TOKEN",
			COMPOSED: "service/v2",
			NEW_KEY: "runtime",
			TOKEN: "secret",
		});
		assert.equal(process.env.APP_NAME, "process-app");
	});

	void it("keeps process values when override is disabled and mutates env by default", async() => {
		process.env = {
			APP_NAME: "process-app",
			BASE_NAME: "process",
			API_HOST: "process.local",
			API_PREFIX: "/process",
		};

		const result = await environmentVariable(
			{
				APP_NAME: DDataStructure.string(),
				BASE_NAME: DDataStructure.string(),
				API_HOST: DDataStructure.string(),
				API_PREFIX: DDataStructure.string(),
				API_URL: DDataStructure.string(),
				FEATURE_FLAG: DDataStructure.boolean(),
				LOG_LABEL: DDataStructure.string(),
				MULTILINE: DDataStructure.string(),
				ESCAPED: DDataStructure.string(),
			},
			{
				includedEnvironmentFiles: [applicationEnvPath, serviceEnvPath],
				override: false,
			},
		);

		DCommon.asserts(result, DEither.isRight);

		assert.deepEqual(DEither.unwrapRight(result), {
			APP_NAME: "process-app",
			BASE_NAME: "process",
			API_HOST: "process.local",
			API_PREFIX: "/process",
			API_URL: "https://process.local/process",
			FEATURE_FLAG: true,
			LOG_LABEL: "[service]",
			MULTILINE: "line1\nline2\r",
			ESCAPED: "$TOKEN",
		});
		assert.equal(process.env.API_URL, "https://process.local/process");
	});

	void it("reads and changes the current working directory", async() => {
		await mkdir(rootPath, { recursive: true });

		const setResult = setCurrentWorkingDirectory(rootPath);
		assert.equal(DEither.isRight(setResult), true);
		assert.equal(DEither.unwrapRight(setResult), undefined);

		const getResult = getCurrentWorkDirectory();
		DCommon.asserts(getResult, DEither.isRight);
		assert.equal(DEither.unwrapRight(getResult), rootPath);
	});

	void it("reads process arguments", () => {
		const result = getProcessArguments();

		assert.deepEqual(result, ["--runtime", "node"]);
	});
});
