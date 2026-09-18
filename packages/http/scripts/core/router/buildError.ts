import { createKind } from "@core/kind";
import { type Route } from "@core/route";
import { type Steps } from "@core/steps";
import * as DKind from "@duplojs/lang/kind";

export class RouterBuildError extends DKind.parentClass(
	createKind("router-build-error"),
	Error,
) {
	public constructor(
		public route: Route,
		public element: Route | Steps,
	) {
		super(null, "Error during build route.");
	}
}
