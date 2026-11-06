export function isSimple(input: object): boolean {
	return (
		input.constructor === undefined
		|| input.constructor?.name === "Object"
	);
}
