import type * as DCommon from "@scripts/common";

export interface SelectValueSelect<
	GenericOutput extends unknown = unknown,
> {
	"-select": GenericOutput;
}

export interface SelectValueSkip {
	"-skip": null;
}

export interface SelectTheFunctionParams<
	GenericArray extends readonly unknown[],
> {
	element: GenericArray[number];
	index: number;
	self: GenericArray;
	skip(): SelectValueSkip;
	select<
		GenericOutput extends DCommon.AnyValue = DCommon.AnyValue,
	>(output: GenericOutput): SelectValueSelect<
		GenericOutput
	>;
}

export const selectTools: Pick<
	SelectTheFunctionParams<any>,
	"skip" | "select"
> = {
	skip() {
		return { "-skip": null };
	},
	select(output: any) {
		return { "-select": output };
	},
};

export function select<
	GenericArray extends readonly unknown[],
	GenericSelectValue extends SelectValueSelect,
>(
	theFunction: (
		params: SelectTheFunctionParams<GenericArray>,
	) => GenericSelectValue | SelectValueSkip,
): (
	array: GenericArray,
) => GenericSelectValue["-select"][];

export function select<
	GenericArray extends readonly unknown[],
	GenericSelectValue extends SelectValueSelect,
>(
	array: GenericArray,
	theFunction: (
		params: SelectTheFunctionParams<GenericArray>,
	) => GenericSelectValue | SelectValueSkip,
): GenericSelectValue["-select"][];

export function select(
	...args:
		| [theFunction: DCommon.AnyFunction]
		| [array: readonly unknown[], theFunction: DCommon.AnyFunction]
): any {
	if (args.length === 1) {
		const [theFunction] = args;

		return (array: readonly unknown[]) => select(array, theFunction);
	}

	const [array, theFunction] = args;

	const outputArray: unknown[] = [];

	for (let index = 0; index < array.length; index++) {
		const element = array[index]!;

		const result = theFunction({
			element,
			index,
			self: array,
			...selectTools,
		}) as SelectValueSelect | SelectValueSkip;

		if ("-skip" in result) {
			continue;
		}

		outputArray.push(result["-select"]);
	}

	return outputArray;
}
