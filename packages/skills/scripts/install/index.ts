import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DSCommand from "@duplojs/server/command";
import { AgentTypeEnum, copySkill, SkillEnum } from "./copySkill";
import * as DEither from "@duplojs/lang/either";
import * as DSFile from "@duplojs/server/file";
import { skillsPath } from "./skillsPath";
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";

export const installCommand = DSCommand.create(
	"install",
	{
		options: [
			DSCommand.createOption(
				"type",
				DDataStructure.literal(AgentTypeEnum.toTuple()),
			),
		],
		subjects: [
			DSCommand.createArgument(
				"skill",
				DDataStructure.literal(SkillEnum.toTuple()),
				{ optional: true },
			),
		],
	},
	async({ args, options }) => {
		const agentType = options.type ?? "default";

		if (args.skill) {
			await copySkill(
				agentType,
				args.skill,
			);

			return;
		}

		await DEither.rightAsyncPipe(
			DSFile.readDirectory(skillsPath),
			DArray.filter(SkillEnum.has),
			DArray.map((value) => copySkill(
				agentType,
				value,
			)),
			DCommon.promiseAll,
		);
	},
);
