import * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import * as DPath from "@duplojs/lang/path";
import * as DPattern from "@duplojs/lang/pattern";
import * as DSCommand from "@duplojs/server/command";
import * as DSCommon from "@duplojs/server/common";
import * as DSFile from "@duplojs/server/file";
import { getPackagePath } from "../packagePath";
import { synchronizeInstructions } from "./instructions";

export * from "./instructions";

export const SetupTypeEnum = DCommon.createEnum([
	"default",
	"claude",
]);
export type SetupTypeEnum = DCommon.GetEnumValue<typeof SetupTypeEnum>;

const setupFileMapper = {
	default: DPath.declarePath("AGENTS.md"),
	claude: DPath.declarePath("CLAUDE.md"),
} as const satisfies Record<SetupTypeEnum, string & DPath.Path>;

export const setupCommand = DSCommand.create(
	"setup",
	{
		description: "Synchronize DuploJS coding conventions in the project's AGENTS.md or CLAUDE.md",
		options: [DSCommand.createOption("type", DDataStructure.literal(SetupTypeEnum.toTuple()))],
	},
	async({ options }) => {
		const setupType = options.type ?? "default";
		const packagePath = getPackagePath();
		const instructionsPath = DPath.resolveRelative([packagePath, DPath.declarePath("instructions/coding-conventions.md")]);

		await DCommon.asyncPipe(
			DEither.rightAsyncPipe(
				DSCommon.getCurrentWorkDirectory(),
				(directory) => ({
					targetPath: DPath.resolveRelative([directory, setupFileMapper[setupType]]),
					relativePackagePath: DPath.computeRelative(directory, packagePath),
				}),
				({ targetPath, relativePackagePath }) => DEither.rightAsyncPipe(
					DSFile.readTextFile(instructionsPath),
					(instructions) => DEither.rightAsyncPipe(
						DCommon.asyncPipe(
							DSFile.readTextFile(targetPath),
							DEither.whenIsLeft(
								DPattern.matchWithErrorOtherwise(
									{ "file-system-read-text-file-not-found": () => DEither.success("") },
									(error) => DEither.left("file-system-read-text-file-error", error),
								),
							),
						),
						(content) => synchronizeInstructions(content, instructions, relativePackagePath),
						(content) => DSFile.writeTextFile(targetPath, content),
					),
				),
			),
			DEither.whenIsLeft((cause) => {
				console.error(cause);
				DSCommon.exitProcess(1);
			}),
		);
	},
);
