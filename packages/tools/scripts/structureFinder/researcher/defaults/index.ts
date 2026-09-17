import { arrayStructureResearcher } from "./array";
import { entityStructureResearcher } from "./entity";
import { lazyStructureResearcher } from "./lazy";
import { newTypeStructureResearcher } from "./newType";
import { objectStructureResearcher } from "./object";
import { recordStructureResearcher } from "./record";
import { taggedObjectStructureResearcher } from "./taggedObject";
import { unionStructureResearcher } from "./union";

export * from "./array";
export * from "./entity";
export * from "./lazy";
export * from "./newType";
export * from "./object";
export * from "./record";
export * from "./taggedObject";
export * from "./union";

export const defaultResearchers = [
	arrayStructureResearcher,
	entityStructureResearcher,
	lazyStructureResearcher,
	newTypeStructureResearcher,
	objectStructureResearcher,
	recordStructureResearcher,
	taggedObjectStructureResearcher,
	unionStructureResearcher,
] as const;
