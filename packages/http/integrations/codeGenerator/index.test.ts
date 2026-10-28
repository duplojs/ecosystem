import * as DEither from "@duplojs/lang/either";
import * as DSFile from "@duplojs/server/file";
import { assertTypeScriptProject } from "@utils";
import * as DPath from "@duplojs/lang/path";
import { spawnSync } from "node:child_process";

describe("codeGenerator", () => {
	const generateWithRolldown = async(config: string, outputFolder: string & DPath.Absolute) => {
		if (DEither.isRight(await DSFile.exists(outputFolder))) {
			DEither.unwrapByInformationOrThrow(
				await DSFile.remove(outputFolder, { recursive: true }),
				"file-system-remove",
			);
		}

		const command = spawnSync("pnpm", ["exec", "rolldown", "--config", config], {
			cwd: import.meta.dirname,
			encoding: "utf8",
			timeout: 30_000,
		});

		expect(command.error).toBeUndefined();
		expect(command.status, `${command.stdout}\n${command.stderr}`).toBe(0);
	};

	it("generates route declarations through the Rolldown inference plugin", async() => {
		const outputFolder = DPath.createAbsoluteOrThrow(`${import.meta.dirname}/routesTypes.generate`);
		const outputFile = DPath.resolveFrom(outputFolder, [DPath.declarePath("routes.d.ts")]);

		await generateWithRolldown("rolldown.typesRoutes.config.ts", outputFolder);

		const outputStat = DEither.unwrapByInformationOrThrow(await DSFile.stat(outputFolder), "file-system-stat");
		const content = DEither.unwrapByInformationOrThrow(await DSFile.readTextFile(outputFile), "file-system-read-text-file");

		expect(outputStat.isDirectory).toBe(true);
		expect(content).toContain("export type Routes = ");
		expect(content).not.toContain("ResponseContract");
		expect(content).toMatchSnapshot();

		assertTypeScriptProject(DPath.createAbsoluteOrThrow(`${import.meta.dirname}/tsconfig.generatedRoutes.json`));
	}, 45_000);

	it("generates the selected slice exports and declarations", async() => {
		const outputFolder = DPath.createAbsoluteOrThrow(`${import.meta.dirname}/slices.generate`);

		await generateWithRolldown("rolldown.slices.config.ts", outputFolder);

		const indexPath = DPath.resolveFrom(outputFolder, [DPath.declarePath("index.js")]);
		const declarationsPath = DPath.resolveFrom(outputFolder, [DPath.declarePath("index.d.ts")]);
		const sdk: unknown = await import(/* @vite-ignore */ indexPath);

		expect(sdk).toHaveProperty("Domains.User.Id");
		expect(sdk).toHaveProperty("Domains.User.Entity");
		expect(DEither.isRight(await DSFile.exists(declarationsPath))).toBe(true);
		assertTypeScriptProject(DPath.createAbsoluteOrThrow(`${import.meta.dirname}/tsconfig.slices.json`));
	}, 45_000);
});
