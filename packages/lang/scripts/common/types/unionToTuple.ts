import type { LastUnionElement } from "./lastUnionElement";

type PushElementToTuple<
	GenericTuple extends unknown[],
	GenericElement extends unknown,
> = [...GenericTuple, GenericElement];

export type UnionToTuple<
	GenericUnion extends unknown,
	GenericElement extends unknown = LastUnionElement<GenericUnion>,
	GenericIsEmpty extends boolean = [GenericUnion] extends [never]
		? true
		: false,
> =
	true extends GenericIsEmpty
		? []
		: PushElementToTuple<
			UnionToTuple<
				Exclude<GenericUnion, GenericElement>
			>,
			GenericElement
		>;
