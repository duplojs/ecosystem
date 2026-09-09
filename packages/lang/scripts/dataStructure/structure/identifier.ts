import * as DKind from "@scripts/kind";
import { type Structure } from "./base";
import { type Structures } from "./types";

export const structureIdentifier = DKind.createKindIdentifier<
	Structure,
	Structures
>();
