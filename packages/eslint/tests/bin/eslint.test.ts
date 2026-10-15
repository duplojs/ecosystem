import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const cliUrl = new URL("./bin/eslint.js", pathToFileURL(require.resolve("eslint/package.json"))).href;

describe("bin/eslint", () => {
	beforeEach(() => {
		vi.resetModules();
	});

	afterEach(() => {
		vi.doUnmock(cliUrl);
	});

	it("loads the eslint CLI from its installed package", async() => {
		const loadCli = vi.fn(() => ({}));
		vi.doMock(cliUrl, loadCli);

		await import("@scripts/bin/eslint");

		expect(loadCli).toHaveBeenCalledTimes(1);
	});
});
