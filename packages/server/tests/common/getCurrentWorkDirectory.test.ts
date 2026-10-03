import type * as DCommon from "@duplojs/lang/common";
import type * as DPath from "@duplojs/lang/path";
import * as DEither from "@duplojs/lang/either";
import { getCurrentWorkDirectory, setEnvironment } from "@scripts";
import { setDenoMock } from "@tests/_utils/deno.mock";
import { setProcessMock } from "@tests/_utils/process.mock";

describe("getCurrentWorkDirectory", () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it("returns current working directory in NODE env", () => {
		setEnvironment("NODE");
		const expected = "/tmp/mock-cwd";
		setProcessMock({
			cwd: () => expected,
		});

		const result = getCurrentWorkDirectory();

		expect(DEither.isRight(result)).toBe(true);

		if (DEither.isRight(result)) {
			expect(DEither.unwrapRight(result)).toBe(expected);
		}
	});

	it("returns fail when process.cwd throws in NODE env", () => {
		setEnvironment("NODE");
		setProcessMock({
			cwd: () => {
				throw new Error("boom");
			},
		});

		const result = getCurrentWorkDirectory();

		expect(DEither.isLeft(result)).toBe(true);
	});

	it("returns current working directory in DENO env", () => {
		setEnvironment("DENO");
		const expected = "/tmp/mock-deno-cwd";
		setDenoMock({
			cwd: () => expected,
		});

		const result = getCurrentWorkDirectory();

		expect(DEither.isRight(result)).toBe(true);
		if (DEither.isRight(result)) {
			expect(DEither.unwrapRight(result)).toBe(expected);
		}
	});

	it("returns fail when Deno.cwd throws in DENO env", () => {
		setEnvironment("DENO");
		setDenoMock({
			cwd: () => {
				throw new Error("boom");
			},
		});

		const result = getCurrentWorkDirectory();

		expect(DEither.isLeft(result)).toBe(true);
	});

	it.each(["NODE", "DENO"] as const)("normalizes an absolute cwd in %s", (environment) => {
		setEnvironment(environment);
		const cwd = vi.fn().mockReturnValue("/tmp//project/../work/");
		if (environment === "NODE") {
			setProcessMock({ cwd });
		} else {
			setDenoMock({ cwd });
		}
		const result = getCurrentWorkDirectory();

		type _CheckResult = DCommon.ExpectType<typeof result, DEither.Error<unknown> | DEither.Success<string & DPath.Absolute>, "strict">;

		const value = DEither.unwrapByInformationOrThrow(result, "success");

		type _CheckValue = DCommon.ExpectType<typeof value, string & DPath.Absolute, "strict">;

		expect(value).toBe("/tmp/work");
		expect(cwd).toHaveBeenCalledOnce();
	});

	it.each([
		["NODE", "relative/path"],
		["NODE", ""],
		["DENO", "relative/path"],
		["DENO", ""],
	] as const)("rejects a non-absolute cwd in %s: %s", (environment, path) => {
		setEnvironment(environment);
		if (environment === "NODE") {
			setProcessMock({ cwd: () => path });
		} else {
			setDenoMock({ cwd: () => path });
		}

		expect(DEither.hasInformation(getCurrentWorkDirectory(), "error")).toBe(true);
	});
});
