import * as DKind from "@duplojs/lang/kind";
import { type stepKind } from "./kind";
import { type Steps } from "./types";

export const stepIdentifier = DKind.createKindIdentifier<
	DKind.Kind<typeof stepKind>,
	Steps
>();
