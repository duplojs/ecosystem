export function stringify(value: unknown): string;

export function stringify(value: unknown) {
	try {
		return JSON.stringify(value) ?? String(value);
	} catch {
		return String(value);
	}
}
