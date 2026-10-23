import { hub } from "@core";
import { existsSync, readFileSync, rmSync } from "fs";
import { codeGeneratorPlugin } from "@duplojs/http/codeGenerator";
import { launchHookServer } from "@duplojs/http";
import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import * as DSFile from "@duplojs/server/file";
import { assertTypeScriptProject } from "@utils";
import * as DPath from "@duplojs/lang/path";
import { spawnSync } from "node:child_process";

describe("codeGenerator", () => {
	const fileName = DPath.createOrThrow(`${import.meta.dirname}/type.generate.ts`);
	const folderName = DPath.createOrThrow(`${import.meta.dirname}/structure.generate`);
	beforeAll(() => {
		if (existsSync(fileName)) {
			rmSync(fileName);
		}
		if (existsSync(folderName)) {
			rmSync(folderName, {
				recursive: true,
				force: true,
			});
		}
	});

	it("correct generate file", async() => {
		const hubWithPlugins = hub.plug(
			codeGeneratorPlugin({
				outputFile: fileName,
				generateStructure: { outputFolder: folderName },
			}),
		);
		await launchHookServer(
			hubWithPlugins.aggregatesHooksHubLifeCycle("beforeStartServer"),
			hubWithPlugins,
			{} as any,
		);

		expect(readFileSync(fileName, "utf-8")).toMatchSnapshot();

		assertTypeScriptProject(DPath.declarePath("codeGenerator/tsconfig.generatedStructure.json"));

		const result = await DCommon.asyncPipe(
			{
				index: DSFile.readTextFile(DPath.resolveRelative([folderName, DPath.declareSegment("index.ts")])),
				types: DSFile.readTextFile(DPath.resolveRelative([folderName, DPath.declareSegment("types.ts")])),
				userStructure: DSFile.readTextFile(DPath.resolveRelative([folderName, DPath.declareSegment("userStructure.ts")])),
				userIdStructure: DSFile.readTextFile(DPath.resolveRelative([folderName, DPath.declareSegment("userIdStructure.ts")])),
				userNameStructure: DSFile.readTextFile(DPath.resolveRelative([folderName, DPath.declareSegment("userNameStructure.ts")])),
			},
			DEither.asyncGroup,
			DEither.unwrapRightOrThrow,
		);

		expect(result.index).toMatchSnapshot();
		expect(result.types).toMatchSnapshot();
		expect(result.userStructure).toMatchSnapshot();
		expect(result.userIdStructure).toMatchSnapshot();
		expect(result.userNameStructure).toMatchSnapshot();
	});

	it("generates route declarations through the Rolldown inference plugin", async() => {
		const outputFolder = DPath.createAbsoluteOrThrow(`${import.meta.dirname}/type.generate`);
		const outputFile = DPath.resolveFrom(outputFolder, [DPath.declarePath("routes.d.ts")]);

		if (DEither.isRight(await DSFile.exists(outputFolder))) {
			DEither.unwrapByInformationOrThrow(
				await DSFile.remove(outputFolder, { recursive: true }),
				"file-system-remove",
			);
		}

		const command = spawnSync("pnpm", ["exec", "rolldown", "--config", "rolldown.config.ts"], {
			cwd: import.meta.dirname,
			encoding: "utf8",
			timeout: 30_000,
		});

		expect(command.error).toBeUndefined();
		expect(command.status, `${command.stdout}\n${command.stderr}`).toBe(0);

		const outputStat = DEither.unwrapByInformationOrThrow(await DSFile.stat(outputFolder), "file-system-stat");
		const content = DEither.unwrapByInformationOrThrow(await DSFile.readTextFile(outputFile), "file-system-read-text-file");

		expect(outputStat.isDirectory).toBe(true);
		expect(content).toContain("export type Routes = ");
		expect(content).toMatchSnapshot();

		assertTypeScriptProject(DPath.declarePath("codeGenerator/tsconfig.generatedRoutes.json"));
	}, 45_000);
});
