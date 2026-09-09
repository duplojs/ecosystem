import * as DChrono from "@scripts/chrono";
import { escapeRegExp } from "./escapeRegExp";

export type EligibleFormDataValue = (
	| boolean
	| number
	| null
	| string
	| File
	| undefined
	| DChrono.TheDate
	| DChrono.TheTime
	| { [key: string]: EligibleFormDataValue }
	| EligibleFormDataValue[]
);

const separator = "/*\\";

const firstElementInPathRegex = new RegExp(`^((?:(?!${escapeRegExp(separator)}).)*)(?:${escapeRegExp(separator)})?`);
const getIndexRegex = /^\[(\d+)\]$/;
const invalidEntryRegex = /__proto__|constructor|prototype/;

export class TheFormData<
	GenericValues extends Record<string, EligibleFormDataValue>,
> extends FormData {
	private constructor(
		public readonly inputValues: GenericValues,
	) {
		super();

		for (const entry of TheFormData.toFlatEntries(inputValues)) {
			this.append(entry[0], entry[1]);
		}
	}

	public static *toFlatEntries(input: EligibleFormDataValue, path?: string): Iterable<[string, string | File], void> {
		if (
			typeof input === "string"
			|| input instanceof DChrono.TheTime
			|| input instanceof DChrono.TheDate
			|| typeof input === "number"
			|| typeof input === "boolean"
		) {
			yield [path ?? "", input.toString()];
		} else if (input instanceof File) {
			yield [path ?? "", input];
		} else if (input === null) {
			yield [path ?? "", "null"];
		} else if (input === undefined) {
			return;
		} else if (input instanceof Array) {
			for (let index = 0; index < input.length; index++) {
				const entriesIterator = this.toFlatEntries(
					input[index],
					path === undefined
						? `[${index}]`
						: `${path}${separator}[${index}]`,
				);

				for (const entry of entriesIterator) {
					yield entry;
				}
			}
		} else {
			for (const key in input) {
				const entriesIterator = this.toFlatEntries(
					input[key as never],
					path === undefined
						? key
						: `${path}${separator}${key}`,
				);

				for (const entry of entriesIterator) {
					yield entry;
				}
			}
		}
	}

	public static fromEntries(
		iterable: Iterable<[string, unknown]>,
		arrayMaxIndex: number,
	): object {
		const constructObject = (
			input: object | undefined,
			path: string,
			value: unknown,
		): object | undefined => {
			const firstElement = path.match(firstElementInPathRegex)![1]!;
			const index = firstElement.match(getIndexRegex)?.[1];

			if (index && Number(index) > arrayMaxIndex) {
				return input;
			}

			let output = input;

			if (output === undefined) {
				if (index !== undefined) {
					output = [];
				} else {
					output = {};
				}
			}

			if (firstElement === path) {
				output[(index ?? firstElement) as never] = value as never;

				return output;
			}

			output[(index ?? firstElement) as never] = constructObject(
				output[(index ?? firstElement) as never],
				path.replace(firstElementInPathRegex, ""),
				value,
			) as never;

			return output;
		};

		let result = undefined as object | undefined;

		for (const entry of iterable) {
			if (invalidEntryRegex.test(entry[0])) {
				continue;
			}

			result = constructObject(
				result,
				entry[0],
				entry[1],
			);
		}

		return result ?? {};
	}

	/**
	 * @internal
	 */
	public static "new"<
		GenericValues extends Record<string, EligibleFormDataValue>,
	>(inputValues: GenericValues) {
		return new TheFormData(inputValues);
	}
}

export function createFormData<
	GenericValues extends Record<string, EligibleFormDataValue>,
>(
	inputValues: GenericValues,
): TheFormData<GenericValues>;

export function createFormData<
	GenericValues extends Record<string, EligibleFormDataValue>,
>(
	inputValues: GenericValues,
) {
	return TheFormData.new(inputValues);
}
