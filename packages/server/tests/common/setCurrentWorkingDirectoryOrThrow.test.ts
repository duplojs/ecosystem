import * as DCommon from "@duplojs/lang/common";
import type * as DPath from "@duplojs/lang/path";
import { setEnvironment } from "@scripts";
import * as DSCommon from "@scripts/common";
import { setProcessMock } from "@tests/_utils/process.mock";

describe("setCurrentWorkingDirectoryOrThrow", () => {
	afterEach(() => {
		setEnvironment("NODE");
		vi.clearAllMocks();
		vi.restoreAllMocks();
	});

	it("returns undefined when working directory is set", () => {
		setEnvironment("NODE");
		setProcessMock({
			chdir: vi.fn(),
		});

		const result = DSCommon.setCurrentWorkingDirectoryOrThrow(DCommon.infer("/tmp/project"));

		expect(result).toBeUndefined();
	});

	it("throws when working directory cannot be set", () => {
		setEnvironment("NODE");
		setProcessMock({
			chdir: () => {
				throw new Error("boom");
			},
		});

		expect(() => DSCommon.setCurrentWorkingDirectoryOrThrow(DCommon.infer("/tmp/project")))
			.toThrow(DSCommon.SetCurrentWorkingDirectoryError);
	});
});
