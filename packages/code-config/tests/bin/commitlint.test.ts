import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const cliUrl = new URL("./cli.js", pathToFileURL(require.resolve("@commitlint/cli/package.json"))).href;

describe("bin/commitlint", () => {
	beforeEach(() => {
		vi.resetModules();
	});

	afterEach(() => {
		vi.doUnmock(cliUrl);
	});

	it("loads the commitlint CLI from its installed package", async() => {
		const loadCli = vi.fn(() => ({}));
		vi.doMock(cliUrl, loadCli);

		await import("@scripts/bin/commitlint");

		expect(loadCli).toHaveBeenCalledTimes(1);
	});
});
