/* oxlint-disable @typescript-eslint/prefer-for-of */
import * as DChrono from "@scripts/chrono";
import { type MinElements } from "./constraints";

export type EligibleDuplicateElement = (
	| string
	| boolean
	| null
	| number
	| bigint
	| undefined
	| DChrono.TheDate
	| DChrono.TheTime
);

export function findDuplicates<
	GenericArray extends readonly EligibleDuplicateElement[],
>(
	array: GenericArray,
): undefined | (readonly GenericArray[number][] & MinElements<1>);

export function findDuplicates(
	array: EligibleDuplicateElement[],
): any {
	const store = new Map<
		EligibleDuplicateElement,
		number
	>();
	let storeTimeObject: (
		| undefined
		| Map<
			DChrono.SerializedTheDate | DChrono.SerializedTheTime,
			DChrono.TheDate | DChrono.TheTime
		>
	) = undefined;
	let result: undefined | any[] = undefined;

	for (let index = 0; index < array.length; index++) {
		const element = array[index];

		if (DChrono.isDate(element) || DChrono.isTime(element)) {
			storeTimeObject ??= new Map();

			const serializedValue = element.toJSON();
			const storedElement = storeTimeObject.get(serializedValue) ?? element;
			const storedCount = store.get(storedElement);

			if (storedCount === 1) {
				result ??= [];
				result.push(storedElement);
			}

			store.set(storedElement, (storedCount ?? 0) + 1);
			if (storedElement === element) {
				storeTimeObject.set(serializedValue, element);
			}
		} else {
			const storedCount = store.get(element);

			if (storedCount === 1) {
				result ??= [];
				result.push(element);
			}

			store.set(element, (storedCount ?? 0) + 1);
		}
	}

	return result;
}
