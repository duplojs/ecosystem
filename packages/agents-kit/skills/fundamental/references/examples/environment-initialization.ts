/**
 * @title Valider la configuration au démarrage.
 *
 * Utiliser une exception au point d’initialisation du programme.
 */
import * as DSCommon from "@duplojs/server/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";

// Initialisation du programme, avant de commencer les traitements.
const environment = await DSCommon.environmentVariableOrThrow({
	PORT: DDataStructure.number([
		DDataStructure.integer(),
		DDataStructure.greaterThanOrEqual(1),
		DDataStructure.lessThanOrEqual(65535),
	]),
});

// Ici, l'initialisation exige un dossier de travail accessible pour démarrer.
const currentDirectory = DSCommon.getCurrentWorkDirectoryOrThrow();
