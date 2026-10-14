import { AgentTypeEnum, copySkill, SkillEnum, skillsPath } from "@scripts";
import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import * as DPath from "@duplojs/lang/path";
// oxlint-disable-next-line duplojs-plugin/no-restricted-import
import { TESTImplementation, setEnvironment } from "@duplojs/server";
import * as DSCommon from "@duplojs/server/common";
import type * as DSFile from "@duplojs/server/file";

describe("copySkill", () => {
	beforeEach(() => {
		setEnvironment("TEST");
		TESTImplementation.set("getCurrentWorkDirectory", () => DPath.createAbsolute("/project"));
	});

	afterEach(() => {
		TESTImplementation.clear();
		setEnvironment("NODE");
	});

	it.each([
		["default", "fundamental", ".agents"],
		["claude", "http", ".claude"],
		["codex", "fundamental", ".codex"],
	] as const)("copies %s/%s into the working directory", async(agent, skill, folder) => {
		const copy = vi.fn(() => Promise.resolve(DEither.right("file-system-copy")));
		TESTImplementation.set("copy", copy);

		const result = await copySkill(agent, skill);

		type _CheckResult = DCommon.ExpectType<typeof result, DSFile.CopyResult, "strict">;

		expect(DEither.unwrapByInformationOrThrow(result, "file-system-copy")).toBeUndefined();
		expect(copy).toHaveBeenCalledExactlyOnceWith(`${skillsPath}/${skill}`, `/project/${folder}/skills/duplojs-${skill}`);
	});

	it("preserves a copy error", async() => {
		class CopyError extends DCommon.DuploJSError.parentClass("file-system-copy-error", Error) {}
		const failure = new CopyError(new Error("Copy denied"));
		TESTImplementation.set("copy", () => Promise.resolve(DEither.left("file-system-copy-error", failure)));

		const result = await copySkill("default", "http");

		expect(DEither.unwrapByInformationOrThrow(result, "file-system-copy-error")).toBe(failure);
	});

	it("does not copy when the working directory is unavailable", () => {
		const copy = vi.fn();
		TESTImplementation.set("copy", copy);
		TESTImplementation.set("getCurrentWorkDirectory", () => DEither.error(new Error("Unavailable")));

		expect(() => copySkill("codex", "http")).toThrow(DSCommon.GetCurrentWorkDirectoryError);
		expect(copy).not.toHaveBeenCalled();
	});
});
