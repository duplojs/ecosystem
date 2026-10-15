import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const cliUrl = new URL("./dist/cli.js", pathToFileURL(require.resolve("oxlint/package.json"))).href;

describe("bin/oxlint", () => {
	beforeEach(() => {
		vi.resetModules();
	});

	afterEach(() => {
		vi.doUnmock(cliUrl);
	});

	it("loads the oxlint CLI from its installed package", async() => {
		const loadCli = vi.fn(() => ({}));
		vi.doMock(cliUrl, loadCli);

		await import("@scripts/bin/oxlint");

		expect(loadCli).toHaveBeenCalledTimes(1);
	});
});
