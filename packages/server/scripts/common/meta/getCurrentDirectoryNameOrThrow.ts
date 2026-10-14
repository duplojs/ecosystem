import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import * as DKind from "@duplojs/lang/kind";
import { createKind } from "@scripts/kind";
import { getCurrentDirectoryName } from "./getCurrentDirectoryName";

export class GetCurrentDirectoryNameError extends DKind.parentClass(
	createKind("get-current-directory-name-error"),
	Error,
) {
	public constructor(
		public error: string,
	) {
		super(null, "Failed to retrieve the current module directory path.");
	}
}

export function getCurrentDirectoryNameOrThrow(
	importMeta: ImportMeta,
) {
	return DEither.whenIsRightOtherwise(
		getCurrentDirectoryName(importMeta),
		DCommon.forward,
		(result) => {
			throw new GetCurrentDirectoryNameError(
				DEither.unwrapLeft(result),
			);
		},
	);
}
