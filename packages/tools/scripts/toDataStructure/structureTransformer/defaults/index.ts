export * from "./array";
export * from "./entity";
export * from "./lazy";
export * from "./newType";
export * from "./nonEncodableString";
export * from "./object";
export * from "./record";
export * from "./taggedObject";
export * from "./type";
export * from "./union";

import type { StructureTransformer } from "../create";

import { arrayStructureTransformer } from "./array";
import { entityStructureTransformer } from "./entity";
import { lazyStructureTransformer } from "./lazy";
import { newTypeStructureTransformer } from "./newType";
import { nonEncodableStringStructureTransformer } from "./nonEncodableString";
import { objectStructureTransformer } from "./object";
import { recordStructureTransformer } from "./record";
import { taggedObjectStructureTransformer } from "./taggedObject";
import { typeStructureTransformer } from "./type";
import { unionStructureTransformer } from "./union";

export const defaultStructureTransformers = [
	arrayStructureTransformer,
	entityStructureTransformer,
	lazyStructureTransformer,
	newTypeStructureTransformer,
	nonEncodableStringStructureTransformer,
	objectStructureTransformer,
	recordStructureTransformer,
	taggedObjectStructureTransformer,
	typeStructureTransformer,
	unionStructureTransformer,
] as const satisfies readonly StructureTransformer[];
