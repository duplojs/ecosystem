/**
 * @title Décoder un chemin en fichier existant de taille bornée.
 *
 * Le codec construit l'interface ; les contraintes consultent le disque.
 */
import * as DSDataStructure from "@duplojs/server/dataStructure";
import type * as DSFile from "@duplojs/server/file";
import type * as DDataStructure from "@duplojs/lang/dataStructure";
import type * as DCommon from "@duplojs/lang/common";

const inputFile = DSDataStructure.file([
	DSDataStructure.fileExist(),
	DSDataStructure.size({ max: "1mb" }),
]);

type _CheckValue = DCommon.ExpectType<
	DDataStructure.StructureValue<typeof inputFile>,
	DSFile.FileInterface,
	"strict"
>;

export function decodeInputFile(value: unknown) {
	// Retourne decode-success avec l'interface, ou decode-error.
	// Une simple string n'est pas la valeur déjà décodée du contrat.
	return inputFile.asyncDecode(DSDataStructure.codecsString, value);
}
