import type * as DCommon from "@scripts/common";
import { type IsKeyPattern } from "./isKeyPattern";

export type IsLiteral<
	GenericString extends string,
> = string extends GenericString
	? false
	: DCommon.IsNever<GenericString> extends true
		? false
		: DCommon.Not<
			IsKeyPattern<
				Extract<
					DCommon.RemoveConstraint<GenericString>,
					string
				>
			>
		>;
