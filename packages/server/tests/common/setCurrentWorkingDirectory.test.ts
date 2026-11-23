import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";
import type * as DPath from "@duplojs/lang/path";
import { setEnvironment } from "@scripts";
import * as DSCommon from "@scripts/common";
import { setDenoMock } from "@tests/_utils/deno.mock";
import { setProcessMock } from "@tests/_utils/process.mock";

describe("setCurrentWorkingDirectory", () => {
	afterEach(() => {
		setEnvironment("NODE");
		vi.clearAllMocks();
		vi.restoreAllMocks();
	});

	it("sets current working directory in NODE env", () => {
		setEnvironment("NODE");
		const chdir = vi.fn();
		setProcessMock({ chdir });

		const result = DSCommon.setCurrentWorkingDirectory(DCommon.infer("/tmp/project"));

		expect(DEither.isRight(result)).toBe(true);
		expect(chdir).toHaveBeenCalledWith("/tmp/project");
	});

	it("returns an identified left when NODE chdir throws", () => {
		setEnvironment("NODE");
		const cause = new Error("boom");
		setProcessMock({
			chdir: () => {
				throw cause;
			},
		});

		const result = DSCommon.setCurrentWorkingDirectory(DCommon.infer("/tmp/project"));

		expect(DEither.unwrapByInformationOrThrow(result, "set-current-working-directory-error")).toBe(cause);
	});

	it("sets current working directory in DENO env", () => {
		setEnvironment("DENO");
		const chdir = vi.fn();
		setDenoMock({ chdir });

		const result = DSCommon.setCurrentWorkingDirectory(DCommon.infer("/tmp/project"));

		expect(DEither.isRight(result)).toBe(true);
		expect(chdir).toHaveBeenCalledWith("/tmp/project");
	});

	it("returns an identified left when DENO chdir throws", () => {
		setEnvironment("DENO");
		const cause = new Error("boom");
		setDenoMock({
			chdir: () => {
				throw cause;
			},
		});

		const result = DSCommon.setCurrentWorkingDirectory(DCommon.infer("/tmp/project"));

		expect(DEither.unwrapByInformationOrThrow(result, "set-current-working-directory-error")).toBe(cause);
	});
});
