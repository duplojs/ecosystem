import { hub } from "@core";
import { existsSync, readFileSync, rmSync } from "fs";
import { launchHookServer } from "../../dist/core";
import { openApiGeneratorPlugin } from "@duplojs/http/openApiGenerator";
import * as DPath from "@duplojs/lang/path";

describe("openApiGenerator", () => {
	const fileName = DPath.createOrThrow(`${import.meta.dirname}/swagger.generate.json`);
	beforeAll(() => {
		if (existsSync(fileName)) {
			rmSync(fileName);
		}
	});

	it("correct generate file", async() => {
		const hubWithPlugins = hub.plug(
			openApiGeneratorPlugin({
				outputFile: fileName,
				routePath: "/swagger",
			}),
		);
		await launchHookServer(
			hubWithPlugins.aggregatesHooksHubLifeCycle("beforeServerBuildRoutes"),
			hubWithPlugins,
			{} as any,
		);

		expect(readFileSync(fileName, "utf-8")).toMatchSnapshot();
	});
});
