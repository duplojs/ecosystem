import type * as DKind from "@scripts/kind";
import type { informationKind } from "../kind";

export type GetInformation<
	GenericEither extends DKind.Kind<typeof informationKind>,
> = DKind.GetValue<typeof informationKind, GenericEither>;
