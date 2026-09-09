import { escapeRegExp } from "./escapeRegExp";
import type { AnyTuple } from "./types";

export function toRegExp(input: string | AnyTuple<string> | RegExp): RegExp;

export function toRegExp(input: string | AnyTuple<string> | RegExp): RegExp {
	if (typeof input === "string") {
		return new RegExp(`^${escapeRegExp(input)}$`);
	}

	if (input instanceof Array) {
		const pattern = input.map(escapeRegExp).join("|");

		return new RegExp(`^(?:${pattern})$`);
	}

	return input;
}
