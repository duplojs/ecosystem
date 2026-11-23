import type * as DCommon from "@duplojs/lang/common";
import type * as DPath from "@duplojs/lang/path";
import * as DEither from "@duplojs/lang/either";
import { setEnvironment } from "@scripts";
import * as DSCommon from "@scripts/common";
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

		const result = DSCommon.getCurrentWorkDirectory();

		expect(DEither.isRight(result)).toBe(true);

		if (DEither.isRight(result)) {
			expect(DEither.unwrapRight(result)).toBe(expected);
		}
	});

	it("returns an identified left when process.cwd throws in NODE env", () => {
		setEnvironment("NODE");
		const cause = new Error("boom");
		setProcessMock({
			cwd: () => {
				throw cause;
			},
		});

		const result = DSCommon.getCurrentWorkDirectory();

		expect(DEither.unwrapByInformationOrThrow(result, "get-current-work-directory-error")).toBe(cause);
	});

	it("returns current working directory in DENO env", () => {
		setEnvironment("DENO");
		const expected = "/tmp/mock-deno-cwd";
		setDenoMock({
			cwd: () => expected,
		});

		const result = DSCommon.getCurrentWorkDirectory();

		expect(DEither.isRight(result)).toBe(true);
		if (DEither.isRight(result)) {
			expect(DEither.unwrapRight(result)).toBe(expected);
		}
	});

	it("returns an identified left when Deno.cwd throws in DENO env", () => {
		setEnvironment("DENO");
		const cause = new Error("boom");
		setDenoMock({
			cwd: () => {
				throw cause;
			},
		});

		const result = DSCommon.getCurrentWorkDirectory();

		expect(DEither.unwrapByInformationOrThrow(result, "get-current-work-directory-error")).toBe(cause);
	});

	it.each(["NODE", "DENO"] as const)("normalizes an absolute cwd in %s", (environment) => {
		setEnvironment(environment);
		const cwd = vi.fn().mockReturnValue("/tmp//project/../work/");
		if (environment === "NODE") {
			setProcessMock({ cwd });
		} else {
			setDenoMock({ cwd });
		}
		const result = DSCommon.getCurrentWorkDirectory();

		type _CheckResult = DCommon.ExpectType<typeof result, DEither.Left<"get-current-work-directory-error", unknown> | DEither.Success<string & DPath.Absolute>, "strict">;

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

		expect(DEither.hasInformation(DSCommon.getCurrentWorkDirectory(), "get-current-work-directory-error")).toBe(true);
	});
});
