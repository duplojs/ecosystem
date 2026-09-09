import { codeBold, codeReset } from "./codes";

export function bold(input: string): string;

export function bold(input: string) {
	return `${codeBold}${input}${codeReset}`;
}
