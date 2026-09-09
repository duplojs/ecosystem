export function isSimple(input: unknown): input is object {
	return (
		typeof input === "object"
		&& input !== null
		&& (
			input.constructor === undefined
			|| input.constructor.name === "Object"
		)
	);
}
