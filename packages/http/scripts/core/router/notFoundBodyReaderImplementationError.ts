import { createKind } from "@core/kind";
import { type BodyController } from "@core/request";
import { type Route } from "@core/route";
import * as DKind from "@duplojs/lang/kind";

export class NotFoundBodyReaderImplementationError extends DKind.parentClass(
	createKind("not-found-body-reader-implementation-error"),
	Error,
) {
	public constructor(
		public route: Route,
		public bodyController: BodyController,
	) {
		super({}, "Body reader implementation not found.");
	}
}
