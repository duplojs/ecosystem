import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";

export function expectFileSystemError(
	result: unknown,
	identifier: string,
	cause?: Error,
) {
	const error = DEither.unwrapLeftOrThrow(result);

	expect(error).toBeInstanceOf(DCommon.DuploJSError);
	expect(DCommon.DuploJSError.hasIdentifier(
		error as DCommon.DuploJSError,
		identifier,
	)).toBe(true);

	if (cause) {
		expect((error as DCommon.DuploJSError).cause).toBe(cause);
	}

	return error;
}
