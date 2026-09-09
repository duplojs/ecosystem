import * as DKind from "@scripts/kind";
import { type Constraint } from "./base";
import { type Constraints } from "./types";

export const constraintIdentifier = DKind.createKindIdentifier<
	Constraint,
	Constraints
>();
