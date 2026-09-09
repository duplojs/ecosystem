import type * as DKind from "@scripts/kind";
import { createKind, informationKind, valueKind } from "../kind";
import { rightKind, type Right } from "./create";

export const resultKind = createKind("result");

type _Result<
	GenericInformation extends string = string,
	GenericValue extends unknown = unknown,
> = (
	& Right<GenericInformation, GenericValue>
	& DKind.Kind<typeof resultKind>
);

export interface Result<
	GenericInformation extends string = string,
	GenericValue extends unknown = unknown,
> extends _Result<
		GenericInformation,
		GenericValue
	> {

}

export function result<
	GenericInformation extends string,
	const GenericValue extends unknown = undefined,
>(
	information: GenericInformation,
): (value: GenericValue) => Result<
	GenericInformation,
	GenericValue
>;

export function result<
	GenericInformation extends string,
	const GenericValue extends unknown = undefined,
>(
	information: GenericInformation,
	value: GenericValue,
): Result<
	GenericInformation,
	GenericValue
>;

export function result(
	...args:
		| [information: string, value: unknown]
		| [information: string]
): any {
	if (args.length === 1) {
		const [information] = args;

		return (value: unknown) => result(information, value);
	}

	const [information, value] = args;

	return {
		[rightKind.runTimeKey]: null,
		[informationKind.runTimeKey]: information,
		[valueKind.runTimeKey]: value,
		[resultKind.runTimeKey]: null,
	} as never;
}
