import { tab } from "./tab";

export function indent(level: number): string;

export function indent(level: number) {
	if (level < 0 || !Number.isFinite(level)) {
		return "";
	}

	return tab.repeat(level);
}
