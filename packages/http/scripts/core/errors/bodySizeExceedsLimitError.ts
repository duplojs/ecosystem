import { createKind } from "@core/kind";
import type * as DCommon from "@duplojs/lang/common";
import * as DKind from "@duplojs/lang/kind";

export class BodySizeExceedsLimitError extends DKind.parentClass(
	createKind("body-size-exceeds-limit-error"),
	Error,
) {
	public constructor(
		public bytesInString: DCommon.BytesInString | number,
	) {
		super({}, `Body size is bigger than ${bytesInString}.`);
	}
}
