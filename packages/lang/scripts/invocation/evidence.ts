import type * as DCommon from "@scripts/common";
import * as DEither from "@scripts/either";

export interface Evidence<
	GenericName extends string = string,
> extends DCommon.DynamicConstraint<"evidence", GenericName> {

}

/**
 * {@include clean/evidence/index.md}
 */
export function appendEvidence<
	GenericInput extends unknown,
	GenericEvidenceName extends string,
>(
	input: GenericInput,
	evidenceName: GenericEvidenceName,
): GenericInput & Evidence<GenericEvidenceName>;

export function appendEvidence<
	GenericInput extends unknown,
	GenericEvidenceName extends string,
>(
	evidenceName: GenericEvidenceName,
): (input: GenericInput) => GenericInput & Evidence<GenericEvidenceName>;

export function appendEvidence(
	...args: [object, string]
		| [string]
) {
	if (args.length === 1) {
		return (input: object) => input;
	}

	const [input] = args;
	return input;
}

export interface EvidenceResult<
	GenericInformation extends string,
	GenericValue extends unknown,
> extends DEither.Result<
		GenericInformation,
		& GenericValue
		& Evidence<GenericInformation>
	> {
}

/**
 * {@include clean/evidenceResult/index.md}
 */
export function evidenceResult<
	GenericInformation extends string,
	GenericValue extends object,
>(
	information: GenericInformation,
): (value: GenericValue) => EvidenceResult<
	GenericInformation,
	GenericValue
>;

export function evidenceResult<
	GenericInformation extends string,
	GenericValue extends object,
>(
	information: GenericInformation,
	value: GenericValue,
): EvidenceResult<
	GenericInformation,
	GenericValue
>;

export function evidenceResult(
	...args: [string, object]
		| [string]
): any {
	if (args.length === 1) {
		const [information] = args;

		return (value: object) => evidenceResult(information, value);
	}

	const [information, value] = args;

	return DEither.result(
		information,
		value,
	);
}

export type FindEvidence<
	GenericValue extends unknown,
> = (
	GenericValue extends Evidence
		? GenericValue
		: GenericValue extends Promise<unknown>
			? FindEvidence<
				Awaited<GenericValue>
			>
			: GenericValue extends DEither.Right | DEither.Left
				? FindEvidence<
					DEither.GetValue<GenericValue>
				>
				: GenericValue extends Generator<
					infer InferredYeldValue,
					infer InferredResult
				>
					? (
						| FindEvidence<InferredYeldValue>
						| FindEvidence<InferredResult>
					)
					: GenericValue extends AsyncGenerator<
						infer InferredYeldValue,
						infer InferredResult
					>
						? (
							| FindEvidence<InferredYeldValue>
							| FindEvidence<InferredResult>
						)
						: never
) extends infer InferredResult extends Evidence
	? InferredResult
	: never;

export type GetEvidenceResult<
	GenericFunction extends DCommon.AnyFunction,
	EvidenceName extends Extract<
		keyof FindEvidence<
			ReturnType<GenericFunction>
		>[DCommon.ConstraintSymbol]["evidence"],
		string
	>,
> = Extract<
	FindEvidence<ReturnType<GenericFunction>>,
	EvidenceName extends unknown
		? Evidence<EvidenceName>
		: never
>;
