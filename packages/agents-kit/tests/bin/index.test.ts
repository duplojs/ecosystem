import { TESTImplementation, setEnvironment } from "@duplojs/server";

describe("bin", () => {
	afterEach(() => {
		TESTImplementation.clear();
		setEnvironment("NODE");
	});

	it("loads the entry point without running a subcommand", async() => {
		setEnvironment("TEST");
		const getProcessArguments = vi.fn(() => []);
		TESTImplementation.set("getProcessArguments", getProcessArguments);

		await import("@scripts/bin");

		expect(getProcessArguments).toHaveBeenCalledExactlyOnceWith();
	});
});
