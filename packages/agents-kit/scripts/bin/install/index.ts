import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DSCommand from "@duplojs/server/command";
import { AgentTypeEnum, copySkill, SkillEnum, symlinkSkill } from "./skill";
import * as DEither from "@duplojs/lang/either";
import * as DSFile from "@duplojs/server/file";
import { getPackagePath } from "../packagePath";
import * as DPath from "@duplojs/lang/path";
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";

export const installCommand = DSCommand.create(
	"install",
	{
		options: [
			DSCommand.createBooleanOption("copy", {
				description: "Copy skills instead of creating symbolic links",
			}),
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
		const installSkill = options.copy ? copySkill : symlinkSkill;

		if (args.skill) {
			await installSkill(
				agentType,
				args.skill,
			);

			return;
		}

		const skillsPath = DPath.resolveRelative([getPackagePath(), DPath.declarePath("skills")]);

		await DEither.rightAsyncPipe(
			DSFile.readDirectory(skillsPath),
			DArray.filter(SkillEnum.has),
			DArray.map((value) => installSkill(
				agentType,
				value,
			)),
			DCommon.promiseAll,
		);
	},
);
