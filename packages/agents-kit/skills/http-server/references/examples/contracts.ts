/**
 * @title Définir les contrats partagés des exemples HTTP.
 *
 * Identifier les structures réutilisables pour leur génération dans un SDK.
 */
import "@duplojs/tools/toTypescript";
import * as DDataStructure from "@duplojs/lang/dataStructure";

export const userStructure = DDataStructure.object({
	id: DDataStructure.string([DDataStructure.uuid()]),
	name: DDataStructure.string([DDataStructure.minCharacters(3)]),
}).setIdentifier("User");

export type User = DDataStructure.StructureValue<typeof userStructure>;

export const renameUserBody = DDataStructure.object({
	name: DDataStructure.string([DDataStructure.minCharacters(3)]),
}).setIdentifier("RenameUserBody");

export type RenameUserBody = DDataStructure.StructureValue<typeof renameUserBody>;
