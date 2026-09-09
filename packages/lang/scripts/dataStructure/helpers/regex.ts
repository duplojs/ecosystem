import { RegexConstraint } from "../constraint";

export function regex(regex: RegExp) {
	return RegexConstraint(regex);
}
