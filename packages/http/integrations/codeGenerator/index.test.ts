import * as DSPath from "@duplojs/server/path";
import * as DEither from "@duplojs/lang/either";
import * as DSFile from "@duplojs/server/file";
import { assertTypeScriptProject } from "@utils";
import * as DPath from "@duplojs/lang/path";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

describe("codeGenerator", () => {
	it("resolves Windows drive, file URL and UNC importers", () => {
		const command = spawnSync(process.execPath, ["--input-type=module"], {
			cwd: import.meta.dirname,
			encoding: "utf8",
			timeout: 30_000,
			input: String.raw`
				Object.defineProperty(process, "platform", { value: "win32" });
				const { generateSlicesRolldown } = await import("@duplojs/http/codeGenerator");
				const { setEnvironment, TESTImplementation } = await import("@duplojs/server");
				const DPath = await import("@duplojs/lang/path");
				const DArray = await import("@duplojs/lang/array");
				const DEither = await import("@duplojs/lang/either");
				setEnvironment("TEST");
				let results = [];
				for (const { root, importer, id } of [
					{ root: "/DRV-C:/work", importer: "C:\\work\\consumer.ts", id: ".\\index.ts" },
					{ root: "/DRV-C:/work", importer: "C:/work/consumer.ts", id: "./index.ts" },
					{ root: "/DRV-C:/work", importer: "file:///C:/work/consumer.ts", id: "./index.ts" },
					{ root: "/UNC:/server/share", importer: "\\\\server\\share\\consumer.ts", id: "./index.ts" },
				]) {
					TESTImplementation.set("getCurrentWorkDirectory", () => DEither.success(DPath.declareAbsolutePath(root)));
					const plugin = generateSlicesRolldown({ slices: [] });
					await plugin.options.call({}, {});
					results = DArray.push(results, plugin.resolveId.call({}, id, importer, {}));
				}
				console.log(JSON.stringify(results));
			`,
		});

		expect(command.error).toBeUndefined();
		expect(command.status, command.stderr).toBe(0);
		expect(JSON.parse(command.stdout)).toStrictEqual([
			"/DRV-C:/work/index.ts",
			"/DRV-C:/work/index.ts",
			"/DRV-C:/work/index.ts",
			"/UNC:/server/share/index.ts",
		]);
	});

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
		const outputFolder = DSPath.createAbsoluteOrThrow(`${import.meta.dirname}/routesTypes.generate`);
		const outputFile = DPath.resolveFrom(outputFolder, [DPath.declarePath("routes.d.ts")]);

		await generateWithRolldown("rolldown.typesRoutes.config.ts", outputFolder);

		const outputStat = DEither.unwrapByInformationOrThrow(await DSFile.stat(outputFolder), "file-system-stat");
		const content = DEither.unwrapByInformationOrThrow(await DSFile.readTextFile(outputFile), "file-system-read-text-file");

		expect(outputStat.isDirectory).toBe(true);
		expect(content).toContain("export type Routes = ");
		expect(content).not.toContain("ResponseContract");
		expect(content).toMatchSnapshot();

		assertTypeScriptProject(DSPath.createAbsoluteOrThrow(`${import.meta.dirname}/tsconfig.generatedRoutes.json`));
	}, 45_000);

	it("generates the selected slice exports and declarations", async() => {
		const outputFolder = DSPath.createAbsoluteOrThrow(`${import.meta.dirname}/slices.generate`);

		await generateWithRolldown("rolldown.slices.config.ts", outputFolder);

		const indexPath = DPath.resolveFrom(outputFolder, [DPath.declarePath("index.js")]);
		const declarationsPath = DPath.resolveFrom(outputFolder, [DPath.declarePath("index.d.ts")]);
		const indexUrl = pathToFileURL(DSPath.toPlatformPathOrThrow(indexPath)).href;
		const sdk: unknown = await import(/* @vite-ignore */ indexUrl);

		expect(sdk).toHaveProperty("Domains.User.Id");
		expect(sdk).toHaveProperty("Domains.User.Entity");
		expect(DEither.isRight(await DSFile.exists(declarationsPath))).toBe(true);
		assertTypeScriptProject(DSPath.createAbsoluteOrThrow(`${import.meta.dirname}/tsconfig.slices.json`));
	}, 45_000);
});
