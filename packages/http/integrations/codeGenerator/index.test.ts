import { hub } from "@core";
import { existsSync, readFileSync, rmSync } from "fs";
import { codeGeneratorPlugin } from "@duplojs/http/codeGenerator";
import { launchHookServer } from "@duplojs/http";
import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import * as DSFile from "@duplojs/server/file";
import { assertTypeScriptProject } from "@utils";
import * as DPath from "@duplojs/lang/path";

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
});
