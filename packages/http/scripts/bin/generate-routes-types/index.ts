import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DPath from "@duplojs/lang/path";
import * as DSCommon from "@duplojs/server/common";
import * as DSCommand from "@duplojs/server/command";
import { generateCodeByInference } from "@plugin-codeGenerator";
import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";

export const generateRoutesTypes = DSCommand.create(
	"generate-routes-types",
	{
		options: [
			DSCommand.createArrayOption(
				"pattern",
				DDataStructure.string(),
			),
			DSCommand.createOption(
				"tsconfig",
				DDataStructure.string([DDataStructure.path()]),
			),
		],
		subjects: [
			DSCommand.createArgument(
				"outputFolder",
				DDataStructure.string([DDataStructure.path()]),
			),
		],
	},
	async({ args, options }) => {
		const resolvedTsconfig = DPath.resolveFrom(
			DSCommon.getCurrentWorkDirectoryOrThrow(),
			[options.tsconfig ?? DCommon.cast("tsconfig.json")],
		);
		const resolvedOutputFolder = DPath.resolveFrom(
			DSCommon.getCurrentWorkDirectoryOrThrow(),
			[args.outputFolder],
		);

		const result = await generateCodeByInference({
			tsconfigPath: resolvedTsconfig,
			isRoutePath: options.pattern
				? DPath.createMatcher(options.pattern)
				: DCommon.justReturn(true),
			outputFolder: resolvedOutputFolder,
		});

		if (DEither.isLeft(result)) {
			return;
		}
	},
);
