/**
 * @title Définir les contrats partagés des exemples HTTP.
 *
 * Les routes partagent leurs schémas sans dépendre d'une génération de SDK.
 */
import * as DDataStructure from "@duplojs/lang/dataStructure";

export const userStructure = DDataStructure.object({
	id: DDataStructure.string([DDataStructure.uuid()]),
	name: DDataStructure.string([DDataStructure.minCharacters(3)]),
});

export type User = DDataStructure.StructureValue<typeof userStructure>;

export const renameUserBody = DDataStructure.object({
	name: DDataStructure.string([DDataStructure.minCharacters(3)]),
});

export type RenameUserBody = DDataStructure.StructureValue<typeof renameUserBody>;
