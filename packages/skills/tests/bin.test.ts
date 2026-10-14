import * as DEither from "@duplojs/lang/either";
import * as DPath from "@duplojs/lang/path";
import type * as DSFile from "@duplojs/server/file";

describe("bin", () => {
	beforeEach(async() => {
		vi.resetModules();
		const { setEnvironment } = await import("@duplojs/server");
		setEnvironment("TEST");
	});

	afterEach(async() => {
		const { TESTImplementation, setEnvironment } = await import("@duplojs/server");
		TESTImplementation.clear();
		setEnvironment("NODE");
	});

	it("executes the root command without accessing files", async() => {
		const { TESTImplementation } = await import("@duplojs/server");
		const getProcessArguments = vi.fn(() => []);
		const copy = vi.fn();
		const readDirectory = vi.fn();
		TESTImplementation.set("getProcessArguments", getProcessArguments);
		TESTImplementation.set("copy", copy);
		TESTImplementation.set("readDirectory", readDirectory);

		await import("@scripts/bin");

		expect(getProcessArguments).toHaveBeenCalledTimes(1);
		expect(copy).not.toHaveBeenCalled();
		expect(readDirectory).not.toHaveBeenCalled();
	});

	it("routes to install and waits for its completion", async() => {
		const { TESTImplementation } = await import("@duplojs/server");
		const pending = Promise.withResolvers<DSFile.CopyResult>();
		const copy = vi.fn(() => pending.promise);
		const getProcessArguments = vi.fn(() => ["install", "http", "--type", "codex"]);
		TESTImplementation.set("getProcessArguments", getProcessArguments);
		TESTImplementation.set("getCurrentWorkDirectory", () => DPath.createAbsolute("/project"));
		TESTImplementation.set("copy", copy);
		const loaded = vi.fn();

		const loading = import("@scripts/bin").then(loaded);

		await vi.waitFor(() => expect(copy).toHaveBeenCalledTimes(1));
		expect(loaded).not.toHaveBeenCalled();
		pending.resolve(DEither.right("file-system-copy"));
		await loading;
		const { skillsPath } = await import("@scripts");

		expect(getProcessArguments).toHaveBeenCalledTimes(1);
		expect(copy).toHaveBeenCalledExactlyOnceWith(`${skillsPath}/http`, "/project/.codex/skills/duplojs-http");
		expect(loaded).toHaveBeenCalledTimes(1);
	});

	it("propagates an install failure", async() => {
		const { TESTImplementation } = await import("@duplojs/server");
		const failure = new Error("Copy failed");
		TESTImplementation.set("getProcessArguments", () => ["install", "http"]);
		TESTImplementation.set("getCurrentWorkDirectory", () => DPath.createAbsolute("/project"));
		TESTImplementation.set("copy", vi.fn().mockRejectedValue(failure));

		await expect(import("@scripts/bin")).rejects.toThrow(failure);
	});
});
