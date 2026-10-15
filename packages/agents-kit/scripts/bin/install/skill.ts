import * as DCommon from "@duplojs/lang/common";
import * as DPath from "@duplojs/lang/path";
import * as DSCommon from "@duplojs/server/common";
import * as DSFile from "@duplojs/server/file";
import * as DEither from "@duplojs/lang/either";
import { getPackagePath } from "../packagePath";
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
	const selectedSkillPath = DPath.resolveRelative([getPackagePath(), DPath.declarePath("skills"), DCommon.cast(skill)]);

	return DEither.rightPipe(
		DSCommon.getCurrentWorkDirectory(),
		(directory) => {
			const skillsFolder = DPath.resolveRelative([
				directory,
				DCommon.cast(agentTypeFolderMapper[agentType]),
				DCommon.cast("skills"),
			]);
			const currentSkillFolder = DPath.resolveRelative([skillsFolder, DCommon.cast(`duplojs-${skill}`)]);

			return {
				selectedSkillPath,
				skillsFolder,
				currentSkillFolder,
			};
		},
	);
}

function removeSkill(path: string & DPath.Path) {
	return DCommon.asyncPipe(
		DSFile.remove(path, { recursive: true }),
		DEither.whenIsLeft(
			DPattern.matchWithErrorOtherwise(
				{
					"file-system-remove-not-found": () => DEither.ok(),
				},
				(error: DSFile.RemoveErrors) => DEither.left("file-system-remove-error", error),
			),
		),
	);
}

export function copySkill(
	agentType: AgentTypeEnum,
	skill: SkillEnum,
) {
	return DEither.rightAsyncPipe(
		getSkillPaths(agentType, skill),
		({ selectedSkillPath, currentSkillFolder }) => DEither.rightAsyncPipe(
			removeSkill(currentSkillFolder),
			() => DSFile.copy(selectedSkillPath, currentSkillFolder),
		),
	);
}

export function symlinkSkill(
	agentType: AgentTypeEnum,
	skill: SkillEnum,
) {
	return DEither.rightAsyncPipe(
		getSkillPaths(agentType, skill),
		({ selectedSkillPath, skillsFolder, currentSkillFolder }) => DEither.rightAsyncPipe(
			DSFile.ensureDirectory(skillsFolder),
			() => removeSkill(currentSkillFolder),
			() => DSFile.symlink(selectedSkillPath, currentSkillFolder, { type: "dir" }),
		),
	);
}
