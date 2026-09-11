export * from "./type";
export * from "./newType";
export * from "./array";
export * from "./object";
export * from "./lazy";
export * from "./union";
export * from "./record";
export * from "./nonEncodableString";
export * from "./entity";
export * from "./taggedObject";

import type { StructureTransformer } from "../create";
import { typeStructureTransformer } from "./type";
import { newTypeStructureTransformer } from "./newType";
import { arrayStructureTransformer } from "./array";
import { objectStructureTransformer } from "./object";
import { lazyStructureTransformer } from "./lazy";
import { unionStructureTransformer } from "./union";
import { recordStructureTransformer } from "./record";
import { nonEncodableStringStructureTransformer } from "./nonEncodableString";
import { entityStructureTransformer } from "./entity";
import { taggedObjectStructureTransformer } from "./taggedObject";

export const defaultStructureTransformers = [
	typeStructureTransformer,
	newTypeStructureTransformer,
	arrayStructureTransformer,
	objectStructureTransformer,
	lazyStructureTransformer,
	unionStructureTransformer,
	recordStructureTransformer,
	nonEncodableStringStructureTransformer,
	entityStructureTransformer,
	taggedObjectStructureTransformer,
] as const satisfies StructureTransformer[];
