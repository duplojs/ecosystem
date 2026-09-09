import { type typeKind, type Type } from "../base";
import type * as DKind from "@scripts/kind";

export type TypeValue<
	GenericType extends Type,
> = DKind.GetValue<typeof typeKind, GenericType>;
