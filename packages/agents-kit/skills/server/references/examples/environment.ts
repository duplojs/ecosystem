/**
 * @title Charger une configuration et choisir l'origine des chemins.
 *
 * Le dossier du module et le dossier de travail ne sont pas interchangeables.
 */
import * as DSCommon from "@duplojs/server/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DPath from "@duplojs/lang/path";
import * as DEither from "@duplojs/lang/either";
import type * as DCommon from "@duplojs/lang/common";

// Une configuration invalide interrompt l'initialisation du module.
export const configuration = await DSCommon.environmentVariableOrThrow(
	{
		PORT: DDataStructure.number([
			DDataStructure.integer(),
			DDataStructure.greaterThanOrEqual(1),
			DDataStructure.lessThanOrEqual(65535),
		]),
		MODE: DDataStructure.literal(["DEV", "PROD"]),
	},
	{
		// Le fichier indiqué doit être lisible ; les variables du runtime priment.
		includedEnvironmentFiles: [DPath.declarePath(".env")],
		override: false,
		justRead: true,
	},
);

type _CheckMode = DCommon.ExpectType<typeof configuration.MODE, "DEV" | "PROD", "strict">;

const directory = DSCommon.getCurrentDirectoryName(import.meta);

type _CheckDirectory = DCommon.ExpectType<typeof directory, string & DPath.Absolute, "strict">;

export const resourcePath = DPath.resolveRelative([directory, DPath.declarePath("resources/template.json")]);

export const outputPath = DEither.rightPipe(
	DSCommon.getCurrentWorkDirectory(),
	(workingDirectory) => DPath.resolveRelative([workingDirectory, DPath.declarePath("output/report.txt")]),
);
