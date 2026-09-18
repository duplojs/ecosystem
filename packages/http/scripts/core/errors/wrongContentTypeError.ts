import { createKind } from "@core/kind";
import * as DKind from "@duplojs/lang/kind";

export class WrongContentTypeError extends DKind.parentClass(
	createKind("wrong-content-type-error"),
	Error,
) {
	public constructor(
		public expectedContentType: string,
		public contentType: string,
	) {
		super({}, `expect content-type "${expectedContentType}" but receive "${contentType}".`);
	}
}
