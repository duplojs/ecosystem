import type * as DKind from "@scripts/kind";
import type { valueKind } from "../kind";

export type GetValue<
	GenericEither extends DKind.Kind<typeof valueKind>,
> = DKind.GetValue<typeof valueKind, GenericEither>;
