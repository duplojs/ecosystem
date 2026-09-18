import { createKind } from "@core/kind";
import * as DKind from "@duplojs/lang/kind";

export class ParseJsonError extends DKind.parentClass(
	createKind("parse-json-error"),
	Error,
) {
	public constructor(
		public payload: string,
		public error: unknown,
	) {
		super({}, "Error when parse on json.");
	}
}
