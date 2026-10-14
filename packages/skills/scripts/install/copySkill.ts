import * as DCommon from "@duplojs/lang/common";
import * as DPath from "@duplojs/lang/path";
import * as DSCommon from "@duplojs/server/common";
import * as DSFile from "@duplojs/server/file";
import { skillsPath } from "./skillsPath";

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

export function copySkill(
	agentType: AgentTypeEnum,
	skill: SkillEnum,
) {
	const selectedSkillPath = DPath.resolveRelative([skillsPath, DCommon.cast(skill)]);

	const currentSkillFolder = DPath.resolveFrom(
		DSCommon.getCurrentWorkDirectoryOrThrow(),
		[
			DCommon.cast(agentTypeFolderMapper[agentType]),
			DCommon.cast("skills"),
			DCommon.cast(`duplojs-${skill}`),
		],
	);

	return DSFile.copy(
		selectedSkillPath,
		DCommon.cast(currentSkillFolder),
	);
}
