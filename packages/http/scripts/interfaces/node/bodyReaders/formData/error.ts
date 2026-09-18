import * as DKind from "@duplojs/lang/kind";
import { createKind } from "@interface-node/kind";

export class BodyParseFormDataError extends DKind.parentClass(
	createKind("body-parse-form-data-error"),
	Error,
) {
	public constructor(
		public information: string,
	) {
		super({}, `Body parse form data error: ${information}`);
	}
}
