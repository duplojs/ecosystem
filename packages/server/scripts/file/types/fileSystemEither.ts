import type * as DEither from "@duplojs/lang/either";

export type FileSystemEither<
	GenericEither extends DEither.Left | DEither.Right,
> = GenericEither extends DEither.Left<infer GenericInformation, infer GenericValue>
	? DEither.Left<`file-system-${GenericInformation}`, GenericValue>
	: GenericEither extends DEither.Right<infer GenericInformation, infer GenericValue>
		? DEither.Right<`file-system-${GenericInformation}`, GenericValue>
		: never;
