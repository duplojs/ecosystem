import type * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import * as DSCommon from "@scripts/common";
import type * as DDataStructure from "@duplojs/lang/dataStructure";
import { type CreateCommandExecuteParams, type CreateCommandParams, type Subjects, create } from "./create";
import { createError, interpretExecCommandError, SymbolCommandError, type Error } from "./error";
import type { Option } from "./options";
import type { Argument } from "./argument";
import type { ForbiddenInvalidIdentifier } from "./types";

export interface ExecCommandParams<
	GenericOptions extends DCommon.AnyTuple<Option> = DCommon.AnyTuple<Option>,
	GenericSubjects extends Subjects = Subjects,
	GenericDisplayName extends string = string,
> extends CreateCommandParams<
		GenericOptions,
		GenericSubjects
	> {
	displayName?: GenericDisplayName & ForbiddenInvalidIdentifier<GenericDisplayName>;
	dataStructureErrorInterpreter?: DDataStructure.ErrorInterpreter;
}

export function exec(
	execute: () => void,
): Promise<
	| DEither.Ok
	| DEither.Error<Error>
>;

export function exec<
	const GenericOptions extends DCommon.AnyTuple<Option> = never,
	GenericSubjects extends Subjects = never,
	const GenericDisplayName extends string = string,
>(
	params: ExecCommandParams<
		GenericOptions,
		GenericSubjects,
		GenericDisplayName
	>,
	execute: (
		params: CreateCommandExecuteParams<
			GenericOptions,
			Extract<
				GenericSubjects,
				DCommon.AnyTuple<Argument>
			>
		>,
	) => DCommon.MaybePromise<void>,
): Promise<
	| DEither.Ok
	| DEither.Error<Error>
>;

export async function exec(
	...args: [DCommon.AnyFunction] | [ExecCommandParams, DCommon.AnyFunction]
) {
	const [params, execute] = args.length === 1
		? [{}, args[0]]
		: args;

	const displayName = params.displayName ?? "root";

	const error = createError(displayName);

	const result = await create(
		displayName as never,
		params,
		execute,
	).execute(
		DSCommon.getProcessArguments(),
		error,
	);

	if (result === SymbolCommandError) {
		// oxlint-disable-next-line no-console
		console.error(interpretExecCommandError(error, params?.dataStructureErrorInterpreter));
		return DEither.error(error);
	}

	return DEither.ok();
}
