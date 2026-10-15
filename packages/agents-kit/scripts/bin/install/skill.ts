import * as DCommon from "@duplojs/lang/common";
import * as DPath from "@duplojs/lang/path";
import * as DSCommon from "@duplojs/server/common";
import * as DSFile from "@duplojs/server/file";
import * as DEither from "@duplojs/lang/either";
import { skillsPath } from "./skillsPath";
import * as DPattern from "@duplojs/lang/pattern";

export const AgentTypeEnum = DCommon.createEnum([
	"default",
	"claude",
	"codex",
]);
type AgentTypeEnum = DCommon.GetEnumValue<typeof AgentTypeEnum>;

export const SkillEnum = DCommon.createEnum([
	"fundamental",
	"http",
]);
type SkillEnum = DCommon.GetEnumValue<typeof SkillEnum>;

const agentTypeFolderMapper = {
	claude: ".claude",
	codex: ".codex",
	default: ".agents",
} as const satisfies Record<AgentTypeEnum, string>;

function getSkillPaths(
	agentType: AgentTypeEnum,
	skill: SkillEnum,
) {
	const selectedSkillPath = DPath.resolveRelative([skillsPath, DCommon.cast(skill)]);

	const skillsFolder = DPath.resolveRelative([
		DSCommon.getCurrentWorkDirectoryOrThrow(),
		DCommon.cast(agentTypeFolderMapper[agentType]),
		DCommon.cast("skills"),
	]);
	const currentSkillFolder = DPath.resolveRelative([skillsFolder, DCommon.cast(`duplojs-${skill}`)]);

	return {
		selectedSkillPath,
		skillsFolder,
		currentSkillFolder,
	};
}

function removeSkill(path: string & DPath.Path) {
	return DCommon.asyncPipe(
		DSFile.remove(path, { recursive: true }),
		DEither.whenIsLeft(
			DPattern.matchWithErrorOtherwise(
				{
					"file-system-remove-not-found": () => DEither.ok(),
				},
				(error): DSFile.RemoveResult => DEither.left("file-system-remove-error", error),
			),
		),
	);
}

export function copySkill(
	agentType: AgentTypeEnum,
	skill: SkillEnum,
) {
	const { selectedSkillPath, currentSkillFolder } = getSkillPaths(agentType, skill);

	return DEither.rightAsyncPipe(
		removeSkill(currentSkillFolder),
		() => DSFile.copy(selectedSkillPath, currentSkillFolder),
	);
}

export function symlinkSkill(
	agentType: AgentTypeEnum,
	skill: SkillEnum,
): Promise<DSFile.SymlinkResult | Extract<DSFile.EnsureDirectoryResult | DSFile.RemoveResult, DEither.Left>> {
	const { selectedSkillPath, skillsFolder, currentSkillFolder } = getSkillPaths(agentType, skill);

	return DEither.rightAsyncPipe(
		DSFile.ensureDirectory(skillsFolder),
		() => removeSkill(currentSkillFolder),
		() => DSFile.symlink(selectedSkillPath, currentSkillFolder, { type: "dir" }),
	);
}
