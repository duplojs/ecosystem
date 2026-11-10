import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import * as DSCommand from "@duplojs/server/command";
import * as DSFile from "@duplojs/server/file";
import { AgentTypeEnum, copySkill, getSkillPaths, SkillEnum, symlinkSkill } from "./skill";

export const updateSkillsCommand = DSCommand.create(
	"update",
	{
		description: "Update installed DuploJS skills, preserving copies and symbolic links",
		options: [DSCommand.createOption("type", DDataStructure.literal(AgentTypeEnum.toTuple()))],
	},
	async({ options }) => {
		const agentType = options.type ?? "default";
		for (const skill of SkillEnum.toTuple()) {
			await DEither.rightAsyncPipe(
				getSkillPaths(agentType, skill),
				({ currentSkillFolder }) => DSFile.linkStat(currentSkillFolder),
				(stat) => {
					if (stat.isSymlink) {
						return symlinkSkill(agentType, skill);
					}
					if (stat.isDirectory) {
						return copySkill(agentType, skill);
					}
					return DEither.ok();
				},
			);
		}
	},
);
